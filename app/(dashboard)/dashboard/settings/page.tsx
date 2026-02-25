import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const supabase = await createClient(); // Await the promise
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Combine auth data with profile data
    const userData = {
        ...user,
        ...profile
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/50">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-serif text-charcoal tracking-tight mb-3">Account Settings</h1>
                    <p className="text-taupe text-lg leading-relaxed">Manage your profile, preferences, and supreme event experience.</p>
                </div>
            </div>

            <SettingsForm user={userData} />
        </div>
    );
}
