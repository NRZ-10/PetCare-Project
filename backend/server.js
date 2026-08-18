const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const ownerRoutes = require('./routes/owner');
const caregiverRoutes = require('./routes/caregiver');
const bookingRoutes = require('./routes/booking');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/reviews');
const notificationRoutes = require('./routes/notifications');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/caregiver', caregiverRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
