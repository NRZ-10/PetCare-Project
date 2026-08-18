import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, MapPin, Briefcase, DollarSign, Clock, ShieldCheck, CheckCircle } from 'lucide-react';
import Loader from '../../components/Loader';
import { getCaregiverProfile } from '../../services/caregiverService';

const BACKEND_URL = 'http://localhost:5000';

const CaregiverProfileView = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getCaregiverProfile();
                setProfile(res.data);
            } catch (error) {
                console.error('Failed to load profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="flex justify-center py-32"><Loader /></div>;

    const avatarUrl = profile?.photo ? `${BACKEND_URL}${profile.photo}` : null;
    const isVerified = profile?.verificationStatus === 'Verified';

    return (
        <div className="p-6 sm:p-8 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800">My Profile</h1>
                    <p className="text-slate-500 text-sm mt-0.5">How owners see you</p>
                </div>
                <Link
                    to="/caregiver/profile/edit"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 text-sm"
                >
                    <Edit2 size={15} /> Edit Profile
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Banner & Avatar */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 h-32 relative">
                    <div className="absolute -bottom-12 left-6">
                        <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-extrabold text-emerald-600">
                                    {profile?.user?.name?.charAt(0)?.toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-16 px-6 pb-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h2 className="text-2xl font-extrabold text-slate-800">{profile?.user?.name}</h2>
                        {isVerified ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md bg-emerald-100 text-emerald-700">
                                <ShieldCheck size={14} /> Verified
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md bg-amber-100 text-amber-700">
                                Pending Verification
                            </span>
                        )}
                    </div>

                    {profile?.location && (
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-6">
                            <MapPin size={16} /> {profile.location}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">About Me</h3>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                    {profile?.bio || <span className="italic text-slate-400">No bio provided.</span>}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <CheckCircle size={18} className="text-emerald-500" /> Services Offered
                                </h3>
                                {profile?.services?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {profile.services.map(s => (
                                            <span key={s} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-sm font-semibold">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="italic text-slate-400">No services selected.</p>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Details */}
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 h-fit space-y-6">
                            <div>
                                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">
                                    <DollarSign size={14} /> Pricing
                                </div>
                                <div className="text-2xl font-extrabold text-slate-800">
                                    ${profile?.price || 0} <span className="text-sm text-slate-500 font-medium">/visit</span>
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">
                                    <Briefcase size={14} /> Experience
                                </div>
                                <div className="font-semibold text-slate-700">
                                    {profile?.experience || 0} years
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider mb-3">
                                    <Clock size={14} /> Availability
                                </div>
                                {profile?.availability?.length > 0 ? (
                                    <ul className="space-y-1.5">
                                        {profile.availability.map(day => (
                                            <li key={day} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {day}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="italic text-slate-400 text-sm">Not specified.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaregiverProfileView;
