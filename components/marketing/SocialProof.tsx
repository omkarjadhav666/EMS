"use client";

import { motion } from "framer-motion";

const brands = [
    "Vogue Weddings",
    "Harper's BAZAAR",
    "Condé Nast",
    "Martha Stewart",
    "The Knot",
    "Brides",
    "Over The Moon"
];

export function SocialProof() {
    return (
        <div className="py-12 bg-white border-y border-stone-100 overflow-hidden relative">

            {/* Gradient Mask for fading edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
                <p className="text-center text-xs font-bold text-stone-400 uppercase tracking-widest mb-8">
                    Trusted by planners featured in
                </p>

                {/* Continuous Ticker */}
                <div className="flex gap-16 md:gap-24 items-center justify-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <motion.div
                        animate={{ x: [0, -1000] }}
                        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                        className="flex gap-16 md:gap-24 items-center whitespace-nowrap"
                    >
                        {/* Render array twice for seamless loop effect */}
                        {[...brands, ...brands, ...brands].map((brand, i) => (
                            <span key={i} className="font-serif text-xl md:text-2xl text-charcoal font-bold tracking-tight">
                                {brand}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
