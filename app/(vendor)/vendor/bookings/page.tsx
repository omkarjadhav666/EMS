import { createClient } from "@/lib/supabase/server";
import { getCurrentVendorId } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { BookingCard } from "@/components/vendor/BookingCard";
import { Briefcase } from "lucide-react";

export default async function VendorBookingsPage({
    searchParams,
}: {
    searchParams: { status?: string };
}) {
    const supabase = await createClient();
    const vendorId = await getCurrentVendorId();

    if (!vendorId) {
        redirect('/unauthorized');
    }

    const status = searchParams.status || 'all';

    // Fetch bookings
    let query = supabase
        .from('bookings')
        .select(`
      *,
      events (
        name,
        event_date,
        event_type,
        location
      ),
      profiles (
        full_name,
        email
      )
    `)
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

    if (status !== 'all') {
        query = query.eq('status', status);
    }

    const { data: bookings } = await query;

    const pendingCount = bookings?.filter(b => b.status === 'pending').length || 0;
    const confirmedCount = bookings?.filter(b => b.status === 'confirmed').length || 0;
    const rejectedCount = bookings?.filter(b => b.status === 'rejected').length || 0;

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-serif text-charcoal mb-2">Booking Requests</h1>
                <p className="text-taupe">Manage your client bookings</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                <a
                    href="/vendor/bookings"
                    className={`px-4 py-2 font-medium transition-colors ${status === 'all'
                            ? 'text-terra-cotta border-b-2 border-terra-cotta'
                            : 'text-taupe hover:text-charcoal'
                        }`}
                >
                    All ({bookings?.length || 0})
                </a>
                <a
                    href="/vendor/bookings?status=pending"
                    className={`px-4 py-2 font-medium transition-colors ${status === 'pending'
                            ? 'text-terra-cotta border-b-2 border-terra-cotta'
                            : 'text-taupe hover:text-charcoal'
                        }`}
                >
                    Pending ({pendingCount})
                </a>
                <a
                    href="/vendor/bookings?status=confirmed"
                    className={`px-4 py-2 font-medium transition-colors ${status === 'confirmed'
                            ? 'text-terra-cotta border-b-2 border-terra-cotta'
                            : 'text-taupe hover:text-charcoal'
                        }`}
                >
                    Confirmed ({confirmedCount})
                </a>
                <a
                    href="/vendor/bookings?status=rejected"
                    className={`px-4 py-2 font-medium transition-colors ${status === 'rejected'
                            ? 'text-terra-cotta border-b-2 border-terra-cotta'
                            : 'text-taupe hover:text-charcoal'
                        }`}
                >
                    Declined ({rejectedCount})
                </a>
            </div>

            {/* Bookings Grid */}
            {bookings && bookings.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-charcoal mb-2">No bookings found</h3>
                    <p className="text-taupe">
                        {status === 'all'
                            ? "You haven't received any booking requests yet"
                            : `No ${status} bookings at the moment`}
                    </p>
                </div>
            )}
        </div>
    );
}
