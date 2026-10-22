import React, { useState, useEffect, useMemo } from 'react';
import { 
    AlertTriangle, PlusCircle, Search, Filter, 
    Loader2, CheckCircle2, ShieldAlert, ArrowLeft, RefreshCw 
} from 'lucide-react';
import toast from 'react-hot-toast';
import complaintService, { getComplaintCategoriesByRole, COMPLAINT_STATUSES } from '../services/complaintService';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';
import ComplaintForm from '../components/ComplaintForm';
import EmptyState from '../components/EmptyState';

const UserComplaints = ({ role = 'owner', defaultTab = 'list' }) => {
    const userCategories = getComplaintCategoriesByRole(role);
    const [activeTab, setActiveTab] = useState(defaultTab); // 'list' or 'submit'
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await complaintService.getMyComplaints();
            setComplaints(res.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load your complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    // Filter complaints locally for instant UI feedback
    const filteredComplaints = useMemo(() => {
        return complaints.filter((item) => {
            if (statusFilter && item.status !== statusFilter) return false;
            if (categoryFilter && item.category !== categoryFilter) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchSubject = item.subject?.toLowerCase().includes(q);
                const matchDesc = item.description?.toLowerCase().includes(q);
                const matchId = item._id?.toLowerCase().includes(q);
                if (!matchSubject && !matchDesc && !matchId) return false;
            }
            return true;
        });
    }, [complaints, statusFilter, categoryFilter, searchQuery]);

    const handleComplaintSubmitted = () => {
        fetchComplaints();
        setActiveTab('list');
    };

    const handleSelectComplaint = (complaint) => {
        setSelectedComplaint(complaint);
        setIsDetailsOpen(true);
    };

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-red-100 text-red-600 rounded-2xl">
                            <AlertTriangle size={26} />
                        </div>
                        Disputes & Complaints
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Report issues with caregivers, owners, or bookings and track resolution status.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {activeTab === 'submit' ? (
                        <button
                            onClick={() => setActiveTab('list')}
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            Back to My Complaints
                        </button>
                    ) : (
                        <button
                            onClick={() => setActiveTab('submit')}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                        >
                            <PlusCircle size={18} />
                            File New Complaint
                        </button>
                    )}
                </div>
            </div>

            {/* Tab navigation pills */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
                <button
                    onClick={() => setActiveTab('list')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        activeTab === 'list'
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'text-slate-500 hover:bg-slate-100'
                    }`}
                >
                    My Complaints ({complaints.length})
                </button>
                <button
                    onClick={() => setActiveTab('submit')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        activeTab === 'submit'
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'text-slate-500 hover:bg-slate-100'
                    }`}
                >
                    Submit a Complaint
                </button>
            </div>

            {/* Content Switcher */}
            {activeTab === 'submit' ? (
                <div className="max-w-3xl mx-auto">
                    <ComplaintForm 
                        onSuccess={handleComplaintSubmitted}
                        onCancel={() => setActiveTab('list')}
                    />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Search and Filters Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                        {/* Search input */}
                        <div className="relative flex-1 max-w-md">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by subject, description or ID..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        {/* Status & Category Selects */}
                        <div className="flex flex-wrap items-center gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Statuses</option>
                                {COMPLAINT_STATUSES.map(stat => (
                                    <option key={stat} value={stat}>{stat}</option>
                                ))}
                            </select>

                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                {userCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {(searchQuery || statusFilter || categoryFilter) && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('');
                                        setCategoryFilter('');
                                    }}
                                    className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 underline transition-colors"
                                >
                                    Reset Filters
                                </button>
                            )}

                            <button
                                onClick={fetchComplaints}
                                title="Refresh"
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>

                    {/* Content List / Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
                            <p className="text-slate-400 text-xs font-medium">Loading your complaints...</p>
                        </div>
                    ) : filteredComplaints.length === 0 ? (
                        <EmptyState
                            icon={ShieldAlert}
                            title={complaints.length === 0 ? "No Complaints Filed" : "No Matching Complaints"}
                            message={
                                complaints.length === 0 
                                    ? "You have not submitted any complaints. If you experience an issue with a booking or user, you can file a complaint here."
                                    : "No complaints match your active search or filters. Try adjusting your query."
                            }
                            action={
                                complaints.length === 0 ? (
                                    <button
                                        onClick={() => setActiveTab('submit')}
                                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                                    >
                                        File a Complaint
                                    </button>
                                ) : null
                            }
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredComplaints.map((item) => (
                                <ComplaintCard
                                    key={item._id}
                                    complaint={item}
                                    onSelect={handleSelectComplaint}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Complaint Full Details Modal */}
            <ComplaintDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                complaint={selectedComplaint}
            />
        </div>
    );
};

export default UserComplaints;
