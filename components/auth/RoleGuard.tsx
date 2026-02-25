"use client";

import { ReactNode } from "react";
import { useUserRole } from "@/lib/auth/useUserRole";
import { UserRole } from "@/lib/auth/roles";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: UserRole[];
    fallback?: ReactNode;
    redirectTo?: string;
}

/**
 * Client-side role guard component
 * Renders children only if user has one of the allowed roles
 */
export function RoleGuard({
    children,
    allowedRoles,
    fallback = null,
    redirectTo = "/unauthorized"
}: RoleGuardProps) {
    const { role, loading } = useUserRole();
    const router = useRouter();

    useEffect(() => {
        if (!loading && role && !allowedRoles.includes(role)) {
            router.push(redirectTo);
        }
    }, [role, loading, allowedRoles, redirectTo, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terra-cotta"></div>
            </div>
        );
    }

    if (!role || !allowedRoles.includes(role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

/**
 * Show content only to specific roles
 */
export function ShowForRole({
    children,
    roles
}: {
    children: ReactNode;
    roles: UserRole[]
}) {
    const { role, loading } = useUserRole();

    if (loading || !role || !roles.includes(role)) {
        return null;
    }

    return <>{children}</>;
}

/**
 * Hide content from specific roles
 */
export function HideForRole({
    children,
    roles
}: {
    children: ReactNode;
    roles: UserRole[]
}) {
    const { role, loading } = useUserRole();

    if (loading || !role || roles.includes(role)) {
        return null;
    }

    return <>{children}</>;
}
