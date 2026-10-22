const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const upload = require('../middleware/upload');
const { handleVerificationUpload } = require('../middleware/verificationUpload');
const {
    getProfile,
    updateProfile,
    uploadPhoto,
    searchCaregivers
} = require('../controllers/caregiverController');
const {
    uploadVerificationDocument,
    getCaregiverVerificationStatus,
    getCaregiverVerificationDocument
} = require('../controllers/verificationController');

// Search route accessible by owners
router.get('/search', protect, authorizeRoles('owner'), searchCaregivers);

// The rest of the routes are for caregivers only
router.use(protect, authorizeRoles('caregiver'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile/photo', upload.single('photo'), uploadPhoto);

// Verification routes
router.post('/verification/upload', handleVerificationUpload('document'), uploadVerificationDocument);
router.get('/verification/status', getCaregiverVerificationStatus);
router.get('/verification/document', getCaregiverVerificationDocument);

module.exports = router;
