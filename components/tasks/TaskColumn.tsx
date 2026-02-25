"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task, TaskStatus } from "./types";
import { SortableTaskCard } from "./SortableTaskCard";
import { LayoutTemplate } from "lucide-react";

interface TaskColumnProps {
    id: TaskStatus;
    label: string;
    column?: any; // To satisfy potential props
    tasks: Task[];
    onStatusChange: (id: string, status: TaskStatus) => void;
    onClickTask?: (task: Task) => void;
}

export function TaskColumn({ id, label, tasks, onStatusChange, onClickTask }: TaskColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
        data: {
            type: "Column",
        },
    });

    return (
        <SortableContext
            id={id}
            items={tasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
        >
            <div
                ref={setNodeRef}
                className="flex flex-col h-full bg-alabaster/50 rounded-xl border border-stone-100 min-h-[400px] xl:min-h-[500px] w-full xl:w-80 shrink-0"
            >
                {/* Column Header */}
                <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-white rounded-t-xl">
                    <h3 className="font-bold text-taupe uppercase tracking-wider text-xs">{label}</h3>
                    <span className="bg-stone-100 text-stone-600 text-[10px] px-2 py-0.5 rounded-full font-bold border border-stone-200">
                        {tasks.length}
                    </span>
                </div>

                {/* Task List - Droppable Zone */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                    {tasks.map(task => (
                        <SortableTaskCard
                            key={task.id}
                            task={task}
                            onStatusChange={onStatusChange}
                            onClick={() => onClickTask?.(task)}
                        />
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
                                <LayoutTemplate className="w-6 h-6 text-stone-300" />
                            </div>
                            <p className="text-xs text-stone-400">No tasks here yet</p>
                        </div>
                    )}
                </div>
            </div>
        </SortableContext>
    );
}
