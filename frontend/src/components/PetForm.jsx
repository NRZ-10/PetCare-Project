import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import { AlertCircle } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

const GENDER_OPTIONS = ['Male', 'Female'];
const VACCINATION_OPTIONS = ['Up to date', 'Partial', 'Not vaccinated'];

const PET_CATEGORIES = {
    Dog: ['Golden Retriever', 'Labrador', 'Pug', 'German Shepherd', 'Bulldog', 'Poodle', 'Beagle', 'Husky', 'Other'],
    Cat: ['Persian', 'Siamese', 'Maine Coon', 'Bengal', 'Sphynx', 'Ragdoll', 'Other'],
    Bird: ['Parrot', 'Canary', 'Cockatiel', 'Finch', 'Lovebird', 'Other'],
    Rabbit: ['Holland Lop', 'Netherland Dwarf', 'Lionhead', 'Flemish Giant', 'Other'],
    Other: ['Other']
};

const initialForm = {
    name: '',
    type: '',
    breed: '',
    customBreed: '', // For when 'Other' is selected
    age: '',
    gender: '',
    vaccinationStatus: '',
    medicalNotes: '',
};

/**
 * PetForm – reusable form for Add/Edit pet.
 */
const PetForm = ({ initialData = null, onSubmit, isLoading = false, submitLabel = 'Save Pet' }) => {
    const [form, setForm] = useState(initialForm);
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});

    // Pre-fill form in edit mode
    useEffect(() => {
        if (initialData) {
            // Determine if the existing breed is in our predefined list
            let isCustom = false;
            let prefilledType = initialData.type || '';
            let prefilledBreed = initialData.breed || '';
            
            if (prefilledType && PET_CATEGORIES[prefilledType]) {
                if (!PET_CATEGORIES[prefilledType].includes(prefilledBreed)) {
                    isCustom = true;
                }
            }

            setForm({
                name: initialData.name || '',
                type: prefilledType,
                breed: isCustom ? 'Other' : prefilledBreed,
                customBreed: isCustom ? prefilledBreed : '',
                age: initialData.age !== undefined ? String(initialData.age) : '',
                gender: initialData.gender || '',
                vaccinationStatus: initialData.vaccinationStatus || '',
                medicalNotes: initialData.medicalNotes || '',
            });
        }
    }, [initialData]);

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Pet name is required';
        if (!form.type) newErrors.type = 'Pet type is required';
        
        if (!form.breed) {
            newErrors.breed = 'Breed is required';
        } else if (form.breed === 'Other' && !form.customBreed.trim()) {
            newErrors.customBreed = 'Please specify the breed';
        }

        if (form.age === '' || isNaN(Number(form.age))) {
            newErrors.age = 'A valid age is required';
        } else if (Number(form.age) < 0) {
            newErrors.age = 'Age cannot be negative';
        }
        if (!form.gender) newErrors.gender = 'Gender is required';
        if (!form.vaccinationStatus) newErrors.vaccinationStatus = 'Vaccination status is required';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const next = { ...prev, [name]: value };
            // Reset breed if type changes
            if (name === 'type') {
                next.breed = '';
                next.customBreed = '';
            }
            return next;
        });
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formData = new FormData();
        formData.append('name', form.name.trim());
        formData.append('type', form.type);
        
        const finalBreed = form.breed === 'Other' ? form.customBreed.trim() : form.breed;
        formData.append('breed', finalBreed);
        
        formData.append('age', form.age);
        formData.append('gender', form.gender);
        formData.append('vaccinationStatus', form.vaccinationStatus);
        formData.append('medicalNotes', form.medicalNotes.trim());
        if (imageFile) {
            formData.append('image', imageFile);
        }

        onSubmit(formData);
    };

    const inputBase = 'w-full px-4 py-2.5 rounded-xl border bg-white text-slate-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
    const inputNormal = `${inputBase} border-slate-200`;
    const inputError = `${inputBase} border-red-400 bg-red-50`;

    const FieldError = ({ field }) =>
        errors[field] ? (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle size={12} /> {errors[field]}
            </p>
        ) : null;

    // Available breeds based on selected type
    const availableBreeds = form.type ? PET_CATEGORIES[form.type] : [];

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Pet Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Buddy"
                    className={errors.name ? inputError : inputNormal}
                />
                <FieldError field="name" />
            </div>

            {/* Type & Breed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Pet Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className={errors.type ? inputError : inputNormal}
                    >
                        <option value="">Select type</option>
                        {Object.keys(PET_CATEGORIES).map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <FieldError field="type" />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Breed <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="breed"
                        value={form.breed}
                        onChange={handleChange}
                        className={errors.breed ? inputError : inputNormal}
                        disabled={!form.type}
                    >
                        <option value="">Select breed</option>
                        {availableBreeds.map((b) => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                    <FieldError field="breed" />
                </div>
            </div>

            {/* Custom Breed (shows if 'Other' is selected) */}
            {form.breed === 'Other' && (
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Specify Breed <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="customBreed"
                        value={form.customBreed}
                        onChange={handleChange}
                        placeholder="e.g., Mixed Breed"
                        className={errors.customBreed ? inputError : inputNormal}
                    />
                    <FieldError field="customBreed" />
                </div>
            )}

            {/* Age & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Age (years) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        step="0.5"
                        className={errors.age ? inputError : inputNormal}
                    />
                    <FieldError field="age" />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className={errors.gender ? inputError : inputNormal}
                    >
                        <option value="">Select gender</option>
                        {GENDER_OPTIONS.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                    <FieldError field="gender" />
                </div>
            </div>

            {/* Vaccination Status */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Vaccination Status <span className="text-red-500">*</span>
                </label>
                <select
                    name="vaccinationStatus"
                    value={form.vaccinationStatus}
                    onChange={handleChange}
                    className={errors.vaccinationStatus ? inputError : inputNormal}
                >
                    <option value="">Select status</option>
                    {VACCINATION_OPTIONS.map((v) => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
                <FieldError field="vaccinationStatus" />
            </div>

            {/* Medical Notes */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Medical Notes <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                    name="medicalNotes"
                    value={form.medicalNotes}
                    onChange={handleChange}
                    placeholder="Allergies, medications, special conditions..."
                    rows={3}
                    className={`${inputNormal} resize-none`}
                />
            </div>

            {/* Image Upload */}
            <ImageUpload
                label="Pet Photo (optional)"
                onChange={setImageFile}
                currentImage={initialData?.imageUrl ? `${BACKEND_URL}${initialData.imageUrl}` : null}
            />

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Saving...
                    </>
                ) : submitLabel}
            </button>
        </form>
    );
};

export default PetForm;
