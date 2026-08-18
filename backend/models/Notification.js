const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['booking_request', 'booking_accepted', 'booking_completed', 'booking_cancelled', 'booking_rejected', 'system'],
        default: 'system'
    },
    read: {
        type: Boolean,
        default: false
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        // Could be a booking ID or anything else
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
