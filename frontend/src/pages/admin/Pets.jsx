import React, { useState, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { getPets, deletePet } from '../../services/adminService';
import toast from 'react-hot-toast';

const BACKEND_URL = 'http://localhost:5000';

const Pets = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });

    const fetchPets = useCallback(async (page, searchTerm) => {
        setLoading(true);
        try {
            const res = await getPets({ page, search: searchTerm, limit: 10 });
            setData(res.data.data);
            setPagination({ page: res.data.page, pages: res.data.pages });
        } catch (error) {
            toast.error('Failed to fetch pets');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchPets(1, search);
        }, 500);
        return () => clearTimeout(timeout);
    }, [search, fetchPets]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete pet "${name}"? This will also remove associated bookings.`)) return;
        try {
            await deletePet(id);
            toast.success('Pet deleted successfully');
            fetchPets(pagination.page, search);
        } catch (error) {
            toast.error('Failed to delete pet');
        }
    };

    const columns = [
        {
            header: 'Pet',
            accessor: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-blue-50 border border-blue-100 shrink-0 flex items-center justify-center">
                        {row.imageUrl
                            ? <img src={`${BACKEND_URL}${row.imageUrl}`} alt={row.name} className="w-full h-full object-cover" />
                            : <span className="text-lg">🐾</span>
                        }
                    </div>
                    <span className="font-semibold text-slate-800">{row.name}</span>
                </div>
            )
        },
        { header: 'Breed', accessor: 'breed' },
        { header: 'Age', accessor: (row) => `${row.age} yrs` },
        { header: 'Gender', accessor: 'gender' },
        { header: 'Owner', accessor: (row) => row.owner?.name || '—' },
        {
            header: 'Vaccinated',
            accessor: (row) => (
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    row.vaccinationStatus === 'Vaccinated'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                }`}>
                    {row.vaccinationStatus || 'Unknown'}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: (row) => (
                <button
                    onClick={() => handleDelete(row._id, row.name)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Pet"
                >
                    <Trash2 size={16} />
                </button>
            )
        }
    ];

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-800">Pets</h1>
                <p className="text-slate-500 mt-1">View and remove fake or invalid pet profiles.</p>
            </div>

            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                search={{
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    placeholder: 'Search by pet name or breed...'
                }}
                pagination={{
                    page: pagination.page,
                    pages: pagination.pages,
                    onPageChange: (p) => fetchPets(p, search)
                }}
            />
        </div>
    );
};

export default Pets;
