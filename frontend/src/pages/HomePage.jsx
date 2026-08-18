import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, HeartHandshake, Search, Users, Coffee, Heart } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen selection:bg-blue-100 selection:text-blue-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-900 text-white py-32 sm:py-40">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-4000"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-white">
                        Trusted Pet Care <br className="hidden sm:block" /> in Your Neighborhood
                    </h1>
                    <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-300 font-light leading-relaxed">
                        Connect with reliable pet sitters, dog walkers, and caregivers who love your pets as much as you do.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-5">
                        <Link 
                            to="/register-owner"
                            className="inline-flex items-center justify-center px-8 py-3.5 text-base md:text-lg font-medium text-slate-900 bg-white rounded-full hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] w-full sm:w-auto"
                        >
                            Find a Caregiver
                        </Link>
                        <Link 
                            to="/register-caregiver"
                            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base md:text-lg font-medium text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300 backdrop-blur-md w-full sm:w-auto"
                        >
                            <span className="relative z-10">Become a Caregiver</span>
                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Heart className="absolute -top-4 left-1/4 w-4 h-4 text-pink-500 fill-pink-500 float-heart-1" />
                                <Heart className="absolute top-1/2 left-1/2 w-5 h-5 text-red-400 fill-red-400 float-heart-2" />
                                <Heart className="absolute -bottom-4 right-1/4 w-4 h-4 text-rose-500 fill-rose-500 float-heart-3" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-3">What We Offer</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Our Services</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <HeartHandshake className="h-8 w-8 text-blue-600" />, title: 'Pet Sitting', desc: 'In-home care for your pets while you are away, ensuring they stay comfortable.' },
                            { icon: <Clock className="h-8 w-8 text-blue-600" />, title: 'Dog Walking', desc: 'Daily walks to keep your dog healthy, happy, and energized.' },
                            { icon: <Shield className="h-8 w-8 text-blue-600" />, title: 'Drop-in Visits', desc: 'Quick visits for feeding, potty breaks, and playtime during your busy day.' },
                        ].map((service, i) => (
                            <div key={i} className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-16 h-16 bg-blue-50/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-slate-900">{service.title}</h3>
                                <p className="text-slate-600 leading-relaxed font-light">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-3">Simple Process</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900">How It Works</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
                        <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-slate-100 via-blue-100 to-slate-100 -z-10"></div>
                        {[
                            { step: '1', icon: <Search className="w-6 h-6 text-blue-400" />, title: 'Search', desc: 'Find trusted and verified caregivers near your location.' },
                            { step: '2', icon: <Users className="w-6 h-6 text-blue-400" />, title: 'Connect', desc: 'Schedule a meet and greet to ensure a perfect match.' },
                            { step: '3', icon: <Coffee className="w-6 h-6 text-blue-400" />, title: 'Relax', desc: 'Enjoy peace of mind while your pet is cared for.' }
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-lg shadow-slate-900/20 hover:-translate-y-1 transition-all duration-300">
                                <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                                    <span className="text-3xl font-bold text-white drop-shadow-sm">
                                        {item.step}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-white flex justify-center items-center gap-2">
                                    {item.icon} {item.title}
                                </h3>
                                <p className="text-slate-300 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
