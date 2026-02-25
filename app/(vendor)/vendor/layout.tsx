import { requireRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { VendorSidebar } from "@/components/vendor/VendorSidebar";
import { VendorHeader } from "@/components/vendor/VendorHeader";

export default async function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Require vendor role
    await requireRole(['vendor', 'admin']);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="flex h-screen bg-alabaster overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0 z-20">
                <VendorSidebar user={user} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <VendorHeader user={user} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
