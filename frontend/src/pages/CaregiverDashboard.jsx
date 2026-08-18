import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, History, Star, Eye, Edit2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/Loader';
import { getCaregiverProfile } from '../services/caregiverService';
import { getCaregiverBookings } from '../services/bookingService';
import reviewService from '../services/reviewService';

const CaregiverDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [reviewsData, setReviewsData] = useState({ averageRating: '0.0', count: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, bookingsRes, reviewsRes] = await Promise.all([
                    getCaregiverProfile(),
                    getCaregiverBookings(),
                    reviewService.getCaregiverReviews(user._id)
                ]);
                setProfile(profileRes.data);
                setBookings(bookingsRes.data);
                setReviewsData(reviewsRes);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const cards = [
        {
            title: 'Active Requests',
            value: loading ? '—' : bookings.filter(b => b.status === 'Pending').length.toString(),
            subtitle: 'Waiting for your response',
            icon: CalendarCheck,
            gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
            iconBg: 'bg-white/20',
        },
        {
            title: 'Completed Jobs',
            value: loading ? '—' : bookings.filter(b => b.status === 'Completed').length.toString(),
            subtitle: 'Great work!',
            icon: History,
            gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
            iconBg: 'bg-white/20',
        },
        {
            title: 'Rating',
            value: loading ? '—' : (reviewsData.averageRating || '0.0').toString(),
            subtitle: loading ? '—' : `${reviewsData.count} review${reviewsData.count === 1 ? '' : 's'}`,
            icon: Star,
            gradient: 'bg-gradient-to-br from-amber-400 to-orange-500',
            iconBg: 'bg-white/20',
        },
        {
            title: 'Profile Views',
            value: '0',
            subtitle: 'This week',
            icon: Eye,
            gradient: 'bg-gradient-to-br from-purple-500 to-pink-600',
            iconBg: 'bg-white/20',
        },
    ];

    if (loading) return <div className="flex justify-center py-24"><Loader /></div>;

    const isPending = profile?.verificationStatus === 'Pending';
    const isVerified = profile?.verificationStatus === 'Verified';

    return (
        <div className="p-6 sm:p-8 max-w-6xl mx-auto">
            {/* Status Banner */}
            {isPending && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                    <div>
                        <h3 className="font-bold text-amber-800">Verification Pending</h3>
                        <p className="text-amber-700 text-sm mt-1">
                            Your profile is currently under review by our admin team. You can still set up your profile and services in the meantime.
                        </p>
                    </div>
                </div>
            )}
            
            {isVerified && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                    <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                    <div>
                        <h3 className="font-bold text-emerald-800">Account Verified</h3>
                        <p className="text-emerald-700 text-sm">Your profile is active and visible to pet owners.</p>
                    </div>
                </div>
            )}

            {/* Greeting */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">Welcome back, {user?.name?.split(' ')[0]}!</p>
                </div>
                <Link
                    to="/caregiver/profile/edit"
                    className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm font-semibold"
                >
                    <Edit2 size={16} /> Edit Profile
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
                {cards.map((card) => (
                    <DashboardCard key={card.title} {...card} />
                ))}
            </div>

            {/* Recent Activity / Next steps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
                        Upcoming Bookings
                        <Link to="/caregiver/history" className="text-sm text-emerald-600 hover:underline">View all</Link>
                    </h2>
                    
                    {bookings.filter(b => b.status === 'Accepted').length > 0 ? (
                        <div className="space-y-4">
                            {bookings.filter(b => b.status === 'Accepted').slice(0,3).map(b => (
                                <div key={b._id} className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                        <CalendarCheck size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm text-slate-800 truncate">{b.service}</p>
                                        <p className="text-xs text-slate-500 truncate">For {b.owner?.name} on {b.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <CalendarCheck size={48} className="text-slate-200 mb-4" />
                            <p className="text-slate-500 font-medium">No upcoming bookings</p>
                            <p className="text-sm text-slate-400 mt-1">When an owner books you, it will appear here.</p>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Profile Completion</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-600">Bio & Details</span>
                            {profile?.bio ? <CheckBadge /> : <MissingBadge />}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-600">Services & Pricing</span>
                            {profile?.services?.length > 0 && profile?.price ? <CheckBadge /> : <MissingBadge />}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-600">Profile Photo</span>
                            {profile?.photo ? <CheckBadge /> : <MissingBadge />}
                        </div>
                        <div className="pt-4 mt-2 border-t border-slate-100 text-center">
                             <Link to="/caregiver/profile/edit" className="text-emerald-600 font-bold hover:underline text-sm">
                                Complete your profile →
                             </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CheckBadge = () => <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold">Done</span>;
const MissingBadge = () => <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold">Missing</span>;

export default CaregiverDashboard;
