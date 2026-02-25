import { Bell, Search } from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { ProfileDropdown } from "./ProfileDropdown";
import { DashboardMobileNav } from "./DashboardMobileNav";

interface HeaderProps {
    user: any;
}

export function Header({ user }: HeaderProps) {

    return (
        <header className="h-16 border-b border-stone-200 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 w-full gap-4">
            <div className="flex items-center gap-4 flex-1">
                <div className="md:hidden flex-shrink-0">
                    <DashboardMobileNav user={user} />
                </div>
                <div className="flex-1 w-full max-w-xl">
                    <GlobalSearch user={user} />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <NotificationsDropdown userId={user?.id} />
                <ProfileDropdown user={user} />
            </div>
        </header>
    );
}
