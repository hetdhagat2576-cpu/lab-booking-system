const Package = require('../models/package');
const Test = require('../models/test');
const mongoose = require('mongoose');

// Get all packages
const getAllPackages = async (req, res) => {
  try {
    const { category, isActive, isPopular, isRecommended, search } = req.query;
    
    let filter = {};
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (isPopular !== undefined) {
      filter.isPopular = isPopular === 'true';
    }
    
    if (isRecommended !== undefined) {
      filter.isRecommended = isRecommended === 'true';
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
    
    const packages = await Package.find(filter)
      .populate('testsIncluded', 'name description price')
      .sort({ isRecommended: -1, isPopular: -1, name: 1 })
      .lean();
    
    res.status(200).json({
      success: true,
      data: packages,
      count: packages.length
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching packages',
      error: error.message
    });
  }
};

// Get package by ID
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package ID'
      });
    }
    
    const package = await Package.findById(id)
      .populate('testsIncluded', 'name description price duration preparation sampleType');
    
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching package',
      error: error.message
    });
  }
};

// Create new package (Admin only)
const createPackage = async (req, res) => {
  try {
    const packageData = req.body;
    
    // Validate test IDs if provided
    if (packageData.testsIncluded && packageData.testsIncluded.length > 0) {
      const validTestIds = await Test.find({ _id: { $in: packageData.testsIncluded } }).distinct('_id');
      const invalidIds = packageData.testsIncluded.filter(id => !validTestIds.includes(id));
      
      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid test IDs provided',
          invalidIds
        });
      }
    }
    
    const package = new Package(packageData);
    await package.save();
    
    const populatedPackage = await Package.findById(package._id)
      .populate('testsIncluded', 'name description price');
    
    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: populatedPackage
    });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating package',
      error: error.message
    });
  }
};

// Update package (Admin only)
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package ID'
      });
    }
    
    // Validate test IDs if provided
    if (updateData.testsIncluded && updateData.testsIncluded.length > 0) {
      const validTestIds = await Test.find({ _id: { $in: updateData.testsIncluded } }).distinct('_id');
      const invalidIds = updateData.testsIncluded.filter(id => !validTestIds.includes(id));
      
      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid test IDs provided',
          invalidIds
        });
      }
    }
    
    const package = await Package.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('testsIncluded', 'name description price');
    
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Package updated successfully',
      data: package
    });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating package',
      error: error.message
    });
  }
};

// Delete package (Admin only)
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package ID'
      });
    }
    
    const package = await Package.findByIdAndDelete(id);
    
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting package',
      error: error.message
    });
  }
};

// Get package categories
const getPackageCategories = async (req, res) => {
  try {
    const categories = await Package.distinct('category');
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching package categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching package categories',
      error: error.message
    });
  }
};

// Get popular packages
const getPopularPackages = async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true, isPopular: true })
      .populate('testsIncluded', 'name description price')
      .sort({ name: 1 })
      .limit(10)
      .lean();
    
    res.status(200).json({
      success: true,
      data: packages,
      count: packages.length
    });
  } catch (error) {
    console.error('Error fetching popular packages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular packages',
      error: error.message
    });
  }
};

// Get recommended packages
const getRecommendedPackages = async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true, isRecommended: true })
      .populate('testsIncluded', 'name description price')
      .sort({ name: 1 })
      .limit(10)
      .lean();
    
    res.status(200).json({
      success: true,
      data: packages,
      count: packages.length
    });
  } catch (error) {
    console.error('Error fetching recommended packages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommended packages',
      error: error.message
    });
  }
};

// Get package details for Package Details page
const getPackageDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package ID'
      });
    }
    
    const package = await Package.findById(id)
      .populate({
        path: 'testsIncluded',
        select: 'name description duration sampleType',
        options: { sort: { name: 1 } }
      });
    
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    // Extract unique sample types from both testsIncluded and package sampleTypes
    const allSampleTypes = new Set();
    
    // Add sample types from included tests
    package.testsIncluded.forEach(test => {
      if (test.sampleType) {
        allSampleTypes.add(test.sampleType);
      }
    });
    
    // Add package level sample types
    package.sampleTypes.forEach(sampleType => {
      allSampleTypes.add(sampleType);
    });
    
    // Calculate report delivery time (max duration from all tests + package duration)
    let maxDuration = package.duration || '24 hours';
    
    // If tests have durations, find the maximum
    const testDurations = package.testsIncluded
      .map(test => test.duration)
      .filter(duration => duration && duration !== '');
    
    if (testDurations.length > 0) {
      // Simple logic: take the longest duration
      // In a real implementation, you might want to parse and add durations properly
      maxDuration = testDurations.reduce((longest, current) => {
        // Simple comparison by length (this is basic, you might want to parse hours/days)
        return current.length > longest.length ? current : longest;
      }, maxDuration);
    }
    
    // Format the response as requested
    const packageDetails = {
      packageName: package.name,
      includedTests: package.testsIncluded.map(test => ({
        name: test.name,
        description: test.description
      })),
      reportDeliveryTime: maxDuration,
      sampleTypes: Array.from(allSampleTypes)
    };
    
    res.status(200).json({
      success: true,
      data: packageDetails
    });
  } catch (error) {
    console.error('Error fetching package details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching package details',
      error: error.message
    });
  }
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  getPackageCategories,
  getPopularPackages,
  getRecommendedPackages,
  getPackageDetails
};
