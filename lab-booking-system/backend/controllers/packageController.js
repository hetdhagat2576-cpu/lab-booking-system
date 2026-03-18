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
    
    // Validate required fields
    if (!packageData.name || !packageData.name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Package name is required',
        error: 'MISSING_NAME'
      });
    }
    
    if (!packageData.category) {
      return res.status(400).json({
        success: false,
        message: 'Package category is required',
        error: 'MISSING_CATEGORY'
      });
    }
    
    // Enhanced price validation for manual input - allow any positive number
    if (packageData.price === undefined || packageData.price === null || packageData.price === '') {
      return res.status(400).json({
        success: false,
        message: 'Package price is required',
        error: 'MISSING_PRICE'
      });
    }
    
    // Parse price from various input formats (500, 500.00, ₹500, $500, 1,250.50)
    let parsedPrice = packageData.price;
    if (typeof parsedPrice === 'string') {
      // Remove currency symbols, commas, and whitespace, then convert to number
      const cleanPrice = parsedPrice.replace(/[₹$\s]/g, '').replace(/,/g, '');
      parsedPrice = parseFloat(cleanPrice);
    }
    
    // Validate the parsed price - allow any positive number including decimals
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid package price is required (must be a positive number)',
        error: 'INVALID_PRICE'
      });
    }
    
    // Round to 2 decimal places for currency precision but allow higher precision if needed
    packageData.price = Math.round(parsedPrice * 100) / 100;
    
    if (!packageData.description || !packageData.description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Package description is required',
        error: 'MISSING_DESCRIPTION'
      });
    }
    
    // Validate test IDs if provided
    if (packageData.testsIncluded && packageData.testsIncluded.length > 0) {
      // Clean up test IDs - remove any null/undefined/empty values
      const cleanTestIds = packageData.testsIncluded.filter(id => id && typeof id === 'string' && id.trim() !== '');
      
      if (cleanTestIds.length === 0 && packageData.testsIncluded.length > 0) {
        // All test IDs were invalid, just set to empty array
        packageData.testsIncluded = [];
        console.warn('All provided test IDs were invalid, setting testsIncluded to empty array');
      } else {
        // Check validity of remaining test IDs
        const validTestIds = await Test.find({ _id: { $in: cleanTestIds } }).distinct('_id');
        const invalidIds = cleanTestIds.filter(id => !validTestIds.includes(id));
        
        if (invalidIds.length > 0) {
          console.warn(`Invalid test IDs found and will be excluded: ${invalidIds.join(', ')}`);
          // Instead of failing, just remove the invalid IDs
          packageData.testsIncluded = validTestIds;
        } else {
          packageData.testsIncluded = cleanTestIds;
        }
      }
    }
    
    // Set default values for missing optional but required fields
    const packageToCreate = {
      ...packageData,
      duration: packageData.duration || '30 mins',
      preparation: packageData.preparation || 'No special preparation required',
      isActive: packageData.isActive !== undefined ? packageData.isActive : true,
      isPopular: packageData.isPopular !== undefined ? packageData.isPopular : false,
      isRecommended: packageData.isRecommended !== undefined ? packageData.isRecommended : false,
      tags: packageData.tags || [],
      originalPrice: packageData.originalPrice || packageData.price,
      testsIncluded: packageData.testsIncluded || [],
      customTests: packageData.customTests || [],
      sampleTypes: packageData.sampleTypes || ['Blood'],
      includes: packageData.includes || [],
      benefits: packageData.benefits || [],
      suitableFor: packageData.suitableFor || [],
    };
    
    console.log('Creating package with data:', packageToCreate);
    
    const package = new Package(packageToCreate);
    await package.save();
    
    // Populate the package with test details before returning
    const populatedPackage = await Package.findById(package._id)
      .populate('testsIncluded', 'name description price');
    
    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: populatedPackage
    });
  } catch (error) {
    console.error('Error creating package:', error);
    
    // Handle specific error types
    let errorMessage = 'Error creating package';
    let errorCode = 'CREATE_ERROR';
    
    if (error.name === 'ValidationError') {
      errorMessage = 'Validation failed: ' + error.message;
      errorCode = 'VALIDATION_ERROR';
    } else if (error.name === 'MongoServerError') {
      errorMessage = 'Database error: ' + error.message;
      errorCode = 'DATABASE_ERROR';
    } else if (error.code === 11000) {
      errorMessage = 'Database connection error';
      errorCode = 'CONNECTION_ERROR';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message,
      code: errorCode
    });
  }
};

