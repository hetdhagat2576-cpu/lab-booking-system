const mongoose = require('mongoose');
const HealthConcern = require('../models/healthConcern');
require('dotenv').config();

const healthConcernsData = [
  { id: "liver", title: "Liver", iconKey: "FlaskConical", description: "Liver function tests", isActive: true, order: 1, rating: 4 },
  { id: "lungs", title: "Lungs", iconKey: "Activity", description: "Respiratory health screening", isActive: true, order: 2, rating: 4 },
  { id: "kidney", title: "Kidney", iconKey: "Droplets", description: "Kidney function tests", isActive: true, order: 3, rating: 4 },
  { id: "fever", title: "Fever", iconKey: "Droplets", description: "Fever and infection tests", isActive: true, order: 4, rating: 3 },
  { id: "thyroid", title: "Thyroid", iconKey: "FlaskConical", description: "Thyroid function tests", isActive: true, order: 5, rating: 4 },
  { id: "diabetes", title: "Diabetes", iconKey: "Droplets", description: "Blood sugar monitoring", isActive: true, order: 6, rating: 5 }
];

const seedHealthConcerns = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab-booking-system');
    console.log('Connected to MongoDB');

    // Clear existing health concerns
    await HealthConcern.deleteMany({});
    console.log('Cleared existing health concerns');

    // Insert new health concerns
    const insertedHealthConcerns = await HealthConcern.insertMany(healthConcernsData);
    console.log(`Inserted ${insertedHealthConcerns.length} health concerns:`);
    
    insertedHealthConcerns.forEach(concern => {
      console.log(`- ${concern.title} (${concern.id}) - Order: ${concern.order}`);
    });

    console.log('Health concerns seeded successfully!');
  } catch (error) {
    console.error('Error seeding health concerns:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
seedHealthConcerns();
