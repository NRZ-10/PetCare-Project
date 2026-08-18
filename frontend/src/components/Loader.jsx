import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ className = '', size = 32, label }) => {
    return (
        <div className={`flex flex-col justify-center items-center p-4 ${className}`}>
            <div className="relative">
                <Loader2 className="animate-spin text-blue-600 relative z-10" size={size} />
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            </div>
            {label && <p className="mt-2 text-sm text-gray-500 animate-pulse">{label}</p>}
        </div>
    );
};

export default Loader;
