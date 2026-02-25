import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { TimelineList } from "@/components/timeline/TimelineList";
import Link from "next/link";
import { ArrowLeft, Clock, CalendarDays } from "lucide-react";
import { format } from "date-fns";

export default async function PublicTimelinePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch event details
    const { data: event } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!event) {
        return notFound();
    }

    // Fetch timeline items
    const { data: timelineItems } = await supabase
        .from('timeline_items')
        .select('*')
        .eq('event_id', event.id)
        .order('order', { ascending: true });

    return (
        <div className="min-h-screen bg-stone-50/50">
            {/* Hero Section */}
            <div className="bg-white border-b border-stone-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <Link href={`/events/${slug}`} className="inline-flex items-center text-sm text-stone-500 hover:text-charcoal mb-6 transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Event
                    </Link>

                    <div className="text-center md:text-left">
                        <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">{event.title} - Schedule</h1>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-stone-500 justify-center md:justify-start">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="w-5 h-5 text-gold-leaf-500" />
                                <span>{format(new Date(event.date), 'EEEE, MMMM do, yyyy')}</span>
                            </div>
                            {event.location && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gold-leaf-500" />
                                    <span>{format(new Date(event.date), 'h:mm a')} Start</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <TimelineList items={timelineItems || []} />
            </div>

            <footer className="bg-white border-t border-stone-100 py-8 mt-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-stone-400 text-sm">© {new Date().getFullYear()} Glamoora. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
