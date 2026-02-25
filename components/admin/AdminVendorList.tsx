'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Store, Search, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface VendorWithDetails {
    id: string;
    name: string;
    category: string;
    status: string;
    created_at: string;
    owner_id: string;
    profiles?: {
        full_name: string;
        email: string;
    };
}

export function AdminVendorList() {
    const [vendors, setVendors] = useState<VendorWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const supabase = createClient();

    const fetchVendors = async () => {
        setIsLoading(true);
        try {
            // Fetch vendors and join with profiles to get the owner's name
            const { data, error } = await supabase
                .from('vendors')
                .select(`
                    id, name, category, status, created_at, owner_id,
                    profiles ( full_name, email )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching vendors:", error);
            } else if (data) {
                setVendors(data as any);
            }
        } catch (err) {
            console.error("Unexpected error fetching vendors:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleUpdateStatus = async (vendorId: string, newStatus: string) => {
        setUpdatingId(vendorId);
        try {
            const { error } = await supabase
                .from('vendors')
                .update({ status: newStatus })
                .eq('id', vendorId);

            if (error) throw error;

            // Re-fetch to guarantee sync, or update locally
            setVendors(vendors.map(v => v.id === vendorId ? { ...v, status: newStatus } : v));
        } catch (error) {
            console.error("Failed to update vendor status:", error);
            alert("Failed to update vendor status. Check console for details.");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredVendors = vendors.filter(v =>
        v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <Store className="w-6 h-6 text-gold-leaf-500" />
                        Vendor Approvals
                    </h3>
                    <p className="text-sm text-taupe mt-1">Review and manage new vendor applications.</p>
                </div>

                <div className="relative max-w-sm w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-stone-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search vendors or owners..."
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
                            <th className="px-8 py-4">Vendor Details</th>
                            <th className="px-8 py-4">Owner</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100/50 bg-white/40">
                        {filteredVendors.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-16 text-center">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <Search className="w-6 h-6 sm:w-8 sm:h-8 text-stone-300" />
                                    </div>
                                    <p className="font-serif text-xl sm:text-2xl text-charcoal mb-2 sm:mb-3">No vendors found</p>
                                    <p className="text-sm sm:text-base text-taupe max-w-sm mx-auto">We couldn't find any vendor applications matching your search criteria.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-stone-50/80 transition-colors group relative">
                                    <td className="px-8 py-6">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-leaf-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="font-bold text-charcoal text-base">{vendor.name}</div>
                                        <div className="text-xs font-medium text-taupe uppercase tracking-wider mt-1.5">
                                            {vendor.category}
                                        </div>
                                        <div className="text-[11px] text-stone-400 mt-1">
                                            Applied {vendor.created_at ? format(new Date(vendor.created_at), "MMM d, yyyy") : "Unknown date"}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-semibold text-charcoal">{vendor.profiles?.full_name || 'Unknown User'}</div>
                                        <div className="text-xs text-taupe mt-0.5">{vendor.profiles?.email || 'No email'}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border",
                                            vendor.status === 'approved' ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-[0_2px_10px_rgba(16,185,129,0.1)]" :
                                                vendor.status === 'rejected' ? "bg-red-50 text-red-700 border-red-200 shadow-[0_2px_10px_rgba(239,68,68,0.1)]" :
                                                    "bg-amber-50 text-amber-700 border-amber-200 shadow-[0_2px_10px_rgba(245,158,11,0.1)]"
                                        )}>
                                            {vendor.status === 'approved' && <CheckCircle className="w-3.5 h-3.5" />}
                                            {vendor.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                                            {vendor.status === 'pending' && <AlertCircle className="w-3.5 h-3.5" />}
                                            <span>{vendor.status || 'pending'}</span>
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            {updatingId === vendor.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-stone-400 mr-4" />
                                            ) : (
                                                <>
                                                    {vendor.status !== 'approved' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(vendor.id, 'approved')}
                                                            className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white border border-emerald-200 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-300 shadow-sm hover:shadow-md"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    {vendor.status !== 'rejected' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(vendor.id, 'rejected')}
                                                            className="px-4 py-2 bg-white text-red-600 hover:bg-red-50 border border-stone-200 hover:border-red-200 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-300 shadow-sm hover:shadow-md"
                                                        >
                                                            Reject
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
