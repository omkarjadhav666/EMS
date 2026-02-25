import { redirect } from "next/navigation";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-alabaster">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="w-20 h-20 rounded-full bg-terra-cotta/10 flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-10 h-10 text-terra-cotta"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h1 className="text-3xl font-serif text-charcoal mb-4">Access Denied</h1>
                <p className="text-taupe mb-8">
                    You don't have permission to access this page. Please contact your administrator if you believe this is an error.
                </p>
                <div className="flex gap-4 justify-center">
                    <a
                        href="/dashboard"
                        className="btn-primary"
                    >
                        Go to Dashboard
                    </a>
                    <a
                        href="/login"
                        className="btn-secondary"
                    >
                        Sign In
                    </a>
                </div>
            </div>
        </div>
    );
}
