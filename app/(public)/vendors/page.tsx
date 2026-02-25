import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

export const metadata = {
    title: "Premium Vendors | Glamoora",
    description: "Discover and hire top-tier vendors for your perfect event.",
};

export default async function VendorsPage() {
    const supabase = await createClient();

    // Fetch all vendors
    const { data: vendors, error } = await supabase
        .from("vendors")
        .select("*")
        .order("rating", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching vendors:", error);
    }

    return (
        <div className="bg-[var(--theme-bg-secondary)] min-h-screen py-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif text-[var(--theme-text-primary)] mb-4">
                        Discover Premium Vendors
                    </h1>
                    <p className="text-[var(--theme-text-muted)] max-w-2xl mx-auto text-lg">
                        Curated professionals who bring your vision to life with ethereal elegance and unmatched expertise.
                    </p>
                </div>

                {vendors && vendors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vendors.map((vendor) => (
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
                                        <div className="w-full h-full bg-gradient-to-tr from-gold-leaf-100 to-sage-100 flex items-center justify-center">
                                            <span className="text-gold-leaf-500 font-serif text-xl">{vendor.name.charAt(0)}</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-charcoal text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm">
                                            {vendor.category}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-charcoal text-xs font-bold flex items-center gap-1 rounded-full shadow-sm">
                                            <Star className="w-3 h-3 text-gold-leaf-500 fill-current" />
                                            {vendor.rating || "New"}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-serif text-[var(--theme-text-primary)] mb-2 group-hover:text-[var(--theme-accent)] transition-colors">
                                        {vendor.name}
                                    </h3>

                                    <div className="flex items-center gap-2 text-[var(--theme-text-muted)] text-sm mb-4">
                                        <MapPin className="w-4 h-4 text-gold-leaf-500" />
                                        <span>{vendor.location || "Location Flexible"}</span>
                                    </div>

                                    <div className="flex justify-between items-center border-t border-[var(--theme-border-color)] pt-4 mt-4">
                                        <span className="text-sm font-semibold text-charcoal">{vendor.price_range || "Price on Request"}</span>
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
                        <h3 className="text-xl font-serif text-[var(--theme-text-primary)] mb-2">No Vendors Available</h3>
                        <p className="text-[var(--theme-text-muted)]">Check back soon for our curated list of professionals.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
