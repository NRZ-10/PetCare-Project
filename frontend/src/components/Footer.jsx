import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe, MessageSquare, Camera, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 mt-auto border-t-4 border-blue-600 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center group mb-4">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm">
                                <Heart className="h-5 w-5 text-white" />
                            </div>
                            <span className="ml-2 text-xl font-extrabold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                                PetCareConnect
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            Connecting pet parents with trusted, loving caregivers in their neighborhood. Because your pets deserve the best.
                        </p>
                        <div className="flex space-x-4">
                            <Link to="/" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                <MessageSquare className="w-4 h-4" />
                            </Link>
                            <Link to="/" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                <Globe className="w-4 h-4" />
                            </Link>
                            <Link to="/" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                <Camera className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Services</h4>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-sm hover:text-blue-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2 opacity-50" /> Pet Sitting</Link></li>
                            <li><Link to="/" className="text-sm hover:text-blue-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2 opacity-50" /> Dog Walking</Link></li>
                            <li><Link to="/" className="text-sm hover:text-blue-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2 opacity-50" /> House Visits</Link></li>
                            <li><Link to="/" className="text-sm hover:text-blue-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2 opacity-50" /> Emergency Care</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Company</h4>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-sm hover:text-blue-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2 opacity-50" /> About Us</Link></li>
                            <li><Link to="/" className="text-sm hover:text-blue-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2 opacity-50" /> Careers</Link></li>
                            <li><Link to="/" className="text-sm hover:text-blue-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2 opacity-50" /> Contact Support</Link></li>
                            <li><Link to="/" className="text-sm hover:text-blue-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2 opacity-50" /> FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-1">
                        <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Stay Updated</h4>
                        <p className="text-sm text-slate-400 mb-4">Subscribe to our newsletter for pet care tips and news.</p>
                        <form className="flex flex-col space-y-2">
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                />
                            </div>
                            <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-sm">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-slate-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} PetCare Connect. All rights reserved.
                    </div>
                    <div className="flex space-x-6 text-sm">
                        <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</Link>
                        <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</Link>
                        <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
