const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const {
    createComplaint,
    getComplaints,
    updateComplaintStatus
} = require('../controllers/complaintController');

// User can create a complaint
router.post('/', protect, createComplaint);

// Admin can get and update complaints
router.get('/', protect, authorizeRoles('admin'), getComplaints);
router.put('/:id', protect, authorizeRoles('admin'), updateComplaintStatus);

module.exports = router;
