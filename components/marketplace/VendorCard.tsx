import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { getVendorImage, getVendorLocation } from "@/lib/utils/vendorImage";

export interface Vendor {
    id: string;
    name: string;
    category: string;
    description: string;
    price_range: string;
    location: string;
    rating: number;
    tags: string[];
    image_url: string;
}

interface VendorCardProps {
    vendor: Vendor;
    onBook: (vendor: Vendor) => void;
}

export function VendorCard({ vendor, onBook }: VendorCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group relative bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-white transition-all duration-500 flex flex-col h-full"
        >
            <div className="relative h-60 w-full overflow-hidden">
                <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full h-full relative"
                >
                    <Image
                        src={getVendorImage(vendor) || "/images/vendors/oberoi.png"}
                        alt={vendor.name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-60" />
                </motion.div>

                <div className="absolute top-4 left-4">
                    <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 hover:bg-white/30 transition-colors font-medium tracking-wide">
                        {vendor.category}
                    </Badge>
                </div>

                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Star className="w-3.5 h-3.5 text-gold-leaf-500 fill-gold-leaf-500" />
                    <span className="font-bold text-charcoal text-sm">{vendor.rating}</span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1 relative bg-gradient-to-b from-white to-stone-50/50">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-serif text-2xl text-charcoal group-hover:text-gold-leaf-600 transition-colors">{vendor.name}</h3>
                        <div className="flex items-center text-taupe text-sm mt-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
                            {getVendorLocation(vendor)}
                        </div>
                    </div>
                </div>

                <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
                    {vendor.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-0.5">Starting at</span>
                        <span className="text-lg text-charcoal font-serif">{vendor.price_range}</span>
                    </div>

                    <Button
                        onClick={() => onBook(vendor)}
                        className="bg-charcoal hover:bg-gold-leaf-600 text-white rounded-full px-6 py-5 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        Request Quote
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

