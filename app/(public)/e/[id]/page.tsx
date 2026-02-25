import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { RSVPModal } from "@/components/public/RSVPModal";

export default async function PublicEventPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();

    // Fetch event (check compatibility with UUID or Slug later, using ID for now)
    const { data: event, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id)
        // .eq('is_public', true) // Ideally we enforce this, but for MVP demos we might skip it or handle it in UI
        .single();

    if (error || !event) {
        return notFound();
    }

    if (!event.is_public) {
        // Optional: allow owner to see it? For now, public is public.
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-serif text-charcoal">Private Event</h1>
                <p className="text-taupe mt-2">This event page involves an invitation only.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100">
                {/* Herop Image Placeholder */}
                <div className="h-48 bg-gradient-to-r from-charcoal to-stone-800 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-white text-center px-4">
                        {event.title}
                    </h1>
                </div>

                <div className="p-8 md:p-12 space-y-8">
                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center text-center md:text-left">
                        <div className="flex items-center gap-3 text-stone-600">
                            <div className="p-3 bg-stone-100 rounded-full">
                                <Calendar className="w-6 h-6 text-charcoal" />
                            </div>
                            <div>
                                <p className="text-xs text-taupe uppercase tracking-wider font-semibold">Date</p>
                                <p className="font-medium text-lg">{format(new Date(event.date), 'MMMM d, yyyy')}</p>
                            </div>
                        </div>

                        <div className="hidden md:block w-px h-12 bg-stone-200"></div>

                        <div className="flex items-center gap-3 text-stone-600">
                            <div className="p-3 bg-stone-100 rounded-full">
                                <MapPin className="w-6 h-6 text-charcoal" />
                            </div>
                            <div>
                                <p className="text-xs text-taupe uppercase tracking-wider font-semibold">Location</p>
                                <p className="font-medium text-lg">{event.location || 'TBD'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-6 pt-4 border-t border-stone-100">
                        <p className="text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
                            Join us for a celebration! Use the button below to confirm your attendance.
                        </p>

                        <div className="flex justify-center">
                            <RSVPModal eventId={event.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
