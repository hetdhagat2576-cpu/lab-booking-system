const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  icon: {
    type: String,
    default: 'bolt'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
}, { _id: true });

const aboutContentSchema = new mongoose.Schema({
  mainHeading: {
    type: String,
    default: 'Why Our System is Smarter Care'
  },
  sections: [sectionSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('AboutContent', aboutContentSchema);
