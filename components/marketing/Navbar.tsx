"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/vendors", label: "Vendors" },
        { href: "/events", label: "Events" },
        { href: "/#features", label: "Features" },
        { href: "/login", label: "Log In" },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-alabaster/80 backdrop-blur-md border-b border-stone-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="font-serif text-2xl font-bold text-charcoal tracking-tight" onClick={() => setIsMobileMenuOpen(false)}>
                            Glam<span className="text-gold-leaf-500 italic">oora</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="text-sm font-sans text-taupe hover:text-charcoal transition-colors uppercase tracking-wider">
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/register"
                            className="btn-primary"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 -mr-2 text-taupe hover:text-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-gold-leaf-500 rounded-md"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-stone-200 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1 shadow-lg">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-4 text-base font-medium text-charcoal hover:bg-alabaster rounded-md transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 pb-2 border-t border-stone-100">
                                <Link
                                    href="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center btn-primary py-3"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
