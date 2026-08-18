import api from './api';

export const createBooking = (data) => api.post('/bookings', data);

export const getOwnerBookings = () => api.get('/bookings/owner');

export const getCaregiverBookings = () => api.get('/bookings/caregiver');

export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status`, { status });
