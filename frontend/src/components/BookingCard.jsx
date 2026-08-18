import React from 'react';
import { Calendar, Clock, MapPin, AlignLeft, User, ShieldCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * Reusable Card for Bookings
 * @param {Object} booking - The populated booking object
 * @param {String} role - 'owner' or 'caregiver'
 * @param {Function} onStatusChange - Handler for action buttons (e.g., accept, cancel)
 * @param {Function} onLeaveReview - Handler for leaving a review
 */
const BookingCard = ({ booking, role, onStatusChange, onLeaveReview }) => {
    const isOwner = role === 'owner';
    const otherParty = isOwner ? booking.caregiver : booking.owner;
    
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden border border-blue-100">
                        {otherParty?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">{otherParty?.name}</h4>
                        <p className="text-xs text-slate-500 font-medium capitalize">
                            {isOwner ? 'Caregiver' : 'Pet Owner'}
                        </p>
                    </div>
                </div>
                <StatusBadge status={booking.status} />
            </div>

            <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                    <ShieldCheck size={16} className="text-slate-400" />
                    <span className="font-semibold text-slate-700">Service:</span>
                    <span>{booking.service}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 px-2">
                    <User size={16} className="text-emerald-500" />
                    <span className="font-semibold">Pet:</span> {booking.pet?.name} ({booking.pet?.breed})
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 px-2">
                    <Calendar size={16} className="text-blue-500" />
                    <span className="font-semibold">Date:</span> {booking.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 px-2">
                    <Clock size={16} className="text-amber-500" />
                    <span className="font-semibold">Time:</span> {booking.time}
                </div>
                {booking.notes && (
                    <div className="flex items-start gap-2 text-sm text-slate-600 px-2 mt-2 pt-2 border-t border-slate-100">
                        <AlignLeft size={16} className="text-slate-400 mt-0.5 shrink-0" />
                        <span className="italic">"{booking.notes}"</span>
                    </div>
                )}
            </div>

            {/* Action Buttons based on Role & Status */}
            <div className="flex gap-2 border-t border-slate-100 pt-4 mt-auto">
                {isOwner && (booking.status === 'Pending' || booking.status === 'Accepted') && (
                    <button
                        onClick={() => onStatusChange(booking._id, 'Cancelled')}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-xl text-sm transition-colors cursor-pointer"
                    >
                        Cancel Booking
                    </button>
                )}

                {!isOwner && booking.status === 'Pending' && (
                    <>
                        <button
                            onClick={() => onStatusChange(booking._id, 'Rejected')}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-sm transition-colors cursor-pointer"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => onStatusChange(booking._id, 'Accepted')}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-xl text-sm transition-colors cursor-pointer shadow-sm shadow-emerald-200"
                        >
                            Accept
                        </button>
                    </>
                )}

                {!isOwner && booking.status === 'Accepted' && (
                    <button
                        onClick={() => onStatusChange(booking._id, 'Completed')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl text-sm transition-colors cursor-pointer shadow-sm shadow-blue-200"
                    >
                        Mark as Completed
                    </button>
                )}
                
                
                {isOwner && booking.status === 'Completed' && (
                    <button
                        onClick={() => onLeaveReview && onLeaveReview(booking)}
                        className="w-full bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 font-semibold py-2 rounded-xl text-sm transition-colors cursor-pointer"
                    >
                        Leave a Review
                    </button>
                )}

                {/* Fallback for history view */}
                {((isOwner && (booking.status === 'Cancelled' || booking.status === 'Rejected')) || (!isOwner && (booking.status === 'Completed' || booking.status === 'Cancelled' || booking.status === 'Rejected'))) && (
                     <p className="w-full text-center text-xs text-slate-400 font-medium py-1">
                         No further actions available.
                     </p>
                )}
            </div>
        </div>
    );
};

export default BookingCard;
