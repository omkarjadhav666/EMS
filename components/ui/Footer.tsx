import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-charcoal text-alabaster py-12 border-t border-stone-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
                            Glam<span className="text-gold-leaf-500 italic">oora</span>
                        </Link>
                        <p className="mt-4 text-stone-400 text-sm">
                            Democratizing professional event planning for everyone.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-serif text-gold-leaf-500 mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-stone-300">
                            <li><Link href="/vendors" className="hover:text-white transition-colors">Vendor Directory</Link></li>
                            <li><Link href="/events" className="hover:text-white transition-colors">Public Events</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif text-gold-leaf-500 mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-stone-300">
                            <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-stone-800 text-center text-xs text-stone-500">
                    © {new Date().getFullYear()} Glamoora Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
