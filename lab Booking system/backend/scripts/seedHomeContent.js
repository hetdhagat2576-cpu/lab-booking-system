const mongoose = require('mongoose');
const HomeWhyBook = require('../models/homeWhyBook');
require('dotenv').config();

const seedHomeContent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab-booking');
    console.log('Connected to MongoDB');

    // Clear existing home content
    await HomeWhyBook.deleteMany({});
    console.log('Cleared existing home content');

    const whyBookItems = [
      {
        iconKey: 'Home',
        title: 'Home Sample Collection',
        description: 'Free and timely sample pickup by certified professionals.',
        order: 1,
        isActive: true
      },
      {
        iconKey: 'CheckCircle',
        title: 'Certified Labs',
        description: 'ISO & NABL certified laboratories for accurate results.',
        order: 2,
        isActive: true
      },
      {
        iconKey: 'Users',
        title: 'Best Prices',
        description: 'Compare labs and save up to 70% on test bookings.',
        order: 3,
        isActive: true
      },
      {
        iconKey: 'FileText',
        title: 'Digital Reports',
        description: 'View and share your reports anytime, anywhere.',
        order: 4,
        isActive: true
      }
    ];

    await HomeWhyBook.insertMany(whyBookItems);
    
    console.log('Home content seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding home content:', error);
    process.exit(1);
  }
};

seedHomeContent();
