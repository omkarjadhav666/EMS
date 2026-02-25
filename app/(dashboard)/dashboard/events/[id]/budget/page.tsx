import { BudgetOverview } from "@/components/budget/BudgetOverview";
import { ExpenseList } from "@/components/budget/ExpenseList";
import { createClient } from "@/lib/supabase/server";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: event } = await supabase
        .from('events')
        .select('budget_total')
        .eq('id', id)
        .single();

    const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('event_id', id)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-10 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/50">
                <div className="max-w-2xl">
                    <Link href={`/dashboard/events/${id}`} className="text-sm text-stone-400 hover:text-gold-leaf-600 flex items-center gap-1.5 mb-4 transition-colors font-medium">
                        <ArrowLeft className="w-4 h-4" /> Back to Event
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-serif text-charcoal tracking-tight">Budget Tracker</h1>
                    <p className="text-taupe mt-3 text-lg leading-relaxed">Monitor your event expenses and maintain your supreme financial vision.</p>
                </div>
            </div>

            <BudgetOverview budgetTotal={event?.budget_total || 0} expenses={expenses || []} />
            <ExpenseList initialExpenses={expenses || []} eventId={id} />
        </div>
    );
}
