const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load .env from the backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const ADMIN = {
    name: 'Admin',
    email: 'admin@petcare.com',
    password: 'Admin@123',
    role: 'admin'
};

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');

        // Remove old admin first so we start fresh
        await User.findOneAndDelete({ email: ADMIN.email });
        console.log('🗑️  Removed old admin (if any)');

        // Create new admin — let the model's pre-save hook hash the password
        const admin = new User({
            name: ADMIN.name,
            email: ADMIN.email,
            password: ADMIN.password, // plain text — hashed by pre-save hook
            role: 'admin'
        });

        await admin.save();
        console.log('🎉 Admin user created successfully!');
        console.log('   Email   :', ADMIN.email);
        console.log('   Password:', ADMIN.password);
        console.log('   Role    : admin');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
