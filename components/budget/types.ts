export type ExpenseCategory = 'Venue' | 'Catering' | 'Photography' | 'Music' | 'Decor' | 'Attire' | 'Other';
export type ExpenseStatus = 'pending' | 'paid';

export interface Expense {
    id: string;
    event_id: string;
    user_id: string;
    title: string;
    amount: number;
    category: ExpenseCategory | string;
    status: ExpenseStatus;
    due_date?: string;
    paid_date?: string;
    created_at: string;
}

export interface BudgetStats {
    total_budget: number;
    total_spent: number;
    total_pending: number;
    categories: { [key: string]: number };
}
