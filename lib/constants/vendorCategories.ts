import {
    Building2,
    UtensilsCrossed,
    Camera,
    Music,
    Palette,
    Car,
    Sparkles,
    ClipboardList,
    Shirt,
    Gift,
    Plane,
    Videotape
} from "lucide-react";

export interface VendorCategory {
    id: string;
    label: string;
    icon: any; // LucideIcon type roughly
    description: string;
}

export const VENDOR_CATEGORIES: VendorCategory[] = [
    {
        id: "Venue",
        label: "Venues & Locations",
        icon: Building2,
        description: "Banquet halls, resorts, open grounds, beaches, and destination properties."
    },
    {
        id: "Catering",
        label: "Catering & Food",
        icon: UtensilsCrossed,
        description: "Live counters, authentic cuisines, wedding feasts, and bar setups."
    },
    {
        id: "Photography",
        label: "Photography",
        icon: Camera,
        description: "Candid, traditional portraits, drone shoots, and pre-wedding coverage."
    },
    {
        id: "Videography",
        label: "Videography & Streaming",
        icon: Videotape, // Using a standard icon
        description: "Cinematic videos, live streaming, and traditional videography."
    },
    {
        id: "Decor",
        label: "Decoration & Setup",
        icon: Palette,
        description: "Floral themes, mandap setup, lighting, and custom entrance designs."
    },
    {
        id: "Entertainment",
        label: "Music & Entertainment",
        icon: Music,
        description: "DJs, live bands, traditional dancers (Kathakali, Theyyam), and MCs."
    },
    {
        id: "Transport",
        label: "Logistics & Transport",
        icon: Car,
        description: "Vintage cars, guest buses, vanity vans, and airport transfers."
    },
    {
        id: "Makeup",
        label: "Makeup & Styling",
        icon: Sparkles,
        description: "Bridal makeup, hairstyling, mehndi artists, and family styling."
    },
    {
        id: "Planning",
        label: "Event Planners",
        icon: ClipboardList,
        description: "Full-service planners, day-of coordinators, and specialized consultants."
    },
    {
        id: "Attire",
        label: "Clothing & Jewellery",
        icon: Shirt,
        description: "Designer wear, rental outfits, and bridal/groom jewelry."
    },
    {
        id: "Gifts",
        label: "Gifts & Favors",
        icon: Gift,
        description: "Return gifts, custom invitations, trousseau packing, and wedding stationery."
    },
    {
        id: "Travel",
        label: "Travel & Accommodation",
        icon: Plane,
        description: "Honeymoon packages, guest hotel bookings, and flights."
    }
];

// Helper to get category details
export const getCategoryDetails = (categoryId: string) => {
    return VENDOR_CATEGORIES.find(c => c.id.toLowerCase() === categoryId.toLowerCase()) || VENDOR_CATEGORIES[0]; // Fallback to Venue
};
