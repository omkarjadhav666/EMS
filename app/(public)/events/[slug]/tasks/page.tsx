import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default async function PublicEventTasksPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch Event
    const { data: event } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single();

    if (!event) {
        return notFound();
    }

    // Fetch Public Tasks
    const { data: tasks } = await supabase
        .from('event_tasks')
        .select('*')
        .eq('event_id', event.id)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen bg-stone-50 py-12 px-4">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <Link
                        href={`/events/${slug}`}
                        className="inline-flex items-center gap-2 text-taupe hover:text-charcoal transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Event Dashboard
                    </Link>
                    <h1 className="text-3xl font-serif text-charcoal mb-2">Volunteer Opportunities</h1>
                    <p className="text-taupe">
                        Help make <strong>{event.title}</strong> special! Below are tasks that need assistance.
                    </p>
                </div>

                {/* Task List */}
                <div className="space-y-4">
                    {!tasks || tasks.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl text-center border border-stone-100 shadow-sm">
                            <CheckCircle2 className="w-12 h-12 text-stone-200 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-charcoal">All caught up!</h3>
                            <p className="text-taupe">No help needed at the moment.</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div key={task.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {task.category && (
                                                <span className="text-[10px] uppercase font-bold tracking-wider text-gold-leaf-600 bg-gold-leaf-50 px-2 py-0.5 rounded-full">
                                                    {task.category}
                                                </span>
                                            )}
                                            {task.due_date && (
                                                <span className="text-xs text-stone-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Due {format(new Date(task.due_date), 'MMM d')}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-charcoal">{task.title}</h3>
                                        <p className="text-taupe mt-2 text-sm">
                                            {task.description || "No specific instructions provided."}
                                        </p>
                                    </div>
                                    <div className="shrink-0">
                                        {/* Placeholder for future interactivity */}
                                        <button className="btn-secondary text-xs px-3 py-1.5" disabled>
                                            Contact Organizer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
