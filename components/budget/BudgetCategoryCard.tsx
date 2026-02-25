"use client";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { Utensils, Home, Camera, Music, Gift, Shirt, MapPin, Sparkles, Car, Flower2, MoreHorizontal } from "lucide-react";

interface BudgetCategoryCardProps {
    category: string;
    spent: number;
    totalBudget?: number; // Optional: If we knew the category split from template
    color?: string;
}

const CATEGORY_ICONS: Record<string, any> = {
    venue: Home,
    catering: Utensils,
    photography: Camera,
    entertainment: Music,
    gifts: Gift,
    attire: Shirt,
    decoration: Flower2,
    transport: Car,
    other: MoreHorizontal
};

export function BudgetCategoryCard({ category, spent, totalBudget, color = "#3b82f6" }: BudgetCategoryCardProps) {
    const Icon = CATEGORY_ICONS[category.toLowerCase()] || Sparkles;

    // If totalBudget is provided, calculate percentage, else just show spent
    const percentage = totalBudget ? Math.min((spent / totalBudget) * 100, 100) : 0;

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 p-6 flex flex-col justify-between h-full">
            {/* Decorative element */}
            <div
                className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-5 group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundColor: color }}
            />

            <div className="flex items-start justify-between mb-8 relative z-10">
                <div
                    className="p-3 rounded-lg bg-opacity-10 text-opacity-100"
                    style={{ backgroundColor: `${color}1A`, color: color }} // 1A is ~10% opacity in hex
                >
                    <Icon className="w-6 h-6" />
                </div>
                {totalBudget && (
                    <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-1 rounded-full">
                        {percentage.toFixed(0)}%
                    </span>
                )}
            </div>

            <div className="space-y-1 relative z-10 mt-auto">
                <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-widest">{category}</h3>
                <p className="text-3xl font-serif text-charcoal group-hover:text-gold-leaf-700 transition-colors">{formatCurrency(spent)}</p>
            </div>

            {totalBudget && (
                <div className="mt-5 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden shadow-inner relative z-10">
                    <div
                        className="h-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                    />
                </div>
            )}
        </div>
    );
}
