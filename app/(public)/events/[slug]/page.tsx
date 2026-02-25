import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { EventHero } from "@/components/public/EventHero";
import { EventTimeline } from "@/components/public/EventTimeline";
import { RSVPSection } from "@/components/public/RSVPSection";
import { PublicEvent, TimelineItem } from "@/types/public-event";

export default async function PublicEventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch event details
    const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single();

    if (eventError || !eventData) {
        return notFound();
    }

    // Fetch timeline items
    const { data: timelineData } = await supabase
        .from('timeline_items')
        .select('*')
        .eq('event_id', eventData.id)
        .order('order', { ascending: true });

    // Cast to expected types (supabase types might need adjustment in real app, but for now casting is fine for MVP)
    const event: PublicEvent = {
        id: eventData.id,
        title: eventData.title || eventData.name, // Handle column name mismatch if any remains
        date: eventData.date,
        location: eventData.location,
        description: eventData.description,
        cover_image: eventData.cover_image,
        theme: eventData.theme || 'modern',
        event_type: eventData.event_type || 'wedding'
    };

    const timelineItems: TimelineItem[] = (timelineData || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        start_time: item.start_time,
        end_time: item.end_time,
        order_index: item.order
    }));

    return (
        <div className="min-h-screen bg-[var(--theme-bg-secondary)] text-[var(--theme-text-content)] font-[family-name:var(--theme-font-body)] overflow-x-hidden selection:bg-[var(--theme-accent)] selection:text-white" data-theme={event.theme || 'modern'}>
            <EventHero event={event} />

            {/* Overlapping Main Content Card */}
            <div className="relative z-20 -mt-24 md:-mt-32 pb-24 px-4">
                <div
                    className="max-w-6xl mx-auto glass-panel rounded-[var(--theme-radius)] overflow-hidden relative"
                    style={{ boxShadow: 'var(--theme-shadow-card)' }}
                >
                    {/* Texture Overlay for Card */}
                    <div
                        className="absolute inset-0 opacity-[var(--theme-pattern-opacity)] pointer-events-none mix-blend-overlay"
                        style={{ backgroundImage: 'var(--theme-bg-texture)' }}
                    />

                    {/* Content Container */}
                    <div className="relative z-10">

                        {/* 1. Intro & Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-[var(--theme-border-color)]">
                            {/* Welcome Column */}
                            <div className="p-12 md:p-16 flex flex-col justify-center text-center md:text-left border-b md:border-b-0 md:border-r border-[var(--theme-border-color)]">
                                <div className="w-16 h-px bg-[var(--theme-accent)] mb-8 mx-auto md:mx-0 opacity-50" />
                                <h2 className="text-4xl md:text-5xl font-[family-name:var(--theme-font-heading)] text-[var(--theme-text-primary)] mb-6 leading-tight">
                                    Welcome
                                </h2>
                                <p className="text-lg text-[var(--theme-text-muted)] font-light leading-relaxed">
                                    {event.description || "We invite you to join us for this special occasion. We look forward to celebrating with you."}
                                </p>
                            </div>

                            {/* Key Details Column */}
                            <div className="p-12 md:p-16 bg-[var(--theme-bg-secondary)]/30 flex flex-col justify-center space-y-8">
                                <div className="detail-item flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full border border-[var(--theme-border-color)] flex items-center justify-center text-[var(--theme-accent)] shrink-0 bg-[var(--theme-bg-content)]">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-[var(--theme-text-primary)] font-[family-name:var(--theme-font-heading)] text-xl mb-1">Location</h3>
                                        <p className="text-[var(--theme-text-muted)] text-sm leading-relaxed">
                                            {event.location || "TBD"}
                                        </p>
                                        {event.location && (
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[var(--theme-accent)] text-xs uppercase tracking-widest font-bold mt-2 inline-block hover:opacity-80 border-b border-[var(--theme-accent)]"
                                            >
                                                View Map
                                            </a>
                                        )}
                                    </div>
                                </div>
                                {/* Could add Date/Time here too if needed, but they are in Hero */}
                            </div>
                        </div>

                        {/* 2. Wide Map Banner */}
                        <div className="w-full h-[400px] relative group overflow-hidden border-b border-[var(--theme-border-color)]">
                            <div className="absolute inset-0 grayscale contrast-[0.9] opacity-80 group-hover:grayscale-0 transition-all duration-1000 ease-in-out">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location || 'New York')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                    className="w-full h-full mix-blend-multiply"
                                />
                                <div className="absolute inset-0 bg-[var(--theme-bg-primary)]/20 pointer-events-none mix-blend-overlay" />
                            </div>
                            <div className="absolute inset-0 pointer-events-none border-y border-[var(--theme-border-color)] opacity-50" />
                        </div>

                        {/* 3. Timeline & RSVP */}
                        <div className="bg-[var(--theme-bg-content)]">
                            {timelineItems.length > 0 && <EventTimeline items={timelineItems} />}

                            <div className="border-t border-[var(--theme-border-color)]">
                                <RSVPSection eventId={event.id} date={event.date} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer outside the card */}
                <footer className="mt-16 text-center text-zinc-500 text-sm font-light tracking-wide">
                    <p>&copy; {new Date().getFullYear()} {event.title}.</p>
                    <p className="mt-2 text-xs opacity-50">Beautifully designed with Glamoora</p>
                </footer>
            </div>
        </div>
    );
}
