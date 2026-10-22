const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const col = mongoose.connection.db.collection('caregiverprofiles');
        const result = await col.updateMany(
            { verificationStatus: 'Verified' },
            { $set: { verificationStatus: 'Approved' } }
        );
        console.log(`Successfully migrated ${result.modifiedCount} profiles to 'Approved'.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
};

migrate();
