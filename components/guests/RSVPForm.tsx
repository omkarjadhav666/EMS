"use client";

import { useActionState, useEffect, useState } from "react";
import { submitRSVP } from "@/lib/actions/guest";
import { Loader2, Check, User, Mail, Phone, MessageSquare, Utensils, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const initialState = {
    errors: {},
    success: false
};

interface RSVPFormProps {
    eventId: string;
}

export function RSVPForm({ eventId }: RSVPFormProps) {
    const [state, formAction, isPending] = useActionState(submitRSVP, initialState);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (state.success) {
            setSuccess(true);
        }
    }, [state.success]);

    if (success) {
        return (
            <div className="text-center py-12 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-sm">
                    <Check className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-serif text-charcoal mb-4">Thank You!</h3>
                <p className="text-taupe mb-8 max-w-md mx-auto">
                    Your RSVP has been received. We're so excited to celebrate with you!
                </p>
                <button
                    onClick={() => setSuccess(false)} // Allow resetting for demo purposes or multiple submissions if needed
                    className="text-sm text-stone-400 hover:text-stone-600 underline"
                >
                    Submit another response
                </button>
            </div>
        );
    }

    return (
        <form action={formAction} className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            <input type="hidden" name="eventId" value={eventId} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-stone-600 flex items-center gap-2">
                        <User className="w-4 h-4 text-gold-leaf-500" /> Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className={cn(
                            "w-full px-4 py-3 rounded-lg bg-white/50 border backdrop-blur-sm focus:ring-2 focus:ring-gold-leaf-200 transition-all outline-none",
                            state.errors?.name ? "border-red-300 bg-red-50/50" : "border-stone-200 focus:border-gold-leaf-300"
                        )}
                        placeholder="Jane Doe"
                    />
                    {state.errors?.name && <p className="text-xs text-red-500">{state.errors.name[0]}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-stone-600 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gold-leaf-500" /> Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className={cn(
                            "w-full px-4 py-3 rounded-lg bg-white/50 border backdrop-blur-sm focus:ring-2 focus:ring-gold-leaf-200 transition-all outline-none",
                            state.errors?.email ? "border-red-300 bg-red-50/50" : "border-stone-200 focus:border-gold-leaf-300"
                        )}
                        placeholder="jane@example.com"
                    />
                    {state.errors?.email && <p className="text-xs text-red-500">{state.errors.email[0]}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-stone-600 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gold-leaf-500" /> Phone Number <span className="text-stone-400 text-xs">(Optional)</span>
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="w-full px-4 py-3 rounded-lg bg-white/50 border border-stone-200 backdrop-blur-sm focus:border-gold-leaf-300 focus:ring-2 focus:ring-gold-leaf-200 transition-all outline-none"
                        placeholder="+1 (555) 000-0000"
                    />
                </div>

                {/* Attendance Status */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-600 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-gold-leaf-500" /> Will you attend? <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="cursor-pointer relative">
                            <input type="radio" name="status" value="confirmed" className="peer sr-only" required />
                            <div className="p-3 text-center rounded-lg border border-stone-200 bg-white/50 hover:bg-stone-50 peer-checked:bg-green-50 peer-checked:border-green-200 peer-checked:text-green-700 transition-all">
                                Joyfully Accept
                            </div>
                        </label>
                        <label className="cursor-pointer relative">
                            <input type="radio" name="status" value="declined" className="peer sr-only" />
                            <div className="p-3 text-center rounded-lg border border-stone-200 bg-white/50 hover:bg-stone-50 peer-checked:bg-stone-100 peer-checked:border-stone-300 peer-checked:text-stone-500 transition-all">
                                Regretfully Decline
                            </div>
                        </label>
                    </div>
                    {state.errors?.status && <p className="text-xs text-red-500">{state.errors.status[0]}</p>}
                </div>
            </div>

            {/* Plus One Toggle */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-stone-50/50 border border-stone-100">
                <input type="checkbox" id="plusOne" name="plusOne" value="true" className="w-4 h-4 text-gold-leaf-600 rounded border-stone-300 focus:ring-gold-leaf-500" />
                <label htmlFor="plusOne" className="text-sm text-stone-600 select-none cursor-pointer">
                    I am bringing a plus one
                </label>
            </div>

            {/* Dietary Restrictions */}
            <div className="space-y-2">
                <label htmlFor="dietaryRestrictions" className="text-sm font-medium text-stone-600 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-gold-leaf-500" /> Dietary Restrictions
                </label>
                <input
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-stone-200 backdrop-blur-sm focus:border-gold-leaf-300 focus:ring-2 focus:ring-gold-leaf-200 transition-all outline-none"
                    placeholder="e.g. Vegetarian, Gluten-free, Allergies..."
                />
            </div>

            {/* Message */}
            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-stone-600 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gold-leaf-500" /> Message to the Host
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-stone-200 backdrop-blur-sm focus:border-gold-leaf-300 focus:ring-2 focus:ring-gold-leaf-200 transition-all outline-none resize-none"
                    placeholder="Share your excitement or best wishes..."
                />
            </div>

            <div className="pt-4">
                {state.errors?._form && (
                    <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                        {state.errors._form[0]}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-charcoal hover:bg-black text-white font-serif py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                        </>
                    ) : (
                        "Confirm RSVP"
                    )}
                </button>
            </div>
        </form>
    );
}
