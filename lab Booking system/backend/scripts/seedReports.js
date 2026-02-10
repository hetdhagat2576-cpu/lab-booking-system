const mongoose = require('mongoose');
const Report = require('../models/report');
const User = require('../models/user');
require('dotenv').config();

const seedReports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab-booking');
    console.log('Connected to MongoDB');

    // Clear existing reports
    await Report.deleteMany({});
    console.log('Cleared existing reports');

    // Get a sample user for reports
    let sampleUser = await User.findOne({ role: 'user' });
    let newUser;
    if (!sampleUser) {
      console.log('No user found, creating sample user first');
      newUser = new User({
        name: 'Sample User',
        email: 'user@example.com',
        password: '$2a$10$rQZ8kHWKtGY5uKx4v2D0/.vQf8jWqHhGhXzXqZyZqZyZqZyZqZyZq',
        role: 'user',
        isEmailVerified: true
      });
      await newUser.save();
      sampleUser = newUser;
    }

    // Create sample reports
    const sampleReports = [
      {
        bookingId: new mongoose.Types.ObjectId(),
        patientId: sampleUser._id,
        technicianId: new mongoose.Types.ObjectId(),
        packageName: 'Complete Health Checkup',
        selectedTests: [
          {
            name: 'Hemoglobin',
            result: '14.5',
            unit: 'g/dL',
            referenceRange: '13.5-17.5',
            status: 'Normal'
          },
          {
            name: 'Total Cholesterol',
            result: '185',
            unit: 'mg/dL',
            referenceRange: '<200',
            status: 'Normal'
          }
        ],
        testDate: new Date(),
        summary: 'Overall health parameters are within normal ranges. No significant abnormalities detected in the conducted tests.',
        recommendations: 'Continue maintaining a healthy lifestyle with regular exercise and balanced diet. Follow up with annual health checkups.',
        status: 'Completed'
      }
    ];

    await Report.insertMany(sampleReports);
    console.log('Reports seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding reports:', error);
    process.exit(1);
  }
};

seedReports();
