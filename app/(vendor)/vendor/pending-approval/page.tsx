import { Clock, CheckCircle } from "lucide-react";

export default function PendingApprovalPage() {
    return (
        <div className="min-h-screen bg-alabaster flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-10 h-10 text-amber-600" />
                </div>

                <h1 className="text-3xl font-serif text-charcoal mb-4">
                    Application Submitted!
                </h1>

                <p className="text-taupe mb-6">
                    Thank you for applying to become a vendor on Glamoora. Your application is currently under review by our team.
                </p>

                <div className="bg-alabaster rounded-lg p-6 mb-6 text-left">
                    <h2 className="font-semibold text-charcoal mb-3">What happens next?</h2>
                    <ul className="space-y-3 text-sm text-taupe">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                            <span>Our team will review your business information and portfolio</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                            <span>We may contact you if we need additional information</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                            <span>You'll receive an email notification once your application is approved</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                            <span>After approval, you can access your vendor dashboard and start receiving bookings</span>
                        </li>
                    </ul>
                </div>

                <p className="text-sm text-taupe mb-6">
                    Review time is typically <strong>1-3 business days</strong>
                </p>

                <a href="/dashboard" className="btn-primary inline-block">
                    Return to Dashboard
                </a>
            </div>
        </div>
    );
}
