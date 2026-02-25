export interface Event {
    id: string;
    title: string;
    date: string;
    location: string | null;
    status: string;
    guest_count: number | null;

    // New fields
    slug: string | null;
    is_public: boolean | null;
    description: string | null;
    cover_image: string | null;
    theme: string | null;
}
