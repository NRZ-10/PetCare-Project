const CaregiverProfile = require('../models/CaregiverProfile');
const path = require('path');
const fs = require('fs');

// @desc    Get caregiver profile (create if not exists)
// @route   GET /api/caregiver/profile
// @access  Private/Caregiver
const getProfile = async (req, res) => {
    try {
        let profile = await CaregiverProfile.findOne({ user: req.user._id }).populate('user', 'name email phone');
        
        if (!profile) {
            // Create a default empty profile for the caregiver
            profile = await CaregiverProfile.create({
                user: req.user._id
            });
            // Re-populate user details for consistency
            profile = await CaregiverProfile.findById(profile._id).populate('user', 'name email phone');
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update caregiver profile details
// @route   PUT /api/caregiver/profile
// @access  Private/Caregiver
const updateProfile = async (req, res) => {
    try {
        const { bio, experience, services, price, availability, location, phone } = req.body;

        let profile = await CaregiverProfile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (phone !== undefined) {
            if (phone.trim() !== '' && !/^\+?[0-9\s-]{10,15}$/.test(phone)) {
                return res.status(400).json({ message: 'Invalid phone number format' });
            }
            const User = require('../models/User');
            const user = await User.findById(req.user._id);
            if (user) {
                user.phone = phone;
                await user.save();
            }
        }

        if (bio !== undefined) profile.bio = bio;
        if (experience !== undefined) profile.experience = Number(experience);
        if (services !== undefined) profile.services = services;
        if (price !== undefined) {
            if (Number(price) <= 0) {
                return res.status(400).json({ message: 'Price must be greater than ₹0' });
            }
            profile.price = Number(price);
        }
        if (availability !== undefined) profile.availability = availability;
        if (location !== undefined) profile.location = location;

        const updatedProfile = await profile.save();
        
        // Re-populate user details before returning
        const populatedProfile = await CaregiverProfile.findById(updatedProfile._id).populate('user', 'name email phone');
        
        res.json(populatedProfile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Upload/replace caregiver profile photo
// @route   POST /api/caregiver/profile/photo
// @access  Private/Caregiver
const uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No photo uploaded' });
        }

        const profile = await CaregiverProfile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Delete old photo if it exists locally
        if (profile.photo && profile.photo.startsWith('/uploads/')) {
            const oldPhotoPath = path.join(__dirname, '..', profile.photo);
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }
        }

        profile.photo = `/uploads/${req.file.filename}`;
        await profile.save();

        res.json({ photo: profile.photo });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Search and filter verified caregivers
// @route   GET /api/caregiver/search
// @access  Private/Owner
const searchCaregivers = async (req, res) => {
    try {
        const { location, service, availability } = req.query;
        let query = { verificationStatus: 'Verified' };

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        
        if (service) {
            query.services = { $in: [service] };
        }
        
        if (availability) {
            // Split if passed as a comma-separated string, otherwise treat as array
            const days = Array.isArray(availability) ? availability : availability.split(',');
            query.availability = { $all: days };
        }

        const caregivers = await CaregiverProfile.find(query)
            .populate('user', 'name email')
            .select('-__v');

        res.json(caregivers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getProfile, updateProfile, uploadPhoto, searchCaregivers };
