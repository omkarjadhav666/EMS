"use client";

import { useState, useEffect } from "react";
import { Guest, GuestStatus } from "./types";
import { AddGuestForm } from "./AddGuestForm";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2, Mail, Utensils, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface GuestListProps {
    initialGuests: Guest[];
    eventId: string;
}

export function GuestList({ initialGuests, eventId }: GuestListProps) {
    const [guests, setGuests] = useState<Guest[]>(initialGuests);
    const supabase = createClient();
    const router = useRouter();

    // Sync state with props
    useEffect(() => {
        setGuests(initialGuests);
    }, [initialGuests]);

    const handleAddGuest = (newGuest: Guest) => {
        setGuests([newGuest, ...guests]);
    };

    const updateStatus = async (id: string, newStatus: GuestStatus) => {
        // Optimistic update
        setGuests(prev => prev.map(g => g.id === id ? { ...g, status: newStatus } : g));

        const { error } = await supabase.from('guests').update({ status: newStatus }).eq('id', id);
        if (error) {
            console.error("Update failed", JSON.stringify(error, null, 2));
            router.refresh();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this guest?")) return;
        setGuests(prev => prev.filter(g => g.id !== id));

        const { error } = await supabase.from('guests').delete().eq('id', id);
        if (error) router.refresh();
    };

    // Stats Calculation
    const stats = {
        invited: guests.length,
        confirmed: guests.filter(g => g.status === 'confirmed').length,
        declined: guests.filter(g => g.status === 'declined').length,
        pending: guests.filter(g => g.status === 'pending').length,
        totalAttendees: guests.filter(g => g.status === 'confirmed').reduce((acc, curr) => acc + 1 + (curr.plus_ones || 0), 0)
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-500">
                            <Users className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-taupe uppercase tracking-wider">Invited</p>
                        <p className="text-3xl font-serif text-charcoal mt-1">{stats.invited}</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-green-600/80 uppercase tracking-wider">Confirmed</p>
                        <p className="text-3xl font-serif text-green-700 mt-1">{stats.confirmed}</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-3 text-yellow-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-yellow-600/80 uppercase tracking-wider">Pending</p>
                        <p className="text-3xl font-serif text-yellow-700 mt-1">{stats.pending}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gold-leaf-50/50 backdrop-blur-md border border-gold-leaf-100 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Users className="w-16 h-16 text-gold-leaf-900" />
                        </div>
                        <p className="text-xs font-bold text-gold-leaf-600 uppercase tracking-wider relative z-10">Total Attendees</p>
                        <p className="text-3xl font-serif text-gold-leaf-700 mt-1 relative z-10">{stats.totalAttendees}</p>
                        <p className="text-[10px] text-gold-leaf-500 mt-1 relative z-10 font-medium">Including Plus Ones</p>
                    </CardContent>
                </Card>
            </div>

            <AddGuestForm eventId={eventId} onAdd={handleAddGuest} />

            <Card className="bg-white/70 backdrop-blur-xl border-white/20 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[800px] md:min-w-full">
                        <thead className="bg-stone-50/80 text-stone-500 font-serif uppercase text-xs tracking-wider border-b border-stone-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Guest Details</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Party Size</th>
                                <th className="px-6 py-4 font-semibold">Preferences</th>
                                <th className="px-6 py-4 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100/50">
                            {guests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16">
                                        <div className="flex flex-col items-center opacity-60">
                                            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                                                <Users className="w-8 h-8 text-stone-300" />
                                            </div>
                                            <p className="font-serif text-xl text-charcoal mb-2">No guests yet</p>
                                            <p className="text-sm text-taupe">Add your first guest to get started.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                guests.map((guest) => (
                                    <tr key={guest.id} className="hover:bg-amber-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-stone-500 font-serif text-lg font-bold shadow-sm border border-white">
                                                    {guest.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-charcoal text-base">{guest.full_name}</div>
                                                    {guest.email && (
                                                        <div className="flex items-center gap-1.5 text-stone-400 text-xs mt-0.5">
                                                            <Mail className="w-3 h-3" /> {guest.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={guest.status}
                                                onChange={(e) => updateStatus(guest.id, e.target.value as GuestStatus)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full text-xs font-bold border-none focus:ring-2 cursor-pointer transition-all shadow-sm appearance-none pr-8 bg-no-repeat bg-[right_0.5rem_center]",
                                                    guest.status === 'confirmed' ? "bg-green-100 text-green-700 ring-green-200" :
                                                        guest.status === 'declined' ? "bg-red-50 text-red-600 ring-red-100" :
                                                            "bg-amber-50 text-amber-600 ring-amber-200"
                                                )}
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="declined">Declined</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-charcoal">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded-md text-xs font-bold">
                                                    +{guest.plus_ones || 0}
                                                </span>
                                                <span className="text-xs text-stone-400">Total: {1 + (guest.plus_ones || 0)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {guest.dietary_restrictions ? (
                                                <div className="flex items-start gap-1.5 text-orange-600 bg-orange-50 px-3 py-1.5 rounded-md inline-block max-w-[200px]" title={guest.dietary_restrictions}>
                                                    <Utensils className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                                    <span className="text-xs font-medium truncate block">{guest.dietary_restrictions}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-stone-300 italic">None</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(guest.id)}
                                                className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                                title="Delete Guest"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
