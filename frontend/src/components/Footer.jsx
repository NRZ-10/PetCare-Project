import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-white py-16 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
                            <Heart className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="ml-3 text-xl font-bold tracking-tight text-slate-100">PetCare Connect</span>
                    </div>
                    <div className="text-slate-500 text-sm font-medium">
                        &copy; {new Date().getFullYear()} PetCare Connect. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
