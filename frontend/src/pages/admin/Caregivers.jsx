import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Check,
    X,
    Trash2,
    ShieldCheck,
    FileText,
    AlertTriangle,
    Clock,
    XCircle,
    Search,
    ExternalLink,
    RefreshCw,
    MapPin,
    Calendar,
    Filter
} from 'lucide-react';
import DataTable from '../../components/DataTable';
import {
    getCaregivers,
    deleteUser,
    viewCaregiverDocument,
    approveVerification,
    rejectVerification,
    requestChangesVerification
} from '../../services/adminService';
import toast from 'react-hot-toast';

const Caregivers = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialStatus = searchParams.get('status') || '';

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    // Modals state
    const [reviewModal, setReviewModal] = useState({ open: false, row: null, pdfUrl: null, loading: false });
    const [approveModal, setApproveModal] = useState({ open: false, row: null, note: '', submitting: false });
    const [rejectModal, setRejectModal] = useState({ open: false, row: null, reason: '', submitting: false });
    const [changesModal, setChangesModal] = useState({ open: false, row: null, reason: '', submitting: false });

    // Fetch caregivers
    const fetchCaregivers = useCallback(async (page, searchTerm, status) => {
        setLoading(true);
        try {
            const params = { page, search: searchTerm, limit: 10 };
            if (status) params.status = status;

            const res = await getCaregivers(params);
            setData(res.data.data);
            setPagination({
                page: res.data.page,
                pages: res.data.pages,
                total: res.data.total
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch caregivers');
        } finally {
            setLoading(false);
        }
    }, []);

    // Sync status filter with URL query param if changed
    useEffect(() => {
        const paramStatus = searchParams.get('status') || '';
        if (paramStatus !== statusFilter) {
            setStatusFilter(paramStatus);
        }
        // eslint-disable-next-line
    }, [searchParams]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchCaregivers(1, search, statusFilter);
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, statusFilter, fetchCaregivers]);

    const handleFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        if (newStatus) {
            setSearchParams({ status: newStatus });
        } else {
            setSearchParams({});
        }
    };

    // Open Document Preview Modal (Authorized fetch via JWT)
    const handleOpenDocument = async (row) => {
        setReviewModal({ open: true, row, pdfUrl: null, loading: true });
        try {
            const res = await viewCaregiverDocument(row._id);
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            setReviewModal({ open: true, row, pdfUrl: blobUrl, loading: false });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to load PDF document.');
            setReviewModal({ open: false, row: null, pdfUrl: null, loading: false });
        }
    };

    const handleCloseReviewModal = () => {
        if (reviewModal.pdfUrl) {
            URL.revokeObjectURL(reviewModal.pdfUrl);
        }
        setReviewModal({ open: false, row: null, pdfUrl: null, loading: false });
    };

    // APPROVE
    const handleConfirmApprove = async () => {
        const row = approveModal.row;
        if (!row) return;

        setApproveModal(prev => ({ ...prev, submitting: true }));
        try {
            await approveVerification(row._id, approveModal.note);
            toast.success(`Caregiver ${row.user?.name} has been approved.`);
            setApproveModal({ open: false, row: null, note: '', submitting: false });
            if (reviewModal.open && reviewModal.row?._id === row._id) {
                handleCloseReviewModal();
            }
            fetchCaregivers(pagination.page, search, statusFilter);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve caregiver.');
            setApproveModal(prev => ({ ...prev, submitting: false }));
        }
    };

    // REJECT
    const handleConfirmReject = async () => {
        const row = rejectModal.row;
        if (!row) return;

        if (!rejectModal.reason.trim()) {
            toast.error('Please enter a rejection reason.');
            return;
        }

        setRejectModal(prev => ({ ...prev, submitting: true }));
        try {
            await rejectVerification(row._id, rejectModal.reason.trim());
            toast.success(`Caregiver ${row.user?.name} verification rejected.`);
            setRejectModal({ open: false, row: null, reason: '', submitting: false });
            if (reviewModal.open && reviewModal.row?._id === row._id) {
                handleCloseReviewModal();
            }
            fetchCaregivers(pagination.page, search, statusFilter);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reject verification.');
            setRejectModal(prev => ({ ...prev, submitting: false }));
        }
    };

    // REQUEST CHANGES
    const handleConfirmRequestChanges = async () => {
        const row = changesModal.row;
        if (!row) return;

        if (!changesModal.reason.trim()) {
            toast.error('Please provide correction instructions for the caregiver.');
            return;
        }

        setChangesModal(prev => ({ ...prev, submitting: true }));
        try {
            await requestChangesVerification(row._id, changesModal.reason.trim());
            toast.success(`Correction instructions sent to ${row.user?.name}.`);
            setChangesModal({ open: false, row: null, reason: '', submitting: false });
            if (reviewModal.open && reviewModal.row?._id === row._id) {
                handleCloseReviewModal();
            }
            fetchCaregivers(pagination.page, search, statusFilter);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to request corrections.');
            setChangesModal(prev => ({ ...prev, submitting: false }));
        }
    };

    // DELETE CAREGIVER
    const handleDelete = async (userId, name) => {
        if (!window.confirm(`Delete caregiver "${name}" and all their data completely? This cannot be undone.`)) return;
        try {
            await deleteUser(userId);
            toast.success('Caregiver deleted successfully');
            fetchCaregivers(pagination.page, search, statusFilter);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete caregiver');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved':
            case 'Verified':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <ShieldCheck size={13} /> Approved
                    </span>
                );
            case 'Pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Clock size={13} /> Pending Review
                    </span>
                );
            case 'Rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <XCircle size={13} /> Rejected
                    </span>
                );
            case 'Changes Requested':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        <AlertTriangle size={13} /> Changes Requested
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Not Submitted
                    </span>
                );
        }
    };

    const columns = [
        {
            header: 'Caregiver',
            accessor: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-300">
                        {row.user?.name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div className="min-w-0">
                        <span className="block font-bold text-slate-800 text-sm leading-tight">
                            {row.user?.name || 'Unknown'}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            {row.location ? (
                                <span className="inline-flex items-center gap-0.5">
                                    <MapPin size={11} /> {row.location}
                                </span>
                            ) : null}
                            {row.experience !== undefined && (
                                <span>• {row.experience} yr exp</span>
                            )}
                            {row.price ? (
                                <span className="font-semibold text-emerald-600">₹{row.price}/hr</span>
                            ) : null}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Contact',
            accessor: (row) => (
                <div>
                    <p className="text-sm text-slate-700">{row.user?.email || '—'}</p>
                    {row.user?.phone && (
                        <p className="text-xs text-slate-400 mt-0.5">{row.user.phone}</p>
                    )}
                </div>
            )
        },
        {
            header: 'Verification Document',
            accessor: (row) => {
                const hasDoc = Boolean(row.verificationDocumentPath);
                return (
                    <div>
                        {hasDoc ? (
                            <div className="space-y-1">
                                <button
                                    onClick={() => handleOpenDocument(row)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200"
                                    title="Review PDF"
                                >
                                    <FileText size={13} /> Review PDF
                                </button>
                                <p className="text-[11px] text-slate-400">
                                    {row.verificationDocumentUploadedAt
                                        ? new Date(row.verificationDocumentUploadedAt).toLocaleDateString()
                                        : '—'}
                                </p>
                            </div>
                        ) : (
                            <span className="text-xs text-slate-400 italic">No document</span>
                        )}
                    </div>
                );
            }
        },
        {
            header: 'Status',
            accessor: (row) => (
                <div>
                    {getStatusBadge(row.verificationStatus)}
                    {row.verificationNote && (
                        <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] truncate" title={row.verificationNote}>
                            <span className="font-semibold">Note:</span> {row.verificationNote}
                        </p>
                    )}
                    {(row.verificationStatus === 'Approved' || row.verificationStatus === 'Verified') && row.verifiedAt && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                            Approved on {new Date(row.verifiedAt).toLocaleDateString()}
                        </p>
                    )}
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (row) => {
                const isApproved = row.verificationStatus === 'Approved' || row.verificationStatus === 'Verified';
                const isRejected = row.verificationStatus === 'Rejected';

                return (
                    <div className="flex items-center gap-1.5">
                        {/* Approve Button */}
                        <button
                            onClick={() => setApproveModal({ open: true, row, note: '', submitting: false })}
                            disabled={isApproved}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                                isApproved
                                    ? 'opacity-40 cursor-not-allowed text-slate-400'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer'
                            }`}
                            title="Approve Caregiver"
                        >
                            <Check size={15} />
                            <span className="hidden xl:inline">Approve</span>
                        </button>

                        {/* Request Changes Button */}
                        <button
                            onClick={() => setChangesModal({ open: true, row, reason: '', submitting: false })}
                            className="p-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Request Changes"
                        >
                            <AlertTriangle size={15} />
                            <span className="hidden xl:inline">Changes</span>
                        </button>

                        {/* Reject Button */}
                        <button
                            onClick={() => setRejectModal({ open: true, row, reason: '', submitting: false })}
                            disabled={isRejected}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                                isRejected
                                    ? 'opacity-40 cursor-not-allowed text-slate-400'
                                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer'
                            }`}
                            title="Reject Verification"
                        >
                            <X size={15} />
                            <span className="hidden xl:inline">Reject</span>
                        </button>

                        <div className="w-px h-4 bg-slate-200 mx-1"></div>

                        {/* Delete User */}
                        <button
                            onClick={() => handleDelete(row.user?._id, row.user?.name)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Caregiver Completely"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                );
            }
        }
    ];

    const filterTabs = [
        { label: 'All', value: '' },
        { label: 'Pending Review', value: 'Pending' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Changes Requested', value: 'Changes Requested' },
        { label: 'Rejected', value: 'Rejected' },
        { label: 'Not Submitted', value: 'Not Submitted' },
    ];

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                        Caregivers & Verifications
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Unified management for registered caregivers, verification documents, and review decisions.
                    </p>
                </div>

                {/* Filter Dropdown on mobile / small screens */}
                <div className="flex items-center gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                    >
                        {filterTabs.map(tab => (
                            <option key={tab.value} value={tab.value}>
                                {tab.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {filterTabs.map((tab) => {
                    const isActive = statusFilter === tab.value;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => handleFilterChange(tab.value)}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* DataTable */}
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                search={{
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    placeholder: 'Search caregiver name or email...'
                }}
                pagination={{
                    page: pagination.page,
                    pages: pagination.pages,
                    onPageChange: (p) => fetchCaregivers(p, search, statusFilter)
                }}
            />

            {/* ======================================================== */}
            {/* Modal 1: Document Review Modal (Authorized PDF Stream) */}
            {/* ======================================================== */}
            {reviewModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col max-h-[92vh] overflow-hidden border border-slate-200">
                        {/* Header */}
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <div className="min-w-0 pr-4">
                                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2 truncate">
                                    <FileText className="text-blue-600 shrink-0" size={20} />
                                    <span>Document Review: {reviewModal.row?.user?.name}</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5 truncate">
                                    File: {reviewModal.row?.verificationDocumentOriginalName || 'verification.pdf'} • Uploaded: {reviewModal.row?.verificationDocumentUploadedAt ? new Date(reviewModal.row.verificationDocumentUploadedAt).toLocaleString() : '—'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {reviewModal.pdfUrl && (
                                    <a
                                        href={reviewModal.pdfUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <ExternalLink size={13} /> Open in Tab
                                    </a>
                                )}
                                <button
                                    onClick={handleCloseReviewModal}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* PDF Viewer Body */}
                        <div className="flex-1 p-4 bg-slate-100 overflow-hidden flex items-center justify-center min-h-[500px]">
                            {reviewModal.loading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <RefreshCw className="animate-spin text-blue-600" size={32} />
                                    <p className="text-xs text-slate-500 font-medium">Loading secure document...</p>
                                </div>
                            ) : reviewModal.pdfUrl ? (
                                <iframe
                                    src={reviewModal.pdfUrl}
                                    title="Verification Document"
                                    className="w-full h-[580px] rounded-xl border border-slate-300 shadow-sm bg-white"
                                />
                            ) : (
                                <p className="text-slate-500 text-sm">Failed to load PDF.</p>
                            )}
                        </div>

                        {/* Modal Footer with Quick Decision Actions */}
                        <div className="p-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
                            <div className="text-xs text-slate-500 font-medium">
                                Current Status: <strong>{reviewModal.row?.verificationStatus}</strong>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setChangesModal({ open: true, row: reviewModal.row, reason: '', submitting: false })}
                                    className="px-3 py-2 text-xs font-bold rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                    <AlertTriangle size={14} /> Request Corrections
                                </button>
                                <button
                                    onClick={() => setRejectModal({ open: true, row: reviewModal.row, reason: '', submitting: false })}
                                    className="px-3 py-2 text-xs font-bold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                    <X size={14} /> Reject
                                </button>
                                <button
                                    onClick={() => setApproveModal({ open: true, row: reviewModal.row, note: '', submitting: false })}
                                    className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                                >
                                    <Check size={14} /> Approve Document
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* Modal 2: Approve Confirmation Modal */}
            {/* ======================================================== */}
            {approveModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-scaleUp">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                            <Check size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">
                            Approve Caregiver
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                            Are you sure you want to approve <strong>{approveModal.row?.user?.name}</strong>?
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            This will record your decision, mark the caregiver as verified, and make them searchable by pet owners.
                        </p>

                        <div className="mt-4">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Optional Admin Note
                            </label>
                            <input
                                type="text"
                                value={approveModal.note}
                                onChange={(e) => setApproveModal(prev => ({ ...prev, note: e.target.value }))}
                                placeholder="E.g. Verified valid government ID and experience certificate"
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                            />
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setApproveModal({ open: false, row: null, note: '', submitting: false })}
                                disabled={approveModal.submitting}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmApprove}
                                disabled={approveModal.submitting}
                                className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                                {approveModal.submitting ? 'Approving...' : 'Confirm Approval'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* Modal 3: Reject Modal with Required Reason */}
            {/* ======================================================== */}
            {rejectModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-scaleUp">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                            <X size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">
                            Reject Verification
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                            Rejecting documents for <strong>{rejectModal.row?.user?.name}</strong>.
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            A specific reason is required. This message will be displayed to the caregiver on their dashboard.
                        </p>

                        <div className="mt-4">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Rejection Reason <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                rows={4}
                                value={rejectModal.reason}
                                onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                                placeholder="Explain why the submitted documents were rejected..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50"
                            />
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setRejectModal({ open: false, row: null, reason: '', submitting: false })}
                                disabled={rejectModal.submitting}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmReject}
                                disabled={rejectModal.submitting}
                                className="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                                {rejectModal.submitting ? 'Rejecting...' : 'Reject Submission'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* Modal 4: Request Corrections Modal with Required Instructions */}
            {/* ======================================================== */}
            {changesModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-scaleUp">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">
                            Request Document Corrections
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                            Ask <strong>{changesModal.row?.user?.name}</strong> to make corrections and re-upload their verification PDF.
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Please provide clear instructions on what needs to be fixed.
                        </p>

                        <div className="mt-4">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Correction Instructions <span className="text-blue-500">*</span>
                            </label>
                            <textarea
                                rows={4}
                                value={changesModal.reason}
                                onChange={(e) => setChangesModal(prev => ({ ...prev, reason: e.target.value }))}
                                placeholder="E.g. Please upload a clearer copy of your government ID and ensure the address matches..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                            />
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setChangesModal({ open: false, row: null, reason: '', submitting: false })}
                                disabled={changesModal.submitting}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmRequestChanges}
                                disabled={changesModal.submitting}
                                className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                                {changesModal.submitting ? 'Submitting...' : 'Send Correction Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Caregivers;
