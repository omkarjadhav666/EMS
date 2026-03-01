"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Star, Building2, UtensilsCrossed, Camera, Music, Palette, Car, Sparkles, ClipboardList, Shirt, Gift, Plane, Videotape, LayoutGrid } from "lucide-react";
import { VENDOR_CATEGORIES } from "@/lib/constants/vendorCategories";

export function VendorDirectory({ initialVendors }: { initialVendors: any[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const filteredVendors = selectedCategory === "All"
        ? initialVendors
        : initialVendors.filter(v => {
            // Some basic matching logic, since db categories might not perfectly match yet.
            if (v.category?.toLowerCase() === selectedCategory.toLowerCase()) return true;
            // Also map general terms 
            if (selectedCategory === "Venue" && v.category?.toLowerCase().includes("venue")) return true;
            if (selectedCategory === "Catering" && v.category?.toLowerCase().includes("cater")) return true;
            if (selectedCategory === "Decor" && (v.category?.toLowerCase().includes("decor") || v.category?.toLowerCase().includes("florist"))) return true;
            if (selectedCategory === "Entertainment" && (v.category?.toLowerCase().includes("music") || v.category?.toLowerCase().includes("dj") || v.category?.toLowerCase().includes("entertain"))) return true;
            if (selectedCategory === "Photography" && v.category?.toLowerCase().includes("photo")) return true;
            return false;
        });

    return (
        <div className="space-y-12">
            {/* Category Filter Scroll Area */}
            <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex items-center gap-3 min-w-max px-1">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 font-medium whitespace-nowrap ${selectedCategory === "All"
                                ? "bg-[var(--theme-accent)] text-white border-[var(--theme-accent)] shadow-md transform scale-105"
                                : "bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] border-[var(--theme-border-color)] hover:border-[var(--theme-accent-light)] hover:text-[var(--theme-accent)]"
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        All Services
                    </button>
                    {VENDOR_CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        const isSelected = selectedCategory === category.id;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 font-medium whitespace-nowrap ${isSelected
                                        ? "bg-[var(--theme-accent)] text-white border-[var(--theme-accent)] shadow-md transform scale-105"
                                        : "bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] border-[var(--theme-border-color)] hover:border-[var(--theme-accent-light)] hover:text-[var(--theme-accent)]"
                                    }`}
                                title={category.description}
                            >
                                <Icon className="w-4 h-4" />
                                {category.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Vendors Grid */}
            {filteredVendors && filteredVendors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVendors.map((vendor) => (
                        <Link
                            href={`/vendors/${vendor.id}`}
                            key={vendor.id}
                            className="group bg-[var(--theme-bg-primary)] rounded-2xl overflow-hidden border border-[var(--theme-border-color)] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="h-48 relative overflow-hidden bg-stone-100">
                                {vendor.image_url ? (
                                    <img
                                        src={vendor.image_url}
                                        alt={vendor.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-tr from-[var(--theme-accent-light)] to-stone-100 flex items-center justify-center">
                                        <span className="text-[var(--theme-accent)] font-serif text-3xl opacity-50">{vendor.name.charAt(0)}</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[var(--theme-text-primary)] text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm">
                                        {vendor.category}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[var(--theme-text-primary)] text-xs font-bold flex items-center gap-1 rounded-full shadow-sm">
                                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                        {vendor.rating || "New"}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-serif text-[var(--theme-text-primary)] mb-2 group-hover:text-[var(--theme-accent)] transition-colors">
                                    {vendor.name}
                                </h3>

                                <div className="flex items-center gap-2 text-[var(--theme-text-muted)] text-sm mb-4">
                                    <MapPin className="w-4 h-4 text-emerald-600 opacity-70" />
                                    <span>{vendor.location || "Location Flexible"}</span>
                                </div>

                                <div className="flex justify-between items-center border-t border-[var(--theme-border-color)] pt-4 mt-4">
                                    <span className="text-sm font-semibold text-[var(--theme-text-primary)]">{vendor.price_range || "Price on Request"}</span>
                                    <span className="text-[var(--theme-accent)] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Profile &rarr;
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-[var(--theme-bg-primary)] rounded-2xl border border-[var(--theme-border-color)]">
                    <div className="w-16 h-16 bg-[var(--theme-bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-[var(--theme-text-muted)] opacity-50" />
                    </div>
                    <h3 className="text-xl font-serif text-[var(--theme-text-primary)] mb-2">No Vendors in this Category</h3>
                    <p className="text-[var(--theme-text-muted)]">Check back soon for our curated list of {selectedCategory !== "All" ? selectedCategory.toLowerCase() : ""} professionals.</p>
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className="mt-6 px-6 py-2 border border-[var(--theme-border-color)] rounded-full text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-secondary)] transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
