const express = require('express');
const router = express.Router();
const { createReview, getCaregiverReviews, getAllReviews } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .post(protect, createReview)
    .get(protect, admin, getAllReviews);

router.route('/caregiver/:id')
    .get(protect, getCaregiverReviews);

module.exports = router;
