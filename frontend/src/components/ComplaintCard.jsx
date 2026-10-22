import React from 'react';
import { Calendar, ChevronRight, MessageSquare, ShieldAlert, PawPrint } from 'lucide-react';
import ComplaintStatusBadge from './ComplaintStatusBadge';

const ComplaintCard = ({ complaint, onSelect }) => {
    const booking = complaint.bookingId || complaint.booking;
    const shortId = complaint._id?.slice(-6).toUpperCase();

    return (
        <div 
            onClick={() => onSelect(complaint)}
            className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full relative"
        >
            {/* Top Bar: ID, Category & Status */}
            <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60">
                        #{shortId}
                    </span>
                    <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md border border-indigo-100">
                        {complaint.category || 'Other'}
                    </span>
                </div>
                <ComplaintStatusBadge status={complaint.status} />
            </div>

            {/* Subject */}
            <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
                {complaint.subject}
            </h3>

            {/* Description Snippet */}
            <p className="text-slate-600 text-xs mb-4 line-clamp-2 leading-relaxed flex-1">
                {complaint.description}
            </p>

            {/* Optional Attached Booking Info */}
            {booking && (
                <div className="mb-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                        <Calendar size={13} className="text-blue-500 shrink-0" />
                        <span className="font-medium truncate">{booking.service} on {booking.date}</span>
                    </div>
                    {booking.pet?.name && (
                        <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
                            <PawPrint size={11} className="text-orange-400" />
                            {booking.pet.name}
                        </span>
                    )}
                </div>
            )}

            {/* Admin Response Snippet if available */}
            {complaint.adminResponse && (
                <div className="mb-3 p-2 bg-emerald-50/70 rounded-xl border border-emerald-100/80 text-[11px] text-emerald-800 line-clamp-1">
                    <span className="font-bold">Admin:</span> {complaint.adminResponse}
                </div>
            )}

            {complaint.rejectionReason && (
                <div className="mb-3 p-2 bg-rose-50/70 rounded-xl border border-rose-100/80 text-[11px] text-rose-800 line-clamp-1">
                    <span className="font-bold">Rejection:</span> {complaint.rejectionReason}
                </div>
            )}

            {/* Footer with Date and Action link */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-auto">
                <span>
                    {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1 font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    View Details
                    <ChevronRight size={14} />
                </span>
            </div>
        </div>
    );
};

export default ComplaintCard;
