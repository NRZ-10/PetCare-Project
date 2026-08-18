import React, { useEffect, useState } from 'react';
import reviewService from '../../services/reviewService';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { Star, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Reviews = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ count: 0, averageRating: 0 });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await reviewService.getCaregiverReviews(user._id);
                setReviews(data.reviews);
                setStats({ count: data.count, averageRating: data.averageRating });
            } catch (error) {
                toast.error('Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchReviews();
        }
    }, [user]);

    if (loading) return <Loader className="py-32" label="Loading reviews..." />;

    return (
        <div className="p-6 sm:p-8 max-w-6xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800">My Reviews</h1>
                    <p className="text-slate-500 mt-1">See what pet owners are saying about you.</p>
                </div>
                {stats.count > 0 && (
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-extrabold text-slate-800 flex items-center gap-1 justify-center">
                                {stats.averageRating} <Star className="w-6 h-6 text-yellow-400 fill-current" />
                            </div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Average Rating</div>
                        </div>
                        <div className="w-px h-10 bg-slate-200"></div>
                        <div className="text-center">
                            <div className="text-3xl font-extrabold text-slate-800">{stats.count}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Reviews</div>
                        </div>
                    </div>
                )}
            </div>

            {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map(review => (
                        <div key={review._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full -z-10"></div>
                            
                            <div className="flex justify-between items-start mb-4 z-10">
                                <div>
                                    <h4 className="font-bold text-slate-800">{review.owner?.name}</h4>
                                    <span className="text-xs text-slate-400 font-medium">
                                        {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={16} 
                                            className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-start gap-2 text-slate-600 z-10">
                                <MessageSquare size={16} className="mt-1 text-slate-300 shrink-0" />
                                <p className="text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState 
                    icon={Star} 
                    title="No Reviews Yet" 
                    message="You haven't received any reviews yet. Complete bookings and encourage owners to leave feedback!" 
                />
            )}
        </div>
    );
};

export default Reviews;
