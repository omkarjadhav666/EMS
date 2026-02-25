"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Check, X, MessageSquare, Calendar, MapPin, User } from "lucide-react";

interface BookingCardProps {
    booking: any;
}

export function BookingCard({ booking }: BookingCardProps) {
    const [loading, setLoading] = useState(false);
    const [showActions, setShowActions] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const handleAccept = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'confirmed' })
                .eq('id', booking.id);

            if (error) throw error;

            // Notify Client
            if (booking.user_id) {
                await supabase.from('notifications').insert({
                    user_id: booking.user_id,
                    title: "Booking Confirmed!",
                    message: `${booking.vendors?.name || 'A vendor'} has confirmed your booking for ${booking.events?.name || 'an event'}.`,
                    type: "booking_update",
                    link: `/dashboard/events/${booking.event_id}`
                });
            }

            setShowActions(false);
            router.refresh();
        } catch (err) {
            console.error(err);
            alert('Failed to accept booking');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!confirm('Are you sure you want to reject this booking request?')) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'rejected' })
                .eq('id', booking.id);

            if (error) throw error;

            // Notify Client
            if (booking.user_id) {
                await supabase.from('notifications').insert({
                    user_id: booking.user_id,
                    title: "Booking Declined",
                    message: `${booking.vendors?.name || 'A vendor'} is unavailable for your event ${booking.events?.name || 'an event'}.`,
                    type: "booking_update",
                    link: `/dashboard/events/${booking.event_id}`
                });
            }

            setShowActions(false);
            router.refresh();
        } catch (err) {
            console.error(err);
            alert('Failed to reject booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            {/* Status Badge */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-charcoal mb-1">
                        {booking.events?.name || 'Untitled Event'}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {booking.status}
                    </span>
                </div>
                <p className="text-sm text-taupe">
                    Requested {new Date(booking.created_at).toLocaleDateString()}
                </p>
            </div>

            {/* Event Details */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-charcoal">
                    <Calendar className="w-4 h-4 text-taupe" />
                    <span>
                        {booking.events?.event_type} • {new Date(booking.events?.event_date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>

                {booking.events?.location && (
                    <div className="flex items-center gap-2 text-sm text-charcoal">
                        <MapPin className="w-4 h-4 text-taupe" />
                        <span>{booking.events.location}</span>
                    </div>
                )}

                <div className="flex items-center gap-2 text-sm text-charcoal">
                    <User className="w-4 h-4 text-taupe" />
                    <span>
                        {booking.profiles?.full_name || booking.profiles?.email}
                    </span>
                </div>
            </div>

            {/* Notes */}
            {booking.notes && (
                <div className="bg-alabaster rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-charcoal mb-1">Client Notes:</p>
                    <p className="text-sm text-taupe italic">"{booking.notes}"</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                {booking.status === 'pending' && showActions && (
                    <>
                        <button
                            onClick={handleAccept}
                            disabled={loading}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Accept
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={loading}
                            className="btn-secondary flex-1 flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Decline
                        </button>
                    </>
                )}

                <button
                    onClick={() => router.push(`/vendor/messages?booking=${booking.id}`)}
                    className="btn-secondary flex items-center justify-center gap-2"
                >
                    <MessageSquare className="w-4 h-4" />
                    Message Client
                </button>
            </div>
        </div>
    );
}
