export type EventType = "wedding" | "birthday" | "corporate" | "social" | "baby_shower" | "engagement" | "concert" | "other";

export interface EventFormData {
    type: EventType;
    subtype?: string;
    title: string;
    guestCount: number;
    budget: number;
    date: Date | undefined;
    location: string;
}

export interface WizardStepProps {
    formData: EventFormData;
    updateData: (data: Partial<EventFormData>) => void;
    onNext: () => void;
    onBack: () => void;
}
