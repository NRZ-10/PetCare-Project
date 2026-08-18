import React, { useState, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { getUsers, deleteUser } from '../../services/adminService';
import toast from 'react-hot-toast';

const Users = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });

    const fetchUsers = useCallback(async (page, searchTerm) => {
        setLoading(true);
        try {
            const res = await getUsers({ page, search: searchTerm, limit: 10 });
            setData(res.data.data);
            setPagination({ page: res.data.page, pages: res.data.pages });
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Simple debounce for search
        const timeout = setTimeout(() => {
            fetchUsers(1, search);
        }, 500);
        return () => clearTimeout(timeout);
    }, [search, fetchUsers]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to completely delete the user "${name}" and all their data?`)) return;
        
        try {
            await deleteUser(id);
            toast.success('User deleted successfully');
            fetchUsers(pagination.page, search);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { 
            header: 'Role', 
            accessor: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    row.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    row.role === 'owner' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                }`}>
                    {row.role}
                </span>
            ) 
        },
        { header: 'Joined', accessor: (row) => new Date(row.createdAt).toLocaleDateString() },
        {
            header: 'Actions',
            accessor: (row) => row.role !== 'admin' ? (
                <button 
                    onClick={() => handleDelete(row._id, row.name)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete User"
                >
                    <Trash2 size={16} />
                </button>
            ) : <span className="text-slate-400 text-xs italic">Protected</span>
        }
    ];

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-800">All Users</h1>
                <p className="text-slate-500 mt-1">Manage platform users across all roles.</p>
            </div>

            <DataTable 
                columns={columns}
                data={data}
                loading={loading}
                search={{
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    placeholder: 'Search by name or email...'
                }}
                pagination={{
                    page: pagination.page,
                    pages: pagination.pages,
                    onPageChange: (p) => fetchUsers(p, search)
                }}
            />
        </div>
    );
};

export default Users;
