"use client";

import { TimelineItem as TimelineItemType } from "./types";
import { format } from "date-fns";
import { Clock, MapPin, Music, Utensils, Camera, PartyPopper, Gem, Heart, Star, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
    item: TimelineItemType;
    isLast?: boolean;
    index: number;
}

const ICONS: Record<string, any> = {
    clock: Clock,
    location: MapPin,
    music: Music,
    food: Utensils,
    camera: Camera,
    party: PartyPopper,
    ring: Gem,
    heart: Heart,
    star: Star,
    sparkles: Sparkles
};

export function TimelineItem({ item, isLast, index }: TimelineItemProps) {
    const Icon = item.icon && ICONS[item.icon] ? ICONS[item.icon] : Star;
    const startTime = new Date(item.start_time);
    const endTime = item.end_time ? new Date(item.end_time) : null;

    return (
        <div className="relative pl-8 md:pl-0">
            {/* Desktop: Alternate sides (Optional, for now let's keep it simple vertical left-aligned for mobile adaptability) */}

            <div className="flex flex-col md:flex-row gap-4 md:gap-8 group">
                {/* Time Column (Desktop) */}
                <div className="hidden md:flex flex-col items-end w-32 pt-1 text-right">
                    <span className="font-serif text-xl text-charcoal">{format(startTime, 'h:mm a')}</span>
                    {endTime && (
                        <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">
                            to {format(endTime, 'h:mm a')}
                        </span>
                    )}
                </div>

                {/* Timeline Line & Dot */}
                <div className="absolute left-0 md:left-32 top-0 bottom-0 md:ml-8 flex flex-col items-center">
                    <div className={cn(
                        "w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110",
                        index % 2 === 0 ? "bg-gold-leaf-100 text-gold-leaf-600" : "bg-stone-100 text-stone-500"
                    )}>
                        <Icon className="w-5 h-5" />
                    </div>
                    {!isLast && (
                        <div className="w-0.5 flex-grow bg-stone-200 mt-2 mb-2 group-hover:bg-gold-leaf-200 transition-colors" />
                    )}
                </div>

                {/* Content Card */}
                <div className="flex-1 pb-12 animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 150}ms` }}>
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-white/20 hover:shadow-md transition-all duration-300 relative group-hover:-translate-y-1">
                        {/* Mobile Time */}
                        <div className="md:hidden mb-2 flex items-center gap-2 text-gold-leaf-600 text-sm font-bold uppercase tracking-wide">
                            <Clock className="w-3 h-3" />
                            {format(startTime, 'h:mm a')}
                            {endTime && ` - ${format(endTime, 'h:mm a')}`}
                        </div>

                        <h3 className="text-xl font-serif text-charcoal mb-2 group-hover:text-gold-leaf-700 transition-colors">{item.title}</h3>

                        {item.description && (
                            <p className="text-stone-500 text-sm leading-relaxed">{item.description}</p>
                        )}

                        {/* Decorative triangle / arrow */}
                        <div className="absolute top-8 -left-2 w-4 h-4 bg-white/80 backdrop-blur-md transform rotate-45 border-l border-b border-white/20 md:block hidden" />
                    </div>
                </div>
            </div>
        </div>
    );
}
