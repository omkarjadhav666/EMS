"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EventCard } from "./EventCard";
import { CreateEventModal } from "./CreateEventModal";
import { Event } from "./types";



interface EventsViewProps {
    initialEvents: Event[];
}

export function EventsView({ initialEvents }: EventsViewProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    // In a real app with real-time updates, we might want to use state for events too, 
    // but for now relying on router.refresh() from the modal is fine.

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-charcoal">My Events</h1>
                    <p className="text-taupe font-sans mt-2">View and manage your upcoming events.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    New Event
                </button>
            </div>

            {initialEvents.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-stone-200 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gold-leaf-100 text-gold-leaf-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-charcoal mb-2">No events yet</h3>
                    <p className="text-taupe mb-6 max-w-md mx-auto">
                        Start planning your first event by clicking the button above. We'll help you manage guests, budget, and vendors.
                    </p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn-secondary"
                    >
                        Create Your First Event
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initialEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}

            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
