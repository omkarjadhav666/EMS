"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check } from "lucide-react";

interface RSVPFormProps {
    eventId: string;
}

export function RSVPForm({ eventId }: RSVPFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        plus_one: false,
        dietary: ""
    });
    const supabase = createClient();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        const { data, error } = await supabase.rpc('submit_rsvp', {
            p_event_id: eventId,
            p_name: formData.name,
            p_email: formData.email,
            p_plus_one: formData.plus_one,
            p_dietary: formData.dietary
        });

        if (error) {
            console.error(error);
            alert("Error submitting RSVP: " + error.message);
        } else if (data && !data.success) {
            alert("Error: " + data.error);
        } else {
            setIsSuccess(true);
        }
        setIsLoading(false);
    }

    if (isSuccess) {
        return (
            <div className="text-center py-8 animate-fade-in-up">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-serif text-charcoal mb-2">You're Confirmed!</h3>
                <p className="text-taupe">Thank you for RSVPing. We can't wait to see you there!</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-taupe uppercase block mb-1">Full Name</label>
                <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Aditi Sharma"
                    className="bg-white"
                />
            </div>

            <div>
                <label className="text-xs font-bold text-taupe uppercase block mb-1">Email Address</label>
                <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="aditi@example.com"
                    className="bg-white"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="plus_one"
                    checked={formData.plus_one}
                    onChange={(e) => setFormData({ ...formData, plus_one: e.target.checked })}
                    className="rounded border-stone-300 text-gold-leaf-500 focus:ring-gold-leaf-500"
                />
                <label htmlFor="plus_one" className="text-sm text-charcoal">I'm bringing a plus one</label>
            </div>

            <div>
                <label className="text-xs font-bold text-taupe uppercase block mb-1">Dietary Restrictions</label>
                <Textarea
                    value={formData.dietary}
                    onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                    placeholder="Any allergies or preferences?"
                    className="bg-white h-24"
                />
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold-leaf-500 hover:bg-gold-leaf-600 text-white"
            >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirm RSVP
            </Button>
        </form>
    );
}
