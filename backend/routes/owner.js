const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const upload = require('../middleware/upload');
const {
    getOwnerProfile,
    updateOwnerProfile,
    uploadProfileImage
} = require('../controllers/ownerController');

// All owner routes require authentication and owner role
router.use(protect, authorizeRoles('owner'));

router.get('/profile', getOwnerProfile);
router.put('/profile', updateOwnerProfile);
router.post('/profile/image', upload.single('profileImage'), uploadProfileImage);

module.exports = router;
