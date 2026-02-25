'use client';

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "./AvatarUpload";
import { Loader2 } from "lucide-react";

export function SettingsForm({ user }: { user: any }) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [fullname, setFullname] = useState<string>(user.full_name || '');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatar_url);

    // Initial state setup if needed

    async function updateProfile() {
        try {
            setLoading(true);

            const updates = {
                id: user.id,
                full_name: fullname,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;

            alert("Profile updated successfully!"); // Replace with toast if available
        } catch (error) {
            alert("Error updating the data!");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-10 inline-block w-full">
            <div className="bg-white/80 backdrop-blur-md border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-8 flex flex-col md:flex-row gap-10 items-start transition-all duration-500">
                <div className="shrink-0 mx-auto md:mx-0">
                    <AvatarUpload
                        userId={user.id}
                        url={avatarUrl}
                        onUploadComplete={(url) => setAvatarUrl(url)}
                    />
                </div>

                <div className="flex-1 space-y-6 w-full">
                    <div>
                        <h3 className="text-xl font-serif text-charcoal flex items-center gap-2">
                            <div className="w-1 h-5 bg-gold-leaf-500 rounded-full" />
                            Personal Information
                        </h3>
                        <p className="text-sm text-taupe mt-1">Configure your public profile and identity details.</p>
                    </div>

                    <div className="grid gap-2.5">
                        <Label htmlFor="email" className="text-xs font-bold text-stone-400 tracking-widest uppercase ml-1">Email</Label>
                        <Input id="email" value={user.email || ''} disabled className="bg-stone-50/50 border-stone-200/40 text-stone-400 cursor-not-allowed rounded-xl px-4 py-6" />
                        <p className="text-[10px] text-stone-400 ml-1">Your email is managed by your authentication provider.</p>
                    </div>

                    <div className="grid gap-2.5">
                        <Label htmlFor="fullname" className="text-xs font-bold text-stone-400 tracking-widest uppercase ml-1">Full Name</Label>
                        <Input
                            id="fullname"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="bg-white/60 backdrop-blur-sm border-stone-200/60 rounded-xl px-4 py-6 focus-visible:ring-gold-leaf-400 focus-visible:border-transparent transition-all shadow-sm"
                            placeholder="e.g. Jane Doe"
                        />
                    </div>

                    <div className="pt-6 flex justify-end">
                        <Button
                            onClick={updateProfile}
                            disabled={loading}
                            className="bg-charcoal text-white hover:bg-gold-leaf-600 rounded-full px-8 py-6 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] animate-[shimmer_2s_infinite] group-hover:block hidden" />
                            {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                            <span className="font-medium text-sm">Save Changes</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
