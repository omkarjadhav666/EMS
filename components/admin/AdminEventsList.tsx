'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ExternalLink, Calendar, Search, Lock, Globe } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EventWithDetails {
    id: string;
    title: string;
    date: string;
    location: string;
    status: string;
    is_public: boolean;
    public_slug: string | null;
    user_id: string;
    created_at: string;
    profiles?: {
        full_name: string;
        email: string;
    };
}

export function AdminEventsList() {
    const [events, setEvents] = useState<EventWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const supabase = createClient();

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                // Fetch events and join with profiles to get the owner's name
                // Supabase RLS policy "Admins view all events" should allow this
                const { data, error } = await supabase
                    .from('events')
                    .select(`
                        id, title, date, location, status, is_public, public_slug, user_id, created_at,
                        profiles ( full_name, email )
                    `)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Error fetching events:", error);
                } else if (data) {
                    setEvents(data as any);
                }
            } catch (err) {
                console.error("Unexpected error fetching events:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = events.filter(evt =>
        evt.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gold-leaf-500" />
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-md border border-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-500">
            <div className="p-8 border-b border-stone-100/50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-white to-stone-50/30">
                <div>
                    <h3 className="font-serif text-2xl text-charcoal tracking-tight">All Platform Events</h3>
                    <p className="text-sm text-taupe mt-1">Oversight and management of all client events.</p>
                </div>

                <div className="relative max-w-sm w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-stone-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search events, clients, or locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-stone-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-leaf-400 focus:border-transparent placeholder:text-stone-300 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50/50 text-[10px] tracking-widest uppercase text-stone-400 font-bold border-b border-stone-100/50">
                        <tr>
                            <th className="px-8 py-4">Event Details</th>
                            <th className="px-8 py-4">Client</th>
                            <th className="px-8 py-4">Status / Privacy</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100/50 bg-white/40">
                        {filteredEvents.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-16 text-center">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <Search className="w-6 h-6 sm:w-8 sm:h-8 text-stone-300" />
                                    </div>
                                    <p className="font-serif text-xl sm:text-2xl text-charcoal mb-2 sm:mb-3">No events found</p>
                                    <p className="text-sm sm:text-base text-taupe max-w-sm mx-auto">We couldn't find any events matching your search criteria.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredEvents.map((evt) => (
                                <tr key={evt.id} className="hover:bg-stone-50/80 transition-colors group relative">
                                    <td className="px-8 py-6">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-leaf-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="font-bold text-charcoal text-base">{evt.title}</div>
                                        <div className="text-xs text-taupe mt-1.5 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {evt.date ? format(new Date(evt.date), "MMM d, yyyy") : "No date"}
                                        </div>
                                        <div className="text-xs text-taupe mt-1">
                                            {evt.location || "No location provided"}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-semibold text-charcoal">{evt.profiles?.full_name || 'Unknown User'}</div>
                                        <div className="text-xs text-taupe mt-0.5">{evt.profiles?.email || 'No email'}</div>
                                    </td>
                                    <td className="px-8 py-6 space-y-2.5">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border",
                                            evt.status === 'confirmed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                evt.status === 'planning' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                    "bg-stone-100 text-stone-700 border-stone-200"
                                        )}>
                                            {evt.status}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-taupe">
                                            {evt.is_public ? (
                                                <><Globe className="w-3.5 h-3.5 text-emerald-600" /> Public</>
                                            ) : (
                                                <><Lock className="w-3.5 h-3.5 text-stone-400" /> Private</>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            href={evt.is_public && evt.public_slug ? `/e/${evt.public_slug}` : `/dashboard/events/${evt.id}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full text-xs font-bold tracking-wide uppercase text-charcoal shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgb(0,0,0,0.05)] hover:border-gold-leaf-300 hover:text-gold-leaf-600 transition-all duration-300"
                                        >
                                            Visit Event <ExternalLink className="w-3.5 h-3.5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
