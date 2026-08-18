import React, { useState } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    LayoutDashboard,
    Users,
    User,
    HeartHandshake,
    PawPrint,
    Calendar,
    Star,
    AlertTriangle,
    Flag,
    LogOut,
    Heart,
    Menu,
    X,
    ChevronRight,
} from 'lucide-react';

const navGroups = [
    {
        title: 'Overview',
        items: [
            { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
        ]
    },
    {
        title: 'Management',
        items: [
            { to: '/admin/users', label: 'All Users', icon: Users },
            { to: '/admin/owners', label: 'Pet Owners', icon: User },
            { to: '/admin/caregivers', label: 'Caregivers', icon: HeartHandshake },
            { to: '/admin/pets', label: 'Pets', icon: PawPrint },
            { to: '/admin/bookings', label: 'Bookings', icon: Calendar },
        ]
    },
    {
        title: 'Moderation',
        items: [
            { to: '/admin/reviews', label: 'Reviews', icon: Star },
            { to: '/admin/complaints', label: 'Complaints', icon: AlertTriangle },
            { to: '/admin/reports', label: 'Reports', icon: Flag },
        ]
    }
];

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-900 text-slate-300">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
                <div className="bg-blue-600 p-2 rounded-xl">
                    <Heart size={20} className="text-white fill-white" />
                </div>
                <div>
                    <p className="text-white font-bold text-sm leading-none">PetCare Connect</p>
                    <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mt-1">Admin Panel</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
                {navGroups.map((group) => (
                    <div key={group.title}>
                        <p className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                            {group.title}
                        </p>
                        <ul className="space-y-1">
                            {group.items.map(({ to, label, icon: Icon, end }) => (
                                <li key={to}>
                                    <NavLink
                                        to={to}
                                        end={end}
                                        onClick={() => setSidebarOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                                isActive
                                                    ? 'bg-blue-600/10 text-blue-400'
                                                    : 'hover:bg-slate-800 hover:text-white'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon size={18} className={isActive ? 'text-blue-500' : 'text-slate-500'} />
                                                <span className="flex-1">{label}</span>
                                                {isActive && <ChevronRight size={14} className="text-blue-500" />}
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Profile / Logout */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm shrink-0 border border-slate-700">
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                        <p className="text-slate-500 text-xs truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 shrink-0 shadow-2xl z-20">
                <SidebarContent />
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <aside className="relative z-50 flex flex-col w-64 h-full shadow-2xl">
                        <button
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X size={22} />
                        </button>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header for mobile */}
                <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shrink-0">
                    <button onClick={() => setSidebarOpen(true)} className="text-slate-500 hover:text-slate-800">
                        <Menu size={24} />
                    </button>
                    <div className="font-bold text-slate-800 text-sm">Admin Panel</div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
