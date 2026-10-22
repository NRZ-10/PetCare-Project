import React, { useState, useEffect, useCallback } from 'react';
import { 
    AlertTriangle, Loader2, CheckCircle, Clock, 
    X, Search, Edit3, Filter, RefreshCw, Eye,
    Calendar, User, ShieldAlert, LayoutGrid, Table as TableIcon,
    XCircle, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import complaintService, { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } from '../../services/complaintService';
import ComplaintStatusBadge from '../../components/ComplaintStatusBadge';
import ComplaintDetailsModal from '../../components/ComplaintDetailsModal';
import AdminComplaintModal from '../../components/AdminComplaintModal';
import EmptyState from '../../components/EmptyState';

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [counts, setCounts] = useState({ all: 0, pending: 0, inProgress: 0, resolved: 0, rejected: 0 });

    // Modals
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);

    const fetchComplaints = useCallback(async (page = 1, currentSearch = search, currentStatus = statusFilter, currentCategory = categoryFilter) => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 12,
                status: currentStatus || undefined,
                category: currentCategory || undefined,
                search: currentSearch || undefined
            };

            const response = await complaintService.getAdminComplaints(params);
            setComplaints(response.data || []);
            setPagination({
                page: response.page || 1,
                pages: response.pages || 1,
                total: response.total || 0
            });
            if (response.counts) {
                setCounts(response.counts);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, categoryFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchComplaints(1, search, statusFilter, categoryFilter);
        }, 350);
        return () => clearTimeout(timer);
    }, [search, statusFilter, categoryFilter, fetchComplaints]);

    const handleOpenDetails = (complaint) => {
        setSelectedComplaint(complaint);
        setIsDetailsOpen(true);
    };

    const handleOpenAction = (complaint) => {
        setSelectedComplaint(complaint);
        setIsActionOpen(true);
    };

    const handleActionComplete = () => {
        fetchComplaints(pagination.page, search, statusFilter, categoryFilter);
    };

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        <div className="p-2.5 bg-red-100 text-red-600 rounded-2xl shadow-xs">
                            <AlertTriangle size={28} />
                        </div>
                        Complaint Moderation
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Investigate disputes, review booking cross-references, and resolve user complaints.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchComplaints(pagination.page, search, statusFilter, categoryFilter)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                    { label: 'All Complaints', count: counts.all, filter: '', color: 'border-slate-300 bg-white' },
                    { label: 'Pending Review', count: counts.pending, filter: 'Pending', color: 'border-amber-200 bg-amber-50/50 text-amber-700' },
                    { label: 'In Progress', count: counts.inProgress, filter: 'In Progress', color: 'border-blue-200 bg-blue-50/50 text-blue-700' },
                    { label: 'Resolved', count: counts.resolved, filter: 'Resolved', color: 'border-emerald-200 bg-emerald-50/50 text-emerald-700' },
                    { label: 'Rejected', count: counts.rejected, filter: 'Rejected', color: 'border-rose-200 bg-rose-50/50 text-rose-700' }
                ].map((item) => {
                    const isSelected = statusFilter === item.filter;
                    return (
                        <div
                            key={item.label}
                            onClick={() => setStatusFilter(item.filter)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-sm ${item.color} ${
                                isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                            }`}
                        >
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                {item.label}
                            </span>
                            <div className="text-2xl font-black mt-1 text-slate-800">
                                {item.count}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filter & Search Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by ID, subject, or user name..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        {COMPLAINT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    {/* View Switcher */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title="Table View"
                        >
                            <TableIcon size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title="Grid View"
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>

                    {(search || statusFilter || categoryFilter) && (
                        <button
                            onClick={() => {
                                setSearch('');
                                setStatusFilter('');
                                setCategoryFilter('');
                            }}
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 underline px-2 cursor-pointer"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
                    <p className="text-slate-400 text-xs font-medium">Loading complaints...</p>
                </div>
            ) : complaints.length === 0 ? (
                <EmptyState
                    icon={ShieldAlert}
                    title="No Complaints Found"
                    message="There are no complaints matching your active search or filters."
                />
            ) : viewMode === 'table' ? (
                /* Table View */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Complainant</th>
                                    <th className="p-4">Subject & Category</th>
                                    <th className="p-4">Related Booking</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {complaints.map((item) => {
                                    const submitter = item.submittedBy || item.user;
                                    const booking = item.bookingId || item.booking;
                                    const shortId = item._id?.slice(-6).toUpperCase();

                                    return (
                                        <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                                            {/* ID */}
                                            <td className="p-4 font-mono font-bold text-slate-900">
                                                #{shortId}
                                            </td>

                                            {/* Complainant */}
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800">
                                                    {submitter?.name || 'Unknown'}
                                                </div>
                                                <div className="text-[11px] text-slate-400 capitalize">
                                                    {submitter?.role || 'User'} • {submitter?.email}
                                                </div>
                                            </td>

                                            {/* Subject & Category */}
                                            <td className="p-4 max-w-xs">
                                                <div className="font-bold text-slate-900 truncate">
                                                    {item.subject}
                                                </div>
                                                <span className="inline-block px-2 py-0.5 mt-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-semibold">
                                                    {item.category || 'Other'}
                                                </span>
                                            </td>

                                            {/* Related Booking */}
                                            <td className="p-4">
                                                {booking ? (
                                                    <div>
                                                        <div className="font-semibold text-slate-800">
                                                            {booking.service}
                                                        </div>
                                                        <div className="text-[11px] text-slate-400">
                                                            {booking.date} ({booking.status})
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-[11px]">None</span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="p-4">
                                                <ComplaintStatusBadge status={item.status} />
                                            </td>

                                            {/* Date */}
                                            <td className="p-4 text-slate-400 whitespace-nowrap">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleOpenDetails(item)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                                        title="View Full Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenAction(item)}
                                                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1"
                                                    >
                                                        <Edit3 size={13} />
                                                        Take Action
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {complaints.map((complaint) => {
                        const submitter = complaint.submittedBy || complaint.user;
                        const target = complaint.targetUser;
                        const booking = complaint.bookingId || complaint.booking;

                        return (
                            <div 
                                key={complaint._id} 
                                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow p-6 flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                                            #{complaint._id.slice(-6).toUpperCase()}
                                        </span>
                                        <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                                            {complaint.category || 'Other'}
                                        </span>
                                    </div>
                                    <ComplaintStatusBadge status={complaint.status} />
                                </div>
                                
                                <h3 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-1">
                                    {complaint.subject}
                                </h3>
                                <p className="text-slate-600 text-xs mb-4 flex-grow line-clamp-3 leading-relaxed">
                                    {complaint.description}
                                </p>
                                
                                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                                    <p>
                                        <span className="font-semibold text-slate-700">From:</span> {submitter?.name} ({submitter?.role})
                                    </p>
                                    {target && (
                                        <p>
                                            <span className="font-semibold text-slate-700">Against:</span> {target.name} ({target.role})
                                        </p>
                                    )}
                                    {booking && (
                                        <p>
                                            <span className="font-semibold text-slate-700">Booking:</span> {booking.service} on {booking.date}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
                                    <span className="text-slate-400">
                                        {new Date(complaint.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenDetails(complaint)}
                                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
                                        >
                                            Details
                                        </button>
                                        <button
                                            onClick={() => handleOpenAction(complaint)}
                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                                        >
                                            <Edit3 size={13} />
                                            Action
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
                    <div>
                        Showing page <strong className="text-slate-800">{pagination.page}</strong> of <strong className="text-slate-800">{pagination.pages}</strong> ({pagination.total} total)
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fetchComplaints(pagination.page - 1, search, statusFilter, categoryFilter)}
                            disabled={pagination.page <= 1 || loading}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 font-semibold disabled:opacity-50 cursor-pointer"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => fetchComplaints(pagination.page + 1, search, statusFilter, categoryFilter)}
                            disabled={pagination.page >= pagination.pages || loading}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 font-semibold disabled:opacity-50 cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Full Details Modal */}
            <ComplaintDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                complaint={selectedComplaint}
                isAdmin={true}
                onInvestigate={(complaint) => {
                    handleOpenAction(complaint);
                }}
            />

            {/* Action / Investigation Modal */}
            <AdminComplaintModal
                isOpen={isActionOpen}
                onClose={() => setIsActionOpen(false)}
                complaint={selectedComplaint}
                onSuccess={handleActionComplete}
            />
        </div>
    );
};

export default AdminComplaints;
