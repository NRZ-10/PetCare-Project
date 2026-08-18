import api from './api';

/**
 * Fetch all pets belonging to the authenticated owner
 */
export const getMyPets = () => api.get('/pets');

/**
 * Fetch a single pet by ID
 */
export const getPetById = (id) => api.get(`/pets/${id}`);

/**
 * Add a new pet — sends multipart/form-data (supports image upload)
 */
export const addPet = (formData) =>
    api.post('/pets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

/**
 * Update an existing pet — sends multipart/form-data (supports image upload)
 */
export const updatePet = (id, formData) =>
    api.put(`/pets/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

/**
 * Delete a pet by ID
 */
export const deletePet = (id) => api.delete(`/pets/${id}`);
