import { BudgetStats, Expense } from "./types";
import { IndianRupee, TrendingUp, AlertCircle, CheckCircle2, Wallet, PiggyBank } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { BudgetChart } from "./BudgetChart";
import { BudgetCategoryCard } from "./BudgetCategoryCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BudgetOverviewProps {
    budgetTotal: number;
    expenses: Expense[];
}

const CATEGORY_COLORS: Record<string, string> = {
    venue: "#10b981", // emerald-500
    catering: "#f97316", // orange-500
    photography: "#3b82f6", // blue-500
    entertainment: "#a855f7", // purple-500
    attire: "#ec4899", // pink-500
    decoration: "#f43f5e", // rose-500
    transport: "#6366f1", // indigo-500
    other: "#78716c" // stone-500
};

export function BudgetOverview({ budgetTotal, expenses }: BudgetOverviewProps) {
    // Calculate stats
    const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalPending = expenses.filter(e => e.status === 'pending').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const spendingProgress = budgetTotal > 0 ? (totalSpent / budgetTotal) * 100 : 0;
    const remaining = budgetTotal - totalSpent;

    // Aggregate Categories for Chart/Cards
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(item => {
        const cat = item.category?.toLowerCase() || "other";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(item.amount);
    });

    const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] || CATEGORY_COLORS.other
    }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Budget */}
                <Card className="border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden relative group transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-taupe/20 to-taupe/40" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-400 group-hover:text-taupe transition-colors">Total Budget</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-stone-100/80 flex items-center justify-center group-hover:bg-white transition-colors">
                            <Wallet className="h-4 w-4 text-stone-400 group-hover:text-taupe" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-serif text-charcoal">{formatCurrency(budgetTotal)}</div>
                        <p className="text-xs text-stone-400 mt-2 font-medium">Target Amount</p>
                    </CardContent>
                </Card>

                {/* Total Spent */}
                <Card className="border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden relative group transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-leaf-300 to-gold-leaf-500" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-400 group-hover:text-taupe transition-colors">Total Spent</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-gold-leaf-50 flex items-center justify-center group-hover:bg-gold-leaf-100 transition-colors">
                            <TrendingUp className="h-4 w-4 text-gold-leaf-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-serif text-charcoal">{formatCurrency(totalSpent)}</div>
                        <div className="w-full bg-stone-100 h-1.5 rounded-full mt-3 overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-gold-leaf-400 to-gold-leaf-600 transition-all duration-1000 ease-out"
                                style={{ width: `${Math.min(spendingProgress, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-stone-400 mt-2 font-medium flex justify-between">
                            <span>{spendingProgress.toFixed(1)}% used</span>
                            <span className="text-gold-leaf-600">{formatCurrency(totalPending)} pending</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Remaining */}
                <Card className="border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden relative group transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1">
                    <div className={cn(
                        "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
                        remaining < 0 ? "from-terra-cotta/50 to-terra-cotta" : "from-sage-400 to-sage-600"
                    )} />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-400 group-hover:text-taupe transition-colors">Remaining</CardTitle>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                            remaining < 0 ? "bg-terra-cotta/10 group-hover:bg-terra-cotta/20" : "bg-sage/10 group-hover:bg-sage/20"
                        )}>
                            <PiggyBank className={cn(
                                "h-4 w-4",
                                remaining < 0 ? "text-terra-cotta" : "text-sage-600"
                            )} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-3xl font-serif ${remaining < 0 ? "text-terra-cotta" : "text-sage-700"}`}>
                            {formatCurrency(remaining)}
                        </div>
                        <p className="text-xs text-stone-400 mt-2 font-medium">Available Funds</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts & Categorization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Donut Chart */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white h-fit">
                    <h3 className="text-xl font-serif mb-8 flex items-center gap-2.5 text-charcoal">
                        <div className="p-2 bg-gold-leaf-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-gold-leaf-600" />
                        </div>
                        Spending Distribution
                    </h3>
                    <div className="relative">
                        <BudgetChart data={chartData} />
                    </div>
                </div>

                {/* Category Cards Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(categoryTotals).map(([cat, amount]) => (
                        <BudgetCategoryCard
                            key={cat}
                            category={cat}
                            spent={amount}
                            color={CATEGORY_COLORS[cat] || "bg-stone-500"}
                        />
                    ))}
                    {Object.keys(categoryTotals).length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 text-stone-400 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                            <IndianRupee className="w-8 h-8 mb-2 opacity-50" />
                            <p>No expenses recorded yet.</p>
                            <p className="text-xs mt-1">Add an expense to see the breakdown.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
