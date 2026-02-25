export type GuestStatus = 'pending' | 'confirmed' | 'declined';

export interface Guest {
    id: string;
    event_id: string;
    user_id: string;
    full_name: string;
    email?: string;
    status: GuestStatus;
    plus_ones: number;
    dietary_restrictions?: string;
    table_assigned?: string;
    created_at: string;
}

export interface GuestStats {
    total_invited: number;
    confirmed: number;
    declined: number;
    pending: number;
    total_attendees: number; // Includes plus ones of confirmed guests
}
