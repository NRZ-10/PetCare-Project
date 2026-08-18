import React, { useEffect, useState } from 'react';
import BookingCard from '../../components/BookingCard';
import Loader from '../../components/Loader';
import { getCaregiverBookings, updateBookingStatus } from '../../services/bookingService';
import toast from 'react-hot-toast';
import { CalendarCheck } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

const BookingRequests = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ id: null, status: '', title: '', message: '', danger: false, confirmLabel: '' });

    const fetchBookings = async () => {
        try {
            const res = await getCaregiverBookings();
            setBookings(res.data);
        } catch (error) {
            toast.error('Failed to load booking requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusChangeClick = (id, status) => {
        const isAccept = status === 'Accepted';
        setModalConfig({
            id,
            status,
            title: isAccept ? 'Accept Booking' : 'Reject Booking',
            message: isAccept ? 'Are you sure you want to accept this booking request?' : 'Are you sure you want to reject this request?',
            danger: !isAccept,
            confirmLabel: isAccept ? 'Accept' : 'Reject'
        });
        setConfirmModalOpen(true);
    };

    const processStatusChange = async () => {
        try {
            await updateBookingStatus(modalConfig.id, modalConfig.status);
            toast.success(`Booking ${modalConfig.status.toLowerCase()}`);
            fetchBookings(); // refresh
            setConfirmModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update booking');
            setConfirmModalOpen(false);
        }
    };

    if (loading) return <div className="flex justify-center py-32"><Loader /></div>;

    const pendingBookings = bookings.filter(b => b.status === 'Pending');

    return (
        <div className="p-6 sm:p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                    <CalendarCheck size={28} className="text-emerald-500" /> Booking Requests
                </h1>
                <p className="text-slate-500 mt-1">Review and manage your incoming requests.</p>
            </div>

            {pendingBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingBookings.map(b => (
                        <BookingCard 
                            key={b._id} 
                            booking={b} 
                            role="caregiver" 
                            onStatusChange={handleStatusChangeClick} 
                        />
                    ))}
                </div>
            ) : (
                <div className="p-6 sm:p-8 max-w-4xl mx-auto h-[60vh] flex flex-col justify-center items-center text-center">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                        <CalendarCheck size={40} className="text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">No pending requests</h2>
                    <p className="text-slate-500 max-w-md">
                        You don't have any incoming booking requests right now. When pet owners request your services, they will appear here.
                    </p>
                </div>
            )}

            <ConfirmationModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={processStatusChange}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmLabel={modalConfig.confirmLabel}
                danger={modalConfig.danger}
            />
        </div>
    );
};

export default BookingRequests;
