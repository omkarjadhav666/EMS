"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskStatus } from "./types";
import { GripVertical } from "lucide-react";
import { TaskCard } from "./TaskCard";

interface SortableTaskCardProps {
    task: Task;
    onStatusChange: (id: string, status: TaskStatus) => void;
    onClick?: () => void;
}

export function SortableTaskCard({ task, onStatusChange, onClick }: SortableTaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative group touch-none"
        >
            {/* Drag Handle - positioned absolute to not affect TaskCard layout */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-2 top-2 z-10 p-1 text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing hover:bg-stone-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical className="w-4 h-4" />
            </div>

            <div className="pl-6"> {/* Add padding for the grip handle */}
                <TaskCard
                    task={task}
                    onStatusChange={onStatusChange}
                    onClick={() => onClick?.()}
                />
            </div>
        </div>
    );
}
