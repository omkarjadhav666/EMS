import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Presentation, Quote, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { VendorBookingButton } from "@/components/vendors/VendorBookingButton";

export default async function VendorPublicProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch the vendor details
    const { data: vendor, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !vendor) {
        notFound();
    }

    return (
        <div className="bg-alabaster min-h-screen pb-20">
            {/* Immersive Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                {vendor.image_url ? (
                    <Image
                        src={vendor.image_url}
                        alt={`${vendor.name} showcase`}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    // Fallback luxury pattern
                    <div className="absolute inset-0 bg-stone-900 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                        <Presentation className="w-32 h-32 text-stone-800" />
                    </div>
                )}

                {/* Heavy gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />

                {/* Navigation Back */}
                <div className="absolute top-8 left-8 z-20">
                    <Link href="/vendors" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 lg:px-24 xl:px-32 z-10">
                    <div className="animate-fade-in-up">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
                            {vendor.category}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight mb-4 drop-shadow-md">
                            {vendor.name}
                        </h1>
                        <div className="flex items-center gap-6 text-stone-200 text-lg">
                            <span className="flex items-center gap-2 font-medium">
                                <MapPin className="w-5 h-5 text-gold-leaf-400" />
                                {vendor.location}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Split Content Area */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-16 pb-16">
                <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 relative">

                    {/* Left Column - Description */}
                    <div className="flex-1 space-y-16 animate-fade-in-up" style={{ animationDelay: '200ms' }}>

                        {/* About Section */}
                        <section className="space-y-6">
                            <h2 className="text-4xl font-serif text-charcoal flex items-center gap-4">
                                <div className="w-1.5 h-8 bg-gold-leaf-500 rounded-full" />
                                Overview
                            </h2>
                            <div className="prose prose-stone prose-lg max-w-none text-stone-600 leading-relaxed font-sans">
                                {vendor.description ? (
                                    <p>{vendor.description}</p>
                                ) : (
                                    <p className="italic text-stone-400">No detailed description provided by the vendor.</p>
                                )}
                            </div>
                        </section>

                        <hr className="border-stone-200" />

                        {/* Glamoora Guarantee Section (Static placeholder to add luxury feel) */}
                        <section className="bg-charcoal text-white rounded-3xl p-10 md:p-12 relative overflow-hidden shadow-2xl shadow-charcoal/10">
                            <Quote className="absolute -top-6 -right-6 w-48 h-48 text-white/5 rotate-12" />
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-2xl font-serif text-gold-leaf-400">The Glamoora Standard</h3>
                                <p className="text-stone-300 leading-relaxed max-w-2xl">
                                    Every vendor in our marketplace is carefully vetted to ensure they meet the supreme standards your event deserves. Expect nothing less than exceptional service and attention to detail.
                                </p>
                            </div>
                        </section>

                    </div>

                    {/* Right Column - Booking Actions */}
                    <div className="w-full lg:w-[400px] xl:w-[450px] animate-fade-in-up md:relative" style={{ animationDelay: '400ms' }}>
                        {/* Pass the server-fetched vendor to the client component */}
                        <VendorBookingButton vendor={vendor} />
                    </div>

                </div>
            </div>
        </div>
    );
}
