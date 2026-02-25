import { createClient } from "@/lib/supabase/client";

export interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
    actionLink?: string; // Optional URL to navigate to
}

export interface BotAction {
    text: string;
    link?: string;
}

const RESPONSES = {
    greeting: ["Hello! I'm your Glamoora assistant. How can I help you today?", "Hi there! Need help with your event?"],
    unknown: ["I'm not sure I understand. Try asking 'Show my budget' or 'Go to vendors'.", "I'm still learning! Try 'How many guests?'"]
};

export class ActionProvider {
    private supabase = createClient();

    constructor() { }

    async processMessage(text: string): Promise<BotAction> {
        const lowerText = text.toLowerCase();

        // 1. Navigation Intents
        if (lowerText.includes("dashboard") || lowerText.includes("home")) {
            return { text: "Taking you to the dashboard.", link: "/dashboard" };
        }
        if (lowerText.includes("budget") && (lowerText.includes("go") || lowerText.includes("show") || lowerText.includes("open"))) {
            return { text: "Opening your budget tracker.", link: "/dashboard/budget" };
        }
        if (lowerText.includes("vendor") || lowerText.includes("marketplace")) {
            return { text: "Browsing vendors now.", link: "/dashboard/marketplace" };
        }
        if (lowerText.includes("guest") && (lowerText.includes("list") || lowerText.includes("go"))) {
            return { text: "Opening guest list.", link: "/dashboard/guests" }; // Assuming guests page exists or will exist
        }

        // 2. Data Retrieval Intents
        if (lowerText.includes("budget") && (lowerText.includes("left") || lowerText.includes("remaining") || lowerText.includes("status"))) {
            return await this.getBudgetStatus();
        }

        if (lowerText.includes("guest") && (lowerText.includes("count") || lowerText.includes("how many"))) {
            return await this.getGuestCount();
        }

        // 3. Greetings
        if (lowerText.match(/\b(hi|hello|hey)\b/)) {
            return { text: RESPONSES.greeting[Math.floor(Math.random() * RESPONSES.greeting.length)] };
        }

        // Default
        return { text: RESPONSES.unknown[Math.floor(Math.random() * RESPONSES.unknown.length)] };
    }

    private async getBudgetStatus(): Promise<BotAction> {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) return { text: "Please log in to see your budget." };

        // Get total budget from events (assuming one active event for MVP or summing all)
        const { data: events } = await this.supabase.from('events').select('budget').eq('user_id', user.id);
        const totalBudget = events?.reduce((sum, e) => sum + (e.budget || 0), 0) || 0;

        // Get total expenses
        const { data: expenses } = await this.supabase.from('expenses').select('amount').eq('user_id', user.id);
        const totalSpent = expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

        const remaining = totalBudget - totalSpent;

        return {
            text: `You have spent ₹${totalSpent.toLocaleString('en-IN')} out of ₹${totalBudget.toLocaleString('en-IN')}. Remaining: ₹${remaining.toLocaleString('en-IN')}.`,
            link: "/dashboard/budget"
        };
    }

    private async getGuestCount(): Promise<BotAction> {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) return { text: "Please log in to check guests." };

        const { count, error } = await this.supabase
            .from('guests')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (error) return { text: "I couldn't retrieve your guest count right now." };

        return {
            text: `You have ${count} guests on your list.`,
            link: "/dashboard/events" // Or guests if it existed
        };
    }
}
