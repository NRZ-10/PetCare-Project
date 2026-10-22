const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const {
    createComplaint,
    getMyComplaints,
    getMyComplaintById,
    getComplaints,
    getComplaintById,
    updateComplaintStatus
} = require('../controllers/complaintController');

// User routes (Owners and Caregivers)
router.post('/', protect, authorizeRoles('owner', 'caregiver'), createComplaint);
router.get('/my', protect, authorizeRoles('owner', 'caregiver'), getMyComplaints);
router.get('/my/:id', protect, authorizeRoles('owner', 'caregiver'), getMyComplaintById);

// Admin routes
router.get('/', protect, authorizeRoles('admin'), getComplaints);
router.get('/:id', protect, authorizeRoles('admin'), getComplaintById);
router.put('/:id', protect, authorizeRoles('admin'), updateComplaintStatus);

module.exports = router;
