"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { generateEventTasks } from "@/lib/logic/generateEventTasks";

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        date: "",
        location: "",
        eventType: "Wedding", // Default
        guestCount: "",
        budget: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not found");

            // TODO: Validate inputs

            // Ensure profile exists to satisfy FK constraint
            const { data: profile } = await supabase
                .from("profiles")
                .select("id")
                .eq("id", user.id)
                .single();

            if (!profile) {
                // Determine full name from metadata or form data
                const fullName = user.user_metadata?.full_name || formData.name.split("'")[0] || "User";

                const { error: profileError } = await supabase
                    .from("profiles")
                    .insert({
                        id: user.id,
                        email: user.email,
                        full_name: fullName,
                        avatar_url: user.user_metadata?.avatar_url,
                        role: 'client'
                    });

                if (profileError) {
                    console.error("Error creating profile:", profileError);
                    // Continue anyway, maybe the trigger handled it in parallel or it's a permission issue
                    // that we can't fix here. But attempting it is worth it.
                }
            }

            const { data, error: insertError } = await supabase
                .from("events")
                .insert({
                    user_id: user.id,
                    title: formData.name,
                    date: new Date(formData.date).toISOString(),
                    location: formData.location || null,
                    event_type: formData.eventType, // Now supported
                    guest_count: formData.guestCount ? parseInt(formData.guestCount) : 0,
                    budget_total: formData.budget ? parseFloat(formData.budget) : 0,
                    status: 'planning'
                })
                .select()
                .single();

            if (insertError) throw insertError;

            // Generate Smart Default Tasks
            if (data) {
                // Import dynamically or ensure it is imported at top
                await generateEventTasks(data.id, formData.eventType as any);
            }

            router.refresh();
            onClose();
            // Reset form
            setFormData({
                name: "",
                date: "",
                location: "",
                eventType: "Wedding",
                guestCount: "",
                budget: ""
            });
            // Optional: Redirect to new event dashboard
            if (data) {
                router.push(`/dashboard/events/${data.id}`);
            }

        } catch (err: any) {
            console.error("Error creating event:", JSON.stringify(err, null, 2));
            setError(err.message || "Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                        Start planning your next big event.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Event Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g. Sarah & Mike's Wedding"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            placeholder="e.g. Mumbai, India"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="guestCount">Guest Count</Label>
                            <Input
                                id="guestCount"
                                name="guestCount"
                                type="number"
                                placeholder="100"
                                value={formData.guestCount}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="budget">Budget (₹)</Label>
                            <Input
                                id="budget"
                                name="budget"
                                type="number"
                                placeholder="500000"
                                value={formData.budget}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Create Event
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
