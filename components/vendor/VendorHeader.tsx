import { VendorMobileNav } from "./VendorMobileNav";
import { ProfileDropdown } from "@/components/dashboard/ProfileDropdown";
import { NotificationsDropdown } from "@/components/dashboard/NotificationsDropdown";

interface VendorHeaderProps {
    user: any;
}

export function VendorHeader({ user }: VendorHeaderProps) {
    return (
        <header className="h-16 border-b border-stone-200 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 w-full gap-4 md:hidden">
            <div className="flex items-center gap-4 flex-1">
                <div className="flex-shrink-0">
                    <VendorMobileNav user={user} />
                </div>
                <div className="font-serif font-bold text-lg text-charcoal">
                    Vendor Portal
                </div>
            </div>

            {/* Actions for mobile header */}
            <div className="flex items-center gap-4">
                <ProfileDropdown user={user} />
            </div>
        </header>
    );
}
