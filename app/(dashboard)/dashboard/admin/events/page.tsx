import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminEventsList } from "@/components/admin/AdminEventsList";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminEventsPage() {
    return (
        <RoleGuard allowedRoles={['admin']}>
            <AdminLayout activeTab="events">
                <AdminEventsList />
            </AdminLayout>
        </RoleGuard>
    );
}
