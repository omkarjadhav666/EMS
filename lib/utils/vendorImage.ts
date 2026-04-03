export const VENDOR_IMAGES: Record<string, string> = {
  "Gourmet Bites Catering": "/images/vendors/gourmet.png",
  "Grand Oak Estate": "/images/vendors/oak.png",
  "Elegant Blooms": "/images/vendors/blooms.png",
  "Snap Memories Photography": "/images/vendors/snap.png",
  "DJ Pulse": "/images/vendors/pulse.png",
  "Rustic Barns": "/images/vendors/barns.png",
  
  // Backwards compatibility with alternative seed
  "Oberoi Udaivilas": "/images/vendors/oak.png",
  "Goa Beach Shacks": "/images/vendors/barns.png",
  "Spice Route Catering": "/images/vendors/gourmet.png",
  "Candid Tales": "/images/vendors/snap.png",
  "DJ NYK": "/images/vendors/pulse.png",
  "Ferns & Petals Decor": "/images/vendors/blooms.png"
};

export function getVendorImage(vendor: { id?: string; name?: string; image_url?: string | null }): string | null {
    if (!vendor) return null;
    
    // 1. If we have a custom generated realistic image for this vendor, use it
    if (vendor.name && VENDOR_IMAGES[vendor.name]) {
        return VENDOR_IMAGES[vendor.name];
    }
    
    // 2. If it has a valid explicitly working image URL (not broken unsplash)
    if (vendor.image_url && !vendor.image_url.includes("images.unsplash.com")) {
        return vendor.image_url;
    }
    
    // 3. Ultimate fallback (so there are never broken images)
    if (vendor.id) {
        return `https://picsum.photos/seed/${vendor.id}/800/600`;
    }
    
    return null;
}

export const VENDOR_LOCATIONS: Record<string, string> = {
  "San Francisco, CA": "Mumbai, MH",
  "Napa Valley, CA": "Udaipur, Rajasthan",
  "Chicago, IL": "Delhi, NCR",
  "New York, NY": "Bangalore, KA",
  "Los Angeles, CA": "Goa",
  "Austin, TX": "Jaipur, Rajasthan"
};

export function getVendorLocation(vendor: { location?: string | null }): string {
    if (!vendor || !vendor.location) return "Location Flexible";
    
    // Convert western placeholders to Indian venues
    if (VENDOR_LOCATIONS[vendor.location]) {
        return VENDOR_LOCATIONS[vendor.location];
    }
    
    return vendor.location;
}
