import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Users, IndianRupee, CheckSquare, Clock, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { CalendarExport } from "@/components/integrations/CalendarExport";

export default async function EventDashboard({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: event, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !event) {
        return notFound();
    }

    // Fetch stats
    const { count: taskCount } = await supabase
        .from('event_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);

    const { count: guestCount } = await supabase
        .from('guests')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);

    const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('event_id', id);

    const totalSpent = expenses?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/events" className="text-taupe hover:text-charcoal transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif text-charcoal">{event.title}</h1>
                        <p className="text-taupe mt-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(event.date), 'MMMM d, yyyy')}
                        </p>
                    </div>
                </div>
                <CalendarExport event={{
                    title: event.title,
                    description: "Event managed via Glamoora",
                    location: event.location,
                    start_date: event.date,
                }} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Tasks", value: taskCount || 0, icon: CheckSquare, href: `/dashboard/events/${id}/tasks` },
                    { label: "Guests", value: guestCount || 0, icon: Users, href: `/dashboard/events/${id}/guests` },
                    { label: "Budget", value: `₹${totalSpent.toLocaleString('en-IN')} / ₹${Number(event.budget_total || 0).toLocaleString('en-IN')}`, icon: IndianRupee, href: `/dashboard/events/${id}/budget` },
                    { label: "Timeline", value: "View", icon: Clock, href: `/dashboard/events/${id}/timeline` },
                ].map((stat) => (
                    <Link key={stat.label} href={stat.href} className="bg-white p-6 rounded-xl border border-stone-200 hover:border-gold-leaf-500 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-stone-100 rounded-full group-hover:bg-gold-leaf-50 transition-colors">
                                <stat.icon className="w-5 h-5 text-charcoal group-hover:text-gold-leaf-600 transition-colors" />
                            </div>
                            <div>
                                <p className="text-xs text-taupe uppercase tracking-wider font-bold">{stat.label}</p>
                                <p className="text-xl font-serif text-charcoal">{stat.value}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Module Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href={`/dashboard/events/${id}/tasks`} className="bg-white p-6 rounded-xl border border-stone-200 hover:border-gold-leaf-500 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckSquare className="w-6 h-6 text-gold-leaf-600" />
                        <h2 className="text-xl font-serif text-charcoal">Tasks</h2>
                    </div>
                    <p className="text-taupe">Manage your event checklist and track progress.</p>
                </Link>

                <Link href={`/dashboard/events/${id}/budget`} className="bg-white p-6 rounded-xl border border-stone-200 hover:border-gold-leaf-500 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-4">
                        <IndianRupee className="w-6 h-6 text-green-600" />
                        <h2 className="text-xl font-serif text-charcoal">Budget</h2>
                    </div>
                    <p className="text-taupe">Track expenses and stay within your budget.</p>
                </Link>

                <Link href={`/dashboard/events/${id}/guests`} className="bg-white p-6 rounded-xl border border-stone-200 hover:border-gold-leaf-500 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-serif text-charcoal">Guest List</h2>
                    </div>
                    <p className="text-taupe">Manage invitations and RSVPs.</p>
                </Link>

                <Link href={`/dashboard/events/${id}/timeline`} className="bg-white p-6 rounded-xl border border-stone-200 hover:border-gold-leaf-500 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-6 h-6 text-charcoal" />
                        <h2 className="text-xl font-serif text-charcoal">Timeline</h2>
                    </div>
                    <p className="text-taupe">Visualize your event planning timeline.</p>
                </Link>

                <Link href={`/dashboard/events/${id}/settings`} className="bg-white p-6 rounded-xl border border-stone-200 hover:border-gold-leaf-500 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckSquare className="w-6 h-6 text-charcoal" />
                        <h2 className="text-xl font-serif text-charcoal">Settings</h2>
                    </div>
                    <p className="text-taupe">Configure public page and event details.</p>
                </Link>
            </div>
        </div>
    );
}

