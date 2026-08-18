import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, Heart } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = user ? (
        <>
            <Link
                to={user.role === 'admin' ? '/admin-dashboard' : `/${user.role}`}
                className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors"
            >
                Dashboard
            </Link>
            <div className="mx-2">
                <NotificationDropdown />
            </div>
            <button 
                onClick={handleLogout} 
                className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 shadow-sm"
            >
                Logout
            </button>
        </>
    ) : (
        <>
            <Link to="/login" className="text-slate-700 hover:text-slate-900 px-4 py-2 rounded-md font-semibold transition-colors">Login</Link>
            <Link 
                to="/register-owner"
                className="ml-4 inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-full hover:bg-slate-800 hover:shadow-md transition-all duration-200"
            >
                Find a Caregiver
            </Link>
            <Link 
                to="/register-caregiver"
                className="group relative ml-3 inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-slate-800 bg-slate-100 border border-slate-200 rounded-full hover:bg-slate-200 transition-all duration-200"
            >
                <span className="relative z-10">Become a Caregiver</span>
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart className="absolute -top-2 left-1/4 w-3 h-3 text-pink-500 fill-pink-500 float-heart-1" />
                    <Heart className="absolute top-1/2 left-1/2 w-4 h-4 text-red-400 fill-red-400 float-heart-2" />
                    <Heart className="absolute -bottom-2 right-1/4 w-3 h-3 text-rose-500 fill-rose-500 float-heart-3" />
                </div>
            </Link>
        </>
    );

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <Heart className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">PetCare Connect</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center">
                        {navLinks}
                    </div>
                    <div className="-mr-2 flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none transition-colors"
                        >
                            {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white">
                    <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col">
                        {user ? (
                            <>
                                <Link
                                    to={user.role === 'admin' ? '/admin-dashboard' : `/${user.role}`}
                                    className="text-slate-600 hover:text-blue-600 hover:bg-slate-50 block px-3 py-2.5 rounded-md text-base font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className="text-left text-red-600 hover:text-red-700 hover:bg-red-50 block px-3 py-2.5 rounded-md text-base font-medium transition-colors w-full"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-700 hover:text-slate-900 hover:bg-slate-50 block px-3 py-2.5 rounded-md text-base font-semibold transition-colors">Login</Link>
                                <Link to="/register-owner" className="text-slate-900 hover:bg-slate-100 block px-3 py-2.5 rounded-md text-base font-semibold transition-colors">Find a Caregiver</Link>
                                <Link to="/register-caregiver" className="group relative text-slate-800 hover:bg-slate-100 block px-3 py-2.5 rounded-md text-base font-medium transition-colors">
                                    <span className="relative z-10">Become a Caregiver</span>
                                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                                        <Heart className="absolute top-1 left-[30%] w-3 h-3 text-pink-500 fill-pink-500 float-heart-1" />
                                        <Heart className="absolute top-2 left-[50%] w-4 h-4 text-red-400 fill-red-400 float-heart-2" />
                                        <Heart className="absolute top-0 right-[30%] w-3 h-3 text-rose-500 fill-rose-500 float-heart-3" />
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
