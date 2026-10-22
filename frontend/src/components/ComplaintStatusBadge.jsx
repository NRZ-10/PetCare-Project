import React from 'react';
import { Clock, RefreshCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const ComplaintStatusBadge = ({ status }) => {
    switch (status) {
        case 'Pending':
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold shadow-xs">
                    <Clock size={12} className="text-amber-500 shrink-0" />
                    Pending
                </span>
            );
        case 'In Progress':
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold shadow-xs">
                    <RefreshCw size={12} className="text-blue-500 animate-spin shrink-0" />
                    In Progress
                </span>
            );
        case 'Resolved':
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold shadow-xs">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    Resolved
                </span>
            );
        case 'Rejected':
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-semibold shadow-xs">
                    <XCircle size={12} className="text-rose-500 shrink-0" />
                    Rejected
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-semibold">
                    <AlertCircle size={12} className="text-slate-400 shrink-0" />
                    {status || 'Unknown'}
                </span>
            );
    }
};

export default ComplaintStatusBadge;
