import api from './api';

/**
 * Fetch the authenticated caregiver's profile
 */
export const getCaregiverProfile = () => api.get('/caregiver/profile');

/**
 * Update caregiver profile details
 */
export const updateCaregiverProfile = (data) => api.put('/caregiver/profile', data);

/**
 * Upload or replace the profile photo
 */
export const uploadCaregiverPhoto = (formData) =>
    api.post('/caregiver/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

/**
 * Search verified caregivers (Owner role)
 */
export const searchCaregivers = (filters = {}) => {
    // Clean up empty filters
    const query = Object.keys(filters)
        .filter(key => filters[key])
        .reduce((acc, key) => {
            acc[key] = filters[key];
            return acc;
        }, {});
    
    return api.get('/caregiver/search', { params: query });
};
