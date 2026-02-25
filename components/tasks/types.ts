export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
    id: string;
    created_at: string;
    title: string;
    description?: string;
    status: TaskStatus;
    due_date?: string;
    user_id: string;
    event_id: string;
    priority?: 'low' | 'medium' | 'high';
    category?: string;
    is_public?: boolean;
    assigned_to?: string;
    position?: number; // for kanban ordering
}

export type TaskColumn = {
    id: TaskStatus;
    label: string;
    tasks: Task[];
};
