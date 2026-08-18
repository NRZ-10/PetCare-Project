import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Eye, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

const vaccinationConfig = {
    'Up to date': {
        label: 'Vaccinated',
        icon: CheckCircle,
        className: 'bg-emerald-100 text-emerald-700',
    },
    'Partial': {
        label: 'Partial',
        icon: AlertCircle,
        className: 'bg-amber-100 text-amber-700',
    },
    'Not vaccinated': {
        label: 'Not Vaccinated',
        icon: XCircle,
        className: 'bg-red-100 text-red-700',
    },
};

/**
 * PetCard – displays a pet's info in a card grid.
 * Props:
 *   pet        – pet object from API
 *   onDelete   – callback(pet) to trigger confirmation
 */
const PetCard = ({ pet, onDelete }) => {
    const vacc = vaccinationConfig[pet.vaccinationStatus] || vaccinationConfig['Not vaccinated'];
    const VaccIcon = vacc.icon;

    const imageUrl = pet.imageUrl
        ? `${BACKEND_URL}${pet.imageUrl}`
        : null;

    return (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:-translate-y-1">
            {/* Pet Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={pet.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-7xl select-none">🐾</span>
                    </div>
                )}
                {/* Gender badge */}
                <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full shadow ${pet.gender === 'Male' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'}`}>
                    {pet.gender}
                </span>
            </div>

            {/* Pet Info */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                    <h3 className="text-lg font-bold text-slate-800 truncate">{pet.name}</h3>
                    <span className="text-xs text-slate-400 font-medium shrink-0 ml-2">{pet.age} yr{pet.age !== 1 ? 's' : ''}</span>
                </div>
                <p className="text-sm text-slate-500 mb-3">{pet.breed}</p>

                {/* Vaccination badge */}
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${vacc.className}`}>
                    <VaccIcon size={12} />
                    {vacc.label}
                </span>

                {/* Action buttons */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <Link
                        to={`/owner/pets/${pet._id}`}
                        className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors"
                    >
                        <Eye size={14} /> View
                    </Link>
                    <Link
                        to={`/owner/pets/${pet._id}/edit`}
                        className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-amber-600 hover:bg-amber-50 py-2 rounded-lg transition-colors"
                    >
                        <Edit2 size={14} /> Edit
                    </Link>
                    <button
                        onClick={() => onDelete(pet)}
                        className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PetCard;
