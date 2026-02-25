export interface TaskTemplate {
    title: string;
    offset: number; // Days before event (negative) or after (positive)
}

export interface EventTemplate {
    label: string;
    subtypes: {
        id: string;
        label: string;
        description: string;
    }[];
    defaultTasks: TaskTemplate[];
    budgetDistribution: {
        [key: string]: number; // Category -> Percentage (0.0 to 1.0)
    };
}

export const EVENT_TEMPLATES: { [key: string]: EventTemplate } = {
    wedding: {
        label: "Wedding",
        subtypes: [
            { id: "banquet", label: "Banquet Hall", description: "Indoor, elegant, stage-centric" },
            { id: "beach", label: "Beach Wedding", description: "Open-air, seaside, floral mandap" },
            { id: "destination", label: "Destination", description: "Travel-heavy, multi-day celebration" },
            { id: "traditional", label: "Traditional", description: "Ritual-heavy, cultural themes" },
            { id: "court", label: "Court / Simple", description: "Budget-friendly, legal-focused" },
            { id: "theme", label: "Theme Wedding", description: "Royal, Vintage, Pastel, etc." }
        ],
        defaultTasks: [
            // Sakharpuda & Pre-Planning (6-12 Months Out)
            { title: "Determine Budget & Split (Groom/Bride Side)", offset: -365 },
            { title: "Draft Guest List (Approx. Count)", offset: -360 },
            { title: "Fix Wedding Date (Muhurat)", offset: -360 },
            { title: "Book Venue (Lagna & Reception)", offset: -350 },
            { title: "Sakharpuda (Engagement) Ceremony", offset: -300 },
            { title: "Purchase Sakharpuda Sarees/Gifts", offset: -310 },

            // Major Vendor Bookings (6-9 Months Out)
            { title: "Book Photographer & Videographer", offset: -270 },
            { title: "Book Caterer (Breakfast, Lunch, Dinner)", offset: -260 },
            { title: "Book Makeup Artist (Sakharpuda & Wedding)", offset: -250 },
            { title: "Book Decorator (Mandap, Gate, Stage)", offset: -240 },
            { title: "Book Guruji/Bhatji for all Rituals", offset: -230 },

            // Shopping & Attire (3-6 Months Out)
            { title: "Purchase Shalu/Paithani (Wedding Sarees)", offset: -180 },
            { title: "Purchase Groom's Sherwani/Kurta", offset: -180 },
            { title: "Select Jewelry (Gold, Mangalsutra)", offset: -170 },
            { title: "Book Hotel Rooms for Guests (Janvas)", offset: -150 },
            { title: "Order Wedding Invitations (Patrika)", offset: -140 },

            // Pre-Wedding Rituals (1-2 Months Out)
            { title: "Send Wedding Invitations", offset: -60 },
            { title: "Kelvan (Family Meals) Starts", offset: -45 },
            { title: "Book Karavli/Helpers", offset: -40 },
            { title: "Purchase Puja Samagri (List from Guruji)", offset: -30 },
            { title: "Buy Varmala (Garlands) & Flowers", offset: -20 },
            { title: "Vehicle Transport (Bus/Cars) Booking", offset: -30 },

            // Week of Wedding (The Chaos!)
            { title: "Haldi Ceremony Arrangements", offset: -3 },
            { title: "Mehndi Ceremony", offset: -2 },
            { title: "Sangeet / Padwa", offset: -2 },
            { title: "Seemant Pujan (Groom Welcome)", offset: -1 },
            { title: "Grahmak (Devkarya)", offset: -1 },

            // The Wedding Day (Lagna)
            { title: "Ganpati Pujan", offset: 0 },
            { title: "Punyavachan & Kanyadan", offset: 0 },
            { title: "Akshata Distribution", offset: 0 },
            { title: "Mangalashtakas & Antarpat", offset: 0 },
            { title: "Saptapadi (Seven Vows)", offset: 0 },
            { title: "Lunch Catering Management", offset: 0 },
            { title: "Reception (Evening)", offset: 0 },

            // Post-Wedding
            { title: "Varat (Procession) Planning", offset: 0 },
            { title: "Grihapravesh (Home Entry)", offset: 1 },
            { title: "Satyanarayan Puja", offset: 2 },
            { title: "Return Gifts Distribution", offset: 1 }
        ],
        budgetDistribution: {
            jewelry: 0.25,
            catering: 0.25,
            venue: 0.15,
            attire: 0.15,
            decor: 0.10,
            photography: 0.05,
            other: 0.05
        }
    },
    birthday: {
        label: "Birthday Party",
        subtypes: [
            { id: "kids", label: "Kids Birthday", description: "Magician, games, cartoon themes" },
            { id: "adult", label: "Adult Birthday", description: "Dinner, drinks, music" },
            { id: "milestone", label: "Milestone (1st, 50th)", description: "Grand hall, extensive guest list" }
        ],
        defaultTasks: [
            { title: "Book Venue/Banquet Hall", offset: -60 },
            { title: "Order Custom Cake", offset: -14 },
            { title: "Invite Guests (WhatsApp/Printed Cards)", offset: -30 },
            { title: "Book Magician/Tatoo Artist", offset: -45 },
            { title: "Decide Return Gifts", offset: -20 },
            { title: "Purchase Return Gifts", offset: -7 },
            { title: "Book Photographer", offset: -15 }
        ],
        budgetDistribution: {
            catering: 0.35,
            venue: 0.20,
            decor: 0.20,
            entertainment: 0.15,
            gifts: 0.10
        }
    },
    corporate: {
        label: "Corporate Event",
        subtypes: [
            { id: "conference", label: "Conference", description: "Professional, AV-heavy, networking" },
            { id: "launch", label: "Product Launch", description: "Brand-focused, media presence" },
            { id: "party", label: "Office Party", description: "Casual, team-bonding, food-focused" },
            { id: "retreat", label: "Team Retreat", description: "Offsite, activities, accommodation" }
        ],
        defaultTasks: [
            { title: "Define Agenda & Speakers", offset: -120 },
            { title: "Book Venue with AV Support", offset: -90 },
            { title: "Arrange Catering (Coffee/Lunch)", offset: -60 },
            { title: "Design & Print Badges/Banners", offset: -30 },
            { title: "Send Calendar Invites", offset: -45 },
            { title: "Prepare Presentation Materials", offset: -14 }
        ],
        budgetDistribution: {
            venue: 0.40,
            catering: 0.25,
            marketing: 0.15,
            technology: 0.15,
            other: 0.05
        }
    },
    baby_shower: {
        label: "Baby Shower / Dohale Jevan",
        subtypes: [
            { id: "traditional", label: "Dohale Jevan (Maharashtrian)", description: "Lotus/Boat/Swing set, Otibharan" },
            { id: "modern", label: "Modern Baby Shower", description: "Games, cake cutting, themed decor" },
            { id: "religious", label: "Godh Bharai", description: "Pujas, heavy rituals, family focus" }
        ],
        defaultTasks: [
            { title: "Fix Date & Muhurat", offset: -60 },
            { title: "Book Venue/Hall", offset: -60 },
            { title: "Purchase Oti (Saree/Rice/Coconut)", offset: -14 },
            { title: "Select Theme (Moon/Lotus/Swing)", offset: -30 },
            { title: "Order Flower Jewellery", offset: -10 },
            { title: "Book Photographer", offset: -45 },
            { title: "Finalize Menu (Favorites of Mom-to-be)", offset: -20 }
        ],
        budgetDistribution: {
            catering: 0.30,
            decor: 0.25,
            attire: 0.20,
            gifts: 0.15,
            venue: 0.10
        }
    },
    social: {
        label: "Cultural / Social",
        subtypes: [
            { id: "festival", label: "Festival Celebration", description: "Diwali, Eid, Christmas gatherings" },
            { id: "community", label: "Community Meetup", description: "Networking, food stalls" },
            { id: "reunion", label: "Reunion", description: "School/College alumni meet" }
        ],
        defaultTasks: [
            { title: "Secure Permission/Venue", offset: -60 },
            { title: "Arrange Sound System", offset: -14 },
            { title: "Coordinate Potluck/Catering", offset: -7 },
            { title: "Volunteer Management", offset: -30 },
            { title: "Cleanup Plan", offset: -3 }
        ],
        budgetDistribution: {
            catering: 0.40,
            venue: 0.20,
            logistics: 0.20,
            decor: 0.10,
            other: 0.10
        }
    },
    engagement: {
        label: "Engagement / Anniversary",
        subtypes: [
            { id: "ring", label: "Ring Ceremony", description: "Formal exchange, dining" },
            { id: "jubilee", label: "Silver/Golden Jubilee", description: "Nostalgic, family gathering" },
            { id: "private", label: "Private Dinner", description: "Romantic, intimate" }
        ],
        defaultTasks: [
            { title: "Book Venue", offset: -90 },
            { title: "Select Rings/Gifts", offset: -30 },
            { title: "Hire Photographer", offset: -45 },
            { title: "Plan Toast/Speech", offset: -7 }
        ],
        budgetDistribution: {
            catering: 0.35,
            venue: 0.25,
            gifts: 0.20,
            photography: 0.15,
            other: 0.05
        }
    },
    concert: {
        label: "Concert / Show",
        subtypes: [
            { id: "music", label: "Music Concert", description: "Sound-heavy, ticketing" },
            { id: "standup", label: "Stand-up Comedy", description: "Seating-focused, mic setup" },
            { id: "dance", label: "Dance Performance", description: "Stage, lighting, dressing rooms" }
        ],
        defaultTasks: [
            { title: "Book Artist/Performer", offset: -180 },
            { title: "Rent Sound & Light Equipment", offset: -60 },
            { title: "Setup Ticketing System", offset: -90 },
            { title: "Arrange Security & Crowd Control", offset: -30 },
            { title: "Marketing & Promotion", offset: -45 }
        ],
        budgetDistribution: {
            talent: 0.40,
            production: 0.25,
            venue: 0.15,
            marketing: 0.15,
            other: 0.05
        }
    }
};
