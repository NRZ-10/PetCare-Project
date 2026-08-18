import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import AvailabilitySelector from './AvailabilitySelector';
import { AlertCircle, Save } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';
const AVAILABLE_SERVICES = [
    'Dog Walking',
    'Pet Sitting',
    'House Sitting',
    'Drop-in Visits',
    'Pet Boarding'
];

const initialForm = {
    bio: '',
    experience: '',
    services: [],
    price: '',
    availability: [],
    location: ''
};

/**
 * CaregiverForm – Form to edit the caregiver profile
 * Props:
 *   initialData - existing profile data
 *   onSubmit - callback(formData, photoFile)
 *   isLoading - submitting state
 */
const CaregiverForm = ({ initialData, onSubmit, isLoading }) => {
    const [form, setForm] = useState(initialForm);
    const [photoFile, setPhotoFile] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                bio: initialData.bio || '',
                experience: initialData.experience !== undefined ? String(initialData.experience) : '',
                services: initialData.services || [],
                price: initialData.price !== undefined ? String(initialData.price) : '',
                availability: initialData.availability || [],
                location: initialData.location || ''
            });
        }
    }, [initialData]);

    const validate = () => {
        const newErrors = {};
        if (form.experience !== '' && (isNaN(Number(form.experience)) || Number(form.experience) < 0)) {
            newErrors.experience = 'Experience must be a positive number';
        }
        if (form.price !== '' && (isNaN(Number(form.price)) || Number(form.price) < 0)) {
            newErrors.price = 'Price must be a positive number';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleServiceToggle = (service) => {
        setForm(prev => {
            const newServices = prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service];
            return { ...prev, services: newServices };
        });
    };

    const handleAvailabilityChange = (selectedDays) => {
        setForm(prev => ({ ...prev, availability: selectedDays }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        onSubmit(form, photoFile);
    };

    const inputBase = 'w-full px-4 py-2.5 rounded-xl border bg-white text-slate-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500';
    const inputNormal = `${inputBase} border-slate-200`;
    const inputError = `${inputBase} border-red-400 bg-red-50`;

    const FieldError = ({ field }) =>
        errors[field] ? (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle size={12} /> {errors[field]}
            </p>
        ) : null;

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <ImageUpload
                label="Profile Photo (optional)"
                onChange={setPhotoFile}
                currentImage={initialData?.photo ? `${BACKEND_URL}${initialData.photo}` : null}
            />

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio</label>
                <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell pet owners about yourself..."
                    rows={4}
                    className={`${inputNormal} resize-none`}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Experience (Years)</label>
                    <input
                        type="number"
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                        placeholder="e.g. 3"
                        min="0"
                        className={errors.experience ? inputError : inputNormal}
                    />
                    <FieldError field="experience" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pricing (per visit/hour)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            className={`${errors.price ? inputError : inputNormal} pl-8`}
                        />
                    </div>
                    <FieldError field="price" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="City, Neighborhood or Zip Code"
                    className={inputNormal}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Services Offered</label>
                <div className="flex flex-wrap gap-2">
                    {AVAILABLE_SERVICES.map(service => (
                        <button
                            key={service}
                            type="button"
                            onClick={() => handleServiceToggle(service)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                                form.services.includes(service)
                                    ? 'bg-blue-100 border-blue-500 text-blue-800 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                        >
                            {service}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Availability</label>
                <AvailabilitySelector
                    selectedDays={form.availability}
                    onChange={handleAvailabilityChange}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Saving...
                    </>
                ) : (
                    <><Save size={16} /> Save Profile</>
                )}
            </button>
        </form>
    );
};

export default CaregiverForm;
