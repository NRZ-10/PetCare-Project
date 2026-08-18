import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PetForm from '../../components/PetForm';
import { addPet } from '../../services/petService';
import toast from 'react-hot-toast';

const AddPet = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        try {
            await addPet(formData);
            toast.success('Pet added successfully! 🐾');
            navigate('/owner/pets');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add pet');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 max-w-2xl mx-auto">
            {/* Back */}
            <Link
                to="/owner/pets"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
            >
                <ArrowLeft size={16} /> Back to My Pets
            </Link>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-800">Add a New Pet</h1>
                    <p className="text-slate-500 text-sm mt-1">Fill in your pet's details below.</p>
                </div>

                <PetForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    submitLabel="Add Pet"
                />
            </div>
        </div>
    );
};

export default AddPet;
