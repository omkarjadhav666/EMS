"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { VendorSidebar } from "./VendorSidebar";
import { AnimatePresence, motion } from "framer-motion";

interface VendorMobileNavProps {
    user: any;
}

export function VendorMobileNav({ user }: VendorMobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-taupe hover:text-charcoal bg-stone-100 rounded-md transition-colors"
                aria-label="Open mobile menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed inset-y-0 left-0 w-64 shadow-2xl z-50 flex flex-col overflow-hidden bg-white"
                        >
                            <div className="absolute top-4 right-4 z-50">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-taupe hover:text-charcoal bg-stone-100/50 rounded-full transition-colors"
                                    aria-label="Close mobile menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 w-full" onClick={() => setIsOpen(false)}>
                                <VendorSidebar user={user} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
