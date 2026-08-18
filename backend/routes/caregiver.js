const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const upload = require('../middleware/upload');
const {
    getProfile,
    updateProfile,
    uploadPhoto,
    searchCaregivers
} = require('../controllers/caregiverController');

// Search route accessible by owners
router.get('/search', protect, authorizeRoles('owner'), searchCaregivers);

// The rest of the routes are for caregivers only
router.use(protect, authorizeRoles('caregiver'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile/photo', upload.single('photo'), uploadPhoto);

module.exports = router;
