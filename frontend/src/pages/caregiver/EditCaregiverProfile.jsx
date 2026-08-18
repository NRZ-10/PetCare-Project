import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Loader from '../../components/Loader';
import CaregiverForm from '../../components/CaregiverForm';
import { getCaregiverProfile, updateCaregiverProfile, uploadCaregiverPhoto } from '../../services/caregiverService';
import toast from 'react-hot-toast';

const EditCaregiverProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getCaregiverProfile();
                setProfile(res.data);
            } catch (error) {
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleSubmit = async (formData, photoFile) => {
        setSaving(true);
        try {
            // Upload photo if a new one was selected
            if (photoFile) {
                const imgData = new FormData();
                imgData.append('photo', photoFile);
                await uploadCaregiverPhoto(imgData);
            }
            
            // Save text data
            await updateCaregiverProfile(formData);
            
            toast.success('Profile updated successfully!');
            navigate('/caregiver/profile');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-32"><Loader /></div>;

    return (
        <div className="p-6 sm:p-8 max-w-3xl mx-auto">
            {/* Back */}
            <Link
                to="/caregiver/profile"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
            >
                <ArrowLeft size={16} /> Back to Profile
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                <div className="mb-6 border-b border-slate-100 pb-4">
                    <h1 className="text-2xl font-extrabold text-slate-800">Edit Profile</h1>
                    <p className="text-slate-500 text-sm mt-1">Set up your services, pricing, and availability.</p>
                </div>

                <CaregiverForm 
                    initialData={profile} 
                    onSubmit={handleSubmit} 
                    isLoading={saving} 
                />
            </div>
        </div>
    );
};

export default EditCaregiverProfile;
