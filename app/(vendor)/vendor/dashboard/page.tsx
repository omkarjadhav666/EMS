import { createClient } from "@/lib/supabase/server";
import { getCurrentVendorId } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { Calendar, IndianRupee, Star, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default async function VendorDashboardPage() {
    const supabase = await createClient();
    const vendorId = await getCurrentVendorId();

    if (!vendorId) {
        redirect('/unauthorized');
    }

    // Fetch vendor data
    const { data: vendor } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

    // Fetch bookings
    const { data: bookings } = await supabase
        .from('bookings')
        .select(`
      *,
      events (
        name,
        event_date,
        event_type
      ),
      profiles (
        full_name,
        email
      )
    `)
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

    const pendingCount = bookings?.filter(b => b.status === 'pending').length || 0;
    const confirmedCount = bookings?.filter(b => b.status === 'confirmed').length || 0;
    const thisMonthBookings = bookings?.filter(b => {
        const bookingDate = new Date(b.created_at);
        const now = new Date();
        return bookingDate.getMonth() === now.getMonth() &&
            bookingDate.getFullYear() === now.getFullYear();
    }).length || 0;

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-serif text-charcoal mb-2">
                    Welcome back, {vendor?.name}!
                </h1>
                <p className="text-taupe">Here's what's happening with your business</p>
            </div>

            {/* Status Alert */}
            {vendor?.status === 'pending' && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-amber-900">Pending Approval</p>
                        <p className="text-sm text-amber-700">
                            Your vendor profile is currently under review. You'll be notified once it's approved.
                        </p>
                    </div>
                </div>
            )}

            {vendor?.status === 'approved' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-green-900">Profile Approved!</p>
                        <p className="text-sm text-green-700">
                            Your vendor profile is live on the marketplace. Start receiving bookings!
                        </p>
                    </div>
                </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-taupe">Pending Requests</p>
                        <Clock className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="text-3xl font-bold text-charcoal">{pendingCount}</p>
                    <p className="text-xs text-taupe mt-1">Awaiting response</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-taupe">Confirmed Bookings</p>
                        <CheckCircle className="w-5 h-5 text-sage" />
                    </div>
                    <p className="text-3xl font-bold text-charcoal">{confirmedCount}</p>
                    <p className="text-xs text-taupe mt-1">Active contracts</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-taupe">This Month</p>
                        <TrendingUp className="w-5 h-5 text-terra-cotta" />
                    </div>
                    <p className="text-3xl font-bold text-charcoal">{thisMonthBookings}</p>
                    <p className="text-xs text-taupe mt-1">New bookings</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-taupe">Rating</p>
                        <Star className="w-5 h-5 text-amber-400" />
                    </div>
                    <p className="text-3xl font-bold text-charcoal">{vendor?.rating || '0.0'}</p>
                    <p className="text-xs text-taupe mt-1">Average rating</p>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-serif text-charcoal">Recent Booking Requests</h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {bookings && bookings.length > 0 ? (
                        bookings.slice(0, 5).map((booking: any) => (
                            <div key={booking.id} className="p-6 hover:bg-alabaster transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-charcoal mb-1">
                                            {booking.events?.name || 'Untitled Event'}
                                        </h3>
                                        <p className="text-sm text-taupe mb-2">
                                            {booking.events?.event_type} • {new Date(booking.events?.event_date).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-charcoal">
                                            Client: {booking.profiles?.full_name || booking.profiles?.email}
                                        </p>
                                        {booking.notes && (
                                            <p className="text-sm text-taupe mt-2 italic">"{booking.notes}"</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-taupe">No booking requests yet</p>
                            <p className="text-sm text-taupe mt-1">
                                Clients will see your profile once it's approved
                            </p>
                        </div>
                    )}
                </div>

                {bookings && bookings.length > 5 && (
                    <div className="p-4 border-t border-gray-200 text-center">
                        <a href="/vendor/bookings" className="text-terra-cotta hover:underline text-sm font-medium">
                            View All Bookings →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
