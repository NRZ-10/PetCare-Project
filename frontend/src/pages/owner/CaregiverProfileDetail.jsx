import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, DollarSign, Clock, ShieldCheck, CheckCircle } from 'lucide-react';
import Loader from '../../components/Loader';
import BookingForm from '../../components/BookingForm';
import api from '../../services/api'; // Using generic API to fetch single caregiver if we didn't add it to service
import { createBooking } from '../../services/bookingService';
import reviewService from '../../services/reviewService';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

const CaregiverProfileDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [reviewsData, setReviewsData] = useState({ reviews: [], count: 0, averageRating: 0 });

    useEffect(() => {
        const fetchCaregiverAndReviews = async () => {
            try {
                const res = await api.get('/caregiver/search'); 
                const found = res.data.find(c => c._id === id);
                if (found) {
                    setProfile(found);
                    // Fetch reviews
                    try {
                        const reviewsRes = await reviewService.getCaregiverReviews(found.user._id);
                        setReviewsData(reviewsRes);
                    } catch (err) {
                        console.error('Failed to fetch reviews', err);
                    }
                } else {
                    toast.error('Caregiver not found');
                    navigate('/owner/search');
                }
            } catch (error) {
                console.error(error);
                navigate('/owner/search');
            } finally {
                setLoading(false);
            }
        };
        fetchCaregiverAndReviews();
    }, [id, navigate]);

    const handleBookingSubmit = async (formData) => {
        setBookingLoading(true);
        try {
            const bookingData = {
                caregiver: profile.user._id,
                ...formData
            };
            await createBooking(bookingData);
            toast.success('Booking request sent successfully!');
            navigate('/owner/bookings');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit booking');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center py-32"><Loader /></div>;
    if (!profile) return null;

    const avatarUrl = profile.photo ? `${BACKEND_URL}${profile.photo}` : null;
    const isVerified = profile.verificationStatus === 'Verified';

    return (
        <div className="p-6 sm:p-8 max-w-6xl mx-auto">
            <Link
                to="/owner/search"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
            >
                <ArrowLeft size={16} /> Back to Search
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 h-32 relative">
                            <div className="absolute -bottom-12 left-6">
                                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-extrabold text-emerald-600">
                                            {profile.user?.name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 px-6 pb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-extrabold text-slate-800">{profile.user?.name}</h1>
                                {isVerified && (
                                    <ShieldCheck size={20} className="text-emerald-500" />
                                )}
                            </div>
                            
                            {reviewsData.count > 0 && (
                                <div className="flex items-center gap-1 mb-2 text-yellow-500">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-bold text-slate-700">{reviewsData.averageRating}</span>
                                    <span className="text-slate-500 text-sm">({reviewsData.count} reviews)</span>
                                </div>
                            )}

                            {profile.location && (
                                <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-6">
                                    <MapPin size={16} /> {profile.location}
                                </div>
                            )}

                            <div className="space-y-6 mt-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">About</h3>
                                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                        {profile.bio || 'No bio provided.'}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 flex items-center gap-2">
                                        <CheckCircle size={18} className="text-emerald-500" /> Services Offered
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.services?.map(s => (
                                            <span key={s} className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-semibold">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Reviews Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Reviews</h3>
                                    {reviewsData.reviews.length === 0 ? (
                                        <p className="text-slate-500">No reviews yet.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {reviewsData.reviews.map(review => (
                                                <div key={review._id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold text-slate-700">{review.owner?.name}</span>
                                                        <div className="flex items-center gap-1 text-yellow-500">
                                                            <Star className="w-4 h-4 fill-current" />
                                                            <span className="text-sm font-semibold">{review.rating}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-600 text-sm">{review.comment}</p>
                                                    <span className="text-xs text-slate-400 mt-2 block">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-wrap gap-8 justify-around text-center">
                        <div>
                            <div className="flex items-center justify-center gap-1 text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">
                                Pricing
                            </div>
                            <div className="text-xl font-extrabold text-slate-800">₹{profile.price} <span className="text-sm font-medium text-slate-500">/hr</span></div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-1 text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">
                                <Briefcase size={14} /> Experience
                            </div>
                            <div className="text-xl font-extrabold text-slate-800">{profile.experience} <span className="text-sm font-medium text-slate-500">years</span></div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-1 text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">
                                <Clock size={14} /> Available
                            </div>
                            <div className="text-sm font-semibold text-slate-700 max-w-xs">{profile.availability?.join(', ')}</div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <BookingForm 
                            caregiver={profile}
                            onSubmit={handleBookingSubmit}
                            isLoading={bookingLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaregiverProfileDetail;
