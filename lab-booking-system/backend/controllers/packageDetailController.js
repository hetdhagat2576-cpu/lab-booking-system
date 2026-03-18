const Package = require('../models/package');
const Test = require('../models/test');
const mongoose = require('mongoose');

// Get package details for Package Details page
const getPackageDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    let package;
    
    // First try to find by ObjectId if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      package = await Package.findById(id)
        .populate({
          path: 'testsIncluded',
          select: 'name description duration sampleType',
          options: { sort: { name: 1 } }
        });
    }
    
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    const allSampleTypes = new Set();
    
    package.testsIncluded.forEach(test => {
      if (test.sampleType) {
        allSampleTypes.add(test.sampleType);
      }
    });
    
    if (package.sampleTypes && package.sampleTypes.length > 0) {
      package.sampleTypes.forEach(sampleType => {
        allSampleTypes.add(sampleType);
      });
    }
    
    let maxDuration = package.duration || '24 hours';
    
    // If tests have durations, find the maximum
    const testDurations = package.testsIncluded
      .map(test => test.duration)
      .filter(duration => duration && duration !== '');
    
    if (testDurations.length > 0) {
      // Simple logic: take the longest duration
      maxDuration = testDurations.reduce((longest, current) => {
        // Simple comparison by length
        return current.length > longest.length ? current : longest;
      }, maxDuration);
    }
    
    // Format the response as requested
    const packageDetails = {
      packageName: package.name,
      requiredSamples: Array.from(allSampleTypes),
      reportingTime: maxDuration,
      includedTests: package.testsIncluded, 
      includedTestNames: package.testsIncluded.map(test => test.name),
      benefits: package.benefits || [],
      suitableFor: package.suitableFor || []
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

// Delete package details
const deletePackageDetails = async (req, res) => {
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
      message: 'Package details deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting package details:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting package details',
      error: error.message
    });
  }
};

module.exports = {
  getPackageDetails,
  updatePackageDetails,
  deletePackageDetails
};
