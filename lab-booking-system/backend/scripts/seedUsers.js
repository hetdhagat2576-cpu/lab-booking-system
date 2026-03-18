const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab_appointment');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create admin user (password will be hashed by the pre-save hook)
    console.log('Creating admin user...');
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@labbooking.com',
      password: 'admin123', 
      role: 'admin',
      emailVerified: true
    });
    console.log('Admin user created');

    // Create lab technician user (password will be hashed by the pre-save hook)
    console.log('Creating lab tech user...');
    const labTechUser = new User({
      name: 'Lab Technician',
      email: 'labtech@labbooking.com',
      password: 'labtech123', 
      role: 'labtechnician',
      emailVerified: true
    });
    console.log('Lab tech user created');

    // Create a regular user for testing (password will be hashed by the pre-save hook)
    console.log('Creating regular user...');
    const regularUser = new User({
      name: 'Regular User',
      email: 'user@labbooking.com',
      password: 'user123', 
      role: 'user',
      emailVerified: true
    });
    console.log('Regular user created');

    console.log('Saving users to database...');
    await adminUser.save();
    console.log('Admin user saved');
    
    await labTechUser.save();
    console.log('Lab tech user saved');
    
    await regularUser.save();
    console.log('Regular user saved');
    
    console.log('Users seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
