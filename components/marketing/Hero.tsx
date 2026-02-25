"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
    return (
        <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-alabaster">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-leaf-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

                    {/* Left Column: Content */}
                    <div className="text-center lg:text-left">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-leaf-500/10 border border-gold-leaf-500/20 text-gold-leaf-600 text-xs font-bold tracking-widest uppercase mb-8"
                        >
                            <Sparkles className="w-3 h-3" />
                            <span>The New Standard</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-5xl sm:text-6xl md:text-7xl font-serif text-charcoal mb-6 leading-[1.1] tracking-tight"
                        >
                            Crafting elegance, <br />
                            <span className="italic text-gold-leaf-500">mastering details.</span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="mt-4 text-xl text-taupe font-sans leading-relaxed max-w-xl mx-auto lg:mx-0"
                        >
                            The intelligent, beautifully designed platform that guides you from chaos to celebration. We bring the luxury of a private planner into your hands.
                        </motion.p>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                        >
                            <Link href="/register" className="btn-primary flex items-center gap-2 h-14 px-8 text-base">
                                Start Planning Free <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                            <Link href="#demo" className="flex items-center gap-3 px-8 h-14 bg-transparent text-charcoal rounded-full font-sans font-semibold tracking-wide hover:bg-stone-200/50 transition-all border border-transparent hover:border-stone-200">
                                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gold-leaf-500">
                                    <Play className="w-3 h-3 translate-x-[1px]" />
                                </div>
                                See it in Action
                            </Link>
                        </motion.div>

                        {/* Trust Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                            className="mt-12 flex items-center justify-center lg:justify-start gap-4 text-sm font-semibold text-stone-400 uppercase tracking-widest"
                        >
                            <div className="flex -space-x-3">
                                {[
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
                                ].map((url, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-alabaster bg-stone-200 overflow-hidden relative">
                                        <Image src={url} alt="User avatar" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                            <span>Loved by 10,000+ Couples</span>
                        </motion.div>
                    </div>

                    {/* Right Column: Image Composition */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.2 }}
                        className="relative block mt-16 lg:mt-0 w-full max-w-md mx-auto lg:max-w-full"
                    >
                        {/* Main Image */}
                        <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-2xl border border-white/40 group">
                            <Image
                                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
                                alt="Elegant Wedding Table Setting"
                                fill
                                priority
                                className="object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                        </div>

                        {/* Floating Glass Card (Top Right) */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                            className="absolute -top-4 -right-2 sm:-top-8 sm:-right-8 bg-white/90 sm:bg-white/80 backdrop-blur-xl p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-xl border border-white flex items-center gap-3 sm:gap-4 z-20 w-48 sm:w-64"
                        >
                            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider mb-0.5 sm:mb-1">Status</p>
                                <p className="text-sm sm:text-base text-charcoal font-serif font-bold leading-tight">Venue Secured</p>
                            </div>
                        </motion.div>

                        {/* Floating Glass Card (Bottom Left) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.8 }}
                            className="absolute -bottom-6 -left-2 sm:-bottom-12 sm:-left-12 bg-charcoal text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 z-20 w-64 sm:w-72"
                        >
                            <h4 className="font-serif text-gold-leaf-400 mb-2">RSVP Tracker</h4>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-3xl font-light">142</p>
                                    <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Attending</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-light text-stone-400">150</p>
                                    <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Invited</p>
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full h-1.5 bg-stone-700/50 rounded-full mt-4 overflow-hidden">
                                <div className="h-full bg-gold-leaf-500 w-[95%]"></div>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
