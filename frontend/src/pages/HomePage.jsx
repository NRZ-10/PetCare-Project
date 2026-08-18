import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Shield, Clock, HeartHandshake, CheckCircle, ArrowRight, Star } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen font-sans bg-slate-50 overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-gradient-to-b from-blue-50 to-white -z-10 rounded-b-[50%] blur-3xl opacity-50"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
                <div className="absolute -bottom-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow delay-200"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        <div className="text-center lg:text-left animate-fade-in-up opacity-0">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-6 shadow-sm border border-blue-200">
                                <Star className="w-4 h-4 mr-2 text-blue-600" />
                                #1 Rated Pet Care Platform
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                                Trusted Pet Care <br className="hidden lg:block"/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    in Your Neighborhood
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl mb-10 text-slate-600 max-w-2xl mx-auto lg:mx-0">
                                Connect with reliable pet sitters, dog walkers, and caregivers who love your pets as much as you do. Experience peace of mind with our verified network.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                                <Link 
                                    to="/register-owner"
                                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                                >
                                    Find a Caregiver
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                                <Link 
                                    to="/register-caregiver"
                                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-700 font-semibold text-lg border-2 border-slate-200 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 flex items-center justify-center"
                                >
                                    Become a Caregiver
                                </Link>
                            </div>
                            

                        </div>
                        
                        <div className="relative animate-fade-in-right opacity-0 delay-200 hidden lg:block">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img src="/hero-pets.jpg" alt="Happy dog and cat" className="w-full h-auto object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
                                    <div className="flex items-center">
                                        <div className="bg-green-100 p-2 rounded-full mr-4">
                                            <Shield className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Verified Sitters</p>
                                            <p className="text-sm text-slate-600">Background checked & approved</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-2">What We Offer</h2>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Premium Pet Care Services</h3>
                        <p className="text-lg text-slate-600">Tailored care to meet the unique needs of your furry family members.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <HeartHandshake className="h-8 w-8 text-rose-500" />, title: 'Pet Sitting', desc: 'In-home care for your pets while you are away, maintaining their routine in a familiar environment.', bgColor: 'bg-rose-100', borderColor: 'group-hover:border-rose-200' },
                            { icon: <Clock className="h-8 w-8 text-emerald-500" />, title: 'Dog Walking', desc: 'Daily structured walks to keep your dog healthy, happy, and well-exercised.', bgColor: 'bg-emerald-100', borderColor: 'group-hover:border-emerald-200' },
                            { icon: <Shield className="h-8 w-8 text-amber-500" />, title: 'Drop-in Visits', desc: 'Quick visits for feeding, potty breaks, medication administration, and playtime.', bgColor: 'bg-amber-100', borderColor: 'group-hover:border-amber-200' },
                        ].map((service, i) => (
                            <div key={i} className={`group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-2 ${service.borderColor} relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className={`w-16 h-16 rounded-2xl ${service.bgColor} flex items-center justify-center mb-6 shadow-sm`}>
                                    {service.icon}
                                </div>
                                <h4 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h4>
                                <p className="text-slate-600 leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-white relative border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-lg text-slate-600">Get started in three simple steps</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
                        {/* Connecting Line (Desktop only) */}
                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-100 via-indigo-200 to-blue-100 z-0"></div>

                        {[
                            { step: '1', title: 'Search', desc: 'Browse profiles and find trusted caregivers near you.' },
                            { step: '2', title: 'Connect', desc: 'Schedule a meet and greet to ensure a perfect match.' },
                            { step: '3', title: 'Relax', desc: 'Enjoy peace of mind while your pet receives top-tier care.' }
                        ].map((item, index) => (
                            <div key={index} className="relative z-10 flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-white border-8 border-slate-50 shadow-md flex items-center justify-center mb-6 mx-auto group hover:scale-110 transition-transform duration-300">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4xNSI+PHBhdGggZD0iTTM2IDM0djI2aC0ydi0yNmgtdjI2aC0ydi0yNmgtdjI2aC0ydi0yNmgtdjI2aC0ydi0yNmgtMTB2LTI2aDEwdjI2aDJ2LTI2aDJ2MjZoMnYtMjZoMnYyNmgydi0yNmgydjI2aDJ2LTI2aDEwdjI2aC0xMHptLTIwLTI2aC0xMHYxMGgxMHYtMTB6bTMwIDBoLTEwdjEwaDEwdi0xMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                </div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                        Ready to give your pet the best care?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of pet owners who trust our community of professional caregivers.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link 
                            to="/register-owner"
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-blue-900 font-bold text-lg shadow-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300 flex items-center justify-center"
                        >
                            Sign Up Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
