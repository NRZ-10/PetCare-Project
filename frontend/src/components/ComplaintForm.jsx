import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, Loader2, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import complaintService, { getComplaintCategoriesByRole } from '../services/complaintService';
import { getOwnerBookings, getCaregiverBookings } from '../services/bookingService';
import { useAuth } from '../hooks/useAuth';

const ComplaintForm = ({ onSuccess, onCancel, preselectedBookingId = null }) => {
    const { user } = useAuth();
    const availableCategories = getComplaintCategoriesByRole(user?.role);
    const [category, setCategory] = useState(availableCategories[0] || 'Other');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [bookingId, setBookingId] = useState(preselectedBookingId || '');
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (availableCategories.length > 0 && !availableCategories.includes(category)) {
            setCategory(availableCategories[0]);
        }
    }, [user?.role]);

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                const res = user?.role === 'caregiver'
                    ? await getCaregiverBookings()
                    : await getOwnerBookings();
                setBookings(res.data || []);
            } catch (err) {
                console.error('Failed to load bookings for complaint dropdown:', err);
            } finally {
                setLoadingBookings(false);
            }
        };

        if (user) {
            fetchUserBookings();
        }
    }, [user]);

    const validate = () => {
        const errs = {};
        if (!subject.trim()) {
            errs.subject = 'Subject is required.';
        } else if (subject.trim().length < 5) {
            errs.subject = 'Subject should be at least 5 characters.';
        }

        if (!description.trim()) {
            errs.description = 'Please provide detailed description of your issue.';
        } else if (description.trim().length < 15) {
            errs.description = 'Description should be at least 15 characters.';
        }

        if (!category) {
            errs.category = 'Please select a complaint category.';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            const payload = {
                category,
                subject: subject.trim(),
                description: description.trim(),
                bookingId: bookingId || undefined
            };

            const response = await complaintService.createComplaint(payload);
            toast.success('Complaint submitted successfully. Our team will review it.');

            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to submit complaint. Please try again.';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Submit a Complaint</h2>
                    <p className="text-xs text-slate-500">Provide complete details to help us investigate and resolve your dispute quickly.</p>
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Complaint Category <span className="text-red-500">*</span>
                </label>
                <select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        if (errors.category) setErrors(prev => ({ ...prev, category: null }));
                    }}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.category ? 'border-red-400 focus:ring-red-300' : 'border-slate-200'
                    }`}
                >
                    {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1 font-medium">{errors.category}</p>}
            </div>

            {/* Subject */}
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Subject / Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => {
                        setSubject(e.target.value);
                        if (errors.subject) setErrors(prev => ({ ...prev, subject: null }));
                    }}
                    placeholder="Brief summary of the issue (e.g. Caregiver did not arrive for scheduled walk)"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.subject ? 'border-red-400 focus:ring-red-300' : 'border-slate-200'
                    }`}
                />
                {errors.subject && <p className="text-xs text-red-500 mt-1 font-medium">{errors.subject}</p>}
            </div>

            {/* Optional Booking Reference */}
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400" />
                    Related Booking (Optional)
                </label>
                <select
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    disabled={loadingBookings}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-60"
                >
                    <option value="">-- No specific booking attached --</option>
                    {bookings.map((b) => {
                        const otherParty = user?.role === 'caregiver' ? b.owner?.name : b.caregiver?.name;
                        return (
                            <option key={b._id} value={b._id}>
                                {b.service} on {b.date} • {otherParty ? `with ${otherParty}` : ''} ({b.status})
                            </option>
                        );
                    })}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                    Attaching a booking links the caregiver/owner and allows the admin to cross-verify timestamps and details.
                </p>
            </div>

            {/* Detailed Description */}
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Detailed Description <span className="text-red-500">*</span></span>
                    <span className="text-[11px] text-slate-400 font-normal">{description.length} characters</span>
                </label>
                <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description) setErrors(prev => ({ ...prev, description: null }));
                    }}
                    placeholder="Provide a clear, detailed factual description of what occurred, including times, location, messages exchanged, or other relevant circumstances..."
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y ${
                        errors.description ? 'border-red-400 focus:ring-red-300' : 'border-slate-200'
                    }`}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1 font-medium">{errors.description}</p>}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                    {submitting ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={16} />
                            Submit Complaint
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ComplaintForm;
