"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Calendar, Users, LayoutGrid } from "lucide-react";
import { EVENT_TEMPLATES } from "@/lib/constants/eventTemplates";

export function EventDirectory({ initialEvents }: { initialEvents: any[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    // Convert EVENT_TEMPLATES object into an array for rendering buttons
    const eventCategories = Object.entries(EVENT_TEMPLATES).map(([key, template]) => ({
        id: key,
        label: template.label,
    }));

    const filteredEvents = selectedCategory === "All"
        ? initialEvents
        : initialEvents.filter(event => {
            // Check if the event's type matches the selected category id
            // Some events might have event_type saved as "wedding", "corporate", etc.
            return event.event_type?.toLowerCase() === selectedCategory.toLowerCase();
        });

    return (
        <div className="space-y-12">
            {/* Category Filter Scroll Area */}
            <div className="w-full overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex items-center gap-3 min-w-max px-1">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 font-medium whitespace-nowrap ${selectedCategory === "All"
                            ? "bg-[var(--theme-accent)] text-white border-[var(--theme-accent)] shadow-md transform scale-105"
                            : "bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] border-[var(--theme-border-color)] hover:border-[var(--theme-accent-light)] hover:text-[var(--theme-accent)]"
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        All Events
                    </button>
                    {eventCategories.map((category) => {
                        const isSelected = selectedCategory === category.id;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 font-medium whitespace-nowrap ${isSelected
                                    ? "bg-[var(--theme-accent)] text-white border-[var(--theme-accent)] shadow-md transform scale-105"
                                    : "bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] border-[var(--theme-border-color)] hover:border-[var(--theme-accent-light)] hover:text-[var(--theme-accent)]"
                                    }`}
                            >
                                {category.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Events Grid */}
            {filteredEvents && filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event) => {
                        const title = event.title || event.name;

                        return (
                            <Link
                                href={`/events/${event.slug || event.id}`}
                                key={event.id}
                                className="group bg-[var(--theme-bg-primary)] rounded-2xl overflow-hidden border border-[var(--theme-border-color)] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
                                data-theme={event.theme || "modern"}
                            >
                                <div className="h-48 relative overflow-hidden bg-gradient-to-tr from-charcoal to-stone-500">
                                    {event.cover_image && !imageErrors[event.id] ? (
                                        <>
                                            <img
                                                src={event.cover_image}
                                                alt={title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 mix-blend-overlay"
                                                onError={() => setImageErrors(prev => ({ ...prev, [event.id]: true }))}
                                            />
                                            <div className="absolute inset-0 bg-charcoal/30 group-hover:bg-charcoal/10 transition-colors"></div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-white/50 pattern-dots">
                                            <Calendar className="w-12 h-12 mb-2 opacity-20" />
                                            <span className="font-serif tracking-widest uppercase text-xs">Glamoora Event</span>
                                        </div>
                                    )}

                                    {/* Date Badge */}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-lg p-2 text-center shadow-lg min-w-[60px]">
                                        <div className="text-[10px] uppercase font-bold text-gold-leaf-600 tracking-wider">
                                            {format(new Date(event.date), "MMM")}
                                        </div>
                                        <div className="text-xl font-serif text-[var(--theme-text-primary)] leading-none mt-1">
                                            {format(new Date(event.date), "dd")}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gold-leaf-600">
                                            {event.event_type || 'Public Event'}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-serif text-[var(--theme-text-primary)] mb-3 group-hover:text-[var(--theme-accent)] transition-colors line-clamp-1">
                                        {title}
                                    </h3>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-start gap-3 text-[var(--theme-text-muted)] text-sm">
                                            <MapPin className="w-4 h-4 mt-0.5 text-gold-leaf-500 shrink-0" />
                                            <span className="line-clamp-2">{event.location || "Location TBD"}</span>
                                        </div>
                                        {event.guest_count > 0 && (
                                            <div className="flex items-center gap-3 text-[var(--theme-text-muted)] text-sm">
                                                <Users className="w-4 h-4 text-gold-leaf-500 shrink-0" />
                                                <span>Up to {event.guest_count} guests</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center border-t border-[var(--theme-border-color)] pt-4">
                                        <span className="text-[var(--theme-text-muted)] text-sm group-hover:text-[var(--theme-accent)] transition-colors">
                                            View Details
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-gold-leaf-500 group-hover:text-white text-stone-400 transition-colors">
                                            &rarr;
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-24 bg-[var(--theme-bg-primary)] rounded-2xl border border-[var(--theme-border-color)]">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-stone-400" />
                    </div>
                    <h3 className="text-xl font-serif text-[var(--theme-text-primary)] mb-2">No Events in this Category</h3>
                    <p className="text-[var(--theme-text-muted)] max-w-md mx-auto">
                        Check back soon to discover new exclusive gatherings in this category.
                    </p>
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className="mt-6 px-6 py-2 border border-[var(--theme-border-color)] rounded-full text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-secondary)] transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
