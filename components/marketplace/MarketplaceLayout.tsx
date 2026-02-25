'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MarketplaceLayoutProps {
    children: React.ReactNode;
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    onSearchChange: (query: string) => void;
}

const CATEGORIES = [
    "All",
    "Venue",
    "Catering",
    "Photography",
    "Music",
    "Decor",
    "Florist",
    "Planner"
];

export function MarketplaceLayout({ children, activeCategory, onCategoryChange, onSearchChange }: MarketplaceLayoutProps) {
    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
                <div className="relative group">
                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-taupe group-focus-within:text-gold-leaf-500 transition-colors" />
                    <Input
                        placeholder="Search exceptional vendors..."
                        className="pl-11 py-6 bg-white/60 backdrop-blur-md border border-white/40 focus-visible:ring-1 focus-visible:ring-gold-leaf-400 focus-visible:border-gold-leaf-400 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all placeholder:text-stone-400 text-charcoal font-medium"
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <h3 className="font-serif text-lg tracking-widest uppercase text-stone-400 mb-6 px-4">Categories</h3>
                    <div className="space-y-1">
                        {CATEGORIES.map(category => (
                            <Button
                                key={category}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start text-left font-medium px-4 py-6 rounded-xl transition-all duration-500 ease-out group",
                                    activeCategory === category
                                        ? "bg-white text-gold-leaf-600 shadow-sm border border-stone-100/50"
                                        : "text-taupe hover:text-charcoal hover:bg-white/40 hover:pl-6"
                                )}
                                onClick={() => onCategoryChange(category)}
                            >
                                <span className={cn(
                                    "w-1.5 h-1.5 rounded-full mr-3 transition-opacity duration-300",
                                    activeCategory === category ? "bg-gold-leaf-500 opacity-100" : "bg-stone-300 opacity-0 group-hover:opacity-100"
                                )} />
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content Grid */}
            <main className="flex-1 pb-10">
                {children}
            </main>
        </div>
    );
}