// Update package (Admin only)
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('=== PACKAGE UPDATE DEBUG START ===');
    console.log('Package ID:', id);
    console.log('Update data:', JSON.stringify(updateData, null, 2));
    console.log('User making update:', req.user ? req.user.email : 'Unknown');
    console.log('=== PACKAGE UPDATE DEBUG END ===');
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package ID',
        error: 'INVALID_ID'
      });
    }
    
    // Check if package exists first
    const existingPackage = await Package.findById(id);
    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
        error: 'PACKAGE_NOT_FOUND'
      });
    }
    
    // Validate test IDs if provided
    if (updateData.testsIncluded && updateData.testsIncluded.length > 0) {
      // Clean up test IDs - remove any null/undefined/empty values
      const cleanTestIds = updateData.testsIncluded.filter(id => id && typeof id === 'string' && id.trim() !== '');
      
      if (cleanTestIds.length === 0 && updateData.testsIncluded.length > 0) {
        // All test IDs were invalid, just set to empty array
        updateData.testsIncluded = [];
        console.warn('All provided test IDs were invalid, setting testsIncluded to empty array');
      } else {
        // Check validity of remaining test IDs
        const validTestIds = await Test.find({ _id: { $in: cleanTestIds } }).distinct('_id');
        const invalidIds = cleanTestIds.filter(id => !validTestIds.includes(id));
        
        if (invalidIds.length > 0) {
          console.warn(`Invalid test IDs found and will be excluded: ${invalidIds.join(', ')}`);
          // Instead of failing, just remove the invalid IDs
          updateData.testsIncluded = validTestIds;
        } else {
          updateData.testsIncluded = cleanTestIds;
        }
      }
    }
    
    // Validate price if provided
    if (updateData.price !== undefined) {
      let parsedPrice = updateData.price;
      if (typeof parsedPrice === 'string') {
        // Remove currency symbols, commas, and whitespace, then convert to number
        const cleanPrice = parsedPrice.replace(/[₹$\s]/g, '').replace(/,/g, '');
        parsedPrice = parseFloat(cleanPrice);
      }
      
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid package price is required (must be a positive number)',
          error: 'INVALID_PRICE'
        });
      }
      
      updateData.price = Math.round(parsedPrice * 100) / 100;
    }
    
    // Validate original price if provided
    if (updateData.originalPrice !== undefined && updateData.originalPrice !== null) {
      let parsedOriginalPrice = updateData.originalPrice;
      if (typeof parsedOriginalPrice === 'string') {
        const cleanPrice = parsedOriginalPrice.replace(/[₹$\s]/g, '').replace(/,/g, '');
        parsedOriginalPrice = parseFloat(cleanPrice);
      }
      
      if (isNaN(parsedOriginalPrice) || parsedOriginalPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid original price is required (must be a positive number)',
          error: 'INVALID_ORIGINAL_PRICE'
        });
      }
      
      updateData.originalPrice = Math.round(parsedOriginalPrice * 100) / 100;
    }
    
    console.log('Final update data:', JSON.stringify(updateData, null, 2));
    
    const package = await Package.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('testsIncluded', 'name description price');
    
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found after update',
        error: 'UPDATE_FAILED'
      });
    }
    
    console.log('Package updated successfully:', package._id);
    
    res.status(200).json({
      success: true,
      message: 'Package updated successfully',
      data: package
    });
  } catch (error) {
    console.error('Error updating package:', error);
    
    // Handle specific error types
    let errorMessage = 'Error updating package';
    let errorCode = 'UPDATE_ERROR';
    
    if (error.name === 'ValidationError') {
      errorMessage = 'Validation failed: ' + error.message;
      errorCode = 'VALIDATION_ERROR';
    } else if (error.name === 'MongoServerError') {
      errorMessage = 'Database error: ' + error.message;
      errorCode = 'DATABASE_ERROR';
    } else if (error.code === 11000) {
      errorMessage = 'Duplicate entry detected';
      errorCode = 'DUPLICATE_ERROR';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message,
      code: errorCode
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
