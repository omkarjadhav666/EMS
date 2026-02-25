import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: event } = await supabase.from('events').select('title, description').eq('slug', slug).single();

    return {
        title: event?.title || 'Event',
        description: event?.description || 'Join us for this special event.',
    };
}

export default async function PublicEventLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    // We can do a quick check here if needed, or let the page handle it
    return (
        <div className="min-h-screen bg-stone-50 font-sans text-charcoal">
            {children}
        </div>
    );
}
