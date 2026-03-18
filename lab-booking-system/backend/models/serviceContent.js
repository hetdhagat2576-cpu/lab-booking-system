const mongoose = require('mongoose');

const serviceFeatureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  iconKey: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const serviceHighlightSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  iconKey: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const serviceContentSchema = new mongoose.Schema({
  features: [serviceFeatureSchema],
  highlights: [serviceHighlightSchema],
  heroTitle: {
    type: String,
    default: 'Our Services'
  },
  heroDescription: {
    type: String,
    default: 'Everything you need to manage laboratory bookings smoothly and professionally.'
  },
  ecosystemTitle: {
    type: String,
    default: 'Smart Lab Ecosystem'
  },
  ecosystemSubtitle: {
    type: String,
    default: 'Powering the next generation of researchers'
  },
  efficiencyBadge: {
    type: String,
    default: 'EFFICIENCY'
  },
  campusTitle: {
    type: String,
    default: 'Built for busy campus schedules'
  },
  campusDescription: {
    type: String,
    default: "We've streamlined the logistics so faculty can focus on teaching and students can focus on experimenting."
  },
  ctaTitle: {
    type: String,
    default: 'Ready to optimize your labs?'
  },
  ctaDescription: {
    type: String,
    default: 'Join 50+ institutions using our booking system.'
  },
  ctaButtonText: {
    type: String,
    default: 'Get Started Now'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServiceContent', serviceContentSchema);
