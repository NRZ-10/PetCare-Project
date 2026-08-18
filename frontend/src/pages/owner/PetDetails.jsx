import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Edit2, Trash2, CheckCircle, AlertCircle,
    XCircle, Calendar, Tag, Activity
} from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';
import Loader from '../../components/Loader';
import { getPetById, deletePet } from '../../services/petService';
import toast from 'react-hot-toast';

const BACKEND_URL = 'http://localhost:5000';

const vaccinationConfig = {
    'Up to date': { label: 'Vaccinated', icon: CheckCircle, className: 'bg-emerald-100 text-emerald-700' },
    'Partial': { label: 'Partially Vaccinated', icon: AlertCircle, className: 'bg-amber-100 text-amber-700' },
    'Not vaccinated': { label: 'Not Vaccinated', icon: XCircle, className: 'bg-red-100 text-red-700' },
};

const PetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDelete, setShowDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getPetById(id);
                setPet(res.data);
            } catch {
                toast.error('Pet not found');
                navigate('/owner/pets');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id, navigate]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deletePet(id);
            toast.success(`${pet.name} removed`);
            navigate('/owner/pets');
        } catch {
            toast.error('Failed to delete pet');
            setDeleting(false);
        }
    };

    if (loading) return <div className="flex justify-center py-32"><Loader /></div>;
    if (!pet) return null;

    const vacc = vaccinationConfig[pet.vaccinationStatus] || vaccinationConfig['Not vaccinated'];
    const VaccIcon = vacc.icon;

    return (
        <div className="p-6 sm:p-8 max-w-3xl mx-auto">
            {/* Back */}
            <Link
                to="/owner/pets"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
            >
                <ArrowLeft size={16} /> Back to My Pets
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Hero Image */}
                <div className="relative h-56 sm:h-72 bg-gradient-to-br from-blue-100 to-indigo-200">
                    {pet.imageUrl ? (
                        <img
                            src={`${BACKEND_URL}${pet.imageUrl}`}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-8xl">🐾</div>
                    )}
                    {/* Action buttons overlay */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Link
                            to={`/owner/pets/${id}/edit`}
                            className="flex items-center gap-1.5 text-xs font-semibold bg-white/90 hover:bg-white text-slate-700 px-3 py-2 rounded-xl shadow transition-colors"
                        >
                            <Edit2 size={13} /> Edit
                        </Link>
                        <button
                            onClick={() => setShowDelete(true)}
                            className="flex items-center gap-1.5 text-xs font-semibold bg-red-500/90 hover:bg-red-500 text-white px-3 py-2 rounded-xl shadow transition-colors cursor-pointer"
                        >
                            <Trash2 size={13} /> Delete
                        </button>
                    </div>
                    {/* Gender pill */}
                    <span className={`absolute bottom-4 left-4 text-sm font-bold px-3 py-1 rounded-full shadow ${pet.gender === 'Male' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'}`}>
                        {pet.gender}
                    </span>
                </div>

                {/* Details */}
                <div className="p-6">
                    <h1 className="text-3xl font-extrabold text-slate-800 mb-1">{pet.name}</h1>
                    <p className="text-slate-500 mb-5">{pet.breed}</p>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
                                <Calendar size={12} /> Age
                            </p>
                            <p className="text-lg font-bold text-slate-700">{pet.age} yr{pet.age !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
                                <Tag size={12} /> Breed
                            </p>
                            <p className="text-base font-bold text-slate-700 truncate">{pet.breed}</p>
                        </div>
                        <div className="col-span-2 sm:col-span-1 bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2 flex items-center gap-1">
                                <Activity size={12} /> Vaccination
                            </p>
                            <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${vacc.className}`}>
                                <VaccIcon size={14} /> {vacc.label}
                            </span>
                        </div>
                    </div>

                    {/* Medical Notes */}
                    {pet.medicalNotes && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Medical Notes</p>
                            <p className="text-sm text-slate-700 leading-relaxed">{pet.medicalNotes}</p>
                        </div>
                    )}

                    {/* Added date */}
                    <p className="text-xs text-slate-400 mt-5">
                        Added on {new Date(pet.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Delete Modal */}
            <ConfirmationModal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                isLoading={deleting}
                title="Delete Pet?"
                message={`Are you sure you want to remove ${pet.name}? This cannot be undone.`}
                confirmLabel="Delete Pet"
            />
        </div>
    );
};

export default PetDetails;
