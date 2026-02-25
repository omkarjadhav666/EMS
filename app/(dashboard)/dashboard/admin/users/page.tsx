import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminUserList } from "@/components/admin/AdminUserList";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminUsersPage() {
    return (
        <RoleGuard allowedRoles={['admin']}>
            <AdminLayout activeTab="users">
                <AdminUserList />
            </AdminLayout>
        </RoleGuard>
    );
}
