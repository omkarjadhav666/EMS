'use client';

import { useState, useEffect } from "react";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { VendorCard, Vendor } from "@/components/marketplace/VendorCard";
import { BookingModal } from "@/components/marketplace/BookingModal";
import { MyServices } from "@/components/marketplace/MyServices";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MarketplacePage() {
    const supabase = createClient();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [activeTab, setActiveTab] = useState<"discover" | "services">("discover");

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('vendors')
            .select('*');

        if (data) setVendors(data);
        if (error) console.error("Error fetching vendors:", error);
        setLoading(false);
    };

    const filteredVendors = vendors.filter(vendor => {
        const matchesCategory = activeCategory === "All" || vendor.category === activeCategory;
        const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="h-full flex flex-col animate-fade-in-up space-y-10 px-2">

            {/* Magazine-style Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/50">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-serif text-charcoal tracking-tight">The Marketplace</h1>
                    <p className="text-taupe mt-3 text-lg leading-relaxed">Curated luxury professionals to bring your vision to life. Discover, book, and manage your exceptional event team.</p>
                </div>

                {/* Premium Pill Tabs */}
                <div className="flex bg-stone-100/50 p-1.5 rounded-full w-fit border border-stone-200/80 backdrop-blur-md shadow-sm">
                    <button
                        onClick={() => setActiveTab("discover")}
                        className={cn(
                            "px-8 py-2.5 rounded-full font-medium text-sm transition-all duration-500 ease-out",
                            activeTab === "discover"
                                ? "bg-white text-charcoal shadow-md scale-100"
                                : "text-taupe hover:text-charcoal hover:bg-white/50 scale-95"
                        )}
                    >
                        Discover
                    </button>
                    <button
                        onClick={() => setActiveTab("services")}
                        className={cn(
                            "px-8 py-2.5 rounded-full font-medium text-sm transition-all duration-500 ease-out",
                            activeTab === "services"
                                ? "bg-white text-charcoal shadow-md scale-100"
                                : "text-taupe hover:text-charcoal hover:bg-white/50 scale-95"
                        )}
                    >
                        My Services
                    </button>
                </div>
            </div>

            {activeTab === "discover" ? (
                <>
                    <MarketplaceLayout
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                        onSearchChange={setSearchQuery}
                    >
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="w-8 h-8 animate-spin text-taupe" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredVendors.map(vendor => (
                                    <VendorCard
                                        key={vendor.id}
                                        vendor={vendor}
                                        onBook={setSelectedVendor}
                                    />
                                ))}
                            </div>
                        )}

                        {!loading && filteredVendors.length === 0 && (
                            <div className="text-center py-20 text-taupe bg-stone-50 rounded-xl border border-stone-100/50">
                                <p>No vendors found matching your criteria.</p>
                            </div>
                        )}
                    </MarketplaceLayout>

                    <BookingModal
                        vendor={selectedVendor}
                        isOpen={!!selectedVendor}
                        onClose={() => setSelectedVendor(null)}
                    />
                </>
            ) : (
                <div className="flex-1">
                    <MyServices />
                </div>
            )}
        </div>
    );
}

