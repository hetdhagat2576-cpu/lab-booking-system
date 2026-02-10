const Feedback = require('../models/feedback');

// Create feedback from user form (public)
const createPublicFeedback = async (req, res) => {
  try {
    const {
      bookingEaseRating,
      confirmationExperience,
      staffFriendlinessRating,
      waitTimeSatisfactionRating,
      averageWaitCategory,
      sampleExplanationClarity,
      turnaroundSatisfactionRating,
      portalEaseRating,
      status,
      comment,
      userName,
      userEmail,
    } = req.body;

    // Create feedback - no admin approval needed
    const feedback = await Feedback.create({
      user: null, // Public feedback has no user
      bookingEaseRating,
      confirmationExperience,
      staffFriendlinessRating,
      waitTimeSatisfactionRating,
      averageWaitCategory,
      sampleExplanationClarity,
      turnaroundSatisfactionRating,
      portalEaseRating,
      status,
      comment,
      userName: userName || 'Anonymous',
      userEmail: userEmail || null,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (error) {
    console.error('Create public feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message,
    });
  }
};

const getReviewedFeedbacks = async (req, res) => {
  try {
    // Get all feedbacks since there's no admin approval system
    const feedbacks = await Feedback.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10); // Limit to 10 most recent feedbacks

    // Transform feedback data to include userName for public feedback
    const transformedFeedbacks = feedbacks.map(feedback => ({
      _id: feedback._id,
      userName: feedback.user ? feedback.user.name : (feedback.userName || 'Anonymous'),
      comment: feedback.comment,
      status: feedback.status,
      bookingEaseRating: feedback.bookingEaseRating,
      staffFriendlinessRating: feedback.staffFriendlinessRating,
      turnaroundSatisfactionRating: feedback.turnaroundSatisfactionRating,
      createdAt: feedback.createdAt
    }));

    res.status(200).json({
      success: true,
      count: transformedFeedbacks.length,
      data: transformedFeedbacks,
    });
  } catch (error) {
    console.error('Get feedbacks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedbacks',
      error: error.message,
    });
  }
};

// Admin: Get all feedbacks with pagination and filtering
const getAllFeedbacks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const feedbacks = await Feedback.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments(query);

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: feedbacks,
    });
  } catch (error) {
    console.error('Get all feedbacks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedbacks',
      error: error.message,
    });
  }
};

// Admin: Update feedback status
const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback status updated successfully',
      data: feedback,
    });
  } catch (error) {
    console.error('Update feedback status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating feedback status',
      error: error.message,
    });
  }
};

// Admin: Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting feedback',
      error: error.message,
    });
  }
};

module.exports = {
  createPublicFeedback,
  getReviewedFeedbacks,
  getAllFeedbacks,
  updateFeedbackStatus,
  deleteFeedback,
};

const createUserFeedback = async (req, res) => {
  try {
    const {
      bookingEaseRating,
      confirmationExperience,
      staffFriendlinessRating,
      waitTimeSatisfactionRating,
      averageWaitCategory,
      sampleExplanationClarity,
      turnaroundSatisfactionRating,
      portalEaseRating,
      status,
      comment,
    } = req.body;
    const feedback = await Feedback.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      bookingEaseRating,
      confirmationExperience,
      staffFriendlinessRating,
      waitTimeSatisfactionRating,
      averageWaitCategory,
      sampleExplanationClarity,
      turnaroundSatisfactionRating,
      portalEaseRating,
      status,
      comment,
    });
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (error) {
    console.error('Create user feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message,
    });
  }
};
 
const getMyFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userEmail: req.user.email })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    console.error('Get my feedbacks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedbacks',
      error: error.message,
    });
  }
};
 
module.exports.createUserFeedback = createUserFeedback;
module.exports.getMyFeedbacks = getMyFeedbacks;
