import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { DashboardTimeline } from "@/components/timeline/DashboardTimeline";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export default async function TimelineDashboardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch event details
    const { data: event } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

    if (!event) {
        return notFound();
    }

    // Fetch timeline items
    const { data: timelineItems } = await supabase
        .from('timeline_items')
        .select('*')
        .eq('event_id', id)
        .order('order', { ascending: true });

    return (
        <div className="space-y-6">
            <div>
                <Link href={`/dashboard/events/${id}`} className="text-sm text-stone-500 hover:text-charcoal flex items-center gap-1 mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Event Dashboard
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-serif text-charcoal">Event Timeline</h1>
                        <p className="text-taupe mt-1">Manage your event schedule and share it with guests.</p>
                    </div>
                </div>
            </div>

            <DashboardTimeline eventId={id} initialItems={timelineItems || []} />
        </div>
    );
}
