import React, { useEffect, useState } from 'react';
import { Users, User, HeartHandshake, PawPrint, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/Loader';
import { getDashboardStats } from '../services/adminService';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getDashboardStats();
                setStats(res.data);
            } catch (error) {
                console.error('Failed to fetch admin stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        {
            title: 'Total Users',
            value: loading ? '—' : stats?.totalUsers.toString(),
            subtitle: 'Across platform',
            icon: Users,
            gradient: 'bg-gradient-to-br from-indigo-500 to-blue-600',
            iconBg: 'bg-white/20',
        },
        {
            title: 'Pet Owners',
            value: loading ? '—' : stats?.totalOwners.toString(),
            subtitle: 'Registered owners',
            icon: User,
            gradient: 'bg-gradient-to-br from-blue-400 to-indigo-500',
            iconBg: 'bg-white/20',
        },
        {
            title: 'Caregivers',
            value: loading ? '—' : stats?.totalCaregivers.toString(),
            subtitle: 'Registered caregivers',
            icon: HeartHandshake,
            gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
            iconBg: 'bg-white/20',
        },
        {
            title: 'Total Pets',
            value: loading ? '—' : stats?.totalPets.toString(),
            subtitle: 'Profiles created',
            icon: PawPrint,
            gradient: 'bg-gradient-to-br from-orange-400 to-amber-500',
            iconBg: 'bg-white/20',
        },
        {
            title: 'Total Bookings',
            value: loading ? '—' : stats?.totalBookings.toString(),
            subtitle: 'Lifetime requests',
            icon: Calendar,
            gradient: 'bg-gradient-to-br from-purple-500 to-pink-600',
            iconBg: 'bg-white/20',
        },
        {
            title: 'Pending Approvals',
            value: loading ? '—' : stats?.pendingVerifications.toString(),
            subtitle: 'Caregivers awaiting review',
            icon: AlertCircle,
            gradient: 'bg-gradient-to-br from-red-500 to-rose-600',
            iconBg: 'bg-white/20',
        }
    ];

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-800">
                    Admin Dashboard
                </h1>
                <p className="text-slate-500 mt-1">Platform overview and key metrics.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map(card => <DashboardCard key={card.title} {...card} />)}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
