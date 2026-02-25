"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CTA() {
    return (
        <section className="relative py-32 bg-charcoal overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-leaf-500/10 rounded-full filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-taupe/20 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight">
                        Ready to orchestrate <br />
                        <span className="italic text-gold-leaf-500">perfection?</span>
                    </h2>
                    <p className="text-xl text-stone-300 max-w-2xl mx-auto mb-12 font-sans leading-relaxed">
                        Join thousands of couples and planners who have elevated their event experience from stressful to seamless.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="bg-gold-leaf-500 text-white hover:bg-gold-leaf-600 transition-colors h-14 px-10 rounded-full font-bold uppercase tracking-wider text-sm flex items-center gap-2 shadow-xl shadow-gold-leaf-500/20"
                        >
                            Start Planning Free <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                        <Link
                            href="/vendors"
                            className="h-14 px-10 rounded-full font-bold uppercase tracking-wider text-sm flex items-center gap-2 text-white border border-white/20 hover:bg-white/10 transition-colors"
                        >
                            Explore Vendors
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
