const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// @desc    Get owner's full profile
// @route   GET /api/owner/profile
// @access  Private/Owner
const getOwnerProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update owner profile fields
// @route   PUT /api/owner/profile
// @access  Private/Owner
const updateOwnerProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, email, phone, address, bio } = req.body;

        // If email is changing, ensure it isn't already taken
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email is already in use by another account' });
            }
            user.email = email;
        }

        if (name) user.name = name;
        if (phone !== undefined) {
            if (phone.trim() !== '' && !/^\+?[0-9\s-]{10,15}$/.test(phone)) {
                return res.status(400).json({ message: 'Invalid phone number format' });
            }
            user.phone = phone;
        }
        if (address !== undefined) user.address = address;
        if (bio !== undefined) user.bio = bio;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            address: updatedUser.address,
            bio: updatedUser.bio,
            profileImage: updatedUser.profileImage,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Upload / replace profile image
// @route   POST /api/owner/profile/image
// @access  Private/Owner
const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete old profile image if it exists locally
        if (user.profileImage && user.profileImage.startsWith('/uploads/')) {
            const oldImagePath = path.join(__dirname, '..', user.profileImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        user.profileImage = `/uploads/${req.file.filename}`;
        await user.save();

        res.json({ profileImage: user.profileImage });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getOwnerProfile, updateOwnerProfile, uploadProfileImage };
