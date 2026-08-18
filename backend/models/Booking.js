const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    caregiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // Storing as YYYY-MM-DD string for simplicity
        required: true
    },
    time: {
        type: String, // e.g., "10:00 AM" or "14:00"
        required: true
    },
    service: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Completed', 'Cancelled', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
