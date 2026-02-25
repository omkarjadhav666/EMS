"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const guestSchema = z.object({
    eventId: z.string().uuid(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    status: z.enum(["confirmed", "declined"]),
    dietaryRestrictions: z.string().optional(),
    plusOne: z.boolean().default(false),
    message: z.string().optional(),
});

export type GuestFormState = {
    errors?: {
        name?: string[];
        email?: string[];
        phone?: string[];
        status?: string[];
        dietaryRestrictions?: string[];
        plusOne?: string[];
        message?: string[];
        _form?: string[];
    };
    success?: boolean;
};

export async function submitRSVP(
    prevState: GuestFormState,
    formData: FormData
): Promise<GuestFormState> {
    const validatedFields = guestSchema.safeParse({
        eventId: formData.get("eventId"),
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        status: formData.get("status"),
        dietaryRestrictions: formData.get("dietaryRestrictions"),
        plusOne: formData.get("plusOne") === "true",
        message: formData.get("message"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { eventId, name, email, phone, status, dietaryRestrictions, plusOne, message } = validatedFields.data;

    const supabase = await createClient();

    // Check for existing RSVP with same email for this event
    const { data: existingGuest } = await supabase
        .from("guests")
        .select("id")
        .eq("event_id", eventId)
        .eq("email", email)
        .single();

    if (existingGuest) {
        // Optional: Update existing record instead of erroring?
        // For now, let's return an error to prevent duplicate submissions or unauthorized updates
        return {
            errors: {
                email: ["An RSVP with this email already exists for this event."]
            }
        }
    }

    const { error } = await supabase.from("guests").insert({
        event_id: eventId,
        name,
        email,
        phone,
        status,
        dietary_restrictions: dietaryRestrictions,
        plus_one: plusOne,
        message,
    });

    if (error) {
        console.error("RSVP Insert Error:", error);
        return {
            errors: {
                _form: ["Failed to submit RSVP. Please try again later."],
            },
        };
    }

    revalidatePath(`/events/${eventId}`); // Revalidate relevant paths
    return { success: true };
}
