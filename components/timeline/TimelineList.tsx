"use client";

import { TimelineItem as TimelineItemType } from "./types";
import { TimelineItem } from "./TimelineItem";
import { format } from "date-fns";

interface TimelineListProps {
    items: TimelineItemType[];
}

export function TimelineList({ items }: TimelineListProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-xl border border-dashed border-stone-200">
                <p className="text-stone-400 font-serif text-xl">Timeline coming soon...</p>
                <p className="text-stone-300 text-sm mt-2">Check back later for the full schedule.</p>
            </div>
        );
    }

    // Group by date if needed, for now assuming single event date or just sequential list
    const sortedItems = [...items].sort((a, b) => a.order - b.order);

    return (
        <div className="relative py-8 px-4 md:px-0">
            {/* Center Line for Mobile */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-stone-100 md:hidden" />

            {sortedItems.map((item, index) => (
                <TimelineItem
                    key={item.id}
                    item={item}
                    index={index}
                    isLast={index === sortedItems.length - 1}
                />
            ))}
        </div>
    );
}
