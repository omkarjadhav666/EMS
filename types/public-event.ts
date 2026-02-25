export interface PublicEvent {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
    cover_image: string;
    theme: string;
    event_type: string;
}

export interface TimelineItem {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    order_index: number;
}
