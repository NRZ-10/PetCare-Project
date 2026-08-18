const Booking = require('../models/Booking');
const CaregiverProfile = require('../models/CaregiverProfile');
const Notification = require('../models/Notification');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private/Owner
const createBooking = async (req, res) => {
    try {
        const { pet, caregiver, date, time, service, notes } = req.body;

        // Verify caregiver exists and is a caregiver
        const caregiverProfile = await CaregiverProfile.findOne({ user: caregiver });
        if (!caregiverProfile) {
            return res.status(404).json({ message: 'Caregiver not found' });
        }

        const booking = await Booking.create({
            owner: req.user._id,
            pet,
            caregiver,
            date,
            time,
            service,
            notes
        });

        // Notify caregiver
        await Notification.create({
            user: caregiver,
            title: 'New Booking Request',
            message: `You have a new booking request from ${req.user.name}.`,
            type: 'booking_request',
            relatedId: booking._id
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all bookings for the logged-in owner
// @route   GET /api/bookings/owner
// @access  Private/Owner
const getOwnerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ owner: req.user._id })
            .populate('pet', 'name breed imageUrl')
            .populate('caregiver', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all bookings for the logged-in caregiver
// @route   GET /api/bookings/caregiver
// @access  Private/Caregiver
const getCaregiverBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ caregiver: req.user._id })
            .populate('pet', 'name breed imageUrl')
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Authorization logic
        if (req.user.role === 'owner') {
            // Owners can only cancel their own pending/accepted bookings
            if (booking.owner.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized' });
            }
            if (status !== 'Cancelled') {
                return res.status(400).json({ message: 'Owners can only cancel bookings' });
            }
        } else if (req.user.role === 'caregiver') {
            // Caregivers can accept, reject, or complete their bookings
            if (booking.caregiver.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized' });
            }
            if (!['Accepted', 'Rejected', 'Completed'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status update for caregiver' });
            }
        } else {
             return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = status;
        const updatedBooking = await booking.save();

        // Create notification based on status
        let notificationMessage = '';
        let notificationTitle = '';
        let notificationType = 'system';
        let notifyUserId = null;

        if (req.user.role === 'caregiver') {
            notifyUserId = booking.owner;
            if (status === 'Accepted') {
                notificationTitle = 'Booking Accepted';
                notificationMessage = `Your booking on ${booking.date} has been accepted by ${req.user.name}.`;
                notificationType = 'booking_accepted';
            } else if (status === 'Rejected') {
                notificationTitle = 'Booking Rejected';
                notificationMessage = `Your booking on ${booking.date} has been rejected by ${req.user.name}.`;
                notificationType = 'booking_rejected';
            } else if (status === 'Completed') {
                notificationTitle = 'Booking Completed';
                notificationMessage = `Your booking on ${booking.date} has been marked as completed by ${req.user.name}. Please leave a review!`;
                notificationType = 'booking_completed';
            }
        } else if (req.user.role === 'owner') {
            notifyUserId = booking.caregiver;
            if (status === 'Cancelled') {
                notificationTitle = 'Booking Cancelled';
                notificationMessage = `The booking on ${booking.date} has been cancelled by ${req.user.name}.`;
                notificationType = 'booking_cancelled';
            }
        }

        if (notifyUserId) {
            await Notification.create({
                user: notifyUserId,
                title: notificationTitle,
                message: notificationMessage,
                type: notificationType,
                relatedId: booking._id
            });
        }

        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createBooking,
    getOwnerBookings,
    getCaregiverBookings,
    updateBookingStatus
};
