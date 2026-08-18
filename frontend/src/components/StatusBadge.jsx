import React from 'react';

const StatusBadge = ({ status }) => {
    let colorClasses = '';

    switch (status) {
        case 'Pending':
            colorClasses = 'bg-amber-100 text-amber-700 border-amber-200';
            break;
        case 'Accepted':
            colorClasses = 'bg-blue-100 text-blue-700 border-blue-200';
            break;
        case 'Completed':
            colorClasses = 'bg-emerald-100 text-emerald-700 border-emerald-200';
            break;
        case 'Cancelled':
            colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
            break;
        case 'Rejected':
            colorClasses = 'bg-red-100 text-red-700 border-red-200';
            break;
        default:
            colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${colorClasses}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
