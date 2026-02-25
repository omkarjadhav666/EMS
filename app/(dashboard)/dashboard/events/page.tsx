import { createClient } from "@/lib/supabase/server";
import { EventsView } from "@/components/events/EventsView";
import { redirect } from "next/navigation";

export default async function EventsPage() {
    const supabase = await createClient();
    let user = null;
    try {
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
        if (error) throw error;
        user = supabaseUser;
    } catch (error) {
        console.error('EventsPage Supabase user fetch error:', error);
        redirect("/login?error=connection");
    }

    if (!user) {
        redirect("/login");
    }

    const { data: events, error } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

    if (error) {
        console.error("Error fetching events:", error);
    }

    return <EventsView initialEvents={events || []} />;
}
