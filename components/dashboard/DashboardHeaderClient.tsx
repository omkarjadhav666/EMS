"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateEventModal } from "@/components/events/CreateEventModal";

export function DashboardHeaderClient() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-serif text-charcoal">Overview</h1>
                <p className="text-taupe mt-1">Here's what's happening with your events.</p>
            </div>
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary flex items-center gap-2"
            >
                <Plus className="w-4 h-4" /> New Event
            </button>

            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
