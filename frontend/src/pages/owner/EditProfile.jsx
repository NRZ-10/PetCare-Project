import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Save } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import Loader from '../../components/Loader';
import { getOwnerProfile, updateOwnerProfile, uploadProfileImage } from '../../services/ownerService';
import toast from 'react-hot-toast';

const BACKEND_URL = 'http://localhost:5000';

const initialForm = { name: '', email: '', phone: '', address: '', bio: '' };

const EditProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getOwnerProfile();
                const p = res.data;
                setProfile(p);
                setForm({
                    name: p.name || '',
                    email: p.email || '',
                    phone: p.phone || '',
                    address: p.address || '',
                    bio: p.bio || '',
                });
            } catch {
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
        if (form.phone && form.phone.trim() !== '' && !/^\+?[0-9\s-]{10,15}$/.test(form.phone)) {
            newErrors.phone = 'Enter a valid phone number';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSaving(true);
        try {
            // 1. Upload profile image if changed
            if (profileImageFile) {
                setUploadingImage(true);
                const imgData = new FormData();
                imgData.append('profileImage', profileImageFile);
                await uploadProfileImage(imgData);
                setUploadingImage(false);
            }

            // 2. Save text fields
            await updateOwnerProfile(form);
            toast.success('Profile updated successfully!');
            navigate('/owner/profile');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
            setUploadingImage(false);
        }
    };

    if (loading) return <div className="flex justify-center py-32"><Loader /></div>;

    const inputBase = 'w-full px-4 py-2.5 rounded-xl border bg-white text-slate-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
    const inputNormal = `${inputBase} border-slate-200`;
    const inputError = `${inputBase} border-red-400 bg-red-50`;

    const FieldError = ({ field }) =>
        errors[field] ? (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle size={12} /> {errors[field]}
            </p>
        ) : null;

    const isLoading = saving || uploadingImage;

    return (
        <div className="p-6 sm:p-8 max-w-2xl mx-auto">
            {/* Back */}
            <Link
                to="/owner/profile"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
            >
                <ArrowLeft size={16} /> Back to Profile
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-800">Edit Profile</h1>
                    <p className="text-slate-500 text-sm mt-1">Update your personal information</p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Profile Image */}
                    <ImageUpload
                        label="Profile Photo"
                        onChange={setProfileImageFile}
                        currentImage={profile?.profileImage ? `${BACKEND_URL}${profile.profileImage}` : null}
                    />

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className={errors.name ? inputError : inputNormal}
                        />
                        <FieldError field="name" />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={errors.email ? inputError : inputNormal}
                        />
                        <FieldError field="email" />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className={errors.phone ? inputError : inputNormal}
                        />
                        <FieldError field="phone" />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Your city or full address"
                            className={inputNormal}
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Bio <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            placeholder="Tell caregivers a bit about yourself and your pets..."
                            rows={3}
                            className={`${inputNormal} resize-none`}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                {uploadingImage ? 'Uploading image...' : 'Saving...'}
                            </>
                        ) : (
                            <><Save size={16} /> Save Profile</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
