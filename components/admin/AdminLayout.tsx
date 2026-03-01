import { ReactNode } from "react";
import { ShieldCheck, CalendarRange, Users, ClipboardList } from "lucide-react";
import { NotificationsDropdown } from "@/components/dashboard/NotificationsDropdown";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
    children: ReactNode;
    userId?: string;
    activeTab?: 'bookings' | 'events' | 'vendors' | 'users';
}

export function AdminLayout({ children, userId, activeTab = 'bookings' }: AdminLayoutProps) {
    const tabs = [
        { id: 'bookings', label: 'Bookings', href: '/dashboard/admin', icon: ClipboardList },
        { id: 'events', label: 'Events Overview', href: '/dashboard/admin/events', icon: CalendarRange },
        { id: 'vendors', label: 'Vendor Approvals', href: '/dashboard/admin/vendors', icon: Users },
        { id: 'users', label: 'User Directory', href: '/dashboard/admin/users', icon: Users },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="bg-charcoal text-white p-6 justify-between shadow-lg pb-0 rounded-t-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-serif flex items-center gap-2">
                            <ShieldCheck className="text-gold" />
                            Admin Portal
                        </h1>
                        <p className="text-stone-400 text-sm mt-1">
                            Platform oversight for events, bookings, and vendors.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationsDropdown userId={userId} />
                        <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
                            <span className="text-gold font-bold">Admin Mode</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 border-b border-stone-700">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className={cn(
                                    "px-4 py-3 font-bold transition-colors flex items-center gap-2 border-b-2 -mb-[1px]",
                                    isActive
                                        ? "text-gold border-gold"
                                        : "text-stone-400 border-transparent hover:text-stone-200 hover:border-stone-500"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 bg-white rounded-b-xl border border-stone-200 border-t-0 overflow-hidden shadow-sm flex flex-col p-6 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
