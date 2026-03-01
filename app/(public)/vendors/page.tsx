import { createClient } from "@/lib/supabase/server";
import { VendorDirectory } from "@/components/marketplace/VendorDirectory";

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
                        Discover Premium Services
                    </h1>
                    <p className="text-[var(--theme-text-muted)] max-w-2xl mx-auto text-lg">
                        Curated professionals across all specialties, from grand venues to intricate decor, ready to bring your vision to life.
                    </p>
                </div>

                <VendorDirectory initialVendors={vendors || []} />
            </div>
        </div>
    );
}
