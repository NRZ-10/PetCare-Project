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
        default: 1,
        min: [1, 'Price must be greater than 0']
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
        enum: ['Not Submitted', 'Pending', 'Approved', 'Rejected', 'Changes Requested', 'Verified'],
        default: 'Not Submitted'
    },
    verificationDocumentPath: {
        type: String,
        default: ''
    },
    verificationDocumentOriginalName: {
        type: String,
        default: ''
    },
    verificationDocumentUploadedAt: {
        type: Date,
        default: null
    },
    verificationNote: {
        type: String,
        default: ''
    },
    verifiedAt: {
        type: Date,
        default: null
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

const CaregiverProfile = mongoose.model('CaregiverProfile', caregiverProfileSchema);

module.exports = CaregiverProfile;
