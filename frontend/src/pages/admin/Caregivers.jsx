import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, Trash2 } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { getCaregivers, verifyCaregiver, deleteUser } from '../../services/adminService';
import toast from 'react-hot-toast';

const Caregivers = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState(''); // '', 'Pending', 'Verified', 'Rejected'
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });

    const fetchCaregivers = useCallback(async (page, searchTerm, status) => {
        setLoading(true);
        try {
            const params = { page, search: searchTerm, limit: 10 };
            if (status) params.status = status;
            
            const res = await getCaregivers(params);
            setData(res.data.data);
            setPagination({ page: res.data.page, pages: res.data.pages });
        } catch (error) {
            toast.error('Failed to fetch caregivers');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchCaregivers(1, search, statusFilter);
        }, 500);
        return () => clearTimeout(timeout);
    }, [search, statusFilter, fetchCaregivers]);

    const handleVerify = async (id, status, name) => {
        if (!window.confirm(`Mark ${name}'s application as ${status}?`)) return;
        try {
            await verifyCaregiver(id, status);
            toast.success(`Caregiver ${status.toLowerCase()}`);
            fetchCaregivers(pagination.page, search, statusFilter);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (userId, name) => {
        if (!window.confirm(`Delete caregiver "${name}" and all their data completely?`)) return;
        try {
            await deleteUser(userId);
            toast.success('Caregiver deleted successfully');
            fetchCaregivers(pagination.page, search, statusFilter);
        } catch (error) {
            toast.error('Failed to delete caregiver');
        }
    };

    const columns = [
        { header: 'Name', accessor: (row) => row.user?.name || 'Unknown' },
        { header: 'Email', accessor: (row) => row.user?.email || 'Unknown' },
        { header: 'Location', accessor: 'location' },
        { 
            header: 'Status', 
            accessor: (row) => (
                <span className={`px-2 py-1 rounded font-bold text-xs ${
                    row.verificationStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                    row.verificationStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                }`}>
                    {row.verificationStatus}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: (row) => (
                <div className="flex items-center gap-1">
                    {row.verificationStatus !== 'Verified' && (
                        <button 
                            onClick={() => handleVerify(row._id, 'Verified', row.user?.name)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Approve"
                        >
                            <Check size={16} />
                        </button>
                    )}
                    {row.verificationStatus !== 'Rejected' && (
                        <button 
                            onClick={() => handleVerify(row._id, 'Rejected', row.user?.name)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Reject"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button 
                        onClick={() => handleDelete(row.user?._id, row.user?.name)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800">Caregivers</h1>
                    <p className="text-slate-500 mt-1">Review applications and manage active caregivers.</p>
                </div>
                
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <DataTable 
                columns={columns}
                data={data}
                loading={loading}
                search={{
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    placeholder: 'Search caregivers...'
                }}
                pagination={{
                    page: pagination.page,
                    pages: pagination.pages,
                    onPageChange: (p) => fetchCaregivers(p, search, statusFilter)
                }}
            />
        </div>
    );
};

export default Caregivers;
