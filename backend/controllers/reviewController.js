const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private/Owner
const createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;

        // Verify booking exists and belongs to owner
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to review this booking' });
        }

        if (booking.status !== 'Completed') {
            return res.status(400).json({ message: 'Can only review completed bookings' });
        }

        // Check if review already exists for this booking
        const existingReview = await Review.findOne({ booking: bookingId });
        if (existingReview) {
            return res.status(400).json({ message: 'Review already exists for this booking' });
        }

        const review = await Review.create({
            booking: bookingId,
            caregiver: booking.caregiver,
            owner: req.user._id,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get reviews for a caregiver
// @route   GET /api/reviews/caregiver/:id
// @access  Public or Private
const getCaregiverReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ caregiver: req.params.id })
            .populate('owner', 'name')
            .sort({ createdAt: -1 });

        const count = reviews.length;
        const averageRating = count > 0 
            ? (reviews.reduce((acc, item) => acc + item.rating, 0) / count).toFixed(1)
            : 0;

        res.json({ reviews, count, averageRating });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('owner', 'name email')
            .populate('caregiver', 'name email')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createReview,
    getCaregiverReviews,
    getAllReviews
};
