import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EventSettingsForm } from "@/components/events/EventSettingsForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EventSettingsPage({ params }: { params: Promise<{ id: string }> }) {
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

    return (
        <div className="w-full space-y-6">
            <div>
                <Link href={`/dashboard/events/${id}`} className="text-sm text-stone-500 hover:text-charcoal flex items-center gap-1 mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Event Dashboard
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-serif text-charcoal">Event Settings</h1>
                        <p className="text-taupe mt-1">Manage event details, public page, and danger zone.</p>
                    </div>
                </div>
            </div>

            <EventSettingsForm event={event} />
        </div>
    );
}
