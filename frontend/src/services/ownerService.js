import api from './api';

/**
 * Fetch the authenticated owner's full profile
 */
export const getOwnerProfile = () => api.get('/owner/profile');

/**
 * Update profile text fields (name, email, phone, address, bio)
 */
export const updateOwnerProfile = (data) => api.put('/owner/profile', data);

/**
 * Upload / replace the profile image
 */
export const uploadProfileImage = (formData) =>
    api.post('/owner/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
