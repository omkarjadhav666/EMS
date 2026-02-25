'use client';

import { Button } from "@/components/ui/button";
import { CalendarCheck } from "lucide-react";
import { format } from "date-fns";

interface EventData {
    title: string;
    description?: string;
    location?: string;
    start_date: string; // ISO string
    end_date?: string; // ISO string
}

export function CalendarExport({ event }: { event: EventData }) {

    const downloadICS = () => {
        const startDate = new Date(event.start_date);
        const endDate = event.end_date ? new Date(event.end_date) : new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour

        const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, "");

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Glamoora//EN
BEGIN:VEVENT
UID:${new Date().getTime()}@glamoora.app
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || "Planned with Glamoora"}
LOCATION:${event.location || ""}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button variant="outline" onClick={downloadICS} className="gap-2">
            <CalendarCheck className="w-4 h-4" />
            Add to Calendar
        </Button>
    );
}
