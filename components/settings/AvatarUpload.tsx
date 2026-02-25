'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Upload, User } from "lucide-react";

export function AvatarUpload({ userId, url, onUploadComplete }: { userId: string, url: string | null, onUploadComplete: (newUrl: string) => void }) {
    const supabase = createClient();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (url) downloadImage(url);
    }, [url]);

    async function downloadImage(path: string) {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path);
            if (error) {
                throw error;
            }
            const url = URL.createObjectURL(data);
            setAvatarUrl(url);
        } catch (error) {
            console.log('Error downloading image: ', error);
        }
    }

    async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${userId}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            onUploadComplete(filePath);
            downloadImage(filePath); // Refresh local view
        } catch (error) {
            alert('Error uploading avatar!');
            console.log(error);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group h-28 w-28 rounded-full">
                {/* Fallback to simple img if Avatar component missing, but using Avatar logic manually for safety if component doesn't exist yet */}
                <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-stone-50 flex items-center justify-center relative transition-transform duration-500 group-hover:scale-105">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                        <User className="h-10 w-10 text-stone-400" />
                    )}
                </div>

                <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer scale-105 group-hover:scale-100">
                    <label htmlFor="single" className="cursor-pointer text-white text-[10px] uppercase tracking-widest font-bold flex flex-col items-center">
                        <Upload className="w-4 h-4 mb-1.5" />
                        CHANGE
                    </label>
                </div>
            </div>

            <input
                style={{
                    visibility: 'hidden',
                    position: 'absolute',
                }}
                type="file"
                id="single"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={uploading}
            />

            {uploading && <div className="text-xs text-taupe flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Uploading...</div>}
        </div>
    );
}
