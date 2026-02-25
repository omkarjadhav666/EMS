"use client";

import { useState, useEffect } from "react";
import { Expense, ExpenseCategory } from "./types";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ExpenseListProps {
    initialExpenses: Expense[];
    eventId: string;
}

const CATEGORIES: ExpenseCategory[] = ['Venue', 'Catering', 'Photography', 'Music', 'Decor', 'Attire', 'Other'];

export function ExpenseList({ initialExpenses, eventId }: ExpenseListProps) {
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [newTitle, setNewTitle] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [newCategory, setNewCategory] = useState<ExpenseCategory>('Other');

    const supabase = createClient();
    const router = useRouter();

    // Sync state with props
    useEffect(() => {
        setExpenses(initialExpenses);
    }, [initialExpenses]);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!newTitle || !newAmount) return;

        const tempId = Math.random().toString();
        const optimisticExpense: Expense = {
            id: tempId,
            event_id: eventId,
            user_id: '',
            title: newTitle,
            amount: parseFloat(newAmount),
            category: newCategory,
            status: 'pending',
            created_at: new Date().toISOString()
        };

        setExpenses([optimisticExpense, ...expenses]);
        setIsAdding(false);
        setNewTitle("");
        setNewAmount("");

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase.from('expenses').insert({
                event_id: eventId,
                user_id: user.id,
                title: newTitle,
                amount: parseFloat(newAmount),
                category: newCategory,
                status: 'pending'
            })
                .select()
                .single();

            if (error) {
                console.error(JSON.stringify(error, null, 2));
                setExpenses(prev => prev.filter(e => e.id !== tempId));
            } else if (data) {
                // Replace optimistic expense with real one
                setExpenses(prev => prev.map(e => e.id === tempId ? data : e));
                router.refresh();
            }
        }
    }

    async function toggleStatus(id: string, currentStatus: string) {
        const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));

        const { error } = await supabase.from('expenses').update({ status: newStatus }).eq('id', id);
        if (error) router.refresh();
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure?")) return;
        setExpenses(prev => prev.filter(e => e.id !== id));

        const { error } = await supabase.from('expenses').delete().eq('id', id);
        if (error) router.refresh();
    }

    return (
        <div className="bg-white/80 backdrop-blur-md border border-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-500">
            <div className="p-8 border-b border-stone-100/50 flex justify-between items-center bg-gradient-to-r from-white to-stone-50/30">
                <h3 className="font-serif text-2xl text-charcoal tracking-tight">Expenses</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={cn(
                        "text-sm py-2.5 px-6 flex items-center gap-2 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md",
                        isAdding ? "bg-stone-100 text-charcoal hover:bg-stone-200" : "bg-charcoal text-white hover:bg-gold-leaf-600"
                    )}
                >
                    {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isAdding ? "Cancel" : "Add Expense"}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAdd} className="p-8 bg-stone-50/30 border-b border-stone-100/50 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        <div className="md:col-span-5">
                            <label className="text-[10px] font-bold text-stone-400 tracking-widest uppercase mb-2 block ml-1">Item Name</label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="e.g. Wedding Cake"
                                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-stone-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-leaf-400 focus:border-transparent placeholder:text-stone-300 transition-all shadow-sm"
                                autoFocus
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="text-[10px] font-bold text-stone-400 tracking-widest uppercase mb-2 block ml-1">Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3 text-stone-400 font-serif">₹</span>
                                <input
                                    type="number"
                                    value={newAmount}
                                    onChange={(e) => setNewAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-stone-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-leaf-400 focus:border-transparent placeholder:text-stone-300 transition-all shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-4">
                            <label className="text-[10px] font-bold text-stone-400 tracking-widest uppercase mb-2 block ml-1">Category</label>
                            <select
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-stone-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-leaf-400 focus:border-transparent transition-all shadow-sm"
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end mt-8">
                        <button
                            type="submit"
                            className="px-8 py-3 text-sm font-medium text-white bg-gold-leaf-500 hover:bg-gold-leaf-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Save Expense
                        </button>
                    </div>
                </form>
            )}

            <div className="divide-y divide-stone-100/50">
                {expenses.length === 0 ? (
                    <div className="p-16 text-center animate-in fade-in duration-700">
                        <div className="w-20 h-20 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Plus className="w-8 h-8 text-stone-300" />
                        </div>
                        <p className="font-serif text-2xl text-charcoal mb-3">No expenses yet</p>
                        <p className="text-base text-taupe max-w-sm mx-auto">Start tracking your budget by adding your first event expense above.</p>
                    </div>
                ) : (
                    expenses.map((expense) => (
                        <div key={expense.id} className="p-6 flex items-center justify-between hover:bg-stone-50/50 transition-colors group relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-leaf-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-5">
                                <button
                                    onClick={() => toggleStatus(expense.id, expense.status)}
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm",
                                        expense.status === 'paid'
                                            ? "bg-sage-500 border-sage-500 text-white"
                                            : "bg-white border-stone-200 text-stone-300 hover:border-gold-leaf-400 hover:text-gold-leaf-500"
                                    )}
                                >
                                    <Check className="w-5 h-5" />
                                </button>
                                <div>
                                    <p className={cn(
                                        "font-semibold text-charcoal text-lg transition-colors",
                                        expense.status === 'paid' && "line-through text-stone-400"
                                    )}>
                                        {expense.title}
                                    </p>
                                    <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mt-1">{expense.category}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <p className={cn(
                                    "font-serif text-xl transition-colors",
                                    expense.status === 'paid' ? "text-stone-400" : "text-charcoal"
                                )}>
                                    ₹{expense.amount.toLocaleString('en-IN')}
                                </p>
                                <button
                                    onClick={() => handleDelete(expense.id)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:bg-terra-cotta/10 hover:text-terra-cotta opacity-0 group-hover:opacity-100 transition-all duration-300"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
