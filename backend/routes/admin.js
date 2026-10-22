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
    getBookings,
    getReports
} = require('../controllers/adminController');
const {
    getAdminVerifications,
    getAdminCaregiverDocument,
    approveCaregiverVerification,
    rejectCaregiverVerification,
    requestCorrectionCaregiverVerification
} = require('../controllers/verificationController');

// All routes require admin role
router.use(protect, authorizeRoles('admin'));

router.get('/stats', getDashboardStats);

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

router.get('/caregivers', getCaregivers);
router.put('/caregivers/:id/verify', verifyCaregiver);

// Verification Management Routes
router.get('/verifications', getAdminVerifications);
router.get('/verifications/:id/document', getAdminCaregiverDocument);
router.put('/verifications/:id/approve', approveCaregiverVerification);
router.put('/verifications/:id/reject', rejectCaregiverVerification);
router.put('/verifications/:id/request-changes', requestCorrectionCaregiverVerification);

router.get('/pets', getPets);
router.delete('/pets/:id', deletePet);

router.get('/bookings', getBookings);

router.get('/reports', getReports);

module.exports = router;

