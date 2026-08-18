import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PetForm from '../../components/PetForm';
import Loader from '../../components/Loader';
import { getPetById, updatePet } from '../../services/petService';
import toast from 'react-hot-toast';

const EditPet = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            await updatePet(id, formData);
            toast.success('Pet updated successfully!');
            navigate(`/owner/pets/${id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update pet');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center py-32"><Loader /></div>;

    return (
        <div className="p-6 sm:p-8 max-w-2xl mx-auto">
            {/* Back */}
            <Link
                to={`/owner/pets/${id}`}
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
            >
                <ArrowLeft size={16} /> Back to {pet?.name}
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-800">Edit Pet</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Updating details for <span className="font-semibold text-slate-700">{pet?.name}</span>
                    </p>
                </div>

                <PetForm
                    initialData={pet}
                    onSubmit={handleSubmit}
                    isLoading={isSubmitting}
                    submitLabel="Save Changes"
                />
            </div>
        </div>
    );
};

export default EditPet;
