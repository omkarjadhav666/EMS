import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BudgetChart } from "@/components/budget/BudgetChart";
import { BudgetCategoryCard } from "@/components/budget/BudgetCategoryCard";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Wallet, TrendingUp, PiggyBank, Search } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const CATEGORY_COLORS: Record<string, string> = {
    venue: "bg-emerald-500",
    catering: "bg-orange-500",
    photography: "bg-blue-500",
    entertainment: "bg-purple-500",
    attire: "bg-pink-500",
    decoration: "bg-rose-500",
    transport: "bg-indigo-500",
    other: "bg-stone-500"
};

export default async function PublicBudgetPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    // 1. Fetch Event
    const { data: event } = await supabase
        .from("events")
        .select("id, title, budget_total, event_type, date, location")
        .eq("slug", slug)
        .eq("is_public", true)
        .single();

    if (!event) return notFound();

    // 2. Fetch Expenses
    const { data: expenses } = await supabase
        .from("expenses")
        .select("id, amount, category, description, date")
        .eq("event_id", event.id)
        .order("date", { ascending: false });

    const expenseList = expenses || [];
    const totalSpent = expenseList.reduce((sum, item) => sum + Number(item.amount), 0);
    const spendingProgress = event.budget_total ? (totalSpent / event.budget_total) * 100 : 0;
    const remaining = (event.budget_total || 0) - totalSpent;

    // 3. Aggregate Categories
    const categoryTotals: Record<string, number> = {};
    expenseList.forEach(item => {
        const cat = item.category?.toLowerCase() || "other";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(item.amount);
    });

    const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] || CATEGORY_COLORS.other
    }));

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-charcoal">
            {/* Hero Section */}
            <div className="relative bg-charcoal text-white pt-20 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225465036-ed0190471203?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-transparent" />

                <div className="relative max-w-6xl mx-auto px-6">
                    <Link href={`/events/${slug}`} className="inline-flex items-center text-stone-300 hover:text-white transition-colors mb-6 text-sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Event Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-serif mb-4">{event.title}</h1>
                    <div className="flex flex-wrap gap-4 text-stone-300 text-sm mb-8">
                        <span>{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                        <span>•</span>
                        <span>{event.location || "Location TBD"}</span>
                    </div>

                    {/* Quick Stats Grid - Hero Overlay */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl">
                        <div className="isolate">
                            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Total Budget</p>
                            <p className="text-3xl font-serif text-white">{formatCurrency(event.budget_total || 0)}</p>
                        </div>
                        <div className="isolate">
                            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Total Spent</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-serif text-gold-leaf-400">{formatCurrency(totalSpent)}</p>
                                <span className="text-xs text-stone-500 bg-stone-800 px-2 py-0.5 rounded-full">{spendingProgress.toFixed(0)}%</span>
                            </div>
                        </div>
                        <div className="isolate">
                            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Remaining</p>
                            <p className={`text-3xl font-serif ${remaining < 0 ? "text-terra-cotta" : "text-sage-400"}`}>
                                {formatCurrency(remaining)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Floating over Hero */}
            <div className="relative max-w-6xl mx-auto px-6 -mt-16 pb-20 space-y-12">

                {/* Category Breakdown Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Donut Chart */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20 h-fit">
                        <h3 className="text-lg font-serif mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-gold-leaf-600" />
                            Spending Distribution
                        </h3>
                        <BudgetChart data={chartData} />
                    </div>

                    {/* Category Cards Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(categoryTotals).map(([cat, amount]) => (
                            <BudgetCategoryCard
                                key={cat}
                                category={cat}
                                spent={amount}
                                // Hack: Estimate budget split based on template (or just hide progress bar if unknown)
                                // For now, we don't have per-category budget limits in the DB, so we pass undefined
                                color={CATEGORY_COLORS[cat] || "bg-stone-500"}
                            />
                        ))}
                        {/* Empty State filler if few categories */}
                        {Object.keys(categoryTotals).length === 0 && (
                            <div className="col-span-full flex items-center justify-center p-12 text-stone-400 border-2 border-dashed border-stone-200 rounded-xl">
                                No expenses recorded yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Detailed Expense Log */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                    <div className="p-6 border-b border-stone-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-xl font-serif text-charcoal">Expense Log</h3>
                            <p className="text-sm text-stone-400">Detailed list of all transactions</p>
                        </div>

                        {/* Placeholder for Client-Side Search (would need a client component wrapper) */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                            <input
                                type="text"
                                placeholder="Search expenses..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-full focus:outline-none focus:border-gold-leaf-400 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-stone-50 text-stone-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {expenseList.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-stone-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-stone-500 whitespace-nowrap">
                                            {new Date(expense.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-stone-600 capitalize">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-stone-100">
                                                {expense.category || "General"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-charcoal font-medium">
                                            {expense.description}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-stone-700">
                                            {formatCurrency(expense.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {expenseList.length > 5 && (
                        <div className="p-4 bg-stone-50/50 text-center border-t border-stone-50">
                            <button className="text-xs font-bold text-stone-400 hover:text-gold-leaf-600 uppercase tracking-widest transition-colors">
                                View All Transactions
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
