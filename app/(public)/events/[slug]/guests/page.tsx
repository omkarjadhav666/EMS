import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { RSVPForm } from "@/components/guests/RSVPForm";

// Helper function to format time
function formatTime(dateString: string) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default async function GuestRSVPPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    let event = null;
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('slug', slug)
            .single();
        if (error) throw error;
        event = data;
    } catch (error) {
        console.error('GuestPage fetch error:', error);
        // Fallback or notFound will trigger below if event is null
    }

    if (!event) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-stone-50 font-sans selection:bg-gold-leaf-200">
            {/* Navigation */}
            <nav className="absolute top-0 left-0 right-0 p-6 z-10">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href={`/events/${slug}`}
                        className="inline-flex items-center text-stone-500 hover:text-charcoal bg-white/50 hover:bg-white backdrop-blur-sm px-4 py-2 rounded-full transition-all text-sm font-medium border border-white/20 shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Event
                    </Link>
                </div>
            </nav>

            <div className="relative pt-24 pb-12 px-4 sm:px-6">
                {/* Content Container */}
                <div className="max-w-3xl mx-auto">

                    {/* Hero Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100 mb-8 animate-in slide-in-from-bottom-8 duration-700">
                        <div className="relative h-48 bg-charcoal flex items-center justify-center overflow-hidden">
                            {/* Abstract Pattern / Image Placeholder */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>

                            <div className="relative z-10 text-center text-white px-6">
                                <h1 className="text-3xl md:text-5xl font-serif font-medium mb-2">{event.title}</h1>
                                <p className="text-stone-300 text-sm tracking-widest uppercase">You are invited</p>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left border-b border-stone-100 pb-8 mb-8">
                                <div className="flex flex-col items-center md:items-start gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gold-leaf-50 flex items-center justify-center text-gold-leaf-600 mb-1">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-stone-400 text-xs uppercase tracking-wide">Date</h3>
                                    <p className="text-charcoal font-serif text-lg">{format(new Date(event.event_date), 'MMMM do, yyyy')}</p>
                                </div>
                                <div className="flex flex-col items-center md:items-start gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gold-leaf-50 flex items-center justify-center text-gold-leaf-600 mb-1">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-stone-400 text-xs uppercase tracking-wide">Time</h3>
                                    <p className="text-charcoal font-serif text-lg">
                                        {formatTime(event.event_date)}
                                    </p>
                                </div>
                                <div className="flex flex-col items-center md:items-start gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gold-leaf-50 flex items-center justify-center text-gold-leaf-600 mb-1">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-stone-400 text-xs uppercase tracking-wide">Location</h3>
                                    <p className="text-charcoal font-serif text-lg">{event.location || "TBD"}</p>
                                </div>
                            </div>

                            <div className="max-w-xl mx-auto">
                                <h2 className="text-2xl font-serif text-center mb-6 text-charcoal">RSVP</h2>
                                <RSVPForm eventId={event.id} />
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-stone-400 text-xs">
                        <p>© {new Date().getFullYear()} Glamoora. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
