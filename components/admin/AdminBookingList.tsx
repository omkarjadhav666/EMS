'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Check, X, Loader2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

// Simple Table if UI component missing
// checking if I made Table component? No. I'll make a simple one or use standard HTML.

interface Booking {
    id: string;
    created_at: string;
    booking_date: string;
    status: 'pending' | 'confirmed' | 'rejected';
    notes: string;
    events: {
        title: string;
    };
    vendors: {
        name: string;
        category: string;
    };
    user_id: string; // Could fetch user email if needed
}

export function AdminBookingList() {
    const supabase = createClient();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                events (title),
                vendors (name, category)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching bookings:", error);
        } else {
            setBookings(data as any[]);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, newStatus: 'confirmed' | 'rejected') => {
        // Optimistic update
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

        const { error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error("Error updating status:", error);
            fetchBookings(); // Revert on error
        }
    };

    if (loading) {
        return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-taupe" /></div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-taupe uppercase bg-stone-50 border-b border-stone-100">
                    <tr>
                        <th className="px-6 py-3">Vendor</th>
                        <th className="px-6 py-3">Event</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Notes</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking, index) => (
                        <motion.tr
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={booking.id}
                            className="bg-white border-b border-stone-50 hover:bg-stone-50/50 transition-colors"
                        >
                            <td className="px-6 py-4 font-medium text-charcoal">
                                <div>{booking.vendors?.name || 'Unknown'}</div>
                                <div className="text-xs text-taupe">{booking.vendors?.category}</div>
                            </td>
                            <td className="px-6 py-4 text-stone-600">
                                {booking.events?.title || 'Unknown Event'}
                            </td>
                            <td className="px-6 py-4 text-stone-600">
                                {format(new Date(booking.booking_date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 text-stone-500 max-w-xs truncate" title={booking.notes}>
                                {booking.notes || '-'}
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant={
                                    booking.status === 'confirmed' ? 'default' :
                                        booking.status === 'rejected' ? 'destructive' : 'secondary'
                                } className={
                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                }>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                        onClick={() => updateStatus(booking.id, 'confirmed')}
                                        disabled={booking.status === 'confirmed'}
                                        title="Approve"
                                    >
                                        <Check className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                        onClick={() => updateStatus(booking.id, 'rejected')}
                                        disabled={booking.status === 'rejected'}
                                        title="Reject"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                    {bookings.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-taupe">
                                No booking requests found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
