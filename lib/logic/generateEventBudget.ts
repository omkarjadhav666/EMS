import { createClient } from "@/lib/supabase/client";
import { EVENT_TEMPLATES } from "@/lib/constants/eventTemplates";
import { EventType } from "@/components/events/wizard/types";

export async function generateEventBudget(eventId: string, type: EventType, totalBudget: number) {
    if (totalBudget <= 0) return;

    const supabase = createClient();
    const template = EVENT_TEMPLATES[type];

    if (!template || !template.budgetDistribution) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const expensesToCreate = Object.entries(template.budgetDistribution).map(([category, percentage]) => {
        const estimatedAmount = Math.round(totalBudget * percentage);
        return {
            event_id: eventId,
            user_id: user.id,
            title: `Estimated ${category.charAt(0).toUpperCase() + category.slice(1)}`,
            amount: estimatedAmount,
            category: category,
            status: 'pending',
            due_date: null // Could calculate this based on event date in future
        };
    });

    if (expensesToCreate.length > 0) {
        const { error } = await supabase.from('expenses').insert(expensesToCreate);
        if (error) {
            console.error("Error generating budget breakdown:", error);
        }
    }
}
