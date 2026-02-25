"use client";

import { TimelineItem } from "@/types/public-event";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface EventTimelineProps {
    items: TimelineItem[];
}

export function EventTimeline({ items }: EventTimelineProps) {
    if (!items || items.length === 0) return null;

    const sortedItems = [...items].sort((a, b) => {
        return (a.order_index || 0) - (b.order_index || 0);
    });

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            {/* Background Pattern - Optional, maybe keep subtle or remove if card texture is enough */}
            <div className="absolute inset-0 opacity-[var(--theme-pattern-opacity)] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(var(--theme-text-muted) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block p-px bg-gradient-to-r from-transparent via-[var(--theme-accent)] to-transparent"
                    >
                        <div className="px-4 py-1.5 bg-[var(--theme-bg-content)] text-[var(--theme-accent)] uppercase tracking-widest text-xs font-bold rounded-[var(--theme-radius)]">
                            The Sequence
                        </div>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl font-[family-name:var(--theme-font-heading)] text-[var(--theme-text-primary)]"
                    >
                        Order of Events
                    </motion.h2>
                </div>

                <div className="relative">
                    {/* Continuous Line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--theme-accent)] to-transparent -translate-x-1/2 md:block opacity-30" />

                    <div className="space-y-12">
                        {sortedItems.map((item, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={item.id} className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                                    {/* Timeline Marker */}
                                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-0 z-10">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            className="w-4 h-4 rounded-full bg-[var(--theme-bg-primary)] border-[3px] border-[var(--theme-accent)] shadow-[0_0_0_4px_var(--theme-bg-secondary)]"
                                        />
                                    </div>

                                    {/* Time Display */}
                                    <motion.div
                                        initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6 }}
                                        className={`w-full md:w-1/2 ${isEven ? 'md:text-left pl-16 py-1' : 'md:text-right pr-16 py-1'}`}
                                    >
                                        <div className="inline-block px-4 py-1 rounded-[var(--theme-radius)] border border-[var(--theme-border)] bg-[var(--theme-bg-content)] shadow-sm text-[var(--theme-accent)] font-medium text-sm md:text-base tracking-wide">
                                            {format(new Date(item.start_time), 'h:mm a')}
                                        </div>
                                    </motion.div>

                                    {/* Content Card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                        className={`w-full md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} pl-16 md:pl-0`}
                                    >
                                        <div className="group cursor-default">
                                            <h3 className="text-3xl font-[family-name:var(--theme-font-heading)] text-[var(--theme-text-primary)] mb-3 group-hover:text-[var(--theme-accent)] transition-colors duration-300">
                                                {item.title}
                                            </h3>
                                            {item.description && (
                                                <p className="text-[var(--theme-text-muted)] leading-relaxed text-base md:text-lg font-light">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
