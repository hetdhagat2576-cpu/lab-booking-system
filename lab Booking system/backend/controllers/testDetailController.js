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
    
    // Format the response as requested
    const testDetails = {
      testName: test.name,
      requiredSamples: [test.sampleType], // Array to allow for multiple sample types in future
      reportingTime: test.duration
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

module.exports = {
  getTestDetails
};
