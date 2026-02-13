const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Package description is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Package category is required'],
    trim: true,
    enum: ['Full Body Checkup', 'Diabetes', 'Liver Health', 'Lung Health', 'Kidney Health', 'Thyroid', 'Fever', 'Heart Health', 'Women Health', 'Senior Citizen', 'Other', 'General'],
  },
  price: {
    type: Number,
    required: [true, 'Package price is required'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
  },
  duration: {
    type: String,
    required: [true, 'Package duration is required'],
    trim: true,
  },
  testsIncluded: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
  }],
  customTests: [{
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    clinicalSignificance: {
      type: String,
      trim: true,
    },
    normalRange: {
      type: String,
      trim: true,
    },
    parameters: [{
      name: {
        type: String,
        trim: true,
      },
      unit: {
        type: String,
        trim: true,
      },
      normalRange: {
        type: String,
        trim: true,
      },
    }],
  }],
  preparation: {
    type: String,
    trim: true,
  },
  sampleTypes: [{
    type: String,
    trim: true,
    enum: ['Blood', 'Urine', 'Stool', 'Swab', 'Sputum', 'Other'],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  isRecommended: {
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
  includes: [{
    type: String,
    trim: true,
  }],
  benefits: [{
    type: String,
    trim: true,
  }],
  suitableFor: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
