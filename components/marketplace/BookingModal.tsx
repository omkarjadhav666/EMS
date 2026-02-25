'use client';

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Vendor } from "./VendorCard";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BookingModalProps {
    vendor: Vendor | null;
    isOpen: boolean;
    onClose: () => void;
}

export function BookingModal({ vendor, isOpen, onClose }: BookingModalProps) {
    const supabase = createClient();
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [date, setDate] = useState<Date>();
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchUserEvents();
        }
    }, [isOpen]);

    const fetchUserEvents = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('events')
                .select('id, title, date')
                .eq('user_id', user.id)
                .neq('status', 'cancelled');
            if (data) setEvents(data);
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!vendor || !selectedEventId || !date) return;

        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error("You must be logged in to book.");
                return;
            }

            const { error } = await supabase
                .from('bookings')
                .insert({
                    user_id: user.id,
                    event_id: selectedEventId,
                    vendor_id: vendor.id,
                    booking_date: format(date, 'yyyy-MM-dd'),
                    notes: notes,
                    status: 'pending'
                });

            if (error) throw error;

            // Fetch vendor owner
            const { data: vendorData } = await supabase
                .from('vendors')
                .select('owner_id')
                .eq('id', vendor.id)
                .single();

            // Insert Notification for vendor
            if (vendorData?.owner_id) {
                await supabase.from('notifications').insert({
                    user_id: vendorData.owner_id,
                    title: "New Booking Request",
                    message: `You have a new booking request for ${format(date, 'MMM d, yyyy')}`,
                    type: "booking_request",
                    link: "/vendor/bookings"
                });
            }

            toast.success("Request Sent!", {
                description: `Your request to ${vendor.name} has been sent successfully.`
            });
            onClose();
            // Reset form
            setDate(undefined);
            setNotes("");
            setSelectedEventId("");

        } catch (error: any) {
            console.error("Booking error:", error);
            toast.error("Booking Failed", {
                description: error.message || "Something went wrong. Please try again."
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (!vendor) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white/90 backdrop-blur-2xl border-stone-200/50 shadow-2xl rounded-3xl">

                {/* Decorative Header Background */}
                <div className="h-24 bg-gradient-to-r from-stone-100 to-stone-50 w-full absolute top-0 left-0 -z-10 border-b border-stone-200/50" />

                <DialogHeader className="px-8 pt-8 pb-4">
                    <DialogTitle className="font-serif text-3xl text-charcoal tracking-tight">Request Quote</DialogTitle>
                    <DialogDescription className="text-taupe text-base mt-2">
                        Send a booking inquiry to <span className="font-semibold text-charcoal">{vendor.name}</span>. They will review your event details and respond shortly.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 px-8 py-2">
                    <div className="space-y-3">
                        <Label className="uppercase tracking-widest text-[11px] font-bold text-stone-500">Select Event</Label>
                        <Select onValueChange={setSelectedEventId} value={selectedEventId}>
                            <SelectTrigger className="w-full bg-white h-12 rounded-xl border-stone-200 focus:ring-gold-leaf-500 shadow-sm">
                                <SelectValue placeholder="Which event is this for?" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-stone-100 shadow-xl font-medium">
                                {events.length === 0 ? (
                                    <SelectItem value="no-events" disabled className="text-stone-400 italic">
                                        No active events found
                                    </SelectItem>
                                ) : (
                                    events.map(event => (
                                        <SelectItem key={event.id} value={event.id} className="cursor-pointer focus:bg-stone-50">
                                            {event.title} <span className="text-stone-400 font-normal ml-1">{event.date ? `(${format(new Date(event.date), 'MMM d, yyyy')})` : ''}</span>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="uppercase tracking-widest text-[11px] font-bold text-stone-500">Requested Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-medium h-12 bg-white rounded-xl border-stone-200 hover:bg-stone-50 hover:text-charcoal shadow-sm",
                                        !date && "text-stone-400"
                                    )}
                                >
                                    <CalendarIcon className="mr-3 h-4 w-4 text-stone-400" />
                                    {date ? format(date, "MMMM d, yyyy") : <span>Pick a date from calendar</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-2xl border-stone-100 shadow-xl">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    className="p-3"
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-3">
                        <Label className="uppercase tracking-widest text-[11px] font-bold text-stone-500">Message / Notes</Label>
                        <Textarea
                            placeholder="Tell the vendor about your vision, guest count, and any specific requirements..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            className="resize-none bg-white rounded-xl border-stone-200 focus-visible:ring-gold-leaf-500 shadow-sm text-base p-4"
                        />
                    </div>
                </div>

                <DialogFooter className="px-8 py-6 bg-stone-50/50 border-t border-stone-100 mt-4 flex sm:justify-between items-center w-full">
                    <Button variant="ghost" onClick={onClose} disabled={submitting} className="text-stone-500 hover:text-charcoal hover:bg-stone-200/50 rounded-full px-6">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting || !selectedEventId || !date}
                        className="bg-charcoal hover:bg-gold-leaf-600 text-white rounded-full px-8 py-6 shadow-lg shadow-charcoal/20 transition-all duration-300 text-base"
                    >
                        {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        Send Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
