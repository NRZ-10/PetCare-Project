import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    FileText,
    UploadCloud,
    ShieldCheck,
    AlertCircle,
    XCircle,
    AlertTriangle,
    Clock,
    RefreshCw,
    Eye
} from 'lucide-react';
import Loader from '../../components/Loader';
import CaregiverForm from '../../components/CaregiverForm';
import {
    getCaregiverProfile,
    updateCaregiverProfile,
    uploadCaregiverPhoto,
    uploadVerificationDocument,
    getVerificationDocument
} from '../../services/caregiverService';
import toast from 'react-hot-toast';

const EditCaregiverProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Verification Document State
    const [selectedDocFile, setSelectedDocFile] = useState(null);
    const [uploadingDoc, setUploadingDoc] = useState(false);
    const [downloadingDoc, setDownloadingDoc] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await getCaregiverProfile();
            setProfile(res.data);
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Scroll to verification section if hash is #verification
    useEffect(() => {
        if (!loading && location.hash === '#verification') {
            const elem = document.getElementById('verification-section');
            if (elem) {
                elem.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [loading, location.hash]);

    const handleSubmitProfile = async (formData, photoFile) => {
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

            toast.success('Profile details updated successfully!');
            navigate('/caregiver/profile');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    // Document file selection with frontend validation
    const handleDocFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Frontend validation: PDF type
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        if (!isPdf) {
            toast.error('Invalid file type. Only PDF documents (.pdf) are accepted.');
            e.target.value = '';
            setSelectedDocFile(null);
            return;
        }

        // Frontend validation: 5MB maximum file size
        const maxSizeBytes = 5 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            toast.error('File size exceeds the 5 MB limit. Please compress or select a smaller PDF.');
            e.target.value = '';
            setSelectedDocFile(null);
            return;
        }

        setSelectedDocFile(file);
    };

    // Document upload / replacement
    const handleUploadDocument = async (e) => {
        e.preventDefault();
        if (!selectedDocFile) {
            toast.error('Please select a PDF document first.');
            return;
        }

        setUploadingDoc(true);
        try {
            const formData = new FormData();
            formData.append('document', selectedDocFile);

            const res = await uploadVerificationDocument(formData);
            toast.success(res.data.message || 'Verification document uploaded successfully!');
            setProfile(res.data.profile);
            setSelectedDocFile(null);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to upload verification document.';
            toast.error(message);
        } finally {
            setUploadingDoc(false);
        }
    };

    // Secure document viewing (authorized blob)
    const handleViewDocument = async () => {
        setDownloadingDoc(true);
        try {
            const res = await getVerificationDocument();
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to open document. Please try again.');
        } finally {
            setDownloadingDoc(false);
        }
    };

    if (loading) return <div className="flex justify-center py-32"><Loader /></div>;

    const status = profile?.verificationStatus || 'Not Submitted';
    const isNotSubmitted = status === 'Not Submitted';
    const isPending = status === 'Pending';
    const isApproved = status === 'Approved' || status === 'Verified';
    const isRejected = status === 'Rejected';
    const isChangesRequested = status === 'Changes Requested';

    return (
        <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
            {/* Back to Profile */}
            <div>
                <Link
                    to="/caregiver/profile"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Profile
                </Link>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-800">Edit Profile & Verification</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Manage your public profile details, services, pricing, and verification credentials.
                </p>
            </div>

            {/* ======================================================== */}
            {/* 1. Caregiver Profile Details & Services Form */}
            {/* ======================================================== */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                <div className="mb-6 border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-extrabold text-slate-800">Caregiver Profile Details</h2>
                    <p className="text-slate-500 text-sm mt-1">Set up your bio, services, pricing, and availability.</p>
                </div>

                <CaregiverForm
                    initialData={profile}
                    onSubmit={handleSubmitProfile}
                    isLoading={saving}
                />
            </div>

            {/* ======================================================== */}
            {/* 2. Verification Documents Section (Below Profile Details) */}
            {/* ======================================================== */}
            <section
                id="verification-section"
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <FileText size={20} />
                            </div>
                            <h2 className="text-xl font-extrabold text-slate-800">Verification Documents</h2>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">
                            Upload your combined document for admin verification review.
                        </p>
                    </div>

                    {/* Verification Status Badge */}
                    <div className="flex items-center">
                        {isNotSubmitted && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                <AlertCircle size={14} /> Not Submitted
                            </span>
                        )}
                        {isPending && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                <Clock size={14} /> Pending Review
                            </span>
                        )}
                        {isApproved && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <ShieldCheck size={14} /> Approved & Verified
                            </span>
                        )}
                        {isRejected && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                <XCircle size={14} /> Rejected
                            </span>
                        )}
                        {isChangesRequested && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                <AlertTriangle size={14} /> Changes Requested
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status Alert Messages */}
                    {isRejected && (
                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                            <XCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <h4 className="font-bold text-rose-800 text-sm">Document Rejected by Admin</h4>
                                {profile?.verificationNote && (
                                    <p className="mt-1 text-xs sm:text-sm text-rose-900 font-medium bg-white/70 p-2.5 rounded-lg border border-rose-200">
                                        <span className="font-bold">Reason:</span> {profile.verificationNote}
                                    </p>
                                )}
                                <p className="text-xs text-rose-700 mt-2">
                                    Please review the reason above and upload a replacement document below to re-submit for review.
                                </p>
                            </div>
                        </div>
                    )}

                    {isChangesRequested && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                            <AlertTriangle className="text-blue-500 shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <h4 className="font-bold text-blue-800 text-sm">Corrections Requested by Admin</h4>
                                {profile?.verificationNote && (
                                    <p className="mt-1 text-xs sm:text-sm text-blue-900 font-medium bg-white/70 p-2.5 rounded-lg border border-blue-200">
                                        <span className="font-bold">Admin Instructions:</span> {profile.verificationNote}
                                    </p>
                                )}
                                <p className="text-xs text-blue-700 mt-2">
                                    Please address the instructions and upload an updated combined PDF below.
                                </p>
                            </div>
                        </div>
                    )}

                    {isApproved && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                            <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold text-emerald-800 text-sm">Your profile has been verified</h4>
                                <p className="text-emerald-700 text-xs sm:text-sm mt-0.5">
                                    Your verification documents have been reviewed and approved. You are visible to pet owners.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Submission Guidelines Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
                            <FileText size={16} className="text-slate-500" /> Document Submission Requirements
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 mb-2">
                            Please combine the following into <strong>ONE single PDF document</strong> before uploading:
                        </p>
                        <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-700 space-y-1 pl-1">
                            <li><span className="font-semibold">Government-issued ID proof</span> (Aadhaar, Passport, Driver's License, or Voter ID).</li>
                            <li><span className="font-semibold">Experience certificate</span> (if available).</li>
                            <li><span className="font-semibold">Police verification certificate</span> (if available).</li>
                        </ol>
                        <p className="text-[11px] text-slate-500 mt-2.5">
                            • Supported format: <strong>PDF (.pdf) only</strong> • Maximum size: <strong>5 MB</strong>
                        </p>
                    </div>

                    {/* Currently Uploaded File Info Card */}
                    {profile?.verificationDocumentPath && (
                        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0">
                                    <FileText size={24} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-sm text-slate-800 truncate">
                                        {profile.verificationDocumentOriginalName || 'verification-document.pdf'}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Uploaded on {profile.verificationDocumentUploadedAt ? new Date(profile.verificationDocumentUploadedAt).toLocaleString() : '—'}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleViewDocument}
                                disabled={downloadingDoc}
                                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {downloadingDoc ? (
                                    <>
                                        <RefreshCw size={14} className="animate-spin" /> Loading...
                                    </>
                                ) : (
                                    <>
                                        <Eye size={14} /> View Uploaded PDF
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Upload / Replacement Form */}
                    <form onSubmit={handleUploadDocument} className="space-y-4">
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                            {profile?.verificationDocumentPath ? 'Replace Document (Upload Revised PDF)' : 'Select & Upload Combined PDF'}
                        </label>

                        <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 transition-colors bg-slate-50/50 flex flex-col items-center justify-center text-center">
                            <UploadCloud size={36} className="text-slate-400 mb-2" />
                            <p className="text-sm font-semibold text-slate-700">
                                {selectedDocFile ? selectedDocFile.name : 'Choose a combined PDF file to upload'}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                {selectedDocFile ? `${(selectedDocFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload` : 'PDF format only, up to 5 MB'}
                            </p>

                            <input
                                type="file"
                                id="profileVerificationDocInput"
                                accept=".pdf,application/pdf"
                                onChange={handleDocFileSelect}
                                className="hidden"
                            />

                            <label
                                htmlFor="profileVerificationDocInput"
                                className="mt-4 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                            >
                                {selectedDocFile ? 'Change File' : 'Browse File'}
                            </label>
                        </div>

                        {selectedDocFile && (
                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={uploadingDoc}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm cursor-pointer"
                                >
                                    {uploadingDoc ? (
                                        <>
                                            <RefreshCw size={16} className="animate-spin" /> Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud size={16} />
                                            {profile?.verificationDocumentPath ? 'Submit Replacement PDF' : 'Upload Verification Document'}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedDocFile(null)}
                                    disabled={uploadingDoc}
                                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>

                    <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
                        Security Notice: Your documents are held in private, encrypted server storage. Only you and authorized PetCare Connect administrators have permission to access them. Document approval means your documents have been verified under the platform's manual review process.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default EditCaregiverProfile;
