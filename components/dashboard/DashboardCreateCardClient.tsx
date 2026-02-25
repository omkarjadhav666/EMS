"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateEventModal } from "@/components/events/CreateEventModal";

export function DashboardCreateCardClient() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="border border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center text-stone-400 p-8 hover:bg-alabaster transition-colors cursor-pointer group h-full min-h-[200px] w-full"
            >
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-3 group-hover:bg-white group-hover:shadow-md transition-all">
                    <Plus className="w-6 h-6" />
                </div>
                <p className="font-serif text-lg">Create New Event</p>
            </button>

            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </>
    );
}
