const mongoose = require('mongoose');
const TermsContent = require('../models/termsContent');
require('dotenv').config();

const seedTerms = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab-booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing terms content
    await TermsContent.deleteMany({});
    console.log('Cleared existing terms content');

    // Create the 7 sections from the image
    const termsSections = [
      {
        sectionNumber: 1,
        title: "Acceptance of Terms & Eligibility",
        content: `Legal Affirmation: By accessing the BookMyLab platform, you agree to be bound by this Agreement.
Eligibility Criteria: You must be 18+, minors require guardian supervision.
Entire Agreement: These Terms, Privacy Policy, and Cookie Policy form the full agreement.
Right to Amend: We may modify these terms, changes take effect upon posting.`,
        order: 0,
        isActive: true
      },
      {
        sectionNumber: 2,
        title: "User Accounts & Prohibited Conduct",
        content: `Registration Veracity: Provide accurate identity and medical information.
Account Custodianship: Keep credentials secure, avoid unsafe networks.
Automated Access: Scrapers/crawlers to extract data are prohibited.
Community Standards: Do not transmit defamatory content or harvest partner data.`,
        order: 1,
        isActive: true
      },
      {
        sectionNumber: 3,
        title: "Booking & Sample Collection Protocols",
        content: `Booking Validity: Contract forms upon lab confirmation of dispatch.
Pre-Analytic Requirements: Fasting may be required for certain tests.
Home Collection Access: Provide a safe, accessible environment.
Turnaround Time (TAT) Estimates: may vary due to clinical factors.`,
        order: 2,
        isActive: true
      },
      {
        sectionNumber: 4,
        title: "Financial Terms & Refund Architecture",
        content: `Pricing Structure: Prices include taxes unless stated.
Payment Gateway: Encrypted gateways, we do not store CVV/PIN.
Cancellation Window: Tiered refunds based on time.
Dispute Window: Report billing discrepancies within 14 days.`,
        order: 3,
        isActive: true
      },
      {
        sectionNumber: 5,
        title: "Data Sovereignty & Medical Privacy",
        content: `Clinical Data Usage: Labs act as Data Controllers, platform as Processor.
HIPAA/GDPR Alignment: No health data sales for marketing.
Data Retention: Records retained per regulation.
Breach Notification: Notify users/regulators within stipulated time.`,
        order: 4,
        isActive: true
      },
      {
        sectionNumber: 6,
        title: "Intellectual Property & Brand Assets",
        content: `Proprietary Rights: Code, graphics, branding owned by Company.
Limited License: Personal, non-commercial use only.
Software Integrity: No reverse engineering.
User Contributions: Feedback becomes Company property.`,
        order: 5,
        isActive: true
      },
      {
        sectionNumber: 7,
        title: "Limitation of Liability & Disclaimers",
        content: `Medical Disclaimer: Platform is facilitator, consult practitioners.
Exclusion of Warranties: Service provided as-is.
Indemnification: You indemnify for violations/misuse.`,
        order: 6,
        isActive: true
      }
    ];

    // Create new terms content
    const termsContent = new TermsContent({
      sections: termsSections,
      version: '1.0',
      lastUpdated: new Date()
    });

    await termsContent.save();
    console.log('Successfully seeded terms content with 7 sections');

    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding terms content:', error);
    process.exit(1);
  }
};

// Run the seed function
seedTerms();
