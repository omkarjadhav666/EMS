import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/ui/Footer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-alabaster flex flex-col">
            <Navbar />
            <main className="flex-1 pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
