const mongoose = require('mongoose');

const privacyPolicySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Privacy Policy'
  },
  sections: [{
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure only one privacy policy document exists
privacyPolicySchema.statics.getPolicy = async function() {
  let policy = await this.findOne().sort({ updatedAt: -1 });
  if (!policy) {
    // Create default policy if none exists
    policy = await this.create({
      title: 'Privacy Policy',
      sections: [
        {
          title: 'Data Protection & Security',
          content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
          order: 1
        },
        {
          title: 'Information Collection & Usage',
          content: 'We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.',
          order: 2
        },
        {
          title: 'Log Data & Analytics',
          content: 'Our servers automatically record information that your browser sends whenever you visit our website.',
          order: 3
        },
        {
          title: 'Cookies & Tracking Technologies',
          content: 'We use cookies and similar tracking technologies to track activity on our website and hold certain information.',
          order: 4
        },
        {
          title: 'Data Retention Policy',
          content: 'We retain your personal information only as long as necessary to provide the services and fulfill the transactions you request.',
          order: 5
        },
        {
          title: 'Third-Party Sharing & Disclosure',
          content: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.',
          order: 6
        },
        {
          title: 'Your Data Rights (GDPR/CCPA)',
          content: 'You have the right to access, update, or delete your personal information at any time.',
          order: 7
        },
        {
          title: 'Children\'s Privacy',
          content: 'Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children.',
          order: 8
        },
        {
          title: 'Changes to This Privacy Policy',
          content: 'We may update our privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.',
          order: 9
        }
      ]
    });
  }
  return policy;
};

const PrivacyPolicy = mongoose.model('PrivacyPolicy', privacyPolicySchema);

module.exports = PrivacyPolicy;
