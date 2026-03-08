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

// Get all feedbacks (Admin only)
const getAllFeedbacks = async (req, res) => {
  try {
    console.log('=== DEBUG: getAllFeedbacks called ===');
    console.log('Feedback model:', Feedback);
    const { page = 1, limit = 10, status, rating } = req.query;
    const skip = (page - 1) * limit;
    
    let filter = {};
    if (status) {
      filter.status = status;
    }
    if (rating) {
      filter.bookingEaseRating = parseInt(rating);
    }
    
    console.log('Filter:', filter);
    console.log('Finding feedbacks...');
    
    const feedbacks = await Feedback.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Feedback.countDocuments(filter);
    
    console.log('Found feedbacks:', feedbacks.length);
    console.log('Total count:', total);
    
    res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
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

// Get feedback by ID
const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id).populate('user', 'name email');
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Get feedback by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message,
    });
  }
};

// Update feedback (Admin only)
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const feedback = await Feedback.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating feedback',
      error: error.message,
    });
  }
};

// Update feedback status (Admin only)
const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Feedback status updated successfully',
      data: feedback
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

// Delete feedback (Admin only)
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedback = await Feedback.findByIdAndDelete(id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
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

// Get reviewed feedbacks (Admin only)
const getReviewedFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ status: { $in: ['reviewed', 'new', 'pending', 'positive'] } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: feedbacks,
      count: feedbacks.length
    });
  } catch (error) {
    console.error('Get reviewed feedbacks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviewed feedbacks',
      error: error.message,
    });
  }
};

// Create feedback from authenticated user
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
    // Find feedback linked to this user's ID or matching their email
    const feedbacks = await Feedback.find({
      $or: [
        { user: req.user._id },
        { userEmail: req.user.email }
      ]
    })
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
 
module.exports = {
  createPublicFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  getReviewedFeedbacks,
  createUserFeedback,
  getMyFeedbacks
};
