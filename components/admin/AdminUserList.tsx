'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Users, Search, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: string;
    updated_at: string;
}

export function AdminUserList() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const supabase = createClient();

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, email, full_name, role, updated_at')
                .order('updated_at', { ascending: false });

            if (error) {
                console.error("Error fetching users:", error);
            } else if (data) {
                setUsers(data as UserProfile[]);
            }
        } catch (err) {
            console.error("Unexpected error fetching users:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateRole = async (userId: string, newRole: string) => {
        setUpdatingId(userId);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Failed to update user role:", error);
            alert("Failed to update user role. Check console for details.");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gold-leaf-500" />
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-md border border-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-500">
            <div className="p-8 border-b border-stone-100/50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-white to-stone-50/30">
                <div>
                    <h3 className="font-serif text-2xl text-charcoal tracking-tight flex items-center gap-2">
                        <Users className="w-6 h-6 text-gold-leaf-500" />
                        User Directory
                    </h3>
                    <p className="text-sm text-taupe mt-1">Manage all registered users and assign roles.</p>
                </div>

                <div className="relative max-w-sm w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-stone-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, email, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-stone-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-leaf-400 focus:border-transparent placeholder:text-stone-300 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50/50 text-[10px] tracking-widest uppercase text-stone-400 font-bold border-b border-stone-100/50">
                        <tr>
                            <th className="px-8 py-4">User</th>
                            <th className="px-8 py-4">Role</th>
                            <th className="px-8 py-4">Last Activity</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100/50 bg-white/40">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-16 text-center">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-stone-300" />
                                    </div>
                                    <p className="font-serif text-xl sm:text-2xl text-charcoal mb-2 sm:mb-3">No users found</p>
                                    <p className="text-sm sm:text-base text-taupe max-w-sm mx-auto">We couldn't find any users matching your search criteria.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-stone-50/80 transition-colors group relative">
                                    <td className="px-8 py-6">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-leaf-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="font-bold text-charcoal text-base">{user.full_name || 'Anonymous User'}</div>
                                        <div className="text-xs text-taupe mt-1.5">{user.email || 'No email'}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border",
                                            user.role === 'admin' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                                user.role === 'vendor' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                    "bg-stone-100 text-stone-700 border-stone-200"
                                        )}>
                                            {user.role === 'admin' && <ShieldAlert className="w-3.5 h-3.5" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-[11px] text-stone-500">
                                        {user.updated_at ? format(new Date(user.updated_at), "MMM d, yyyy h:mm a") : "Unknown"}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {updatingId === user.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-stone-400 mr-4" />
                                            ) : (
                                                <>
                                                    {user.role !== 'admin' && (
                                                        <button
                                                            onClick={() => handleUpdateRole(user.id, 'admin')}
                                                            className="px-3 py-1.5 bg-white text-purple-600 hover:bg-purple-50 border border-stone-200 hover:border-purple-200 rounded-lg text-xs font-bold transition-all shadow-sm"
                                                        >
                                                            Make Admin
                                                        </button>
                                                    )}
                                                    {user.role !== 'vendor' && (
                                                        <button
                                                            onClick={() => handleUpdateRole(user.id, 'vendor')}
                                                            className="px-3 py-1.5 bg-white text-emerald-600 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-200 rounded-lg text-xs font-bold transition-all shadow-sm"
                                                        >
                                                            Make Vendor
                                                        </button>
                                                    )}
                                                    {user.role !== 'client' && (
                                                        <button
                                                            onClick={() => handleUpdateRole(user.id, 'client')}
                                                            className="px-3 py-1.5 bg-white text-stone-600 hover:bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-lg text-xs font-bold transition-all shadow-sm"
                                                        >
                                                            Make Client
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
