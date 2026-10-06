import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, Heart } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            <div className="mx-2 flex items-center">
                <NotificationDropdown />
            </div>
            <button 
                onClick={handleLogout} 
                className="ml-4 px-5 py-2 rounded-full border-2 border-slate-200 text-slate-600 font-medium hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
            >
                Logout
            </button>
        </>
    ) : (
        <>
            <Link to="/login" className="text-slate-600 hover:text-blue-600 px-4 py-2 rounded-md font-medium transition-colors">
                Login
            </Link>
            <div className="flex items-center space-x-3 ml-4">
                <Link to="/register-owner">
                    <button className="px-5 py-2 rounded-full bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                        Find a Caregiver
                    </button>
                </Link>
                <Link to="/register-caregiver">
                    <button className="px-5 py-2 rounded-full bg-white text-slate-700 font-medium border border-slate-200 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300">
                        Become a Caregiver
                    </button>
                </Link>
            </div>
        </>
    );

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-1' : 'bg-transparent py-3'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl group-hover:scale-105 transition-transform shadow-sm">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <span className="ml-3 text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                                PetCareConnect
                            </span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center">
                        {navLinks}
                    </div>
                    <div className="-mr-2 flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors"
                        >
                            {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100 bg-white border-b border-slate-200 shadow-lg' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pt-2 pb-6 space-y-2">
                    {user ? (
                        <>
                            <Link
                                to={user.role === 'admin' ? '/admin-dashboard' : `/${user.role}`}
                                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 rounded-xl text-base font-medium transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <button 
                                onClick={() => { handleLogout(); setIsMenuOpen(false); }} 
                                className="w-full text-left text-red-600 hover:bg-red-50 block px-4 py-3 rounded-xl text-base font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 rounded-xl text-base font-medium transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register-owner" 
                                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 rounded-xl text-base font-medium transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Find a Caregiver
                            </Link>
                            <Link 
                                to="/register-caregiver" 
                                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 rounded-xl text-base font-medium transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Become a Caregiver
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
