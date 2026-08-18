import React, { useEffect, useState } from 'react';
import BookingCard from '../../components/BookingCard';
import Loader from '../../components/Loader';
import { getCaregiverBookings, updateBookingStatus } from '../../services/bookingService';
import toast from 'react-hot-toast';
import { History, CheckCircle, Clock } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // upcoming or past
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchBookings = async () => {
        try {
            const res = await getCaregiverBookings();
            setBookings(res.data);
        } catch (error) {
            toast.error('Failed to load booking history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusChangeClick = (id, status) => {
        if (status === 'Completed') {
            setSelectedBooking(id);
            setConfirmModalOpen(true);
        } else {
            processStatusChange(id, status);
        }
    };

    const processStatusChange = async (id, status) => {
        try {
            await updateBookingStatus(id, status);
            toast.success(`Booking ${status.toLowerCase()}`);
            fetchBookings(); // refresh
            setConfirmModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update booking');
            setConfirmModalOpen(false);
        }
    };

    if (loading) return <div className="flex justify-center py-32"><Loader /></div>;

    const upcomingBookings = bookings.filter(b => b.status === 'Accepted');
    const pastBookings = bookings.filter(b => ['Completed', 'Cancelled', 'Rejected'].includes(b.status));

    const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

    return (
        <div className="p-6 sm:p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                    <History size={28} className="text-blue-500" /> My Jobs
                </h1>
                <p className="text-slate-500 mt-1">Manage your accepted and past bookings.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`pb-4 px-2 font-bold text-sm transition-colors relative ${activeTab === 'upcoming' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <span className="flex items-center gap-2"><Clock size={16}/> Upcoming ({upcomingBookings.length})</span>
                    {activeTab === 'upcoming' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`pb-4 px-2 font-bold text-sm transition-colors relative ${activeTab === 'past' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <span className="flex items-center gap-2"><CheckCircle size={16}/> Past ({pastBookings.length})</span>
                    {activeTab === 'past' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full" />}
                </button>
            </div>

            {/* Grid */}
            {displayedBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedBookings.map(b => (
                        <BookingCard 
                            key={b._id} 
                            booking={b} 
                            role="caregiver" 
                            onStatusChange={handleStatusChangeClick} 
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 border-dashed p-12 text-center text-slate-500 font-medium">
                    {activeTab === 'upcoming' ? 'You have no upcoming jobs.' : 'Your past job history is empty.'}
                </div>
            )}

            <ConfirmationModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={() => processStatusChange(selectedBooking, 'Completed')}
                title="Mark as Completed"
                message="Are you sure you want to mark this booking as completed? The pet owner will be notified."
                confirmLabel="Yes, Complete"
                danger={false}
            />
        </div>
    );
};

export default BookingHistory;
