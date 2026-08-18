const User = require('../models/User');
const Pet = require('../models/Pet');
const Booking = require('../models/Booking');
const CaregiverProfile = require('../models/CaregiverProfile');

// Helper for pagination & search
const getPaginatedData = async (Model, query, page, limit, populate = []) => {
    const skip = (page - 1) * limit;
    let queryBuilder = Model.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    
    populate.forEach(p => { queryBuilder = queryBuilder.populate(p); });
    
    const data = await queryBuilder;
    const total = await Model.countDocuments(query);
    
    return { data, total, page: Number(page), pages: Math.ceil(total / limit) };
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOwners = await User.countDocuments({ role: 'owner' });
        const totalCaregivers = await User.countDocuments({ role: 'caregiver' });
        const totalPets = await Pet.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const pendingVerifications = await CaregiverProfile.countDocuments({ verificationStatus: 'Pending' });

        res.json({
            totalUsers,
            totalOwners,
            totalCaregivers,
            totalPets,
            totalBookings,
            pendingVerifications
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get users (with optional role filter and search)
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
    try {
        const { role, search, page = 1, limit = 10 } = req.query;
        let query = {};
        
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const result = await getPaginatedData(User, query, page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete user and cascade delete related data
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Cascade deletes
        if (user.role === 'owner') {
            await Pet.deleteMany({ owner: user._id });
            await Booking.deleteMany({ owner: user._id });
        } else if (user.role === 'caregiver') {
            await CaregiverProfile.findOneAndDelete({ user: user._id });
            await Booking.deleteMany({ caregiver: user._id });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get caregivers with profiles
// @route   GET /api/admin/caregivers
const getCaregivers = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;
        
        // This is tricky because search by name is in User model, but status is in CaregiverProfile
        // For simplicity, we'll fetch CaregiverProfiles and populate user
        let query = {};
        if (status) query.verificationStatus = status;

        const result = await getPaginatedData(CaregiverProfile, query, page, limit, ['user']);
        
        // Manual search filter after population if search exists (not ideal for huge datasets, but fine for MVP)
        if (search) {
            const regex = new RegExp(search, 'i');
            result.data = result.data.filter(p => p.user && (regex.test(p.user.name) || regex.test(p.user.email)));
            result.total = result.data.length;
            result.pages = Math.ceil(result.total / limit);
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update caregiver verification status
// @route   PUT /api/admin/caregivers/:id/verify
const verifyCaregiver = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Verified', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const profile = await CaregiverProfile.findByIdAndUpdate(
            req.params.id,
            { verificationStatus: status },
            { new: true }
        ).populate('user');

        if (!profile) return res.status(404).json({ message: 'Caregiver profile not found' });
        
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get pets
// @route   GET /api/admin/pets
const getPets = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        let query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { breed: { $regex: search, $options: 'i' } }
            ];
        }

        const result = await getPaginatedData(Pet, query, page, limit, ['owner']);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete pet
// @route   DELETE /api/admin/pets/:id
const deletePet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });

        await Booking.deleteMany({ pet: pet._id });
        await Pet.findByIdAndDelete(req.params.id);

        res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get bookings
// @route   GET /api/admin/bookings
const getBookings = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        let query = {};
        
        if (status) query.status = status;

        const result = await getPaginatedData(Booking, query, page, limit, ['owner', 'caregiver', 'pet']);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getUsers,
    deleteUser,
    getCaregivers,
    verifyCaregiver,
    getPets,
    deletePet,
    getBookings
};
