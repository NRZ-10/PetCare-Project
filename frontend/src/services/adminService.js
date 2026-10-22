import api from './api';

export const getDashboardStats = () => api.get('/admin/stats');

export const getUsers = (params) => api.get('/admin/users', { params });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export const getCaregivers = (params) => api.get('/admin/caregivers', { params });
export const verifyCaregiver = (id, status) => api.put(`/admin/caregivers/${id}/verify`, { status });

export const getPets = (params) => api.get('/admin/pets', { params });
export const deletePet = (id) => api.delete(`/admin/pets/${id}`);

export const getBookings = (params) => api.get('/admin/bookings', { params });

// Caregiver Document Verification Management
export const getVerifications = (params) => api.get('/admin/verifications', { params });
export const viewCaregiverDocument = (id) =>
    api.get(`/admin/verifications/${id}/document`, { responseType: 'blob' });
export const approveVerification = (id, note = '') =>
    api.put(`/admin/verifications/${id}/approve`, { note });
export const rejectVerification = (id, reason) =>
    api.put(`/admin/verifications/${id}/reject`, { reason });
export const requestChangesVerification = (id, reason) =>
    api.put(`/admin/verifications/${id}/request-changes`, { reason });
