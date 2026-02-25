import { TaskBoard } from "@/components/tasks/TaskBoard";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function TasksPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: tasks } = await supabase
        .from('event_tasks')
        .select('*')
        .eq('event_id', id)
        .order('created_at', { ascending: false });

    return (
        <div>
            <Link
                href={`/dashboard/events/${id}`}
                className="inline-flex items-center gap-2 text-stone-500 hover:text-charcoal mb-6 transition-colors font-medium text-sm"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Event Dashboard
            </Link>
            <div className="mb-6">
                <h1 className="text-3xl font-serif text-charcoal">Tasks</h1>
                <p className="text-taupe mt-1">Manage your event checklist</p>
            </div>
            <TaskBoard initialTasks={tasks || []} eventId={id} />
        </div>
    );
}
