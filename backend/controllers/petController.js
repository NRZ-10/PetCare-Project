const Pet = require('../models/Pet');
const path = require('path');
const fs = require('fs');

// @desc    Get all pets for the logged-in owner
// @route   GET /api/pets
// @access  Private/Owner
const getMyPets = async (req, res) => {
    try {
        const pets = await Pet.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single pet by ID (must belong to owner)
// @route   GET /api/pets/:id
// @access  Private/Owner
const getPetById = async (req, res) => {
    try {
        const pet = await Pet.findOne({ _id: req.params.id, owner: req.user._id });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(pet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Add a new pet
// @route   POST /api/pets
// @access  Private/Owner
const addPet = async (req, res) => {
    try {
        const { name, breed, age, gender, vaccinationStatus, medicalNotes } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        const pet = await Pet.create({
            owner: req.user._id,
            name,
            breed,
            age: Number(age),
            gender,
            vaccinationStatus,
            medicalNotes: medicalNotes || '',
            imageUrl
        });

        res.status(201).json(pet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a pet
// @route   PUT /api/pets/:id
// @access  Private/Owner
const updatePet = async (req, res) => {
    try {
        const pet = await Pet.findOne({ _id: req.params.id, owner: req.user._id });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const { name, breed, age, gender, vaccinationStatus, medicalNotes } = req.body;

        // Handle new image upload – delete old image if it was stored locally
        if (req.file) {
            if (pet.imageUrl && pet.imageUrl.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '..', pet.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            pet.imageUrl = `/uploads/${req.file.filename}`;
        }

        if (name) pet.name = name;
        if (breed) pet.breed = breed;
        if (age !== undefined) pet.age = Number(age);
        if (gender) pet.gender = gender;
        if (vaccinationStatus) pet.vaccinationStatus = vaccinationStatus;
        if (medicalNotes !== undefined) pet.medicalNotes = medicalNotes;

        const updatedPet = await pet.save();
        res.json(updatedPet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a pet
// @route   DELETE /api/pets/:id
// @access  Private/Owner
const deletePet = async (req, res) => {
    try {
        const pet = await Pet.findOne({ _id: req.params.id, owner: req.user._id });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Delete associated image file if stored locally
        if (pet.imageUrl && pet.imageUrl.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '..', pet.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await pet.deleteOne();
        res.json({ message: 'Pet removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getMyPets, getPetById, addPet, updatePet, deletePet };
