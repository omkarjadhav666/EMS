import { createClient } from "@/lib/supabase/server";
import { EventDirectory } from "@/components/events/EventDirectory";

export const metadata = {
    title: "Public Events | Glamoora",
    description: "Discover and participate in exclusive public events powered by Glamoora.",
};

export default async function PublicEventsPage() {
    const supabase = await createClient();

    const { data: events, error } = await supabase
        .from("events")
        .select("*")
        // .eq("is_public", true) // The is_public column doesn't exist yet, fetching all for now
        .order("date", { ascending: true }); // Show upcoming first

    if (error) {
        console.error("Error fetching events:", error);
    }

    return (
        <div className="bg-[var(--theme-bg-secondary)] min-h-screen py-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 relative">
                    {/* Background Decor */}
                    <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gold-leaf-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <h1 className="text-4xl md:text-5xl font-serif text-[var(--theme-text-primary)] mb-4 relative z-10">
                        Discover Public Events
                    </h1>
                    <p className="text-[var(--theme-text-muted)] max-w-2xl mx-auto text-lg mb-12 relative z-10">
                        Explore and participate in our exclusive public gatherings, trade shows, and highly anticipated community workshops.
                    </p>
                </div>

                {/* Render the new interactive filtered directory */}
                <EventDirectory initialEvents={events || []} />

            </div>
        </div>
    );
}
