import React, { useEffect } from 'react';
import { 
    X, AlertTriangle, Calendar, User, ShieldAlert, 
    FileText, CheckCircle2, XCircle, Info, Clock, PawPrint
} from 'lucide-react';
import ComplaintStatusBadge from './ComplaintStatusBadge';
import StatusBadge from './StatusBadge';

const ComplaintDetailsModal = ({ isOpen, onClose, complaint, isAdmin = false, onInvestigate }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !complaint) return null;

    const booking = complaint.bookingId || complaint.booking;
    const submitter = complaint.submittedBy || complaint.user;
    const target = complaint.targetUser;
    const shortId = complaint._id?.slice(-6).toUpperCase();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col z-10 animate-[fadeScaleIn_0.15s_ease-out]">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-slate-800">
                                    Complaint Details
                                </h2>
                                <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                                    #{shortId}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Submitted on {new Date(complaint.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ComplaintStatusBadge status={complaint.status} />
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Category & Subject */}
                    <div>
                        <div className="inline-block px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 text-xs font-semibold mb-2">
                            {complaint.category || 'General'}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 leading-snug">
                            {complaint.subject}
                        </h3>
                    </div>

                    {/* Parties info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                Complainant
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                    {submitter?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 leading-tight">
                                        {submitter?.name || 'Unknown User'}
                                    </p>
                                    <p className="text-xs text-slate-500 capitalize">
                                        {submitter?.role || 'User'} • {submitter?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {target && (
                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                    Reported Party
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                                        {target?.name?.charAt(0)?.toUpperCase() || 'T'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 leading-tight">
                                            {target?.name}
                                        </p>
                                        <p className="text-xs text-slate-500 capitalize">
                                            {target?.role || 'User'} • {target?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <FileText size={14} className="text-slate-400" />
                            Detailed Description
                        </h4>
                        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                            {complaint.description}
                        </div>
                    </div>

                    {/* Related Booking Details */}
                    {booking && (
                        <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/60 p-4 rounded-2xl border border-blue-100">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Calendar size={14} className="text-blue-600" />
                                    Related Booking Information
                                </h4>
                                {booking.status && <StatusBadge status={booking.status} />}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                <div className="bg-white/80 p-2.5 rounded-xl border border-blue-50">
                                    <span className="text-slate-400 block font-medium">Service</span>
                                    <span className="font-bold text-slate-800">{booking.service || 'N/A'}</span>
                                </div>
                                <div className="bg-white/80 p-2.5 rounded-xl border border-blue-50">
                                    <span className="text-slate-400 block font-medium">Date & Time</span>
                                    <span className="font-bold text-slate-800">{booking.date} at {booking.time}</span>
                                </div>
                                <div className="bg-white/80 p-2.5 rounded-xl border border-blue-50">
                                    <span className="text-slate-400 block font-medium">Pet</span>
                                    <span className="font-bold text-slate-800 flex items-center gap-1">
                                        <PawPrint size={12} className="text-orange-500" />
                                        {booking.pet?.name || 'Pet'} {booking.pet?.breed ? `(${booking.pet.breed})` : ''}
                                    </span>
                                </div>
                                <div className="bg-white/80 p-2.5 rounded-xl border border-blue-50">
                                    <span className="text-slate-400 block font-medium">Caregiver</span>
                                    <span className="font-bold text-slate-800">
                                        {booking.caregiver?.name || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Admin Response / Rejection Section */}
                    {(complaint.adminResponse || complaint.rejectionReason || complaint.handledBy || complaint.resolvedAt) && (
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Info size={14} className="text-blue-500" />
                                Admin Investigation & Response
                            </h4>

                            {complaint.rejectionReason && (
                                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                                    <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-1">
                                        <XCircle size={16} />
                                        Rejection Reason
                                    </div>
                                    <p className="text-xs text-rose-900 leading-relaxed whitespace-pre-wrap">
                                        {complaint.rejectionReason}
                                    </p>
                                </div>
                            )}

                            {complaint.adminResponse && (
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-1">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                        Admin Response / Findings
                                    </div>
                                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {complaint.adminResponse}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                                {complaint.handledBy && (
                                    <span>
                                        Handled by: <strong className="text-slate-600">{complaint.handledBy.name}</strong>
                                    </span>
                                )}
                                {complaint.resolvedAt && (
                                    <span>
                                        Resolved on: <strong className="text-slate-600">{new Date(complaint.resolvedAt).toLocaleDateString()}</strong>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                        {isAdmin ? 'Admin Moderation Panel' : 'Status updates will appear here automatically.'}
                    </p>

                    <div className="flex items-center gap-2">
                        {isAdmin && onInvestigate && (
                            <button
                                onClick={() => {
                                    onClose();
                                    onInvestigate(complaint);
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                            >
                                Take Action
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetailsModal;
