import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { getMyPets } from '../services/petService';

const BookingForm = ({ caregiver, onSubmit, isLoading }) => {
    const [pets, setPets] = useState([]);
    const [form, setForm] = useState({
        pet: '',
        service: '',
        date: '',
        time: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const res = await getMyPets();
                setPets(res.data);
            } catch (error) {
                console.error("Failed to load pets", error);
            }
        };
        fetchPets();
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!form.pet) newErrors.pet = 'Please select a pet';
        if (!form.service) newErrors.service = 'Please select a service';
        if (!form.date) newErrors.date = 'Please select a date';
        if (!form.time) newErrors.time = 'Please select a time';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSubmit(form);
    };

    const inputBase = 'w-full px-4 py-2.5 rounded-xl border bg-white text-slate-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
    const inputNormal = `${inputBase} border-slate-200`;
    const inputError = `${inputBase} border-red-400 bg-red-50`;

    return (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-800 mb-4 border-b border-slate-100 pb-3">
                Book {caregiver?.user?.name}
            </h3>

            {/* Pet Selection */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Pet</label>
                <select
                    name="pet"
                    value={form.pet}
                    onChange={handleChange}
                    className={errors.pet ? inputError : inputNormal}
                >
                    <option value="">-- Choose a pet --</option>
                    {pets.map(p => (
                        <option key={p._id} value={p._id}>{p.name} ({p.breed})</option>
                    ))}
                </select>
                {errors.pet && <p className="text-red-500 text-xs mt-1">{errors.pet}</p>}
                {pets.length === 0 && (
                    <p className="text-amber-500 text-xs mt-1">You need to add a pet before booking.</p>
                )}
            </div>

            {/* Service Selection */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service</label>
                <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className={errors.service ? inputError : inputNormal}
                >
                    <option value="">-- Choose a service --</option>
                    {caregiver?.services?.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1"><Calendar size={14}/> Date</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={handleChange}
                        className={errors.date ? inputError : inputNormal}
                    />
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1"><Clock size={14}/> Time</label>
                    <select
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                        className={errors.time ? inputError : inputNormal}
                    >
                        <option value="">-- Select time --</option>
                        {Array.from({ length: 24 }).flatMap((_, i) => {
                            const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
                            const ampm = i < 12 ? 'AM' : 'PM';
                            const formattedHour = hour.toString().padStart(2, '0');
                            return [
                                <option key={`${i}:00`} value={`${formattedHour}:00 ${ampm}`}>{`${formattedHour}:00 ${ampm}`}</option>,
                                <option key={`${i}:30`} value={`${formattedHour}:30 ${ampm}`}>{`${formattedHour}:30 ${ampm}`}</option>
                            ];
                        })}
                    </select>
                    {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes (Optional)</label>
                <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions for the caregiver..."
                    rows={3}
                    className={`${inputNormal} resize-none`}
                />
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading || pets.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Submitting...
                        </>
                    ) : (
                        <><CheckCircle size={18} /> Request Booking</>
                    )}
                </button>
            </div>
        </form>
    );
};

export default BookingForm;
