const mongoose = require('mongoose');

const termsSectionSchema = new mongoose.Schema({
  sectionNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
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

const termsContentSchema = new mongoose.Schema({
  sections: [termsSectionSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  version: {
    type: String,
    default: '1.0'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TermsContent', termsContentSchema);
