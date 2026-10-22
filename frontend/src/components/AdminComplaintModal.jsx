import React, { useState, useEffect } from 'react';
import { 
    X, AlertTriangle, CheckCircle, XCircle, Clock, 
    RefreshCw, Calendar, User, FileText, Loader2, PawPrint, ShieldAlert 
} from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from './StatusBadge';
import ComplaintStatusBadge from './ComplaintStatusBadge';
import ConfirmationModal from './ConfirmationModal';
import complaintService from '../services/complaintService';

const AdminComplaintModal = ({ isOpen, onClose, complaint, onSuccess }) => {
    const [status, setStatus] = useState('Pending');
    const [adminResponse, setAdminResponse] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [saving, setSaving] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, statusToConfirm: null });

    useEffect(() => {
        if (complaint) {
            setStatus(complaint.status || 'Pending');
            setAdminResponse(complaint.adminResponse || complaint.adminNotes || '');
            setRejectionReason(complaint.rejectionReason || '');
        }
    }, [complaint]);

    if (!isOpen || !complaint) return null;

    const booking = complaint.bookingId || complaint.booking;
    const submitter = complaint.submittedBy || complaint.user;
    const target = complaint.targetUser;

    const executeUpdate = async (targetStatus = status) => {
        if (targetStatus === 'Rejected' && !rejectionReason.trim()) {
            toast.error('A rejection reason is required before rejecting a complaint.');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                status: targetStatus,
                adminResponse: adminResponse.trim(),
                rejectionReason: targetStatus === 'Rejected' ? rejectionReason.trim() : rejectionReason
            };

            await complaintService.updateComplaintStatus(complaint._id, payload);
            toast.success(`Complaint status updated to ${targetStatus}`);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update complaint status');
        } finally {
            setSaving(false);
            setConfirmModal({ isOpen: false, statusToConfirm: null });
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (status === 'Rejected' && !rejectionReason.trim()) {
            toast.error('Please enter a rejection reason.');
            return;
        }

        if (status === 'Resolved' || status === 'Rejected') {
            setConfirmModal({
                isOpen: true,
                statusToConfirm: status
            });
        } else {
            executeUpdate(status);
        }
    };

    const handleQuickAction = (actionStatus) => {
        setStatus(actionStatus);
        if (actionStatus === 'In Progress') {
            executeUpdate('In Progress');
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                    onClick={onClose}
                />

                {/* Modal Container */}
                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col z-10 animate-[fadeScaleIn_0.15s_ease-out]">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold text-slate-800">Investigate & Resolve Complaint</h2>
                                    <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                                        #{complaint._id?.slice(-6).toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Review details and record your administrative decision.
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={onClose}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="p-6 overflow-y-auto space-y-6">
                        {/* Status bar & quick transitions */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Status:</span>
                                <ComplaintStatusBadge status={complaint.status} />
                            </div>

                            {complaint.status === 'Pending' && (
                                <button
                                    type="button"
                                    onClick={() => handleQuickAction('In Progress')}
                                    disabled={saving}
                                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    <RefreshCw size={12} className={saving ? 'animate-spin' : ''} />
                                    Mark In Progress
                                </button>
                            )}
                        </div>

                        {/* Complaint Details Card */}
                        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-semibold">
                                    {complaint.category || 'General'}
                                </span>
                                <span className="text-xs text-slate-400">
                                    Submitted {new Date(complaint.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="font-bold text-slate-900 text-base">{complaint.subject}</h3>
                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-100">
                                {complaint.description}
                            </p>

                            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-500 border-t border-slate-100">
                                <div>
                                    <span className="font-semibold text-slate-700">Complainant: </span>
                                    {submitter?.name} ({submitter?.role}) • {submitter?.email}
                                </div>
                                {target && (
                                    <div>
                                        <span className="font-semibold text-slate-700">Reported User: </span>
                                        {target.name} ({target.role}) • {target.email}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Related Booking Overview */}
                        {booking ? (
                            <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/70 p-4 rounded-2xl border border-blue-100 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                                        <Calendar size={14} className="text-blue-600" />
                                        Related Booking Cross-Reference
                                    </h4>
                                    {booking.status && <StatusBadge status={booking.status} />}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                    <div className="bg-white/90 p-2 rounded-xl border border-blue-100">
                                        <span className="text-slate-400 block font-medium">Service</span>
                                        <span className="font-bold text-slate-800">{booking.service}</span>
                                    </div>
                                    <div className="bg-white/90 p-2 rounded-xl border border-blue-100">
                                        <span className="text-slate-400 block font-medium">Date / Time</span>
                                        <span className="font-bold text-slate-800">{booking.date} {booking.time}</span>
                                    </div>
                                    <div className="bg-white/90 p-2 rounded-xl border border-blue-100">
                                        <span className="text-slate-400 block font-medium">Pet</span>
                                        <span className="font-bold text-slate-800">{booking.pet?.name || 'Pet'}</span>
                                    </div>
                                    <div className="bg-white/90 p-2 rounded-xl border border-blue-100">
                                        <span className="text-slate-400 block font-medium">Caregiver</span>
                                        <span className="font-bold text-slate-800">{booking.caregiver?.name || 'N/A'}</span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-blue-700/80 italic pt-1">
                                    Note: Taking administrative action on this complaint will not alter or delete the booking record.
                                </p>
                            </div>
                        ) : (
                            <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 text-center">
                                No specific booking attached to this complaint.
                            </div>
                        )}

                        {/* Decision Form */}
                        <form id="admin-complaint-form" onSubmit={handleFormSubmit} className="space-y-4 pt-2 border-t border-slate-100">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Update Status <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {['Pending', 'In Progress', 'Resolved', 'Rejected'].map((stat) => {
                                        const isSelected = status === stat;
                                        return (
                                            <button
                                                key={stat}
                                                type="button"
                                                onClick={() => setStatus(stat)}
                                                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                                                    isSelected
                                                        ? stat === 'Resolved'
                                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                                            : stat === 'Rejected'
                                                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                                            : stat === 'In Progress'
                                                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                            : 'bg-slate-800 text-white border-slate-800 shadow-sm'
                                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                {stat}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Rejection Reason (Required when status is Rejected) */}
                            {status === 'Rejected' && (
                                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl animate-[fadeScaleIn_0.15s_ease-out]">
                                    <label className="block text-xs font-bold text-rose-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                        <XCircle size={14} className="text-rose-600" />
                                        Rejection Reason <span className="text-rose-600">* (Required)</span>
                                    </label>
                                    <p className="text-[11px] text-rose-600 mb-2">
                                        Explain clearly to the complainant why this complaint is not accepted or actionable.
                                    </p>
                                    <textarea
                                        rows={3}
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="e.g., Insufficient evidence provided, issue was already resolved amicably, or claim does not violate community guidelines..."
                                        className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                                        required
                                    />
                                </div>
                            )}

                            {/* Admin Response / Notes */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <FileText size={14} className="text-slate-400" />
                                    Admin Response / Investigation Findings
                                </label>
                                <p className="text-[11px] text-slate-400 mb-2">
                                    This explanation will be visible to the complainant and logged in the complaint history.
                                </p>
                                <textarea
                                    rows={4}
                                    value={adminResponse}
                                    onChange={(e) => setAdminResponse(e.target.value)}
                                    placeholder="Enter findings, communications conducted, or resolution outcome..."
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 font-semibold text-xs hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            form="admin-complaint-form"
                            disabled={saving}
                            className={`px-6 py-2 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60 ${
                                status === 'Resolved'
                                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                                    : status === 'Rejected'
                                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                            }`}
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={14} />
                                    Save Decision ({status})
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog for Destructive or Final Actions */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, statusToConfirm: null })}
                onConfirm={() => executeUpdate(confirmModal.statusToConfirm)}
                title={`Confirm ${confirmModal.statusToConfirm} Decision`}
                message={
                    confirmModal.statusToConfirm === 'Rejected'
                        ? 'Are you sure you want to reject this complaint? The complainant will be notified with your rejection reason.'
                        : 'Are you sure you want to mark this complaint as Resolved? The complainant will be notified of your findings.'
                }
                confirmLabel={`Confirm ${confirmModal.statusToConfirm}`}
                danger={confirmModal.statusToConfirm === 'Rejected'}
                isLoading={saving}
            />
        </>
    );
};

export default AdminComplaintModal;
