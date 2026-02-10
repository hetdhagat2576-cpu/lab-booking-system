const mongoose = require('mongoose');
const ServiceContent = require('../models/serviceContent');
const connectDB = require('../config/db');
require('dotenv').config();

const seedServiceContent = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing service content
    await ServiceContent.deleteMany({});
    console.log('Cleared existing service content');

    // Create default service content
    const defaultServiceContent = {
      heroTitle: 'Our Services',
      heroDescription: 'Everything you need to manage laboratory bookings smoothly and professionally.',
      ecosystemTitle: 'Smart Lab Ecosystem',
      ecosystemSubtitle: 'Powering the next generation of researchers',
      efficiencyBadge: 'EFFICIENCY',
      campusTitle: 'Built for busy campus schedules',
      campusDescription: "We've streamlined the logistics so faculty can focus on teaching and students can focus on experimenting.",
      ctaTitle: 'Ready to optimize your labs?',
      ctaDescription: 'Join 50+ institutions using our booking system.',
      ctaButtonText: 'Get Started Now',
      features: [
        {
          title: 'Laboratory Booking',
          description: 'Reserve chemistry, physics, biology, and computer labs with real-time availability.',
          iconKey: 'FlaskConical',
          order: 1,
          isActive: true
        },
        {
          title: 'Smart Scheduling',
          description: 'Avoid clashes with an intelligent calendar that respects classes, exams, and holidays.',
          iconKey: 'CalendarCheck',
          order: 2,
          isActive: true
        },
        {
          title: 'Role-Based Access',
          description: 'Separate views for students, faculty, and admins with the right level of control.',
          iconKey: 'Users2',
          order: 3,
          isActive: true
        },
        {
          title: 'Notifications & Reminders',
          description: 'Email or in-app reminders so you never miss an important lab session.',
          iconKey: 'BellRing',
          order: 4,
          isActive: true
        },
        {
          title: 'Usage Analytics',
          description: 'Understand lab usage patterns to plan resources and maintenance better.',
          iconKey: 'BarChart4',
          order: 5,
          isActive: true
        },
        {
          title: 'Anywhere Access',
          description: 'Responsive web app that works on mobile, tablet, and desktop.',
          iconKey: 'Globe',
          order: 6,
          isActive: true
        }
      ],
      highlights: [
        {
          title: 'Fast Booking',
          description: 'Book a lab in just a few clicks.',
          iconKey: 'Zap',
          order: 1,
          isActive: true
        },
        {
          title: 'Secure Platform',
          description: 'Protected data and controlled access.',
          iconKey: 'ShieldCheck',
          order: 2,
          isActive: true
        },
        {
          title: 'Clear History',
          description: 'Track past and upcoming reservations.',
          iconKey: 'Clock',
          order: 3,
          isActive: true
        },
        {
          title: 'Collaboration Ready',
          description: 'Share booking details with teams.',
          iconKey: 'Handshake',
          order: 4,
          isActive: true
        }
      ]
    };

    const serviceContent = await ServiceContent.create(defaultServiceContent);
    console.log('Service content seeded successfully:', serviceContent._id);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding service content:', error);
    process.exit(1);
  }
};

seedServiceContent();
