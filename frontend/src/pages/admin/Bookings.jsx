import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { getBookings } from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminBookings = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });

    const fetchBookings = useCallback(async (page, status) => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (status) params.status = status;
            const res = await getBookings(params);
            setData(res.data.data);
            setPagination({ page: res.data.page, pages: res.data.pages });
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings(1, statusFilter);
    }, [statusFilter, fetchBookings]);

    const columns = [
        { header: 'Owner', accessor: (row) => row.owner?.name || '—' },
        { header: 'Caregiver', accessor: (row) => row.caregiver?.name || '—' },
        { header: 'Pet', accessor: (row) => row.pet?.name || '—' },
        { header: 'Service', accessor: 'service' },
        { header: 'Date', accessor: 'date' },
        { header: 'Time', accessor: 'time' },
        {
            header: 'Status',
            accessor: (row) => <StatusBadge status={row.status} />
        }
    ];

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800">Bookings</h1>
                    <p className="text-slate-500 mt-1">Platform-wide booking activity (read-only view).</p>
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                pagination={{
                    page: pagination.page,
                    pages: pagination.pages,
                    onPageChange: (p) => fetchBookings(p, statusFilter)
                }}
            />
        </div>
    );
};

export default AdminBookings;
