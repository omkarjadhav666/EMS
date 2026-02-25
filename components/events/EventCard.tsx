import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Event } from "./types";

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps) {
    const isPast = new Date(event.date) < new Date();

    return (
        <Link href={`/dashboard/events/${event.id}`}>
            <div className="bg-white p-6 rounded-xl border border-stone-200 hover:border-gold-leaf-500 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-serif text-xl font-bold text-charcoal group-hover:text-gold-leaf-600 transition-colors">
                            {event.title}
                        </h3>
                        <p className={cn("text-xs font-bold uppercase tracking-wider mt-1", isPast ? "text-stone-400" : "text-gold-leaf-500")}>
                            {isPast ? "Past Event" : "Upcoming"}
                        </p>
                    </div>
                    <div className={cn("w-3 h-3 rounded-full", isPast ? "bg-stone-300" : "bg-green-500")} />
                </div>

                <div className="space-y-2 text-sm text-taupe">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gold-leaf-400" />
                        <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
                    </div>
                    {event.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gold-leaf-400" />
                            <span>{event.location}</span>
                        </div>
                    )}
                    {event.guest_count && (
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gold-leaf-400" />
                            <span>{event.guest_count} Guests</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
