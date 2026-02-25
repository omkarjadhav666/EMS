import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Calendar, Users } from "lucide-react";

export const metadata = {
    title: "Public Events | Glamoora",
    description: "Discover and participate in exclusive public events powered by Glamoora.",
};

export default async function PublicEventsPage() {
    const supabase = await createClient();

    // Fetch public events
    const { data: events, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_public", true)
        .order("date", { ascending: true }); // Show upcoming first

    if (error) {
        console.error("Error fetching events:", error);
    }

    return (
        <div className="bg-[var(--theme-bg-secondary)] min-h-screen py-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif text-[var(--theme-text-primary)] mb-4">
                        Featured Events
                    </h1>
                    <p className="text-[var(--theme-text-muted)] max-w-2xl mx-auto text-lg">
                        Explore and join beautifully orchestrated public gatherings, workshops, and celebrations.
                    </p>
                </div>

                {events && events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => {
                            // Some events might just have "name" instead of "title" depending on schema evolution
                            const title = event.title || event.name;

                            return (
                                <Link
                                    href={`/events/${event.slug || event.id}`}
                                    key={event.id}
                                    className="group bg-[var(--theme-bg-primary)] rounded-2xl overflow-hidden border border-[var(--theme-border-color)] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
                                    data-theme={event.theme || "modern"}
                                >
                                    <div className="h-48 relative overflow-hidden bg-gradient-to-tr from-charcoal to-stone-500">
                                        {event.cover_image ? (
                                            <>
                                                <img
                                                    src={event.cover_image}
                                                    alt={title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 mix-blend-overlay"
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
                                            <div className="text-xl font-serif text-charcoal leading-none mt-1">
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
                        <h3 className="text-xl font-serif text-[var(--theme-text-primary)] mb-2">No Upcoming Public Events</h3>
                        <p className="text-[var(--theme-text-muted)] max-w-md mx-auto">
                            Check back soon to discover new exclusive gatherings. Why not host your own?
                        </p>
                        <Link href="/register" className="btn-primary mt-6 inline-block">
                            Start Planning
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
