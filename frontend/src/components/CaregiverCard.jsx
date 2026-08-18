import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, Clock } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

/**
 * CaregiverCard – Display card for a caregiver.
 */
const CaregiverCard = ({ profile }) => {
    const avatarUrl = profile.photo ? `${BACKEND_URL}${profile.photo}` : null;
    const name = profile.user?.name || 'Caregiver';
    const isVerified = profile.verificationStatus === 'Verified';

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 overflow-hidden flex flex-col">
            {/* Header & Avatar */}
            <div className="relative h-24 bg-gradient-to-r from-emerald-500 to-teal-600">
                <div className="absolute -bottom-10 left-4">
                    <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white flex items-center justify-center">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-extrabold text-emerald-600">
                                {name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>
                {isVerified && (
                    <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-700">Verified</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="pt-12 px-5 pb-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-extrabold text-slate-800 truncate pr-2">{name}</h3>
                    <div className="flex items-center gap-1 shrink-0 bg-amber-50 px-2 py-0.5 rounded text-amber-600">
                        <Star size={12} className="fill-amber-500" />
                        <span className="text-xs font-bold">4.9</span>
                    </div>
                </div>

                {profile.location && (
                    <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                        <MapPin size={14} />
                        <span className="truncate">{profile.location}</span>
                    </div>
                )}

                <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
                    {profile.bio || 'No bio provided yet.'}
                </p>

                {/* Services Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {profile.services?.slice(0, 3).map(service => (
                        <span key={service} className="text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            {service}
                        </span>
                    ))}
                    {profile.services?.length > 3 && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-500 px-2 py-1 rounded">
                            +{profile.services.length - 3}
                        </span>
                    )}
                </div>

                {/* Footer with Price and Button */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div>
                        <span className="text-lg font-extrabold text-emerald-600">${profile.price || 0}</span>
                        <span className="text-xs text-slate-500 font-medium">/hr</span>
                    </div>
                    <Link
                        to={`/owner/caregiver/${profile._id}`}
                        className="text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors shadow"
                    >
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CaregiverCard;
