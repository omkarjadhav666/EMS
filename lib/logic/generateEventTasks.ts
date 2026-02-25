import { createClient } from "@/lib/supabase/client";
import { EVENT_TEMPLATES } from "@/lib/constants/eventTemplates";
import { EventType } from "@/components/events/wizard/types";

export async function generateEventTasks(eventId: string, type: EventType, subtypeId?: string) {
    const supabase = createClient();
    const template = EVENT_TEMPLATES[type];

    if (!template) return;

    // 1. Get Default Tasks from Template
    let tasksToCreate = [...template.defaultTasks];

    // 2. Prepare Bulk Insert Data
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch event date to calculate offsets
    const { data: event } = await supabase.from('events').select('date').eq('id', eventId).single();
    const eventDate = event?.date ? new Date(event.date) : new Date();

    const taskRows = tasksToCreate.map((task, index) => {
        let dueDate = null;
        if (eventDate && task.offset) {
            const d = new Date(eventDate);
            d.setDate(d.getDate() + task.offset);
            dueDate = d.toISOString();
        }

        return {
            event_id: eventId,
            user_id: user.id,
            title: task.title,
            status: 'pending',
            priority: 'medium',
            position: index, // Maintain order
            due_date: dueDate
        };
    });

    // 3. Insert into Database
    const { error } = await supabase.from('event_tasks').insert(taskRows);

    if (error) {
        console.error("Error generating tasks:", error);
    }
}
