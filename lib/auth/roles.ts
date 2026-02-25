import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type UserRole = 'client' | 'vendor' | 'admin';

export interface UserProfile {
    id: string;
    email: string;
    role: UserRole;
    vendor_id?: string;
    full_name?: string;
    avatar_url?: string;
}

/**
 * Get the current authenticated user's role
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return (profile?.role as UserRole) || 'client';
}

/**
 * Get the current authenticated user's full profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!profile) return null;

    return {
        id: profile.id,
        email: user.email || '',
        role: (profile.role as UserRole) || 'client',
        vendor_id: profile.vendor_id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
    };
}

/**
 * Require specific roles to access a route
 * Redirects to /unauthorized if user doesn't have permission
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<UserRole> {
    const role = await getCurrentUserRole();

    if (!role) {
        redirect('/login');
    }

    if (!allowedRoles.includes(role)) {
        redirect('/unauthorized');
    }

    return role;
}

/**
 * Require authentication
 * Redirects to /login if not authenticated
 */
export async function requireAuth() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return user;
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
    const currentRole = await getCurrentUserRole();
    return currentRole === role;
}

/**
 * Check if user is an admin
 */
export async function isAdmin(): Promise<boolean> {
    return hasRole('admin');
}

/**
 * Check if user is a vendor
 */
export async function isVendor(): Promise<boolean> {
    return hasRole('vendor');
}

/**
 * Check if user is a client
 */
export async function isClient(): Promise<boolean> {
    return hasRole('client');
}

/**
 * Get vendor ID for the current user (if they are a vendor)
 */
export async function getCurrentVendorId(): Promise<string | null> {
    const profile = await getCurrentUserProfile();
    return profile?.vendor_id || null;
}
