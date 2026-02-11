const Test = require('../models/test');
const mongoose = require('mongoose');

// Get dashboard browse cards with categorized tests
const getDashboardBrowseCards = async (req, res) => {
  try {
    const { isActive = true, limit = 10 } = req.query;
    
    // Use the same filter logic as getAllTests for consistency
    let filter = {};
    filter.isActive = isActive === 'true';
    
    // Get all active tests
    const tests = await Test.find(filter)
      .sort({ isPopular: -1, name: 1 })
      .lean();
    
    // Group tests by category
    const categorizedTests = {};
    const categories = ['Blood Test', 'Urine Test', 'Imaging', 'Cardiology', 'Diabetes', 'Liver', 'Kidney', 'Thyroid', 'General', 'Other'];
    
    // Initialize categories
    categories.forEach(category => {
      categorizedTests[category] = [];
    });
    
    // Group tests into categories
    tests.forEach(test => {
      if (categorizedTests[test.category]) {
        categorizedTests[test.category].push({
          _id: test._id,
          name: test.name,
          description: test.description,
          price: test.price,
          originalPrice: test.originalPrice,
          duration: test.duration,
          category: test.category,
          sampleType: test.sampleType,
          isPopular: test.isPopular,
          imageUrl: test.imageUrl,
          tags: test.tags
        });
      }
    });
    
    // Filter out empty categories and limit results per category
    const filteredCategories = {};
    Object.keys(categorizedTests).forEach(category => {
      if (categorizedTests[category].length > 0) {
        filteredCategories[category] = categorizedTests[category].slice(0, parseInt(limit));
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        categories: filteredCategories,
        totalTests: tests.length,
        availableCategories: Object.keys(filteredCategories)
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard browse cards:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard browse cards',
      error: error.message
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const stats = await Test.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    const totalTests = await Test.countDocuments({ isActive: true });
    const popularTests = await Test.countDocuments({ isActive: true, isPopular: true });
    
    res.status(200).json({
      success: true,
      data: {
        totalTests,
        popularTests,
        categoryStats: stats
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

// Get tests by category for dashboard
const getDashboardTestsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }
    
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const filter = {
      category: category,
      isActive: true
    };
    
    const tests = await Test.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Test.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: {
        tests,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching tests by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tests by category',
      error: error.message
    });
  }
};

// Search tests for dashboard
const searchDashboardTests = async (req, res) => {
  try {
    const { q: query, category, page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const skip = (page - 1) * limit;
    
    let filter = {
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    };
    
    if (category) {
      filter.category = category;
    }
    
    const tests = await Test.find(filter)
      .sort({ isPopular: -1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Test.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: {
        tests,
        query,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error searching tests:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching tests',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardBrowseCards,
  getDashboardStats,
  getDashboardTestsByCategory,
  searchDashboardTests
};
