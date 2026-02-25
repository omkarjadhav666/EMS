"use client";

import { useEffect, useState } from "react";
import { UserRole, UserProfile } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/client";

export function useUserRole() {
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchRole() {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.log("[useUserRole] No user found. Setting role to null.");
                setRole(null);
                setLoading(false);
                return;
            }

            console.log("[useUserRole] User found:", user.id);

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error("[useUserRole] Error fetching profile:", error);
            }

            console.log("[useUserRole] Profile data fetched:", profile);

            setRole((profile?.role as UserRole) || 'client');
            setLoading(false);
        }

        fetchRole();
    }, [supabase]);

    return { role, loading };
}

export function useUserProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setProfile(null);
                setLoading(false);
                return;
            }

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileData) {
                setProfile({
                    id: profileData.id,
                    email: user.email || '',
                    role: (profileData.role as UserRole) || 'client',
                    vendor_id: profileData.vendor_id,
                    full_name: profileData.full_name,
                    avatar_url: profileData.avatar_url,
                });
            }

            setLoading(false);
        }

        fetchProfile();
    }, [supabase]);

    return { profile, loading };
}
