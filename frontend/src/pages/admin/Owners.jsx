import React, { useState, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { getUsers, deleteUser } from '../../services/adminService';
import toast from 'react-hot-toast';

const Owners = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });

    const fetchOwners = useCallback(async (page, searchTerm) => {
        setLoading(true);
        try {
            const res = await getUsers({ role: 'owner', page, search: searchTerm, limit: 10 });
            setData(res.data.data);
            setPagination({ page: res.data.page, pages: res.data.pages });
        } catch (error) {
            toast.error('Failed to fetch owners');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchOwners(1, search);
        }, 500);
        return () => clearTimeout(timeout);
    }, [search, fetchOwners]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete owner "${name}" and all their pets/bookings?`)) return;
        
        try {
            await deleteUser(id);
            toast.success('Owner deleted successfully');
            fetchOwners(pagination.page, search);
        } catch (error) {
            toast.error('Failed to delete owner');
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Phone', accessor: (row) => row.phone || '—' },
        { header: 'Joined', accessor: (row) => new Date(row.createdAt).toLocaleDateString() },
        {
            header: 'Actions',
            accessor: (row) => (
                <button 
                    onClick={() => handleDelete(row._id, row.name)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            )
        }
    ];

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-800">Pet Owners</h1>
                <p className="text-slate-500 mt-1">Manage registered pet owners.</p>
            </div>

            <DataTable 
                columns={columns}
                data={data}
                loading={loading}
                search={{
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    placeholder: 'Search owners...'
                }}
                pagination={{
                    page: pagination.page,
                    pages: pagination.pages,
                    onPageChange: (p) => fetchOwners(p, search)
                }}
            />
        </div>
    );
};

export default Owners;
