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
  bookingEaseRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  confirmationExperience: {
    type: String,
    enum: ['immediate', 'delayed', 'none'],
    required: true,
  },
  staffFriendlinessRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  waitTimeSatisfactionRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  averageWaitCategory: {
    type: String,
    enum: ['<10', '10-20', '20+'],
    required: true,
  },
  sampleExplanationClarity: {
    type: String,
    enum: ['very', 'somewhat', 'not'],
    required: true,
  },
  turnaroundSatisfactionRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  portalEaseRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
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

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
