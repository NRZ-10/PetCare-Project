const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Pet name is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'],
        required: [true, 'Pet type is required']
    },
    breed: {
        type: String,
        required: [true, 'Breed is required'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [0, 'Age cannot be negative']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: [true, 'Gender is required']
    },
    vaccinationStatus: {
        type: String,
        enum: ['Up to date', 'Partial', 'Not vaccinated'],
        required: [true, 'Vaccination status is required']
    },
    medicalNotes: {
        type: String,
        default: '',
        trim: true
    },
    imageUrl: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;
