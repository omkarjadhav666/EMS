"use client";

import { useState, useEffect, useMemo } from "react";
import { Task, TaskStatus } from "./types";
import { TaskCard } from "./TaskCard";
import { Plus, LayoutTemplate, List, Kanban, Filter, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    closestCorners,
    DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { TaskColumn } from "./TaskColumn";
import { TaskDetailsModal } from "./TaskDetailsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskBoardProps {
    initialTasks: Task[];
    eventId: string;
}

export function TaskBoard({ initialTasks, eventId }: TaskBoardProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    // Sort tasks by position on load
    useEffect(() => {
        setTasks([...initialTasks].sort((a, b) => (a.position || 0) - (b.position || 0)));
    }, [initialTasks]);

    const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
    const [filterPriority, setFilterPriority] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const supabase = createClient();
    const router = useRouter();

    // Configure sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        })
    );

    const columns: { id: TaskStatus; label: string }[] = [
        { id: 'pending', label: 'To Do' },
        { id: 'in_progress', label: 'In Progress' },
        { id: 'completed', label: 'Done' },
    ];

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
            return matchesSearch && matchesPriority;
        });
    }, [tasks, searchQuery, filterPriority]);

    // Handle Modal Save
    const handleSaveTask = (savedTask: Task) => {
        setTasks(prev => {
            const exists = prev.find(t => t.id === savedTask.id);
            if (exists) {
                return prev.map(t => t.id === savedTask.id ? savedTask : t);
            }
            return [...prev, savedTask];
        });
        setEditingTask(null);
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        const { error } = await supabase.from('event_tasks').delete().eq('id', taskId);
        if (!error) {
            setTasks(prev => prev.filter(t => t.id !== taskId));
        }
    };

    // DND Handlers (Simplified for brevity, assuming existing logic works)
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [originalStatus, setOriginalStatus] = useState<TaskStatus | null>(null);

    function onDragStart(event: DragStartEvent) {
        const task = tasks.find(t => t.id === event.active.id);
        setActiveId(event.active.id as string);
        setActiveTask(task || null);
        setOriginalStatus(task?.status || null);
    }

    async function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTask = tasks.find((t) => t.id === activeId);
        const overTask = tasks.find((t) => t.id === overId);

        if (!activeTask) return;

        // Determine the new status
        let newStatus = activeTask.status;

        const isOverColumn = columns.some(col => col.id === overId);
        if (isOverColumn) {
            newStatus = overId as TaskStatus;
        } else if (overTask) {
            newStatus = overTask.status;
        }

        // 1. Update Position in UI (Reorder)
        if (activeId !== overId) {
            setTasks((items) => {
                const oldIndex = items.findIndex((t) => t.id === activeId);
                const newIndex = items.findIndex((t) => t.id === overId);
                return arrayMove(items, oldIndex, newIndex);
            });
        }

        // 2. Persist Status Change if changed from ORIGINAL stats
        // We compare against originalStatus because activeTask.status might have been optimistically updated in onDragOver
        if (originalStatus && newStatus !== originalStatus) {
            console.log(`Updating task ${activeId} status from ${originalStatus} to ${newStatus}`);
            setTasks(prev => prev.map(t => t.id === activeId ? { ...t, status: newStatus } : t));
            const { error } = await supabase.from('event_tasks').update({ status: newStatus }).eq('id', activeId);
            if (error) console.error("Error updating status:", error);

            if (newStatus === 'completed' && !error) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.from('notifications').insert({
                        user_id: user.id,
                        title: "Task Completed",
                        message: `Great job! You've completed "${activeTask.title}".`,
                        type: "system",
                        link: `/dashboard/events/${eventId}/tasks`
                    });
                }
            }
        }

        setOriginalStatus(null);
    }

    async function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTask = tasks.find((t) => t.id === activeId);
        const overTask = tasks.find((t) => t.id === overId);

        if (!activeTask) return;

        const isOverColumn = columns.some(col => col.id === overId);

        // Scenario 1: Dragging over a column (empty space)
        if (isOverColumn) {
            const newStatus = overId as TaskStatus;
            if (activeTask.status !== newStatus) {
                setTasks(prev => prev.map(t => t.id === activeId ? { ...t, status: newStatus } : t));
            }
        }
        // Scenario 2: Dragging over another task in a different column
        else if (overTask && activeTask.status !== overTask.status) {
            const newStatus = overTask.status;
            setTasks(prev => prev.map(t => t.id === activeId ? { ...t, status: newStatus } : t));
        }
    }

    const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        const { error } = await supabase.from('event_tasks').update({ status: newStatus }).eq('id', taskId);

        if (newStatus === 'completed' && !error) {
            const { data: { user } } = await supabase.auth.getUser();
            const task = tasks.find(t => t.id === taskId);
            if (user && task) {
                await supabase.from('notifications').insert({
                    user_id: user.id,
                    title: "Task Completed",
                    message: `Great job! You've completed "${task.title}".`,
                    type: "system",
                    link: `/dashboard/events/${eventId}/tasks`
                });
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Filter className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                        <Input
                            placeholder="Search tasks..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <div className="flex bg-stone-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('board')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'board' ? 'bg-white shadow text-charcoal' : 'text-stone-400 hover:text-charcoal'}`}
                        >
                            <Kanban className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-charcoal' : 'text-stone-400 hover:text-charcoal'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <Button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="btn-primary gap-2">
                        <Plus className="w-4 h-4" /> Add Task
                    </Button>
                </div>
            </div>

            {/* Board View */}
            {viewMode === 'board' && (
                <div className="h-full">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={onDragStart}
                        onDragOver={onDragOver}
                        onDragEnd={onDragEnd}
                    >
                        <div className="flex flex-col xl:flex-row gap-6 xl:overflow-x-auto pb-4 xl:h-[calc(100vh-280px)]">
                            {columns.map((col) => (
                                <TaskColumn
                                    key={col.id}
                                    column={col} // Pass column if needed, or remove prop if not
                                    label={col.label} // Pass label explicitly if TaskColumn expects it
                                    id={col.id} // Pass id explicitly if TaskColumn expects it
                                    tasks={filteredTasks.filter((task) => task.status === col.id)}
                                    onStatusChange={handleStatusChange}
                                    onClickTask={(task) => { setEditingTask(task); setIsModalOpen(true); }}
                                />
                            ))}
                        </div>
                        <DragOverlay>
                            {activeId && activeTask ? (
                                <div className="opacity-50 rotate-3">
                                    <TaskCard task={activeTask} onStatusChange={() => { }} />
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[600px]">
                        <thead className="bg-stone-50 text-stone-500 font-medium uppercase text-xs">
                            <tr>
                                <th className="p-4">Task</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Priority</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Due Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredTasks.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-taupe">No tasks found.</td></tr>
                            ) : (
                                filteredTasks.map(task => (
                                    <tr key={task.id} className="hover:bg-gold-leaf-50/10 group transition-colors cursor-pointer" onClick={() => { setEditingTask(task); setIsModalOpen(true); }}>
                                        <td className="p-4 font-medium text-charcoal">{task.title}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                 ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-800'}`}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                 ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {task.priority || 'medium'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-stone-600">{task.category || '-'}</td>
                                        <td className="p-4 text-stone-600">
                                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}>
                                                <X className="w-4 h-4 text-stone-400 hover:text-red-500" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <TaskDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={editingTask}
                eventId={eventId}
                onSave={handleSaveTask}
                onDelete={handleDeleteTask}
            />
        </div>
    );
}

