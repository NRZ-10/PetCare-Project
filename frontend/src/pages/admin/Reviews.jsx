import React, { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, Trash2 } from 'lucide-react';
import DataTable from '../../components/DataTable';
import reviewService from '../../services/reviewService';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';

const AdminReviews = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const reviews = await reviewService.getAllReviews();
            setData(reviews);
        } catch (error) {
            toast.error('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const columns = [
        { header: 'Owner', accessor: (row) => row.owner?.name || 'Unknown' },
        { header: 'Caregiver', accessor: (row) => row.caregiver?.name || 'Unknown' },
        {
            header: 'Rating',
            accessor: (row) => (
                <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < row.rating ? 'fill-current' : 'text-slate-200'} />
                    ))}
                    <span className="text-slate-700 font-semibold ml-1">{row.rating}</span>
                </div>
            )
        },
        {
            header: 'Comment',
            accessor: (row) => (
                <p className="max-w-xs truncate text-slate-600 text-sm">{row.comment}</p>
            )
        },
        { header: 'Date', accessor: (row) => new Date(row.createdAt).toLocaleDateString() },
        {
            header: 'Actions',
            accessor: (row) => (
                <button
                    onClick={() => setReviewToDelete(row)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Review"
                >
                    <Trash2 size={16} />
                </button>
            )
        }
    ];

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                    <MessageSquare size={24} className="text-blue-500" /> Reviews
                </h1>
                <p className="text-slate-500 mt-1">Moderate user-submitted reviews.</p>
            </div>

            <DataTable
                columns={columns}
                data={data}
                loading={loading}
            />

            <ConfirmationModal
                isOpen={!!reviewToDelete}
                onClose={() => setReviewToDelete(null)}
                onConfirm={() => {
                    // In a real app, call deleteReview API here
                    setData(prev => prev.filter(r => r._id !== reviewToDelete._id));
                    toast.success('Review removed');
                    setReviewToDelete(null);
                }}
                title="Delete Review?"
                message="Are you sure you want to remove this review? This action cannot be undone."
                confirmLabel="Delete Review"
            />
        </div>
    );
};

export default AdminReviews;
