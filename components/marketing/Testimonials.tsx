"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        content: "Glamoora turned what I thought would be a year of stress into an absolute joy. The budgeting tool alone saved us from countless arguments. It felt like having a luxury planner in my pocket.",
        author: "Sarah & David",
        role: "Married September 2025",
        image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=200&auto=format&fit=crop"
    },
    {
        content: "As a professional planner, I've used clunky enterprise software for years. Switching to Glamoora allowed me to collaborate with my clients in a beautiful workspace that matches the luxury events we throw.",
        author: "Elena Rodriguez",
        role: "Premier Event Planner",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
    },
    {
        content: "The RSVP tracking and timeline features are a godsend. Everything flows so smoothly, from finding the perfect florist to tracking down that one uncle who forgot to RSVP.",
        author: "Marcus Chen",
        role: "Corporate Event Director",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop"
    }
];

export function Testimonials() {
    return (
        <section className="py-24 bg-soft-sand relative overflow-hidden">
            {/* Accent lines */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-leaf-200 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-gold-leaf-600 font-bold uppercase tracking-widest text-xs mb-3"
                    >
                        Testimonials
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-serif text-charcoal mb-6"
                    >
                        Success Stories
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 + (idx * 0.1) }}
                            className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <Quote className="absolute top-8 right-8 w-12 h-12 text-gold-leaf-100 group-hover:text-gold-leaf-200 transition-colors" />

                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-4 h-4 text-gold-leaf-400 fill-current" />
                                ))}
                            </div>

                            <p className="text-stone-600 font-sans leading-relaxed mb-8 relative z-10 text-lg">
                                "{t.content}"
                            </p>

                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-200 relative">
                                    <Image src={t.image} alt={t.author} fill className="object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-serif font-bold text-charcoal">{t.author}</h4>
                                    <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
