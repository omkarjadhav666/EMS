"use client";

import Link from "next/link";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AuthFormProps {
    type: "login" | "register";
}

export function AuthForm({ type }: AuthFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const fullName = formData.get("fullName") as string;

        try {
            if (type === "register") {
                const { error: signUpError, data } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });

                if (signUpError) throw signUpError;

                // Auto sign in or show success (Supabase auto-confirms if disabled, or sends email)
                // For this demo assuming auto-confirm or user manually confirms.
                // Often 'data.session' is null if email confirmation is required.
                if (data.user && !data.session) {
                    setError("Please check your email to confirm your account.");
                    return;
                }

                router.push("/dashboard");

            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (signInError) throw signInError;
                router.push("/dashboard");
            }

            router.refresh(); // Refresh server components
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-serif text-charcoal">
                    {type === "login" ? "Welcome back" : "Create an account"}
                </h1>
                <p className="text-taupe font-sans">
                    {type === "login"
                        ? "Enter your email to sign in to your events."
                        : "Start planning your perfect event today."}
                </p>
            </div>

            {error && (
                <div className="p-3 rounded-sm bg-terra-cotta/10 border border-terra-cotta/20 text-terra-cotta text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
                {type === "register" && (
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wide text-taupe">Full Name</label>
                        <input
                            name="fullName"
                            type="text"
                            placeholder="Jane Doe"
                            className="w-full px-4 py-3 rounded-sm bg-white border border-stone-200 focus:border-gold-leaf-500 focus:ring-1 focus:ring-gold-leaf-500 outline-none transition-all placeholder:text-stone-300"
                            required
                        />
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wide text-taupe">Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 rounded-sm bg-white border border-stone-200 focus:border-gold-leaf-500 focus:ring-1 focus:ring-gold-leaf-500 outline-none transition-all placeholder:text-stone-300"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wide text-taupe">Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-sm bg-white border border-stone-200 focus:border-gold-leaf-500 focus:ring-1 focus:ring-gold-leaf-500 outline-none transition-all placeholder:text-stone-300"
                        required
                        minLength={6}
                    />
                </div>

                <button
                    disabled={isLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-6 h-12"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {type === "login" ? "Sign In" : "Create Account"}
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
            </form>



            <p className="text-center text-sm text-taupe font-sans">
                {type === "login" ? (
                    <>
                        Don't have an account?{" "}
                        <Link href="/register" className="text-gold-leaf-600 hover:underline font-bold">
                            Sign up
                        </Link>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}
                        <Link href="/login" className="text-gold-leaf-600 hover:underline font-bold">
                            Log in
                        </Link>
                    </>
                )}
            </p>
        </div>
    );
}
