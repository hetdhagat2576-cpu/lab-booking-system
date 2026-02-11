const Package = require('../models/package');
const Test = require('../models/test');
const mongoose = require('mongoose');

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
    if (package.sampleTypes && package.sampleTypes.length > 0) {
      package.sampleTypes.forEach(sampleType => {
        allSampleTypes.add(sampleType);
      });
    }
    
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
      requiredSamples: Array.from(allSampleTypes),
      reportingTime: maxDuration
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

// Update package details
const updatePackageDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package ID'
      });
    }
    
    const package = await Package.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: package,
      message: 'Package details updated successfully'
    });
  } catch (error) {
    console.error('Error updating package details:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating package details',
      error: error.message
    });
  }
};

module.exports = {
  getPackageDetails,
  updatePackageDetails
};
