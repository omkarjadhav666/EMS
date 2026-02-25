import { GuestList } from "@/components/guests/GuestList";
import { AddGuestForm } from "@/components/guests/AddGuestForm";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: guests } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', id)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <Link href={`/dashboard/events/${id}`} className="text-sm text-stone-500 hover:text-charcoal flex items-center gap-1 mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Event Dashboard
                </Link>
                <h1 className="text-3xl font-serif text-charcoal">Guest List</h1>
                <p className="text-taupe mt-1">Manage your event attendees</p>
            </div>
            <GuestList initialGuests={guests || []} eventId={id} />
        </div>
    );
}
