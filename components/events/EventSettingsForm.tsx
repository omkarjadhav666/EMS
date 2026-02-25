"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, Trash2, Globe, Save, AlertTriangle, Calendar, MapPin, Users, IndianRupee, Sparkles, LayoutTemplate, Link as LinkIcon, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const eventSettingsSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    date: z.string(),
    location: z.string().optional(),
    budget: z.number().min(0).optional(),
    guest_count: z.number().min(0).optional(),
    slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    is_public: z.boolean(),
    description: z.string().optional(),
    theme: z.string().optional(),
    event_type: z.string().optional(),
});

type EventSettingsFormValues = z.infer<typeof eventSettingsSchema>;

interface EventSettingsFormProps {
    event: any;
}

export function EventSettingsForm({ event }: EventSettingsFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");

    // Initial values
    const defaultValues: Partial<EventSettingsFormValues> = {
        name: event.name || event.title || "",
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
        location: event.location || "",
        budget: Number(event.budget_total) || 0,
        guest_count: event.guest_count || 0,
        slug: event.slug || "",
        is_public: event.is_public || false,
        description: event.description || "",
        theme: event.theme || "modern",
        event_type: event.event_type || "wedding",
    };

    const form = useForm<EventSettingsFormValues>({
        resolver: zodResolver(eventSettingsSchema),
        defaultValues,
    });

    async function onSubmit(data: EventSettingsFormValues) {
        setIsSaving(true);
        try {
            // Check slug uniqueness if changed
            if (data.slug !== event.slug) {
                const { data: existingEvent } = await supabase
                    .from("events")
                    .select("id")
                    .eq("slug", data.slug)
                    .single();

                if (existingEvent) {
                    form.setError("slug", { message: "This slug is already taken." });
                    setIsSaving(false);
                    return;
                }
            }

            const { error } = await supabase
                .from("events")
                .update({
                    title: data.name,
                    date: new Date(data.date).toISOString(),
                    location: data.location,
                    budget_total: data.budget,
                    guest_count: data.guest_count,
                    slug: data.slug,
                    is_public: data.is_public,
                    description: data.description,
                    theme: data.theme,
                    event_type: data.event_type,
                })
                .eq("id", event.id);

            if (error) throw error;

            toast.success("Event settings updated!");
            router.refresh();
        } catch (error) {
            console.error("Error updating settings:", error);
            toast.error("Failed to update settings. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteEvent() {
        if (deleteConfirmation !== "DELETE") return;
        setIsDeleting(true);
        try {
            const { error } = await supabase.from("events").delete().eq("id", event.id);
            if (error) throw error;
            toast.success("Event deleted successfully.");
            router.push("/dashboard/events");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete event.");
            setIsDeleting(false);
        }
    }

    // Styles matching ExpenseList.tsx
    const inputStyle = "w-full px-3 py-2 bg-white border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 placeholder:text-stone-300 transition-all";
    const labelStyle = "text-xs font-bold text-stone-500 uppercase mb-1 flex items-center gap-1.5";
    const cardHeaderStyle = "p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50";
    const cardTitleStyle = "font-serif text-xl text-charcoal";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: General Settings */}
                        <div className="card-luxury p-0 overflow-hidden h-fit">
                            <div className={cardHeaderStyle}>
                                <h3 className={cardTitleStyle}>General Details</h3>
                                <div className="p-2 bg-stone-100 rounded-full">
                                    <Sparkles className="w-4 h-4 text-stone-400" />
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={labelStyle}>
                                                Event Name <span className="text-red-400">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Omkar & Prachi's Wedding"
                                                    className={inputStyle}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelStyle}>
                                                    <Calendar className="w-3.5 h-3.5" /> Date & Time
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="datetime-local"
                                                        className={inputStyle}
                                                        min={new Date().toISOString().slice(0, 16)}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelStyle}>
                                                    <MapPin className="w-3.5 h-3.5" /> Location
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Venue Name, City"
                                                        className={inputStyle}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="budget"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelStyle}>
                                                    <IndianRupee className="w-3.5 h-3.5" /> Total Budget
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        className={inputStyle}
                                                        {...field}
                                                        onChange={e => field.onChange(parseFloat(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guest_count"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelStyle}>
                                                    <Users className="w-3.5 h-3.5" /> Est. Guests
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        className={inputStyle}
                                                        {...field}
                                                        onChange={e => field.onChange(parseInt(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Public Page Settings */}
                        <div className="card-luxury p-0 overflow-hidden h-fit">
                            <div className={cardHeaderStyle}>
                                <div className="flex items-center gap-3">
                                    <h3 className={cardTitleStyle}>Public Page</h3>
                                    <FormField
                                        control={form.control}
                                        name="is_public"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="data-[state=checked]:bg-gold-leaf-500 scale-90"
                                                    />
                                                </FormControl>
                                                <span className={cn("text-xs font-bold uppercase", field.value ? "text-gold-leaf-600" : "text-stone-400")}>
                                                    {field.value ? "Live" : "Private"}
                                                </span>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="p-2 bg-stone-100 rounded-full">
                                    <Globe className="w-4 h-4 text-stone-400" />
                                </div>
                            </div>

                            {form.watch("is_public") ? (
                                <div className="p-6 space-y-6 animate-in slide-in-from-top-4 duration-500">
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelStyle}>
                                                    Event URL
                                                </FormLabel>
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <div className="flex-1 flex items-center gap-0 rounded-md overflow-hidden border border-stone-200 focus-within:ring-2 focus-within:ring-stone-400 transition-all bg-white">
                                                        <span className="text-stone-400 text-sm whitespace-nowrap bg-stone-50 px-3 py-2 border-r border-stone-200 font-medium hidden sm:block">
                                                            {origin}/events/
                                                        </span>
                                                        <span className="text-stone-400 text-sm whitespace-nowrap bg-stone-50 px-3 py-2 border-r border-stone-200 font-medium sm:hidden">
                                                            /events/
                                                        </span>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="my-wedding-2026"
                                                                className="border-0 focus-visible:ring-0 rounded-none bg-transparent h-auto py-2 shadow-none min-w-[120px]"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="shrink-0 w-full sm:w-auto"
                                                        onClick={() => {
                                                            const url = `${origin}/events/${field.value}`;
                                                            navigator.clipboard.writeText(url);
                                                            toast.success("Link copied to clipboard!");
                                                        }}
                                                    >
                                                        <LinkIcon className="w-4 h-4 mr-2" />
                                                        Copy
                                                    </Button>
                                                </div>
                                                <FormDescription className="text-xs text-stone-400 mt-1">
                                                    Unique link for your guests to view event details and RSVP.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="event_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelStyle}>
                                                    <Sparkles className="w-3.5 h-3.5" /> Event Type
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={inputStyle}>
                                                            <SelectValue placeholder="Select event type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="wedding">Wedding</SelectItem>
                                                        <SelectItem value="birthday">Birthday</SelectItem>
                                                        <SelectItem value="anniversary">Anniversary</SelectItem>
                                                        <SelectItem value="corporate">Corporate Event</SelectItem>
                                                        <SelectItem value="party">Party</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="theme"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelStyle}>
                                                    <LayoutTemplate className="w-3.5 h-3.5" /> Page Theme
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={inputStyle}>
                                                            <SelectValue placeholder="Select a theme" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="modern">Modern Minimalist</SelectItem>
                                                        <SelectItem value="classic">Classic Elegant</SelectItem>
                                                        <SelectItem value="rustic">Rustic Charm</SelectItem>
                                                        <SelectItem value="floral">Floral Garden</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelStyle}>
                                                    Welcome Message
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Welcome to our wedding! We can't wait to celebrate with you..."
                                                        className={cn(inputStyle, "min-h-[100px] resize-none")}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-100 flex items-start gap-3">
                                        <div className="bg-white p-2 rounded-full shadow-sm text-gold-leaf-500">
                                            <Info className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-charcoal">Public Access</h4>
                                            <p className="text-xs text-stone-500 mt-1">
                                                Your event is visible to anyone with the link.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center text-stone-400">
                                    <Globe className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">Enable public access to configure the page.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-2 mb-8">
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 text-sm font-medium text-white bg-charcoal hover:bg-black rounded-md shadow-sm transition-colors h-auto"
                        >
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Save All Changes
                        </Button>
                    </div>

                    {/* Danger Zone */}
                    <div className="rounded-lg border border-red-100 bg-red-50/10 overflow-hidden">
                        <div className="p-4 border-b border-red-100 flex items-center gap-2 bg-red-50/30">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                            <h3 className="font-serif text-lg text-red-600 truncate">Danger Zone</h3>
                        </div>
                        <div className="p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
                            <div>
                                <h4 className="font-bold text-stone-800">Delete Event</h4>
                                <p className="text-sm text-stone-500 mt-1 max-w-xl">
                                    Permanently remove this event and all associated data (guests, tasks, budget). This cannot be undone.
                                </p>
                            </div>
                            <div className="w-full md:w-auto shrink-0">
                                {!deleteConfirmation ? (
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-auto border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                        onClick={() => setDeleteConfirmation("CONFIRMING")}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete Event
                                    </Button>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-2 rounded-md border border-red-200 shadow-sm animate-in fade-in slide-in-from-right-2 w-full max-w-full">
                                        <Input
                                            autoFocus
                                            value={deleteConfirmation === "CONFIRMING" ? "" : deleteConfirmation}
                                            onChange={e => setDeleteConfirmation(e.target.value)}
                                            placeholder='Type "DELETE"'
                                            className="w-full sm:w-32 border border-stone-200 focus-visible:ring-1 h-8 text-sm"
                                        />
                                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                disabled={deleteConfirmation !== "DELETE" || isDeleting}
                                                onClick={handleDeleteEvent}
                                                className="h-8 flex-1"
                                            >
                                                {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm"}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteConfirmation("")}
                                                className="h-8 px-2 text-stone-400 hover:text-stone-600 flex-1"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
