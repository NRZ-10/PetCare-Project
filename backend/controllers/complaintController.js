const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } = require('../models/Complaint');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create a complaint
// @route   POST /api/complaints
// @access  Private (Owner / Caregiver)
const createComplaint = async (req, res) => {
    try {
        const { category, subject, description, bookingId, booking: bookingAlt, targetUser } = req.body;

        if (!subject || !subject.trim()) {
            return res.status(400).json({ message: 'Subject is required' });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({ message: 'Detailed description is required' });
        }

        const selectedCategory = category || 'Other';
        if (!COMPLAINT_CATEGORIES.includes(selectedCategory)) {
            return res.status(400).json({
                message: `Invalid category. Must be one of: ${COMPLAINT_CATEGORIES.join(', ')}`
            });
        }

        const effectiveBookingId = bookingId || bookingAlt;
        let resolvedTargetUser = targetUser;
        let verifiedBookingId = null;

        if (effectiveBookingId) {
            if (!mongoose.Types.ObjectId.isValid(effectiveBookingId)) {
                return res.status(400).json({ message: 'Invalid booking ID format' });
            }

            const bookingDoc = await Booking.findById(effectiveBookingId);
            if (!bookingDoc) {
                return res.status(404).json({ message: 'Referenced booking not found' });
            }

            const currentUserIdStr = req.user._id.toString();
            const isOwner = bookingDoc.owner.toString() === currentUserIdStr;
            const isCaregiver = bookingDoc.caregiver.toString() === currentUserIdStr;

            if (!isOwner && !isCaregiver) {
                return res.status(403).json({
                    message: 'You can only attach bookings that you are a participant of'
                });
            }

            verifiedBookingId = bookingDoc._id;

            // Automatically set counterpart as targetUser if not explicitly provided
            if (!resolvedTargetUser) {
                resolvedTargetUser = isOwner ? bookingDoc.caregiver : bookingDoc.owner;
            }
        }

        if (resolvedTargetUser && !mongoose.Types.ObjectId.isValid(resolvedTargetUser)) {
            return res.status(400).json({ message: 'Invalid target user ID' });
        }

        const complaint = new Complaint({
            submittedBy: req.user._id,
            user: req.user._id,
            targetUser: resolvedTargetUser || undefined,
            bookingId: verifiedBookingId || undefined,
            booking: verifiedBookingId || undefined,
            category: selectedCategory,
            subject: subject.trim(),
            description: description.trim(),
            status: 'Pending'
        });

        const savedComplaint = await complaint.save();
        await savedComplaint.populate([
            { path: 'submittedBy', select: 'name email role phone' },
            { path: 'targetUser', select: 'name email role' },
            {
                path: 'bookingId',
                populate: [
                    { path: 'pet', select: 'name breed' },
                    { path: 'owner', select: 'name email' },
                    { path: 'caregiver', select: 'name email' }
                ]
            }
        ]);

        res.status(201).json({
            success: true,
            message: 'Complaint submitted successfully',
            data: savedComplaint
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get current user's complaints
// @route   GET /api/complaints/my
// @access  Private (Owner / Caregiver)
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            $or: [{ submittedBy: req.user._id }, { user: req.user._id }]
        })
            .populate('submittedBy', 'name email role')
            .populate('targetUser', 'name email role')
            .populate({
                path: 'bookingId',
                populate: [
                    { path: 'pet', select: 'name breed imageUrl' },
                    { path: 'owner', select: 'name email phone' },
                    { path: 'caregiver', select: 'name email phone' }
                ]
            })
            .populate({
                path: 'booking',
                populate: [
                    { path: 'pet', select: 'name breed imageUrl' },
                    { path: 'owner', select: 'name email phone' },
                    { path: 'caregiver', select: 'name email phone' }
                ]
            })
            .populate('handledBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: complaints
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user's single complaint by ID
// @route   GET /api/complaints/my/:id
// @access  Private (Owner / Caregiver)
const getMyComplaintById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid complaint ID' });
        }

        const complaint = await Complaint.findById(req.params.id)
            .populate('submittedBy', 'name email role')
            .populate('targetUser', 'name email role')
            .populate({
                path: 'bookingId',
                populate: [
                    { path: 'pet', select: 'name breed imageUrl' },
                    { path: 'owner', select: 'name email phone' },
                    { path: 'caregiver', select: 'name email phone' }
                ]
            })
            .populate({
                path: 'booking',
                populate: [
                    { path: 'pet', select: 'name breed imageUrl' },
                    { path: 'owner', select: 'name email phone' },
                    { path: 'caregiver', select: 'name email phone' }
                ]
            })
            .populate('handledBy', 'name email');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const isSubmitter =
            (complaint.submittedBy && complaint.submittedBy._id.toString() === req.user._id.toString()) ||
            (complaint.user && complaint.user.toString() === req.user._id.toString());

        if (!isSubmitter) {
            return res.status(403).json({ message: 'Not authorized to view this complaint' });
        }

        res.json({
            success: true,
            data: complaint
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all complaints (Admin only with search & filtering)
// @route   GET /api/complaints
// @access  Private/Admin
const getComplaints = async (req, res) => {
    try {
        const { status, category, search, page = 1, limit = 10 } = req.query;
        let query = {};

        if (status) query.status = status;
        if (category) query.category = category;

        if (search && search.trim()) {
            const searchTerm = search.trim();
            const searchConditions = [
                { subject: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];

            // If valid ObjectId, search by _id
            if (mongoose.Types.ObjectId.isValid(searchTerm)) {
                searchConditions.push({ _id: searchTerm });
            }

            // Find matching users by name
            const matchingUsers = await User.find({
                name: { $regex: searchTerm, $options: 'i' }
            }).select('_id');

            if (matchingUsers.length > 0) {
                const userIds = matchingUsers.map(u => u._id);
                searchConditions.push(
                    { submittedBy: { $in: userIds } },
                    { user: { $in: userIds } },
                    { targetUser: { $in: userIds } }
                );
            }

            query.$or = searchConditions;
        }

        const skip = (Number(page) - 1) * Number(limit);
        const complaints = await Complaint.find(query)
            .populate('submittedBy', 'name email role phone')
            .populate('user', 'name email role phone')
            .populate('targetUser', 'name email role phone')
            .populate({
                path: 'bookingId',
                populate: [
                    { path: 'pet', select: 'name breed imageUrl' },
                    { path: 'owner', select: 'name email phone' },
                    { path: 'caregiver', select: 'name email phone' }
                ]
            })
            .populate({
                path: 'booking',
                populate: [
                    { path: 'pet', select: 'name breed imageUrl' },
                    { path: 'owner', select: 'name email phone' },
                    { path: 'caregiver', select: 'name email phone' }
                ]
            })
            .populate('handledBy', 'name email')
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Complaint.countDocuments(query);

        // Compute summary counts for admin cards
        const [totalAll, totalPending, totalInProgress, totalResolved, totalRejected] = await Promise.all([
            Complaint.countDocuments({}),
            Complaint.countDocuments({ status: 'Pending' }),
            Complaint.countDocuments({ status: 'In Progress' }),
            Complaint.countDocuments({ status: 'Resolved' }),
            Complaint.countDocuments({ status: 'Rejected' })
        ]);

        res.json({
            data: complaints,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)) || 1,
            counts: {
                all: totalAll,
                pending: totalPending,
                inProgress: totalInProgress,
                resolved: totalResolved,
                rejected: totalRejected
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single complaint for Admin
// @route   GET /api/complaints/:id
// @access  Private/Admin
const getComplaintById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid complaint ID' });
        }

        const complaint = await Complaint.findById(req.params.id)
            .populate('submittedBy', 'name email role phone')
            .populate('user', 'name email role phone')
            .populate('targetUser', 'name email role phone')
            .populate({
                path: 'bookingId',
                populate: [
                    { path: 'pet', select: 'name breed imageUrl' },
                    { path: 'owner', select: 'name email phone' },
                    { path: 'caregiver', select: 'name email phone' }
                ]
            })
            .populate({
                path: 'booking',
                populate: [
                    { path: 'pet', select: 'name breed imageUrl' },
                    { path: 'owner', select: 'name email phone' },
                    { path: 'caregiver', select: 'name email phone' }
                ]
            })
            .populate('handledBy', 'name email');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.json({
            success: true,
            data: complaint
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update complaint status & admin response (Admin only)
// @route   PUT /api/complaints/:id
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid complaint ID' });
        }

        const { status, adminResponse, adminNotes, rejectionReason } = req.body;

        if (status && !COMPLAINT_STATUSES.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${COMPLAINT_STATUSES.join(', ')}`
            });
        }

        // Validate rejection reason requirement
        if (status === 'Rejected' && (!rejectionReason || !rejectionReason.trim())) {
            return res.status(400).json({
                message: 'A rejection reason is required when rejecting a complaint'
            });
        }

        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const effectiveResponse = adminResponse !== undefined ? adminResponse : adminNotes;

        if (status) complaint.status = status;
        if (effectiveResponse !== undefined) {
            complaint.adminResponse = effectiveResponse;
            complaint.adminNotes = effectiveResponse;
        }

        if (status === 'Rejected') {
            complaint.rejectionReason = rejectionReason.trim();
        } else if (rejectionReason !== undefined) {
            complaint.rejectionReason = rejectionReason;
        }

        complaint.handledBy = req.user._id;

        if (['Resolved', 'Rejected'].includes(status)) {
            complaint.resolvedAt = new Date();
        }

        const updatedComplaint = await complaint.save();
        await updatedComplaint.populate([
            { path: 'submittedBy', select: 'name email role phone' },
            { path: 'targetUser', select: 'name email role phone' },
            {
                path: 'bookingId',
                populate: [
                    { path: 'pet', select: 'name breed' },
                    { path: 'owner', select: 'name email' },
                    { path: 'caregiver', select: 'name email' }
                ]
            },
            { path: 'handledBy', select: 'name email' }
        ]);

        // Send in-app notification to complainant
        try {
            const complainantId = updatedComplaint.submittedBy?._id || updatedComplaint.user;
            if (complainantId) {
                let noteTitle = `Complaint Update: ${status}`;
                let noteMsg = `Your complaint regarding "${updatedComplaint.subject}" is now marked as "${status}".`;
                if (status === 'Rejected' && updatedComplaint.rejectionReason) {
                    noteMsg += ` Reason: ${updatedComplaint.rejectionReason}`;
                } else if (updatedComplaint.adminResponse) {
                    noteMsg += ` Admin Response: ${updatedComplaint.adminResponse}`;
                }

                await Notification.create({
                    user: complainantId,
                    title: noteTitle,
                    message: noteMsg,
                    type: 'system',
                    relatedId: updatedComplaint._id
                });
            }
        } catch (notifyErr) {
            console.error('Failed to create in-app notification:', notifyErr.message);
        }

        res.json({
            success: true,
            message: 'Complaint updated successfully',
            data: updatedComplaint
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createComplaint,
    getMyComplaints,
    getMyComplaintById,
    getComplaints,
    getComplaintById,
    updateComplaintStatus
};
