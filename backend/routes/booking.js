const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const {
    createBooking,
    getOwnerBookings,
    getCaregiverBookings,
    updateBookingStatus
} = require('../controllers/bookingController');

router.use(protect);

// Owner routes
router.post('/', authorizeRoles('owner'), createBooking);
router.get('/owner', authorizeRoles('owner'), getOwnerBookings);

// Caregiver routes
router.get('/caregiver', authorizeRoles('caregiver'), getCaregiverBookings);

// Shared route (role-based logic inside the controller)
router.put('/:id/status', updateBookingStatus);

module.exports = router;
