import React from 'react';
import { Flag } from 'lucide-react';

const Reports = () => (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-800">Reports</h1>
            <p className="text-slate-500 mt-1">View platform activity reports and analytics.</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center text-center">
            <Flag size={48} className="text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">Reports Module</h3>
            <p className="text-slate-400 text-sm">Coming soon. Analytics and report generation will be available here in a future update.</p>
        </div>
    </div>
);

export default Reports;
