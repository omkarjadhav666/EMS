import Link from "next/link";
import { Plus, Clock, IndianRupee, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeaderClient } from "@/components/dashboard/DashboardHeaderClient";
import { DashboardCreateCardClient } from "@/components/dashboard/DashboardCreateCardClient";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Stats
    const { count: activeEventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .neq('status', 'cancelled');

    // Fetch Events for list and budget calc
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

    // Ensure budget_total is treated as a number
    const totalBudget = events?.reduce((acc, curr) => acc + (Number(curr.budget_total) || 0), 0) || 0;

    const { count: pendingTasksCount } = await supabase
        .from('event_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Welcome */}
            <DashboardHeaderClient />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Events", value: activeEventsCount || 0, icon: Clock, color: "text-gold-leaf-600", bg: "bg-gold-leaf-500/10" },
                    { label: "Total Budget", value: `₹${totalBudget.toLocaleString('en-IN')}`, icon: IndianRupee, color: "text-sage", bg: "bg-sage/10" },
                    { label: "Tasks Pending", value: pendingTasksCount || 0, icon: CheckCircle2, color: "text-terra-cotta", bg: "bg-terra-cotta/10" }
                ].map((stat) => (
                    <div key={stat.label} className="card-luxury flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-taupe uppercase tracking-wider font-bold">{stat.label}</p>
                            <p className="text-2xl font-serif text-charcoal">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Your Events */}
            <div>
                <h2 className="text-xl font-serif text-charcoal mb-4">Your Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* New Event Card */}
                    <DashboardCreateCardClient />

                    {/* Event Cards */}
                    {events?.map((event) => (
                        <Link key={event.id} href={`/dashboard/events/${event.id}`} className="card-luxury group block relative overflow-hidden h-full min-h-[200px]">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <div className="w-24 h-24 rounded-full bg-gold-leaf-500 blur-2xl"></div>
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-sage/10 text-sage-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-sage/20">
                                            {event.status}
                                        </span>
                                        {event.date && (
                                            <span className="text-xs text-taupe font-serif italic">
                                                {new Date(event.date).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-charcoal group-hover:text-gold-leaf-600 transition-colors mb-1">
                                        {event.title}
                                    </h3>
                                    <p className="text-sm text-taupe flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span className="capitalize">{event.type}</span>
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-stone-100">
                                    <div className="flex justify-between items-center text-xs text-stone-500">
                                        <span>{event.guest_count || 0} Guests</span>
                                        <span>₹{Number(event.budget_total).toLocaleString('en-IN')} Budget</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
