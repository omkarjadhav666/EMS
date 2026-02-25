import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    let user = null;
    try {
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
        if (error) throw error;
        user = supabaseUser;
    } catch (error) {
        console.error('Layout Supabase fetch error:', error);
        redirect("/login?error=connection");
    }

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex h-screen bg-alabaster overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0 z-20">
                <Sidebar user={user} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Header user={user} />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 w-full max-w-[100vw]">
                    {children}
                </main>
            </div>
        </div>
    );
}
