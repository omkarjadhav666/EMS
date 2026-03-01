'use client';

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export function RSVPModal({ eventId }: { eventId: string }) {
    const supabase = createClient();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    // We could add status (Going/Maybe/No) but simpler for MVP

    const handleRSVP = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.from('guests').insert({
                event_id: eventId,
                name: name,
                email: email,
                status: 'confirmed', // Auto-confirm for this simple flow
                user_id: null // Anonymous guest
            });

            if (error) throw error;

            setIsOpen(false);
            alert("RSVP Sent! We look forward to seeing you.");
        } catch (error) {
            console.error(error);
            alert("Error sending RSVP.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="bg-gold hover:bg-gold-leaf-600 text-white shadow-lg text-lg px-8">
                    RSVP Now
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl">Confirm Attendance</DialogTitle>
                    <DialogDescription>
                        Enter your details to RSVP for this event.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleRSVP} disabled={loading || !name} className="bg-charcoal text-white w-full">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send RSVP
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
