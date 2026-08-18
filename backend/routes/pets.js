const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const upload = require('../middleware/upload');
const {
    getMyPets,
    getPetById,
    addPet,
    updatePet,
    deletePet
} = require('../controllers/petController');

// All pet routes require authentication and owner role
router.use(protect, authorizeRoles('owner'));

router.route('/')
    .get(getMyPets)
    .post(upload.single('image'), addPet);

router.route('/:id')
    .get(getPetById)
    .put(upload.single('image'), updatePet)
    .delete(deletePet);

module.exports = router;
