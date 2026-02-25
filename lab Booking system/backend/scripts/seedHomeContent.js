const mongoose = require('mongoose');
const HomeWhyBook = require('../models/homeWhyBook');
const HomeHowItWorks = require('../models/homeHowItWorks');
require('dotenv').config();

const seedHomeContent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab-booking');
    console.log('Connected to MongoDB');

    // Clear existing home content
    await HomeWhyBook.deleteMany({});
    await HomeHowItWorks.deleteMany({});
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

    const howItWorksItems = [
      {
        stepNumber: 1,
        iconKey: 'Search',
        title: 'Search & Select',
        description: 'Search for tests and labs, compare prices, and select what you need.',
        order: 1,
        isActive: true
      },
      {
        stepNumber: 2,
        iconKey: 'CreditCard',
        title: 'Book & Pay',
        description: 'Book your test and pay securely online or choose cash on collection.',
        order: 2,
        isActive: true
      },
      {
        stepNumber: 3,
        iconKey: 'Home',
        title: 'Sample Collection',
        description: 'Get your sample collected at home or visit the lab.',
        order: 3,
        isActive: true
      },
      {
        stepNumber: 4,
        iconKey: 'FileText',
        title: 'Get Reports',
        description: 'Receive your test reports digitally within 24-48 hours.',
        order: 4,
        isActive: true
      }
    ];

    await HomeWhyBook.insertMany(whyBookItems);
    await HomeHowItWorks.insertMany(howItWorksItems);
    
    console.log('Home content seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding home content:', error);
    process.exit(1);
  }
};

seedHomeContent();
