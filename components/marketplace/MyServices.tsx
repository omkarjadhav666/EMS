'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Calendar as CalendarIcon, MapPin, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function MyServices() {
    const supabase = createClient();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyServices();
    }, []);

    const fetchMyServices = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Join bookings with vendors and events
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    id, 
                    status, 
                    booking_date, 
                    notes, 
                    created_at,
                    vendors ( id, name, category, image_url, location, price_range ),
                    events ( id, title, date )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) {
                setBookings(data);
            }
            if (error) {
                console.error("Error fetching services:", error);
            }
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-taupe" />
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="text-center py-20 text-taupe bg-stone-50 rounded-xl border border-stone-100/50">
                <p>You haven't requested any quotes or booked any services yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {bookings.map((booking) => (
                <div key={booking.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 hover:border-gold-leaf-200 transition-all duration-500 flex flex-col h-full">
                    {/* Top image header for the "ticket" */}
                    <div className="relative h-28 w-full bg-stone-100">
                        {booking.vendors?.image_url && (
                            <Image
                                src={booking.vendors.image_url}
                                alt={booking.vendors.name}
                                fill
                                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                            />
                        )}
                        <div className="absolute inset-0 bg-charcoal/20" />
                        <div className="absolute top-4 right-4">
                            <Badge
                                variant="outline"
                                className={cn(
                                    "bg-white/90 backdrop-blur-md border-0 shadow-sm font-medium",
                                    booking.status === 'accepted' ? 'text-emerald-700' :
                                        (booking.status === 'rejected' ? 'text-rose-700' : 'text-amber-700')
                                )}
                            >
                                <span className={cn(
                                    "w-1.5 h-1.5 rounded-full mr-1.5",
                                    booking.status === 'accepted' ? 'bg-emerald-500' :
                                        (booking.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse')
                                )} />
                                {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                            </Badge>
                        </div>
                    </div>

                    {/* Ticket Body */}
                    <div className="p-6 flex flex-col flex-1 relative bg-white">
                        {/* Perforated edge effect */}
                        <div className="absolute top-0 left-4 right-4 border-t-2 border-dashed border-stone-200 -mt-0.5 z-10" />

                        <div className="flex justify-between items-start mb-6 pt-2">
                            <div>
                                <h3 className="font-serif text-2xl text-charcoal">{booking.vendors?.name}</h3>
                                <p className="text-sm font-medium text-gold-leaf-600 tracking-wide uppercase mt-1">{booking.vendors?.category}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-start">
                                <div className="p-2 bg-stone-50 rounded-lg mr-3">
                                    <CalendarIcon className="w-4 h-4 text-stone-400" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-0.5">Event</p>
                                    <p className="text-charcoal font-medium">{booking.events?.title}</p>
                                    <p className="text-taupe text-sm mt-0.5">
                                        {booking.events?.date ? format(new Date(booking.events.date), 'MMMM d, yyyy') : 'No date set'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {booking.notes && (
                            <div className="mt-2 bg-stone-50 p-4 rounded-xl text-sm text-taupe italic border border-stone-100">
                                "{booking.notes}"
                            </div>
                        )}

                        <div className="mt-auto pt-6 flex justify-between items-end">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-1">Requested On</p>
                                <p className="text-sm text-charcoal font-medium">{format(new Date(booking.created_at), 'MMM d, yyyy')}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-1">Est. Quote</p>
                                <p className="text-sm text-charcoal font-serif">{booking.vendors?.price_range}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
