"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    CalendarDays,
    CheckSquare,
    CreditCard,
    Store,
    Settings,
    LogOut,
    ShieldCheck
} from "lucide-react";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Events", href: "/dashboard/events", icon: CalendarDays },
    { name: "Checklist", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Budget", href: "/dashboard/budget", icon: CreditCard },
    { name: "Marketplace", href: "/dashboard/marketplace", icon: Store },
    { name: "Admin Portal", href: "/dashboard/admin", icon: ShieldCheck },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
    user: any; // Using any for now to avoid strict type issues with Supabase User
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-soft-sand border-r border-stone-200 w-64">
            {/* Brand */}
            <div className="p-6">
                <Link href="/dashboard" className="font-serif text-2xl font-bold tracking-tight text-charcoal">
                    Glam<span className="text-gold-leaf-500 italic">oora</span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-2">
                {navigation.map((item) => {
                    // Role-based filtering
                    if (item.href === "/dashboard/admin" && user?.user_metadata?.role !== 'admin') {
                        return null;
                    }

                    if (item.href === "/dashboard/marketplace" && user?.user_metadata?.role === 'admin') {
                        return null;
                    }

                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-sans font-medium rounded-sm transition-all duration-200",
                                isActive
                                    ? "bg-white text-charcoal shadow-sm border border-stone-100"
                                    : "text-taupe hover:bg-white/50 hover:text-charcoal"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-gold-leaf-500" : "text-stone-400")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200">
                <form action="/auth/signout" method="post">
                    <button className="flex items-center gap-3 px-4 py-3 text-sm font-sans font-medium text-taupe hover:text-terra-cotta w-full transition-colors w-full text-left">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}
