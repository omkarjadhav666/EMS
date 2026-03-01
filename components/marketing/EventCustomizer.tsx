"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    GlassWater,
    Cake,
    Briefcase,
    Heart,
    Palmtree,
    Users,
    Sparkles,
    Crown,
    Moon,
    Sun,
    ArrowRight,
    RefreshCcw,
    PartyPopper,
    Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Data structures
const EVENT_TYPES = [
    { id: "wedding", label: "Wedding", icon: Heart },
    { id: "birthday", label: "Birthday", icon: Cake },
    { id: "corporate", label: "Corporate", icon: Briefcase },
];

const SUB_TYPES: Record<string, { id: string; label: string; icon: any }[]> = {
    wedding: [
        { id: "beach", label: "Beach", icon: Palmtree },
        { id: "hall", label: "Hall", icon: Building2 },
        { id: "intimate", label: "Intimate", icon: Heart },
    ],
    birthday: [
        { id: "milestone", label: "Milestone", icon: Crown },
        { id: "theme_party", label: "Theme Party", icon: Sparkles },
        { id: "surprise", label: "Surprise", icon: PartyPopper },
    ],
    corporate: [
        { id: "seminar", label: "Seminar", icon: Users },
        { id: "gala", label: "Gala", icon: Sparkles },
        { id: "retreat", label: "Retreat", icon: Palmtree },
    ],
};

const MOODS = [
    { id: "royal", label: "Royal", icon: Crown, desc: "Opulent & Grand" },
    { id: "minimal", label: "Minimal", icon: Moon, desc: "Sleek & Modern" },
    { id: "traditional", label: "Traditional", icon: Sun, desc: "Classic & Timeless" },
];

