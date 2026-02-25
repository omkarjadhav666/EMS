"use client";

import { useState, useMemo } from "react";
import { Task, TaskStatus } from "./types";
import { Filter, Search, X, CheckCircle2, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskDetailsModal } from "./TaskDetailsModal";

// Extend Task interface for the global view to include the joined event data
export interface GlobalTask extends Task {
    events?: {
        title: string;
    } | null;
}

interface GlobalTasksViewProps {
    initialTasks: GlobalTask[];
}

export function GlobalTasksView({ initialTasks }: GlobalTasksViewProps) {
    const [tasks, setTasks] = useState<GlobalTask[]>(initialTasks);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterPriority, setFilterPriority] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<GlobalTask | null>(null);

    const supabase = createClient();

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (task.events?.title?.toLowerCase() || "").includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
            const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tasks, searchQuery, filterStatus, filterPriority]);

    // Handle Quick Status Toggle
    const toggleTaskStatus = async (task: GlobalTask) => {
        const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';

        // Optimistic UI Update
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

        const { error } = await supabase
            .from('event_tasks')
            .update({ status: newStatus })
            .eq('id', task.id);

        if (error) {
            console.error("Error toggling task status:", error);
            // Revert on error
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: task.status } : t));
        }
    };

    // Handle Modal Save
    const handleSaveTask = (savedTask: Task) => {
        setTasks(prev => {
            const exists = prev.find(t => t.id === savedTask.id);
            if (exists) {
                return prev.map(t => t.id === savedTask.id ? { ...savedTask, events: exists.events } : t);
            }
            // For new tasks, we'd ideally fetch the joined event name, but since we don't have a "Create Task" 
            // from the global view yet, this is mostly for updates.
            return prev;
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

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                        <Input
                            placeholder="Search tasks or events..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-full sm:w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">To Do</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterPriority} onValueChange={setFilterPriority}>
                            <SelectTrigger className="w-full sm:w-[140px]">
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
                </div>
            </div>

            {/* List View */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 font-medium uppercase text-xs">
                            <tr>
                                <th className="p-4 w-12 text-center">Done</th>
                                <th className="p-4">Task Name</th>
                                <th className="p-4">Event</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Priority</th>
                                <th className="p-4">Due Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-stone-400">
                                            <Filter className="w-12 h-12 mb-4 opacity-20" />
                                            <p className="text-lg font-medium text-stone-600">No tasks found</p>
                                            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTasks.map(task => (
                                    <tr
                                        key={task.id}
                                        className={`hover:bg-stone-50/50 transition-colors cursor-pointer ${task.status === 'completed' ? 'opacity-60' : ''}`}
                                        onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                                    >
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleTaskStatus(task); }}
                                                className="transition-transform hover:scale-110 focus:outline-none"
                                            >
                                                {task.status === 'completed' ? (
                                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                                ) : (
                                                    <Circle className="w-6 h-6 text-stone-300 hover:text-gold-leaf-400" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4 font-medium text-charcoal max-w-[300px] truncate">
                                            <span className={task.status === 'completed' ? 'line-through text-stone-400' : ''}>
                                                {task.title}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-stone-100 text-stone-700">
                                                {task.events?.title || 'Unknown Event'}
                                            </span>
                                        </td>
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
                                        <td className="p-4 text-stone-600">
                                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Task Details Modal Wrapper for editing */}
            {editingTask && (
                <TaskDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    task={editingTask as Task}
                    eventId={editingTask.event_id}
                    onSave={handleSaveTask}
                    onDelete={handleDeleteTask}
                />
            )}
        </div>
    );
}
