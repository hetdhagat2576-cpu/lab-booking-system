const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Allow null for public feedback
  },
  userName: {
    type: String,
    trim: true,
    default: 'Anonymous',
  },
  userEmail: {
    type: String,
    trim: true,
    default: null,
  },
  
  // Feedback type - only general feedback supported
  feedbackType: {
    type: String,
    enum: ['general'],
    default: 'general',
  },
  
  // General feedback fields (only used for general feedback)
  bookingEaseRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  confirmationExperience: {
    type: String,
    enum: ['immediate', 'delayed', 'none'],
    default: null,
  },
  staffFriendlinessRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  waitTimeSatisfactionRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  averageWaitCategory: {
    type: String,
    enum: ['<10', '10-20', '20+'],
    default: null,
  },
  sampleExplanationClarity: {
    type: String,
    enum: ['very', 'somewhat', 'not'],
    default: null,
  },
  turnaroundSatisfactionRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  portalEaseRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  
  status: {
    type: String,
    enum: ['new', 'pending', 'reviewed', 'resolved', 'positive', 'negative'],
    default: 'new',
    required: true,
  },
  comment: {
    type: String,
    trim: true,
  },
  
}, {
  timestamps: true,
});


feedbackSchema.set('toJSON', { virtuals: true });
feedbackSchema.set('toObject', { virtuals: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