export function EventCustomizer() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selections, setSelections] = useState({
        type: "",
        subType: "",
        mood: "",
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSelect = (key: string, value: string) => {
        const newSelections = { ...selections, [key]: value };
        setSelections(newSelections);

        if (step < 3) {
            setTimeout(() => setStep(step + 1), 300); // Slight delay for selection animation
        } else {
            // Final step
            handleGenerate(newSelections);
        }
    };

    const handleGenerate = (finalSelections: any) => {
        setIsGenerating(true);
        // Simulate generation delay
        setTimeout(() => {
            const params = new URLSearchParams(finalSelections);
            router.push(`/register?${params.toString()}`);
        }, 2500);
    };

    const reset = () => {
        setStep(1);
        setSelections({ type: "", subType: "", mood: "" });
    };

    const currentSubTypes = selections.type ? SUB_TYPES[selections.type] : [];

    return (
        <div className="mt-10 lg:mt-12 w-full max-w-xl mx-auto lg:mx-0">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/80 relative overflow-hidden min-h-[300px] flex flex-col justify-center transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] group">

                {/* Progress indicator */}
                {!isGenerating && step <= 3 && (
                    <div className="absolute top-6 left-8 flex items-center gap-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 rounded-full transition-all duration-500 ${s === step ? "w-8 bg-gold-leaf-500" : s < step ? "w-4 bg-gold-leaf-300" : "w-4 bg-stone-200"
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Reset Button */}
                {step > 1 && !isGenerating && (
                    <button
                        onClick={reset}
                        className="absolute top-4 right-6 text-stone-400 hover:text-charcoal transition-colors p-2 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Start Over"
                    >
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                )}

                <div className="relative z-0 min-h-[220px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: EVENT TYPE */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="mt-2 text-center lg:text-left">
                                    <h3 className="text-2xl font-serif text-charcoal">What are we celebrating?</h3>
                                    <p className="text-sm text-stone-500 mt-1">Select an event type to begin.</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {EVENT_TYPES.map((type) => {
                                        const Icon = type.icon;
                                        const isSelected = selections.type === type.id;
                                        return (
                                            <button
                                                key={type.id}
                                                onClick={() => handleSelect("type", type.id)}
                                                className={`group/btn flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${isSelected
                                                        ? "bg-gold-leaf-50 border-gold-leaf-500 text-gold-leaf-700 shadow-md transform scale-[1.02]"
                                                        : "bg-white/80 border-stone-100 text-taupe hover:border-gold-leaf-300 hover:shadow-sm hover:-translate-y-1 hover:bg-white"
                                                    }`}
                                            >
                                                <Icon className={`w-8 h-8 mb-3 transition-colors duration-300 ${isSelected ? "text-gold-leaf-500" : "text-stone-400 group-hover/btn:text-gold-leaf-400"}`} />
                                                <span className={`font-medium text-sm transition-colors duration-300 ${isSelected ? "text-gold-leaf-700" : "group-hover/btn:text-charcoal"}`}>{type.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: SUB-TYPE */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="mt-2 text-center lg:text-left">
                                    <h3 className="text-2xl font-serif text-charcoal">Choose the setting</h3>
                                    <p className="text-sm text-stone-500 mt-1">Where will the magic happen?</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {currentSubTypes.map((type) => {
                                        const Icon = type.icon;
                                        const isSelected = selections.subType === type.id;
                                        return (
                                            <button
                                                key={type.id}
                                                onClick={() => handleSelect("subType", type.id)}
                                                className={`group/btn flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${isSelected
                                                        ? "bg-gold-leaf-50 border-gold-leaf-500 text-gold-leaf-700 shadow-md transform scale-[1.02]"
                                                        : "bg-white/80 border-stone-100 text-taupe hover:border-gold-leaf-300 hover:shadow-sm hover:-translate-y-1 hover:bg-white"
                                                    }`}
                                            >
                                                <Icon className={`w-8 h-8 mb-3 transition-colors duration-300 ${isSelected ? "text-gold-leaf-500" : "text-stone-400 group-hover/btn:text-gold-leaf-400"}`} />
                                                <span className={`font-medium text-sm transition-colors duration-300 ${isSelected ? "text-gold-leaf-700" : "group-hover/btn:text-charcoal"}`}>{type.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: MOOD */}
                        {step === 3 && !isGenerating && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-4"
                            >
                                <div className="mt-2 text-center lg:text-left">
                                    <h3 className="text-2xl font-serif text-charcoal">Set the perfect mood</h3>
                                    <p className="text-sm text-stone-500 mt-1">Select the aesthetic for your event.</p>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {MOODS.map((mood) => {
                                        const Icon = mood.icon;
                                        const isSelected = selections.mood === mood.id;
                                        return (
                                            <button
                                                key={mood.id}
                                                onClick={() => handleSelect("mood", mood.id)}
                                                className={`group/btn flex items-center p-4 rounded-2xl border transition-all duration-300 ${isSelected
                                                        ? "bg-gold-leaf-50 border-gold-leaf-500 text-gold-leaf-700 shadow-md"
                                                        : "bg-white/80 border-stone-100 text-taupe hover:border-gold-leaf-300 hover:shadow-sm hover:-translate-y-1 hover:bg-white"
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors duration-300 ${isSelected ? "bg-gold-leaf-100" : "bg-stone-50 group-hover/btn:bg-stone-100"}`}>
                                                    <Icon className={`w-6 h-6 transition-colors duration-300 ${isSelected ? "text-gold-leaf-600" : "text-stone-400 group-hover/btn:text-gold-leaf-500"}`} />
                                                </div>
                                                <div className="text-left flex-1">
                                                    <span className={`block font-semibold text-base transition-colors duration-300 ${isSelected ? "text-gold-leaf-800" : "text-charcoal"}`}>{mood.label}</span>
                                                    <span className="block text-sm text-stone-500">{mood.desc}</span>
                                                </div>
                                                <ArrowRight className={`w-5 h-5 transition-all duration-300 ${isSelected ? "text-gold-leaf-500 translate-x-1" : "text-stone-300 group-hover/btn:text-gold-leaf-400 group-hover/btn:translate-x-1"}`} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* GENERATING STATE */}
                        {isGenerating && (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center justify-center text-center py-8"
                            >
                                <div className="relative w-20 h-20 mb-6">
                                    {/* Outer spinning ring */}
                                    <motion.div
                                        className="absolute inset-0 border-[3px] border-gold-leaf-200 rounded-full border-t-gold-leaf-500 border-r-gold-leaf-500"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />
                                    {/* Inner spinning ring (opposite direction) */}
                                    <motion.div
                                        className="absolute inset-2 border-[3px] border-stone-200 rounded-full border-b-gold-leaf-400 border-l-gold-leaf-400"
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                    {/* Center icon */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-gold-leaf-500 animate-pulse" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-serif text-charcoal mb-2">Curating your vision...</h3>
                                <p className="text-stone-500">
                                    Preparing a personalized <span className="font-semibold text-charcoal">{selections.mood}</span> <span className="font-semibold text-charcoal">{selections.subType}</span> {selections.type}.
                                </p>
                                <div className="mt-6 w-48 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-gold-leaf-400 to-gold-leaf-600 rounded-full"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2.5, ease: "easeInOut" }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
