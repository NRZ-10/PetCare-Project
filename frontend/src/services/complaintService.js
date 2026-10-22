import api from './api';

export const OWNER_COMPLAINT_CATEGORIES = [
    'Caregiver Did Not Arrive',
    'Caregiver Misconduct',
    'Poor Service',
    'Pet Safety / Neglect',
    'Booking Issue',
    'Fake Profile',
    'Payment Issue',
    'Other'
];

export const CAREGIVER_COMPLAINT_CATEGORIES = [
    'Owner Did Not Show Up',
    'Owner Misconduct',
    'Undisclosed Pet Aggression / Safety Issue',
    'Unsafe Environment',
    'Booking Issue',
    'Fake Profile',
    'Payment Issue',
    'Other'
];

export const COMPLAINT_CATEGORIES = Array.from(new Set([
    ...OWNER_COMPLAINT_CATEGORIES,
    ...CAREGIVER_COMPLAINT_CATEGORIES
]));

export const getComplaintCategoriesByRole = (role) => {
    if (role === 'caregiver') return CAREGIVER_COMPLAINT_CATEGORIES;
    return OWNER_COMPLAINT_CATEGORIES;
};

export const COMPLAINT_STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const complaintService = {
    // User functions
    createComplaint: async (complaintData) => {
        const response = await api.post('/complaints', complaintData);
        return response.data;
    },
    getMyComplaints: async () => {
        const response = await api.get('/complaints/my');
        return response.data;
    },
    getMyComplaintById: async (id) => {
        const response = await api.get(`/complaints/my/${id}`);
        return response.data;
    },

    // Admin functions
    getAdminComplaints: async (params) => {
        const response = await api.get('/complaints', { params });
        return response.data;
    },
    getAdminComplaintById: async (id) => {
        const response = await api.get(`/complaints/${id}`);
        return response.data;
    },
    updateComplaintStatus: async (id, payload) => {
        const response = await api.put(`/complaints/${id}`, payload);
        return response.data;
    }
};

export default complaintService;
