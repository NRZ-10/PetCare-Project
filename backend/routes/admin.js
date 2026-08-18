const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const {
    getDashboardStats,
    getUsers,
    deleteUser,
    getCaregivers,
    verifyCaregiver,
    getPets,
    deletePet,
    getBookings
} = require('../controllers/adminController');

// All routes require admin role
router.use(protect, authorizeRoles('admin'));

router.get('/stats', getDashboardStats);

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

router.get('/caregivers', getCaregivers);
router.put('/caregivers/:id/verify', verifyCaregiver);

router.get('/pets', getPets);
router.delete('/pets/:id', deletePet);

router.get('/bookings', getBookings);

module.exports = router;
