const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const BSON = mongoose.mongo.BSON;

const BACKUP_DIR = path.join(__dirname, 'db_backup');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

const models = ['Booking', 'CaregiverProfile', 'Notification', 'Pet', 'Review', 'User'];

async function exportData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Register all models
    for (const modelName of models) {
      require(path.join(__dirname, '..', 'models', `${modelName}.js`));
    }

    for (const modelName of models) {
      const Model = mongoose.model(modelName);
      const data = await Model.find({}).lean();
      
      const collectionName = Model.collection.collectionName;

      // Save as JSON
      fs.writeFileSync(path.join(BACKUP_DIR, `${collectionName}.json`), JSON.stringify(data, null, 2));
      console.log(`Exported ${data.length} records for ${collectionName} as JSON`);

      // Save as BSON (concatenated BSON documents, which is what mongorestore expects)
      const writeStream = fs.createWriteStream(path.join(BACKUP_DIR, `${collectionName}.bson`));
      for (const doc of data) {
         writeStream.write(BSON.serialize(doc));
      }
      writeStream.end();
      console.log(`Exported ${data.length} records for ${collectionName} as BSON`);
    }

    console.log('Export complete! Check the db_backup folder in your backend directory.');
    process.exit(0);
  } catch (err) {
    console.error('Error exporting data:', err);
    process.exit(1);
  }
}

exportData();
