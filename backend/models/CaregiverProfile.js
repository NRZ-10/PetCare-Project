const mongoose = require('mongoose');

const caregiverProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    photo: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    experience: {
        type: Number,
        default: 0
    },
    services: {
        type: [String],
        default: []
    },
    price: {
        type: Number,
        default: 0
    },
    availability: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        default: ''
    },
    verificationStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

const CaregiverProfile = mongoose.model('CaregiverProfile', caregiverProfileSchema);

module.exports = CaregiverProfile;
