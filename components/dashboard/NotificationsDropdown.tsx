"use client";

import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface Notification {
    id: string;
    title: string;
    message: string | null;
    type: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

export function NotificationsDropdown({ userId }: { userId?: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        if (!userId) return;

        // Initial fetch
        const fetchNotifications = async () => {
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(20);

            if (data) setNotifications(data);
        };

        fetchNotifications();

        // Real-time subscription
        const channel = supabase
            .channel('realtime_notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    setNotifications(prev => [payload.new as Notification, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    const handleMarkAsRead = async (id: string, link: string | null) => {
        // Optimistic UI update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));

        // DB update
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        if (link) {
            setIsOpen(false);
            router.push(link);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;

        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false);
    };

    // If no user is logged in (e.g., viewing public pages), don't render or render empty
    if (!userId) {
        return (
            <button className="relative p-2 text-taupe hover:bg-alabaster rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gold-leaf-300">
                <Bell className="w-5 h-5" />
            </button>
        );
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button className="relative p-2 text-taupe hover:bg-alabaster rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gold-leaf-300">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-terra-cotta rounded-full border-2 border-white"></span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="font-normal flex justify-between items-center bg-white sticky top-0 z-10 py-3">
                    <span className="font-serif font-bold text-charcoal text-base">Notifications</span>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <span className="text-xs font-medium text-gold-leaf-600 bg-gold-leaf-50 px-2 py-0.5 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0}
                            className="text-xs text-taupe hover:text-charcoal transition-colors disabled:opacity-50 flex items-center gap-1"
                            title="Mark all as read"
                        >
                            <CheckCheck className="w-3 h-3" />
                        </button>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`flex flex-col items-start p-4 cursor-pointer transition-colors ${notification.is_read ? 'bg-white hover:bg-alabaster' : 'bg-gold-leaf-50/30 hover:bg-gold-leaf-50'}`}
                                onClick={() => handleMarkAsRead(notification.id, notification.link)}
                            >
                                <div className="flex w-full justify-between items-start gap-2">
                                    <span className={`text-sm ${notification.is_read ? "text-charcoal/80" : "font-semibold text-charcoal"}`}>
                                        {notification.title}
                                    </span>
                                    {!notification.is_read && (
                                        <span className="w-2 h-2 rounded-full bg-gold-leaf-500 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                                    )}
                                </div>
                                {notification.message && (
                                    <p className={`text-xs mt-1 line-clamp-2 ${notification.is_read ? "text-stone-400" : "text-taupe"}`}>
                                        {notification.message}
                                    </p>
                                )}
                                <span className="text-[10px] text-stone-400 mt-2 font-medium uppercase tracking-wider">
                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                </span>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="p-8 text-center flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-3 text-stone-300">
                                <Bell className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-medium text-charcoal">All caught up!</p>
                            <p className="text-xs text-taupe mt-1">No new notifications</p>
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
