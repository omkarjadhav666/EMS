'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/marketplace/BookingModal";
import { Vendor } from "@/components/marketplace/VendorCard";
import { CalendarDays, Star } from "lucide-react";

interface VendorBookingButtonProps {
    vendor: Vendor;
}

export function VendorBookingButton({ vendor }: VendorBookingButtonProps) {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 md:p-8 sticky top-24 w-full">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-1">Starting At</p>
                        <p className="text-4xl font-serif text-charcoal">{vendor.price_range === '$$$$' ? '₹₹₹₹' : vendor.price_range === '$$$' ? '₹₹₹' : vendor.price_range === '$$' ? '₹₹' : '₹'}</p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-stone-600">
                        <Star className="w-5 h-5 text-gold-leaf-500 fill-gold-leaf-500" />
                        <span className="font-medium text-lg">{vendor.rating} <span className="text-stone-400 font-normal">/ 5 Rating</span></span>
                    </div>
                    {/* Add more highlights here if needed, like "Responds quickly", etc. */}
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={() => setIsBookingModalOpen(true)}
                        className="w-full bg-charcoal hover:bg-gold-leaf-600 text-white rounded-full py-6 text-lg font-medium shadow-xl shadow-charcoal/20 transition-all duration-300 group"
                    >
                        <CalendarDays className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Request Quote
                    </Button>
                    <p className="text-center text-xs text-stone-400">You won't be charged yet</p>
                </div>
            </div>

            <BookingModal
                vendor={vendor}
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
            />
        </>
    );
}
