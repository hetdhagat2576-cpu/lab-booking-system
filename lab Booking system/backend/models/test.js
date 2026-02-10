const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Test name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Test description is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Test category is required'],
    trim: true,
    enum: ['Blood Test', 'Urine Test', 'Imaging', 'Cardiology', 'Diabetes', 'Liver', 'Kidney', 'Thyroid', 'General', 'Other'],
  },
  price: {
    type: Number,
    required: [true, 'Test price is required'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
  },
  duration: {
    type: String,
    required: [true, 'Test duration is required'],
    trim: true,
  },
  preparation: {
    type: String,
    trim: true,
  },
  sampleType: {
    type: String,
    required: [true, 'Sample type is required'],
    trim: true,
    enum: ['Blood', 'Urine', 'Stool', 'Swab', 'Other'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  imageUrl: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
