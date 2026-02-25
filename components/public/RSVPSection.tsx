"use client";

import { motion } from "framer-motion";
import { RSVPForm } from "@/components/events/RSVPForm";

interface RSVPSectionProps {
    eventId: string;
    date?: string;
}

export function RSVPSection({ eventId, date }: RSVPSectionProps) {
    return (
        <section id="rsvp" className="py-12 md:py-16 relative overflow-hidden">
            <div className="max-w-xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-transparent p-0 relative"
                >
                    {/* Theme Border Effect - Double border for Classic, Dashed for Rustic */}
                    {/* Removed inner border effect since we are inside a card now */}

                    <div className="text-center mb-10">
                        <span className="text-[var(--theme-accent)] uppercase tracking-[0.2em] text-xs font-bold block mb-3">
                            Kindly Respond
                        </span>
                        <h2 className="text-4xl md:text-5xl font-[family-name:var(--theme-font-heading)] text-[var(--theme-text-primary)] mb-4">
                            Join Us
                        </h2>
                        <p className="text-[var(--theme-text-muted)] font-light">
                            We would be honored by your presence.
                        </p>
                    </div>

                    <div className="bg-[var(--theme-bg-content)]/50 rounded-[var(--theme-radius)] p-6 md:p-8 border border-[var(--theme-border-color)] shadow-inner">
                        <div className="theme-light-override">
                            <RSVPForm eventId={eventId} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
