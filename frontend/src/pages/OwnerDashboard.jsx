import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Calendar, CheckSquare, Activity, PlusCircle, User, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/Loader';
import { getMyPets } from '../services/petService';
import { getOwnerBookings } from '../services/bookingService';

const OwnerDashboard = () => {
    const { user } = useAuth();
    const [pets, setPets] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [petsRes, bookingsRes] = await Promise.all([
                    getMyPets(),
                    getOwnerBookings()
                ]);
                setPets(petsRes.data);
                setBookings(bookingsRes.data);
            } catch {
                // fail silently
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const cards = [
        {
            title: 'Total Pets',
            value: loading ? '—' : pets.length,
            subtitle: 'Registered pets',
            icon: PawPrint,
            gradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
            iconBg: 'bg-white/20',
        },
        {
            title: 'Upcoming Bookings',
            value: loading ? '—' : bookings.filter(b => b.status === 'Accepted').length.toString(),
            subtitle: 'Confirmed care',
            icon: Calendar,
            gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600',
            iconBg: 'bg-white/20',
        },
        {
            title: 'Completed Bookings',
            value: loading ? '—' : bookings.filter(b => b.status === 'Completed').length.toString(),
            subtitle: 'Past services',
            icon: CheckCircle,
            gradient: 'bg-gradient-to-br from-amber-400 to-orange-500',
            iconBg: 'bg-white/20',
        },
        {
            title: 'Recent Activity',
            value: pets.length > 0 ? 'Active' : 'No activity',
            subtitle: pets.length > 0 ? `${pets.length} pet${pets.length !== 1 ? 's' : ''} registered` : 'Start by adding a pet',
            icon: Activity,
            gradient: 'bg-gradient-to-br from-purple-500 to-purple-700',
            iconBg: 'bg-white/20',
        },
    ];

    const quickActions = [
        {
            to: '/owner/pets/add',
            icon: PlusCircle,
            label: 'Add a Pet',
            desc: 'Register a new pet to your profile',
            color: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
        },
        {
            to: '/owner/pets',
            icon: PawPrint,
            label: 'My Pets',
            desc: 'View, edit or delete your pets',
            color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100',
        },
        {
            to: '/owner/profile/edit',
            icon: User,
            label: 'Edit Profile',
            desc: 'Update your personal information',
            color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100',
        },
    ];

    return (
        <div className="p-6 sm:p-8 max-w-6xl mx-auto">
            {/* Greeting */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={18} className="text-amber-400" />
                    <p className="text-sm text-slate-500 font-medium">Welcome back</p>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-800">
                    Hello, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-slate-500 mt-1">Here's what's happening with your pets today.</p>
            </div>

            {/* Stats Cards */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
                    {cards.map((card) => (
                        <DashboardCard key={card.title} {...card} />
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {quickActions.map(({ to, icon: Icon, label, desc, color }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group ${color}`}
                        >
                            <div className="p-2 rounded-lg bg-white shadow-sm">
                                <Icon size={20} className="shrink-0" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{label}</p>
                                <p className="text-xs opacity-70 mt-0.5 truncate">{desc}</p>
                            </div>
                            <ArrowRight size={16} className="opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Pets */}
            {pets.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-800">Your Pets</h2>
                        <Link to="/owner/pets" className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1">
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-1">
                        {pets.slice(0, 5).map((pet) => (
                            <Link
                                key={pet._id}
                                to={`/owner/pets/${pet._id}`}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors shrink-0"
                            >
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-2xl shadow-sm overflow-hidden">
                                    {pet.imageUrl
                                        ? <img src={`http://localhost:5000${pet.imageUrl}`} alt={pet.name} className="w-full h-full object-cover" />
                                        : '🐾'}
                                </div>
                                <p className="text-xs font-semibold text-slate-700 max-w-[60px] truncate text-center">{pet.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state if no pets */}
            {!loading && pets.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
                    <div className="text-6xl mb-4">🐾</div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No pets yet!</h3>
                    <p className="text-slate-500 mb-6">Get started by adding your first furry friend.</p>
                    <Link
                        to="/owner/pets/add"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        <PlusCircle size={18} /> Add Your First Pet
                    </Link>
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;
