"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { PublicEvent } from "@/types/public-event";
import { format } from "date-fns";
import { ArrowDown } from "lucide-react";
import { useRef, useState } from "react";

interface EventHeroProps {
    event: PublicEvent;
}

export function EventHero({ event }: EventHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [imageError, setImageError] = useState(false);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    const handleScrollDown = () => {
        const nextSection = document.getElementById('event-details');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const eventDate = new Date(event.date);

    const getIntroText = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'birthday':
                return 'The Birthday Celebration Of';
            case 'anniversary':
                return 'The Anniversary Celebration Of';
            case 'corporate':
                return 'Corporate Event';
            case 'party':
                return 'The Party Of';
            case 'wedding':
            default:
                return 'The Wedding Celebration Of';
        }
    };

    return (
        <div ref={containerRef} className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-[var(--theme-bg-primary)] flex items-center justify-center">
            {/* Parallax Background */}
            <motion.div
                style={{ y, scale, opacity }}
                className="absolute inset-0 z-0"
            >
                {event.cover_image && !imageError ? (
                    <img
                        src={event.cover_image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-[var(--theme-bg-secondary)]" />
                )}
                <div className="absolute inset-0 bg-black/20" /> {/* General dimming */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Theme Texture & Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-[var(--theme-pattern-opacity)] pointer-events-none mix-blend-overlay"
                    style={{ backgroundImage: 'var(--theme-bg-texture)' }}
                />
            </motion.div>

            {/* Content using mix-blend-mode for editorial feel */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 md:space-y-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                >
                    <div className="overflow-hidden">
                        <motion.p
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[var(--theme-accent)] uppercase tracking-[0.4em] text-xs md:text-sm font-medium mb-4"
                        >
                            {getIntroText(event.event_type || 'wedding')}
                        </motion.p>
                    </div>

                    <div className="overflow-hidden pb-4">
                        <motion.h1
                            initial={{ y: "110%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl md:text-8xl lg:text-9xl font-[family-name:var(--theme-font-heading)] text-white leading-[0.9] tracking-tight"
                        >
                            {event.title}
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-6 text-white/90 font-light tracking-widest text-sm uppercase"
                    >
                        <span>{eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                        <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
                        <span>{eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • {event.location?.split(',')[0]}</span>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                onClick={handleScrollDown}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors cursor-pointer flex flex-col items-center gap-2 group"
            >
                <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">Scroll</span>
                <ArrowDown className="w-5 h-5 animate-bounce-slow" />
            </motion.button>
        </div >
    );
}
