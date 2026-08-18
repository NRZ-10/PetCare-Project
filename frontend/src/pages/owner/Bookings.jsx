import React, { useEffect, useState } from 'react';
import BookingCard from '../../components/BookingCard';
import Loader from '../../components/Loader';
import { getOwnerBookings, updateBookingStatus } from '../../services/bookingService';
import reviewService from '../../services/reviewService';
import toast from 'react-hot-toast';
import { CalendarCheck, History } from 'lucide-react';
import ReviewModal from '../../components/ReviewModal';
import ConfirmationModal from '../../components/ConfirmationModal';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);

    const fetchBookings = async () => {
        try {
            const res = await getOwnerBookings();
            setBookings(res.data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusChangeClick = (id, status) => {
        if (status === 'Cancelled') {
            setSelectedBookingForCancel(id);
            setCancelModalOpen(true);
        } else {
            processStatusChange(id, status);
        }
    };

    const processStatusChange = async (id, status) => {
        try {
            await updateBookingStatus(id, status);
            toast.success(`Booking ${status.toLowerCase()}`);
            fetchBookings(); // refresh
            setCancelModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update booking');
            setCancelModalOpen(false);
        }
    };

    const handleLeaveReviewClick = (booking) => {
        setSelectedBookingForReview(booking);
        setReviewModalOpen(true);
    };

    const handleReviewSubmit = async ({ rating, comment }) => {
        try {
            await reviewService.createReview({
                bookingId: selectedBookingForReview._id,
                rating,
                comment
            });
            toast.success('Review submitted successfully!');
            setReviewModalOpen(false);
            setSelectedBookingForReview(null);
            // Optionally, mark this booking so the button disappears, 
            // but for simplicity we rely on the backend rejecting duplicates
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) return <div className="flex justify-center py-32"><Loader /></div>;

    const activeBookings = bookings.filter(b => ['Pending', 'Accepted'].includes(b.status));
    const historyBookings = bookings.filter(b => ['Completed', 'Cancelled', 'Rejected'].includes(b.status));

    const displayedBookings = activeTab === 'active' ? activeBookings : historyBookings;

    return (
        <div className="p-6 sm:p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-800">My Bookings</h1>
                <p className="text-slate-500 mt-1">Manage your pet care requests.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`pb-4 px-2 font-bold text-sm transition-colors relative ${activeTab === 'active' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <span className="flex items-center gap-2"><CalendarCheck size={16}/> Active ({activeBookings.length})</span>
                    {activeTab === 'active' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 px-2 font-bold text-sm transition-colors relative ${activeTab === 'history' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <span className="flex items-center gap-2"><History size={16}/> History ({historyBookings.length})</span>
                    {activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />}
                </button>
            </div>

            {/* Grid */}
            {displayedBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedBookings.map(b => (
                        <BookingCard 
                            key={b._id} 
                            booking={b} 
                            role="owner" 
                            onStatusChange={handleStatusChangeClick}
                            onLeaveReview={handleLeaveReviewClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 border-dashed p-12 text-center text-slate-500 font-medium">
                    {activeTab === 'active' ? 'You have no active bookings.' : 'Your booking history is empty.'}
                </div>
            )}

            <ReviewModal 
                isOpen={reviewModalOpen}
                onClose={() => { setReviewModalOpen(false); setSelectedBookingForReview(null); }}
                onSubmit={handleReviewSubmit}
                caregiverName={selectedBookingForReview?.caregiver?.name}
            />

            <ConfirmationModal
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                onConfirm={() => processStatusChange(selectedBookingForCancel, 'Cancelled')}
                title="Cancel Booking"
                message="Are you sure you want to cancel this booking? This action cannot be undone."
                confirmLabel="Cancel Booking"
                danger={true}
            />
        </div>
    );
};

export default Bookings;
