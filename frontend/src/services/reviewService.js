import api from './api';

const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },
  getCaregiverReviews: async (caregiverId) => {
    const response = await api.get(`/reviews/caregiver/${caregiverId}`);
    return response.data; // { reviews, count, averageRating }
  },
  getAllReviews: async () => {
    const response = await api.get('/reviews');
    return response.data;
  }
};

export default reviewService;
