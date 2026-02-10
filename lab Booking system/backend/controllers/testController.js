const Test = require('../models/test');
const mongoose = require('mongoose');

// Get all tests
const getAllTests = async (req, res) => {
  try {
    const { category, isActive, isPopular, search } = req.query;
    
    let filter = {};
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (isPopular !== undefined) {
      filter.isPopular = isPopular === 'true';
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const tests = await Test.find(filter)
      .sort({ isPopular: -1, name: 1 })
      .lean();
    
    res.status(200).json({
      success: true,
      data: tests,
      count: tests.length
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tests',
      error: error.message
    });
  }
};

// Get test by ID
const getTestById = async (req, res) => {
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
    
    res.status(200).json({
      success: true,
      data: test
    });
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching test',
      error: error.message
    });
  }
};

// Create new test (Admin only)
const createTest = async (req, res) => {
  try {
    const testData = req.body;
    
    const test = new Test(testData);
    await test.save();
    
    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: test
    });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test',
      error: error.message
    });
  }
};

// Update test (Admin only)
const updateTest = async (req, res) => {
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
      message: 'Test updated successfully',
      data: test
    });
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating test',
      error: error.message
    });
  }
};

// Delete test (Admin only)
const deleteTest = async (req, res) => {
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
      message: 'Test deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting test',
      error: error.message
    });
  }
};

// Get test categories
const getTestCategories = async (req, res) => {
  try {
    const categories = await Test.distinct('category');
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching test categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching test categories',
      error: error.message
    });
  }
};

module.exports = {
  getAllTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  getTestCategories
};
