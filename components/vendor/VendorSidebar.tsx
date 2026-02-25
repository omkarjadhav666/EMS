"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Calendar, MessageSquare, Settings, BarChart3, Briefcase, LogOut } from "lucide-react";
import { NotificationsDropdown } from "@/components/dashboard/NotificationsDropdown";

interface VendorSidebarProps {
    user: any;
}

export function VendorSidebar({ user }: VendorSidebarProps) {
    const pathname = usePathname();

    const navigation = [
        { name: "Dashboard", href: "/vendor/dashboard", icon: Home },
        { name: "Bookings", href: "/vendor/bookings", icon: Briefcase },
        { name: "Profile & Services", href: "/vendor/profile", icon: Settings },
        { name: "Availability", href: "/vendor/availability", icon: Calendar },
        { name: "Messages", href: "/vendor/messages", icon: MessageSquare },
        { name: "Analytics", href: "/vendor/analytics", icon: BarChart3 },
    ];

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
            <div className="p-6 pb-2">
                <h1 className="text-2xl font-serif text-charcoal font-bold tracking-tight">
                    Glam<span className="text-gold-leaf-500 italic">oora</span>
                </h1>
                <p className="text-sm text-stone-500 mt-1">Vendor Portal</p>
            </div>

            <div className="px-6 py-4">
                <NotificationsDropdown userId={user?.id} />
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                                isActive
                                    ? "bg-alabaster text-charcoal shadow-sm border border-stone-100"
                                    : "text-taupe hover:bg-alabaster hover:text-charcoal"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-gold-leaf-500" : "text-stone-400")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-stone-200 space-y-2">
                <Link
                    href="/dashboard"
                    className="block text-center text-sm text-taupe hover:text-charcoal transition-colors py-2"
                >
                    ← Back to Main Dashboard
                </Link>
                <form action="/auth/signout" method="post">
                    <button className="flex items-center gap-3 px-4 py-3 text-sm font-sans font-medium text-taupe hover:text-terra-cotta w-full transition-colors w-full text-left rounded-lg hover:bg-red-50">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}
