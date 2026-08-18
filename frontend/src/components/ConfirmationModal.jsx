import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmationModal – animated confirmation dialog.
 * Props:
 *   isOpen       – boolean controlling visibility
 *   onClose      – callback to dismiss without confirming
 *   onConfirm    – callback on confirm button click
 *   title        – modal heading
 *   message      – modal body text
 *   confirmLabel – confirm button text (default: "Delete")
 *   isLoading    – shows spinner on confirm button
 *   danger       – if true, confirm button is red (default: true)
 */
const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed? This action cannot be undone.',
    confirmLabel = 'Delete',
    isLoading = false,
    danger = true,
}) => {
    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-[fadeScaleIn_0.15s_ease-out]">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-4 mx-auto ${danger ? 'bg-red-100' : 'bg-amber-100'}`}>
                    <AlertTriangle size={28} className={danger ? 'text-red-500' : 'text-amber-500'} />
                </div>

                {/* Content */}
                <h2 className="text-xl font-bold text-slate-800 text-center mb-2">{title}</h2>
                <p className="text-slate-500 text-sm text-center mb-6">{message}</p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-white transition-all cursor-pointer disabled:opacity-60
                            ${danger
                                ? 'bg-red-500 hover:bg-red-600 active:scale-95'
                                : 'bg-amber-500 hover:bg-amber-600 active:scale-95'
                            }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Deleting...
                            </span>
                        ) : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
