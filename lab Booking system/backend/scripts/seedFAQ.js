const mongoose = require('mongoose');
const FAQ = require('../models/faq');
const connectDB = require('../config/db');
require('dotenv').config();

const seedFAQ = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing FAQ data
    await FAQ.deleteMany({});
    console.log('Cleared existing FAQ data');

    // Seed FAQ items from the image
    const faqItems = [
      {
        question: 'How do I book a laboratory?',
        answer: 'You can book a laboratory through our online platform by selecting your desired lab, choosing an available time slot, and providing the necessary details. You can also book through our mobile app or contact our support team for assistance.',
        category: 'booking',
        order: 1,
        isActive: true
      },
      {
        question: 'Can I book multiple labs at the same time?',
        answer: 'Yes, you can book multiple labs simultaneously, subject to availability. Our system will show you all available time slots across different labs, allowing you to coordinate bookings efficiently.',
        category: 'booking',
        order: 2,
        isActive: true
      },
      {
        question: 'When can my sample be rejected?',
        answer: 'Samples may be rejected if they are improperly collected, contaminated, not stored at the correct temperature, or collected outside the specified time window. Following all pre-test instructions carefully helps ensure sample acceptance.',
        category: 'general',
        order: 3,
        isActive: true
      },
      {
        question: 'How can I create a user account on your platform?',
        answer: 'Creating an account is simple. Click on the "Sign Up" button, provide your basic information including email and phone number, verify your email, and set a secure password. The entire process takes less than 5 minutes.',
        category: 'account',
        order: 4,
        isActive: true
      },
      {
        question: 'Is my personal and medical data secure?',
        answer: 'Absolutely. We use industry-standard encryption and security measures to protect your data. Our platform complies with HIPAA and other privacy regulations, ensuring your personal and medical information remains confidential and secure.',
        category: 'security',
        order: 5,
        isActive: true
      },
      {
        question: 'Can I save my medical records on my account?',
        answer: 'Yes, you can securely store your medical records in your account. All records are encrypted and accessible only to you. You can also grant temporary access to healthcare providers when needed.',
        category: 'account',
        order: 6,
        isActive: true
      },
      {
        question: 'Can I add family members to my account?',
        answer: 'Yes, you can add family members to your account as dependents. This allows you to manage bookings and view results for your children, elderly parents, or other family members with their consent.',
        category: 'account',
        order: 7,
        isActive: true
      },
      {
        question: 'What should I do if I cannot log in to my account?',
        answer: 'If you cannot log in, first try resetting your password using the "Forgot Password" link. If issues persist, contact our support team at support@labbooking.com or call our helpline for immediate assistance.',
        category: 'technical',
        order: 8,
        isActive: true
      },
      {
        question: 'How long does it take to resolve a technical issue?',
        answer: 'Most technical issues are resolved within 24-48 hours. Critical issues affecting multiple users are prioritized and typically resolved within 4-6 hours. You can track your support ticket status online.',
        category: 'technical',
        order: 9,
        isActive: true
      },
      {
        question: 'Can my medical data be misused?',
        answer: 'No, your medical data cannot be misused. We have strict policies and technical safeguards in place. We never sell your data to third parties, and access is limited to authorized personnel for legitimate purposes only.',
        category: 'security',
        order: 10,
        isActive: true
      },
      {
        question: 'How can I know how my data is being used?',
        answer: 'You can view your data usage history in your account settings. We provide transparent logs of when your data is accessed and for what purpose. Our privacy policy clearly outlines all data usage practices.',
        category: 'security',
        order: 11,
        isActive: true
      },
      {
        question: 'Who can access my medical history and records?',
        answer: 'Only you and authorized healthcare providers with your explicit consent can access your medical records. Our staff can only access data necessary for providing services, and all access is logged and audited regularly.',
        category: 'security',
        order: 12,
        isActive: true
      },
      {
        question: 'Can I delete my account if I no longer want to use the service?',
        answer: 'Yes, you can delete your account at any time from your account settings. Upon deletion, your personal data will be removed from our active systems, though we may retain certain information as required by law or for legitimate business purposes.',
        category: 'account',
        order: 13,
        isActive: true
      }
    ];

    const savedFAQs = await FAQ.insertMany(faqItems);
    console.log(`Seeded ${savedFAQs.length} FAQ items`);

    console.log('FAQ seeding completed successfully!');
    mongoose.connection.close();

  } catch (error) {
    console.error('Error seeding FAQ data:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedFAQ();
