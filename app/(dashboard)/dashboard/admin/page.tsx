import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminBookingList } from "@/components/admin/AdminBookingList";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminPage() {
    return (
        <RoleGuard allowedRoles={['admin']}>
            <AdminLayout>
                <AdminBookingList />
            </AdminLayout>
        </RoleGuard>
    );
}
