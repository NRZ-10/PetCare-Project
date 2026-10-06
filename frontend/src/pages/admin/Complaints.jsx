import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Loader2, CheckCircle, Clock, X, Search, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Modal State
    const [status, setStatus] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchComplaints();
    }, [filter]);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const url = filter ? `http://localhost:5000/api/complaints?status=${filter}` : 'http://localhost:5000/api/complaints';
            const response = await axios.get(url, config);
            setComplaints(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (complaint) => {
        setSelectedComplaint(complaint);
        setStatus(complaint.status);
        setAdminNotes(complaint.adminNotes || '');
        setIsModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            await axios.put(`http://localhost:5000/api/complaints/${selectedComplaint._id}`, 
                { status, adminNotes }, 
                config
            );
            
            toast.success('Complaint updated successfully');
            setIsModalOpen(false);
            fetchComplaints();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update complaint');
        } finally {
            setSaving(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending':
                return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold flex items-center w-fit"><Clock size={12} className="mr-1" /> Pending</span>;
            case 'In Progress':
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center w-fit"><Loader2 size={12} className="mr-1" /> In Progress</span>;
            case 'Resolved':
                return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center w-fit"><CheckCircle size={12} className="mr-1" /> Resolved</span>;
            default:
                return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold w-fit">{status}</span>;
        }
    };

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center">
                        <AlertTriangle className="mr-3 text-red-500" size={32} />
                        Complaints
                    </h1>
                    <p className="text-slate-500 mt-1">Manage and resolve user disputes.</p>
                </div>
                
                <div className="flex gap-2">
                    {['', 'Pending', 'In Progress', 'Resolved'].map((stat) => (
                        <button
                            key={stat}
                            onClick={() => setFilter(stat)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                filter === stat 
                                ? 'bg-slate-800 text-white shadow-md' 
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                        >
                            {stat === '' ? 'All' : stat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
            ) : complaints.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center text-center shadow-sm">
                    <CheckCircle size={48} className="text-emerald-400 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-1">No Complaints Found</h3>
                    <p className="text-slate-400 text-sm">Everything is running smoothly!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {complaints.map((complaint) => (
                        <div key={complaint._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                {getStatusBadge(complaint.status)}
                                <button 
                                    onClick={() => openModal(complaint)}
                                    className="text-slate-400 hover:text-blue-500 transition-colors p-1"
                                >
                                    <Edit3 size={18} />
                                </button>
                            </div>
                            
                            <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1">{complaint.subject}</h3>
                            <p className="text-slate-600 text-sm mb-4 flex-grow line-clamp-3">{complaint.description}</p>
                            
                            <div className="pt-4 border-t border-slate-100 text-sm text-slate-500 space-y-1">
                                <p><span className="font-medium text-slate-700">From:</span> {complaint.user?.name} ({complaint.user?.role})</p>
                                {complaint.targetUser && (
                                    <p><span className="font-medium text-slate-700">Against:</span> {complaint.targetUser.name}</p>
                                )}
                                <p className="text-xs text-slate-400 mt-2">
                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && selectedComplaint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">Resolve Complaint</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                                <h3 className="font-semibold text-slate-800 mb-1">{selectedComplaint.subject}</h3>
                                <p className="text-slate-600 text-sm whitespace-pre-wrap">{selectedComplaint.description}</p>
                            </div>

                            <form id="update-complaint-form" onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                    <select 
                                        value={status} 
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full rounded-xl border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Admin Notes</label>
                                    <textarea 
                                        value={adminNotes} 
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add resolution details or internal notes..."
                                        rows={4}
                                        className="w-full rounded-xl border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                form="update-complaint-form"
                                disabled={saving}
                                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center disabled:opacity-70"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin mr-2" /> : <CheckCircle size={18} className="mr-2" />}
                                Update Complaint
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Complaints;
