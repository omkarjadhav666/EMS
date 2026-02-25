"use client";

import { Task } from "@/components/tasks/types";
import { format, isSameMonth, parseISO } from "date-fns";
import { CheckCircle2, Circle, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineViewProps {
    tasks: Task[];
}

export function TimelineView({ tasks }: TimelineViewProps) {
    // 1. Sort tasks by due_date
    const sortedTasks = [...tasks].sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });

    // 2. Group by Month
    const groupedTasks: { [key: string]: Task[] } = {};
    sortedTasks.forEach(task => {
        if (!task.due_date) {
            const key = "No Date";
            if (!groupedTasks[key]) groupedTasks[key] = [];
            groupedTasks[key].push(task);
            return;
        }
        const date = parseISO(task.due_date);
        const key = format(date, "MMMM yyyy");
        if (!groupedTasks[key]) groupedTasks[key] = [];
        groupedTasks[key].push(task);
    });

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-200 before:to-transparent">
                {Object.entries(groupedTasks).map(([month, tasks]) => (
                    <div key={month} className="relative is-active group text-center">
                        {/* Month Header */}
                        <div className="flex items-center justify-center mb-6 sticky top-24 z-10">
                            <span className="bg-white border border-stone-200 text-stone-500 px-4 py-1 rounded-full text-sm font-serif font-bold shadow-sm">
                                {month}
                            </span>
                        </div>

                        <div className="space-y-8">
                            {tasks.map((task, idx) => {
                                const isEven = idx % 2 === 0;
                                const isCompleted = task.status === 'completed';
                                const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isCompleted;

                                return (
                                    <div key={task.id} className={cn(
                                        "md:flex items-center justify-between gap-8 w-full group",
                                        isEven ? "flex-row-reverse" : ""
                                    )}>
                                        {/* Task Card */}
                                        <div className="w-full md:w-[calc(50%-2rem)] bg-white p-4 rounded-lg border border-stone-100 shadow-sm hover:shadow-md transition-all text-left relative">
                                            {/* Connector Dot */}
                                            <div className={cn(
                                                "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 bg-white z-10 hidden md:block",
                                                isEven ? "-left-[2.55rem]" : "-right-[2.55rem]",
                                                isCompleted ? "border-green-500 bg-green-50" :
                                                    isOverdue ? "border-red-400 bg-red-50" : "border-stone-300"
                                            )}></div>

                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className={cn(
                                                        "font-serif font-bold text-lg mb-1",
                                                        isCompleted ? "text-stone-400 line-through" : "text-charcoal"
                                                    )}>
                                                        {task.title}
                                                    </h4>
                                                    {task.due_date && (
                                                        <p className={cn("text-xs flex items-center gap-1", isOverdue ? "text-red-500 font-bold" : "text-taupe")}>
                                                            <CalendarIcon className="w-3 h-3" />
                                                            {format(parseISO(task.due_date), "MMM d, yyyy")}
                                                            {isOverdue && <span className="ml-1 text-[10px] uppercase bg-red-100 px-1 rounded">Overdue</span>}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="mt-1">
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                    ) : isOverdue ? (
                                                        <AlertCircle className="w-5 h-5 text-red-400" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-stone-300" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Spacer for Center Line */}
                                        <div className="hidden md:block w-8"></div>

                                        {/* Empty Side for balance */}
                                        <div className="hidden md:block w-[calc(50%-2rem)]"></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
