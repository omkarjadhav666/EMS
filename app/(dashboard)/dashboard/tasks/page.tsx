import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GlobalTasksView } from "@/components/tasks/GlobalTasksView";

export default async function TasksPage() {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login");
    }

    // Fetch tasks globally for the user, joined with the event title
    const { data: tasks, error } = await supabase
        .from("event_tasks")
        .select(`
            *,
            events!event_tasks_event_id_fkey (title)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching global tasks:", error);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-charcoal">Global Checklist</h1>
                    <p className="text-taupe font-sans mt-2">Manage all your upcoming event tasks across every event.</p>
                </div>
            </div>
            <GlobalTasksView initialTasks={tasks || []} />
        </div>
    );
}
