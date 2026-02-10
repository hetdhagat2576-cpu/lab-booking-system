const mongoose = require('mongoose');
const AboutContent = require('../models/AboutContent');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab_appointment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedAboutContent = async () => {
  try {
    // Clear existing about content
    await AboutContent.deleteMany({});
    console.log('Cleared existing about content');

    // Create initial about content based on the provided image
    const initialAboutContent = new AboutContent({
      mainHeading: 'Why Our System is Smarter Care',
      sections: [
        {
          icon: 'bolt',
          title: 'All-in-One',
          description: 'Schedules and equipment in one place.',
          imageUrl: ''
        },
        {
          icon: 'shield',
          title: 'Secure',
          description: 'Data stays protected.',
          imageUrl: ''
        },
        {
          icon: 'cloud',
          title: 'Accessible',
          description: '24/7 cloud access.',
          imageUrl: ''
        },
        {
          icon: 'dollar',
          title: 'Affordable',
          description: 'Clear pricing.',
          imageUrl: ''
        }
      ]
    });

    await initialAboutContent.save();
    console.log('Initial about content seeded successfully');

    // Display the seeded content
    const seededContent = await AboutContent.findOne();
    console.log('\nSeeded Content:');
    console.log('Main Heading:', seededContent.mainHeading);
    console.log('Sections:');
    seededContent.sections.forEach((section, index) => {
      console.log(`  ${index + 1}. ${section.title}: ${section.description}`);
    });

  } catch (error) {
    console.error('Error seeding about content:', error);
  } finally {
    mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

seedAboutContent();
