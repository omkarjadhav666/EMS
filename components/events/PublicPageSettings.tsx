"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, Copy, Check } from "lucide-react";

interface PublicPageSettingsProps {
    eventId: string;
    initialData: {
        slug: string | null;
        is_public: boolean | null;
        description: string | null;
        theme: string | null;
    };
}

export function PublicPageSettings({ eventId, initialData }: PublicPageSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        slug: initialData.slug || "",
        is_public: initialData.is_public || false,
        description: initialData.description || "",
        theme: initialData.theme || "modern"
    });
    const [copied, setCopied] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/events/${formData.slug}` : '';

    async function handleSave() {
        setIsLoading(true);
        // Basic slug validation
        const cleanSlug = formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

        const { error } = await supabase
            .from('events')
            .update({
                slug: cleanSlug,
                is_public: formData.is_public,
                description: formData.description,
                theme: formData.theme
            })
            .eq('id', eventId);

        if (error) {
            alert("Error saving settings: " + error.message);
        } else {
            router.refresh();
        }
        setIsLoading(false);
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="card-luxury p-6 space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-serif text-xl text-charcoal">Public Event Page</h3>
                    <p className="text-sm text-taupe mt-1">Share this page with your guests to collect RSVPs.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-charcoal">
                        {formData.is_public ? "Published" : "Draft"}
                    </span>
                    <Switch
                        checked={formData.is_public}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-taupe uppercase block mb-2">Event URL Slug</label>
                    <div className="flex gap-2">
                        <div className="flex-1 flex items-center border border-stone-200 rounded-md px-3 bg-stone-50 text-stone-500">
                            <span className="text-sm">events/</span>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-charcoal p-0 ml-1"
                                placeholder="my-awesome-event"
                            />
                        </div>
                    </div>
                </div>

                {formData.is_public && formData.slug && (
                    <div className="flex items-center gap-2 p-3 bg-gold-leaf-50/50 rounded-lg border border-gold-leaf-100">
                        <input
                            readOnly
                            value={publicUrl}
                            className="flex-1 bg-transparent text-sm text-charcoal border-none focus:ring-0"
                        />
                        <button onClick={copyToClipboard} className="text-gold-leaf-600 hover:text-gold-leaf-700 p-1">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <a href={`/events/${formData.slug}`} target="_blank" className="text-gold-leaf-600 hover:text-gold-leaf-700 p-1">
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                )}

                <div>
                    <label className="text-xs font-bold text-taupe uppercase block mb-2">Welcome Message</label>
                    <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Tell your guests about the event..."
                        className="h-32 font-serif"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-taupe uppercase block mb-2">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['modern', 'classic', 'rustic'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setFormData({ ...formData, theme: t })}
                                className={`p-4 border rounded-lg text-center capitalize transition-all ${formData.theme === t
                                        ? 'border-gold-leaf-500 bg-gold-leaf-50 text-gold-leaf-800 ring-1 ring-gold-leaf-500'
                                        : 'border-stone-200 hover:border-gold-leaf-300'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-gold-leaf-500 hover:bg-gold-leaf-600 text-white"
                >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
