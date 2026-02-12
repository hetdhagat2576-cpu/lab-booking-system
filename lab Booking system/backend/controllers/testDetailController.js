const Test = require('../models/test');
const mongoose = require('mongoose');

// Get test details for Test Details page
const getTestDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid test ID'
      });
    }
    
    const test = await Test.findById(id);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    // Format the response with comprehensive test information
    const testDetails = {
      _id: test._id,
      testName: test.name,
      description: test.description,
      category: test.category,
      price: test.price,
      originalPrice: test.originalPrice,
      requiredSamples: [test.sampleType], // Array to allow for multiple sample types in future
      reportingTime: test.duration,
      preparation: test.preparation || 'No special preparation required',
      isPopular: test.isPopular,
      tags: test.tags,
      imageUrl: test.imageUrl,
      createdAt: test.createdAt,
      updatedAt: test.updatedAt
    };
    
    res.status(200).json({
      success: true,
      data: testDetails
    });
  } catch (error) {
    console.error('Error fetching test details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching test details',
      error: error.message
    });
  }
};

// Update test details
const updateTestDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid test ID'
      });
    }
    
    const test = await Test.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: test,
      message: 'Test details updated successfully'
    });
  } catch (error) {
    console.error('Error updating test details:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating test details',
      error: error.message
    });
  }
};

// Delete test details
const deleteTestDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid test ID'
      });
    }
    
    const test = await Test.findByIdAndDelete(id);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Test details deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting test details:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting test details',
      error: error.message
    });
  }
};

module.exports = {
  getTestDetails,
  updateTestDetails,
  deleteTestDetails
};
