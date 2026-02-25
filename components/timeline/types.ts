export interface TimelineItem {
    id: string;
    event_id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time?: string;
    order: number;
    icon?: string;
    created_at?: string;
}

export type NewTimelineItem = Omit<TimelineItem, 'id' | 'created_at'>;
