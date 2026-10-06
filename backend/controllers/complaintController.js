const Complaint = require('../models/Complaint');

// @desc    Create a complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
    try {
        const { targetUser, booking, subject, description } = req.body;
        
        const complaint = new Complaint({
            user: req.user._id,
            targetUser,
            booking,
            subject,
            description
        });

        const savedComplaint = await complaint.save();
        res.status(201).json(savedComplaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all complaints (Admin only)
// @route   GET /api/complaints
// @access  Private/Admin
const getComplaints = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        let query = {};
        if (status) query.status = status;

        const skip = (page - 1) * limit;
        const complaints = await Complaint.find(query)
            .populate('user', 'name email role')
            .populate('targetUser', 'name email role')
            .populate('booking', 'service date')
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Complaint.countDocuments(query);

        res.json({
            data: complaints,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update complaint status (Admin only)
// @route   PUT /api/complaints/:id
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        if (status) complaint.status = status;
        if (adminNotes !== undefined) complaint.adminNotes = adminNotes;

        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    updateComplaintStatus
};
