"use client";

import { CheckCircle2, IndianRupee, LayoutTemplate, Users, Calendar, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const showcaseFeatures = [
    {
        title: "Intelligent Budgeting",
        subtitle: "Visual finance tracking",
        description: "Real-time tracking that warns you before you overspend. Visual charts make finance beautiful. Say goodbye to messy spreadsheets and hello to elegant financial control.",
        icon: IndianRupee,
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
        reversed: false
    },
    {
        title: "Premium Vendor Discovery",
        subtitle: "Curated excellence",
        description: "Discover, hire, and manage top-tier vendors all in one centralized premium dashboard. From florists to photographers, find the perfect match for your aesthetic.",
        icon: Users,
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop",
        reversed: true
    },
    {
        title: "Seamless RSVP Tracking",
        subtitle: "Guest management simplified",
        description: "Send beautiful invitations and track RSVPs in real-time. Manage dietary restrictions, plus-ones, and seating charts with absolute grace.",
        icon: Calendar,
        image: "https://images.unsplash.com/photo-1505365063097-f131a19615a1?q=80&w=2070&auto=format&fit=crop",
        reversed: false
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 lg:py-32 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24 lg:mb-32"
                >
                    <p className="text-gold-leaf-600 font-bold uppercase tracking-widest text-xs mb-3">
                        The Glamoora Experience
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal mb-6 tracking-tight">
                        Everything you need, <br className="hidden md:block" />
                        <span className="italic text-taupe">executed flawlessly.</span>
                    </h2>
                </motion.div>

                <div className="space-y-24 lg:space-y-40">
                    {showcaseFeatures.map((feature, idx) => (
                        <div key={idx} className={`flex flex-col gap-12 lg:gap-24 items-center ${feature.reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>

                            {/* Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: feature.reversed ? 40 : -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="flex-1 lg:max-w-xl"
                            >
                                <div className="w-16 h-16 bg-alabaster rounded-2xl flex items-center justify-center mb-8 border border-stone-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gold-leaf-100 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                    <feature.icon className="w-8 h-8 text-gold-leaf-500 relative z-10" />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-2">{feature.subtitle}</h3>
                                <h4 className="text-3xl md:text-4xl font-serif text-charcoal mb-6">{feature.title}</h4>
                                <p className="text-lg text-taupe leading-relaxed font-sans">{feature.description}</p>
                            </motion.div>

                            {/* Image Showcase */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="flex-1 w-full relative"
                            >
                                <div className="aspect-[4/3] relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-charcoal/10 mix-blend-multiply"></div>
                                </div>

                                {/* Decorative Blur */}
                                <div className={`absolute top-1/2 -z-10 w-full h-full bg-gold-leaf-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 ${feature.reversed ? 'right-0 translate-x-1/4' : 'left-0 -translate-x-1/4'}`}></div>
                            </motion.div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
