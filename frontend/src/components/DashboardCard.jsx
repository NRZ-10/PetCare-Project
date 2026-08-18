import React from 'react';

/**
 * DashboardCard – a premium stat card for the owner dashboard.
 * Props:
 *   title      – card label (string)
 *   value      – primary stat (string | number)
 *   subtitle   – small note below value (string)
 *   icon       – Lucide icon component
 *   gradient   – Tailwind bg gradient classes (string)
 *   iconBg     – Tailwind classes for the icon background pill (string)
 */
const DashboardCard = ({ title, value, subtitle, icon: Icon, gradient, iconBg }) => {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl ${gradient}`}
        >
            {/* Content */}
            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest opacity-80">{title}</p>
                    <p className="mt-2 text-5xl font-extrabold">{value}</p>
                    {subtitle && (
                        <p className="mt-1 text-xs opacity-70">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`flex items-center justify-center rounded-xl p-3 ${iconBg}`}>
                        <Icon size={24} strokeWidth={2} />
                    </div>
                )}
            </div>

            {/* Decorative circles */}
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
        </div>
    );
};

export default DashboardCard;
