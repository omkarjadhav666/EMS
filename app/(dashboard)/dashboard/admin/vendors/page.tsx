import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminVendorList } from "@/components/admin/AdminVendorList";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminVendorsPage() {
    return (
        <RoleGuard allowedRoles={['admin']}>
            <AdminLayout activeTab="vendors">
                <AdminVendorList />
            </AdminLayout>
        </RoleGuard>
    );
}
