import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import CaregiverCard from '../../components/CaregiverCard';
import Loader from '../../components/Loader';
import { searchCaregivers } from '../../services/caregiverService';

const AVAILABLE_SERVICES = ['Dog Walking', 'Pet Sitting', 'House Sitting', 'Drop-in Visits', 'Pet Boarding'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SearchCaregivers = () => {
    const [caregivers, setCaregivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        location: '',
        service: '',
        availability: ''
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const fetchCaregivers = async (currentFilters) => {
        setLoading(true);
        try {
            const res = await searchCaregivers(currentFilters);
            setCaregivers(res.data);
        } catch (error) {
            console.error('Failed to search caregivers', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchCaregivers(filters);
        // eslint-disable-next-line
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCaregivers(filters);
    };

    const handleClear = () => {
        const cleared = { location: '', service: '', availability: '' };
        setFilters(cleared);
        fetchCaregivers(cleared);
    };

    const handleChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
            
            {/* Mobile Filter Toggle */}
            <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <span className="font-bold text-slate-700">Find Caregivers</span>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-semibold"
                >
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* Filter Panel */}
            <aside className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-72 shrink-0 space-y-4`}>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sticky top-6">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <Filter size={18} className="text-blue-500" /> Filters
                        </h2>
                        {isFilterOpen && (
                            <button onClick={() => setIsFilterOpen(false)} className="md:hidden text-slate-400">
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
                            <input 
                                type="text"
                                name="location"
                                value={filters.location}
                                onChange={handleChange}
                                placeholder="City or Zip code"
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Service Needed</label>
                            <select 
                                name="service"
                                value={filters.service}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Any Service</option>
                                {AVAILABLE_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Availability</label>
                            <select 
                                name="availability"
                                value={filters.availability}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Any Day</option>
                                {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div className="pt-2 flex flex-col gap-2">
                            <button 
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <Search size={16} /> Apply Filters
                            </button>
                            <button 
                                type="button"
                                onClick={handleClear}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-sm transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </form>
                </div>
            </aside>

            {/* Results Grid */}
            <main className="flex-1">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800">Caregivers</h1>
                        <p className="text-slate-500 text-sm mt-1">Showing {caregivers.length} verified caregivers</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader /></div>
                ) : caregivers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {caregivers.map(cg => (
                            <CaregiverCard key={cg._id} profile={cg} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Search size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No caregivers found</h3>
                        <p className="text-slate-500 mt-1 max-w-md">We couldn't find any caregivers matching your current filters. Try adjusting your search criteria.</p>
                        <button 
                            onClick={handleClear}
                            className="mt-6 text-blue-600 font-bold hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SearchCaregivers;
