"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Loader2, User, Mail, Utensils, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Guest } from "./types";
import { cn } from "@/lib/utils";

interface AddGuestFormProps {
    eventId: string;
    onAdd: (guest: Guest) => void;
}

export function AddGuestForm({ eventId, onAdd }: AddGuestFormProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [plusOnes, setPlusOnes] = useState(0);
    const [dietary, setDietary] = useState("");

    const supabase = createClient();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!fullName.trim()) return;

        setIsLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Optimistic object
            const tempId = Math.random().toString();
            const newGuest: Guest = {
                id: tempId,
                event_id: eventId,
                user_id: user.id,
                full_name: fullName,
                email: email || undefined,
                status: 'pending',
                plus_ones: plusOnes,
                dietary_restrictions: dietary || undefined,
                created_at: new Date().toISOString()
            };

            // UI Update
            onAdd(newGuest);

            // Reset Form
            setFullName("");
            setEmail("");
            setPlusOnes(0);
            setDietary("");
            setIsExpanded(false);

            // API Call
            const { data, error } = await supabase.from('guests').insert({
                event_id: eventId,
                user_id: user.id,
                full_name: fullName,
                email: email || null,
                status: 'pending',
                plus_ones: plusOnes,
                dietary_restrictions: dietary || null
            }).select().single();

            if (error) {
                console.error("Error adding guest:", error);
                // In a real app, we'd handle revert here or show error toast
            } else {
                router.refresh(); // Sync real ID
            }
        }

        setIsLoading(false);
    }

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="w-full py-4 border-2 border-dashed border-stone-300 rounded-xl flex items-center justify-center gap-2 text-stone-400 hover:border-gold-leaf-300 hover:bg-gold-leaf-50/10 hover:text-gold-leaf-600 transition-all duration-300 group"
            >
                <div className="bg-stone-100 group-hover:bg-gold-leaf-100 p-2 rounded-full transition-colors">
                    <Plus className="w-5 h-5" />
                </div>
                <span className="font-medium">Add New Guest</span>
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-stone-50 border border-stone-100 p-6 rounded-xl shadow-sm animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
                <h4 className="font-serif text-lg text-charcoal flex items-center gap-2">
                    <div className="p-1.5 bg-gold-leaf-100 rounded-md text-gold-leaf-600">
                        <Plus className="w-4 h-4" />
                    </div>
                    New Guest Details
                </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-leaf-200 focus:border-gold-leaf-300 transition-all placeholder:text-stone-300"
                        placeholder="e.g. Jane Doe"
                        autoFocus
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-leaf-200 focus:border-gold-leaf-300 transition-all placeholder:text-stone-300"
                        placeholder="jane@example.com"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> Plus Ones
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={plusOnes}
                        onChange={(e) => setPlusOnes(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-leaf-200 focus:border-gold-leaf-300 transition-all placeholder:text-stone-300"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5" /> Dietary Restrictions
                    </label>
                    <input
                        type="text"
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-leaf-200 focus:border-gold-leaf-300 transition-all placeholder:text-stone-300"
                        placeholder="e.g. Vegan, Nut Allergy"
                    />
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-stone-200/50">
                <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-stone-500 hover:text-charcoal hover:bg-stone-100 rounded-lg transition-colors"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-charcoal hover:bg-black rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Save Guest
                </button>
            </div>
        </form>
    );
}
