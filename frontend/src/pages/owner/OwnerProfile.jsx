import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Mail, Phone, MapPin, FileText, User } from 'lucide-react';
import Loader from '../../components/Loader';
import { getOwnerProfile } from '../../services/ownerService';
import toast from 'react-hot-toast';

const BACKEND_URL = 'http://localhost:5000';

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-4 border-b border-slate-100 last:border-0">
        <div className="p-2 bg-blue-50 rounded-lg mt-0.5 shrink-0">
            <Icon size={16} className="text-blue-500" />
        </div>
        <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-medium text-slate-700 mt-0.5">{value || <span className="text-slate-400 italic">Not provided</span>}</p>
        </div>
    </div>
);

const OwnerProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getOwnerProfile();
                setProfile(res.data);
            } catch {
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="flex justify-center py-32"><Loader /></div>;

    const avatarUrl = profile?.profileImage ? `${BACKEND_URL}${profile.profileImage}` : null;

    return (
        <div className="p-6 sm:p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800">My Profile</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Your personal information</p>
                </div>
                <Link
                    to="/owner/profile/edit"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 text-sm"
                >
                    <Edit2 size={15} /> Edit Profile
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Avatar banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-28 relative">
                    <div className="absolute -bottom-10 left-6">
                        <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-extrabold text-white">
                                    {profile?.name?.charAt(0)?.toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-14 px-6 pb-6">
                    <h2 className="text-xl font-extrabold text-slate-800">{profile?.name}</h2>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 mt-1">
                        <User size={11} /> Pet Owner
                    </span>

                    {profile?.bio && (
                        <p className="text-sm text-slate-600 mt-4 leading-relaxed">{profile.bio}</p>
                    )}

                    <div className="mt-6">
                        <InfoRow icon={Mail} label="Email Address" value={profile?.email} />
                        <InfoRow icon={Phone} label="Phone Number" value={profile?.phone} />
                        <InfoRow icon={MapPin} label="Address" value={profile?.address} />
                        <InfoRow icon={FileText} label="Bio" value={profile?.bio} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerProfile;
