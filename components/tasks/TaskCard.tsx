import { Task } from "./types";
import { cn } from "@/lib/utils";
import { Clock, MoreHorizontal, CheckCircle2, Circle, Globe, Tag } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
    task: Task;
    onStatusChange: (taskId: string, newStatus: Task['status']) => void;
    onClick?: (task: Task) => void;
}

const PRIORITY_COLORS = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-blue-100 text-blue-700 border-blue-200"
};

export function TaskCard({ task, onStatusChange, onClick }: TaskCardProps) {
    const isCompleted = task.status === 'completed';

    return (
        <div
            onClick={() => onClick?.(task)}
            className={cn(
                "bg-white p-4 rounded-lg border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative",
                isCompleted && "opacity-60 bg-stone-50"
            )}>
            {/* Priority Strip */}
            {task.priority && !isCompleted && (
                <div className={cn("absolute left-0 top-4 bottom-4 w-1 rounded-r-full",
                    task.priority === 'high' ? "bg-red-400" :
                        task.priority === 'medium' ? "bg-yellow-400" : "bg-blue-400"
                )} />
            )}

            <div className="flex justify-between items-start mb-2 pl-2">
                <h4 className={cn("font-bold text-charcoal text-sm", isCompleted && "line-through text-stone-400")}>
                    {task.title}
                </h4>
                {task.is_public && (
                    <Globe className="w-3 h-3 text-gold-leaf-500 shrink-0 ml-2" />
                )}
            </div>

            {task.description && (
                <p className="text-xs text-taupe line-clamp-2 mb-3 font-sans pl-2">
                    {task.description}
                </p>
            )}

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 pl-2">
                <div className="flex items-center gap-2">
                    {task.due_date && (
                        <div className={cn("flex items-center gap-1 text-[10px]",
                            new Date(task.due_date) < new Date() && !isCompleted ? "text-terra-cotta font-bold" : "text-stone-400"
                        )}>
                            <Clock className="w-3 h-3" />
                            {format(new Date(task.due_date), "MM/dd/yyyy")}
                        </div>
                    )}
                    {task.category && (
                        <div className="flex items-center gap-1 text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-full">
                            <Tag className="w-2.5 h-2.5" />
                            {task.category}
                        </div>
                    )}
                </div>

                {/* Simple Status Toggle for MVP */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(task.id, isCompleted ? 'pending' : 'completed');
                    }}
                    className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                        isCompleted ? "text-sage hover:text-sage-600" : "text-stone-300 hover:text-gold-leaf-500"
                    )}
                >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
