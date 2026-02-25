import { createClient } from "@/lib/supabase/server";
import { BudgetOverview } from "@/components/budget/BudgetOverview";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function BudgetPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch all active events for the user
    const { data: events } = await supabase
        .from('events')
        .select('id, budget_total, title')
        .eq('user_id', user.id)
        .neq('status', 'cancelled');

    const totalBudget = events?.reduce((acc, curr) => acc + (Number(curr.budget_total) || 0), 0) || 0;
    const eventIds = events?.map(e => e.id) || [];

    // Fetch all expenses for those events
    let expenses: any[] = [];
    if (eventIds.length > 0) {
        const { data } = await supabase
            .from('expenses')
            .select('*')
            .in('event_id', eventIds);
        expenses = data || [];
    }

    return (
        <div className="space-y-10 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/50">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-serif text-charcoal tracking-tight mb-3">Global Budget</h1>
                    <p className="text-taupe text-lg leading-relaxed">A comprehensive overview of your financial health across all active events.</p>
                </div>
                {/* Optional: Add a quick action button if needed */}
            </div>

            {events && events.length > 0 ? (
                <BudgetOverview budgetTotal={totalBudget} expenses={expenses} />
            ) : (
                <div className="bg-white/80 backdrop-blur-md border border-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-16 text-center animate-in fade-in duration-700 mt-8">
                    <div className="w-20 h-20 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Plus className="w-8 h-8 text-stone-300" />
                    </div>
                    <p className="font-serif text-2xl text-charcoal mb-3">No active events</p>
                    <p className="text-base text-taupe max-w-sm mx-auto mb-8">Create an event to start tracking and managing your global budget.</p>
                    <Link href="/dashboard/events/new" className="inline-flex px-8 py-3 text-sm font-medium text-white bg-gold-leaf-500 hover:bg-gold-leaf-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                        Create Event
                    </Link>
                </div>
            )}
        </div>
    );
}
