const mongoose = require('mongoose');
const PrivacyContent = require('../models/privacyPolicy');
require('dotenv').config();

const seedPrivacyContent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing privacy content
    await PrivacyContent.deleteMany({});
    console.log('Cleared existing privacy content');

    // Create default privacy content
    const defaultPrivacyContent = {
      version: '1.0',
      sections: [
        {
          sectionNumber: 1,
          title: 'Information We Collect',
          content: 'We collect information you provide directly to us, such as when you create an account, use our services, or contact us. This may include your name, email address, phone number, payment information, and medical information relevant to laboratory services.',
          order: 1,
          isActive: true
        },
        {
          sectionNumber: 2,
          title: 'How We Use Your Information',
          content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, communicate with you about products, services, and promotional offers, and monitor and analyze trends and usage.',
          order: 2,
          isActive: true
        },
        {
          sectionNumber: 3,
          title: 'Information Sharing',
          content: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy. We may share your information with healthcare providers for service delivery, payment processors for transactions, and legal authorities when required by law.',
          order: 3,
          isActive: true
        },
        {
          sectionNumber: 4,
          title: 'Data Security',
          content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.',
          order: 4,
          isActive: true
        },
        {
          sectionNumber: 5,
          title: 'Data Retention',
          content: 'We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Medical records are retained according to applicable healthcare regulations.',
          order: 5,
          isActive: true
        },
        {
          sectionNumber: 6,
          title: 'Your Rights',
          content: 'You have the right to access, update, or delete your personal information. You can manage your account settings and preferences through your online account. You may also opt-out of certain communications from us.',
          order: 6,
          isActive: true
        },
        {
          sectionNumber: 7,
          title: 'Cookies and Tracking',
          content: 'We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.',
          order: 7,
          isActive: true
        },
        {
          sectionNumber: 8,
          title: 'Children\'s Privacy',
          content: 'Our service is not intended for children under 18 years of age. We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.',
          order: 8,
          isActive: true
        },
        {
          sectionNumber: 9,
          title: 'Changes to This Privacy Policy',
          content: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this policy.',
          order: 9,
          isActive: true
        }
      ]
    };

    const privacyContent = await PrivacyContent.create(defaultPrivacyContent);
    console.log('Privacy content seeded successfully:', privacyContent._id);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding privacy content:', error);
    process.exit(1);
  }
};

seedPrivacyContent();
