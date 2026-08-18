import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import PetCard from '../../components/PetCard';
import ConfirmationModal from '../../components/ConfirmationModal';
import Loader from '../../components/Loader';
import { getMyPets, deletePet } from '../../services/petService';
import toast from 'react-hot-toast';

const MyPets = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [petToDelete, setPetToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchPets = async () => {
        try {
            const res = await getMyPets();
            setPets(res.data);
        } catch {
            toast.error('Failed to load pets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPets(); }, []);

    const filteredPets = pets.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.breed.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async () => {
        if (!petToDelete) return;
        setDeleting(true);
        try {
            await deletePet(petToDelete._id);
            toast.success(`${petToDelete.name} has been removed`);
            setPets((prev) => prev.filter((p) => p._id !== petToDelete._id));
            setPetToDelete(null);
        } catch {
            toast.error('Failed to delete pet');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800">My Pets</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {loading ? '...' : `${pets.length} pet${pets.length !== 1 ? 's' : ''} registered`}
                    </p>
                </div>
                <Link
                    to="/owner/pets/add"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 text-sm"
                >
                    <PlusCircle size={17} /> Add Pet
                </Link>
            </div>

            {/* Search */}
            {pets.length > 0 && (
                <div className="relative mb-6 max-w-sm">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or breed..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-24">
                    <Loader />
                </div>
            ) : pets.length === 0 ? (
                <div className="text-center py-24">
                    <div className="text-7xl mb-4">🐾</div>
                    <h2 className="text-xl font-bold text-slate-700 mb-2">No pets yet</h2>
                    <p className="text-slate-500 mb-6">Add your first pet to get started!</p>
                    <Link
                        to="/owner/pets/add"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        <PlusCircle size={18} /> Add Your First Pet
                    </Link>
                </div>
            ) : filteredPets.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-slate-500">No pets match "<strong>{search}</strong>"</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredPets.map((pet) => (
                        <PetCard key={pet._id} pet={pet} onDelete={setPetToDelete} />
                    ))}
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={!!petToDelete}
                onClose={() => setPetToDelete(null)}
                onConfirm={handleDelete}
                isLoading={deleting}
                title="Delete Pet?"
                message={`Are you sure you want to remove ${petToDelete?.name}? This action cannot be undone.`}
                confirmLabel="Delete Pet"
            />
        </div>
    );
};

export default MyPets;
