import React, { useState } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    LayoutDashboard,
    UserCircle,
    CalendarCheck,
    History,
    Star,
    LogOut,
    Heart,
    Menu,
    X,
    ChevronRight,
} from 'lucide-react';

const navItems = [
    { to: '/caregiver', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/caregiver/profile', label: 'My Profile', icon: UserCircle },
    { to: '/caregiver/requests', label: 'Booking Requests', icon: CalendarCheck },
    { to: '/caregiver/history', label: 'Booking History', icon: History },
    { to: '/caregiver/reviews', label: 'Reviews', icon: Star },
];

const CaregiverLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                <div className="bg-white/20 p-2 rounded-xl">
                    <Heart size={20} className="text-white fill-white" />
                </div>
                <div>
                    <p className="text-white font-bold text-sm leading-none">PetCare</p>
                    <p className="text-emerald-200 text-xs">Connect</p>
                </div>
            </div>

            {/* User avatar */}
            <div className="px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                        <p className="text-emerald-200 text-xs">Pet Caregiver</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                                isActive
                                    ? 'bg-white text-emerald-700 shadow-md'
                                    : 'text-emerald-50 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon size={18} />
                                <span className="flex-1">{label}</span>
                                {isActive && <ChevronRight size={14} className="text-emerald-500" />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="px-3 pb-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-200 hover:bg-white/10 hover:text-red-100 transition-all duration-150 cursor-pointer"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-gradient-to-b from-emerald-600 to-teal-800 shadow-xl">
                <SidebarContent />
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="relative z-50 flex flex-col w-64 h-full bg-gradient-to-b from-emerald-600 to-teal-800 shadow-xl">
                        <button
                            className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X size={22} />
                        </button>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center gap-4 shrink-0">
                    <button
                        className="lg:hidden text-slate-500 hover:text-slate-700 cursor-pointer"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={22} />
                    </button>

                    <div className="flex-1" id="caregiver-page-title" />

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <span className="hidden sm:block text-sm font-semibold text-slate-700">{user?.name}</span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CaregiverLayout;
