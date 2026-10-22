const mongoose = require('mongoose');

const OWNER_COMPLAINT_CATEGORIES = [
    'Caregiver Did Not Arrive',
    'Caregiver Misconduct',
    'Poor Service',
    'Pet Safety / Neglect',
    'Booking Issue',
    'Fake Profile',
    'Payment Issue',
    'Other'
];

const CAREGIVER_COMPLAINT_CATEGORIES = [
    'Owner Did Not Show Up',
    'Owner Misconduct',
    'Undisclosed Pet Aggression / Safety Issue',
    'Unsafe Environment',
    'Booking Issue',
    'Fake Profile',
    'Payment Issue',
    'Other'
];

// Union of all categories for schema validation
const COMPLAINT_CATEGORIES = Array.from(new Set([
    ...OWNER_COMPLAINT_CATEGORIES,
    ...CAREGIVER_COMPLAINT_CATEGORIES
]));

const COMPLAINT_STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const complaintSchema = new mongoose.Schema({
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Maintained for backward compatibility
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    // Maintained for backward compatibility
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    category: {
        type: String,
        required: [true, 'Complaint category is required'],
        enum: COMPLAINT_CATEGORIES,
        default: 'Other'
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    status: {
        type: String,
        enum: COMPLAINT_STATUSES,
        default: 'Pending'
    },
    adminResponse: {
        type: String,
        default: ''
    },
    // Maintained for backward compatibility
    adminNotes: {
        type: String,
        default: ''
    },
    rejectionReason: {
        type: String,
        default: ''
    },
    handledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolvedAt: {
        type: Date
    }
}, { timestamps: true });

// Pre-save synchronization hook to ensure backwards compatibility
complaintSchema.pre('save', function(next) {
    if (this.submittedBy && !this.user) {
        this.user = this.submittedBy;
    } else if (this.user && !this.submittedBy) {
        this.submittedBy = this.user;
    }
    if (this.bookingId && !this.booking) {
        this.booking = this.bookingId;
    } else if (this.booking && !this.bookingId) {
        this.bookingId = this.booking;
    }
    if (this.adminResponse && !this.adminNotes) {
        this.adminNotes = this.adminResponse;
    } else if (this.adminNotes && !this.adminResponse) {
        this.adminResponse = this.adminNotes;
    }
    if (typeof next === 'function') next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
module.exports.COMPLAINT_CATEGORIES = COMPLAINT_CATEGORIES;
module.exports.OWNER_COMPLAINT_CATEGORIES = OWNER_COMPLAINT_CATEGORIES;
module.exports.CAREGIVER_COMPLAINT_CATEGORIES = CAREGIVER_COMPLAINT_CATEGORIES;
module.exports.COMPLAINT_STATUSES = COMPLAINT_STATUSES;
