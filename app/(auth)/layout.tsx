import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-alabaster">
            {/* Visual Side */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-charcoal text-alabaster relative overflow-hidden">
                <div className="z-10">
                    <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
                        <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
                            Glam<span className="text-gold-leaf-500 italic">oora</span>
                        </h2>
                    </Link>
                </div>
                <div className="z-10 relative">
                    <blockquote className="text-2xl font-serif italic leading-relaxed">
                        "The details are not the details. They make the design."
                    </blockquote>
                    <p className="mt-4 text-taupe font-sans uppercase tracking-widest text-xs">
                        - Charles Eames
                    </p>
                </div>

                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-stone-800 rounded-full opacity-50 blur-3xl pointer-events-none"></div>
            </div>

            {/* Form Side */}
            <div className="flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
