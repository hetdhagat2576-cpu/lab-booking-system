const HealthConcern = require('../models/healthConcern');
const mongoose = require('mongoose');

// Get all health concerns
const getHealthConcerns = async (req, res) => {
  try {
    const concerns = await HealthConcern.find({}).sort({ order: 1, createdAt: 1 });
    
    res.status(200).json({
      success: true,
      data: concerns,
      count: concerns.length
    });
  } catch (error) {
    console.error('Error fetching health concerns:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching health concerns',
      error: error.message
    });
  }
};

// Get health concern by ID
const getHealthConcernById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid health concern ID'
      });
    }
    
    const concern = await HealthConcern.findById(id);
    
    if (!concern) {
      return res.status(404).json({
        success: false,
        message: 'Health concern not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: concern
    });
  } catch (error) {
    console.error('Error fetching health concern:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching health concern',
      error: error.message
    });
  }
};

// Create new health concern (Admin only)
const createHealthConcern = async (req, res) => {
  try {
    const { id, title, iconKey, description, isActive, order, rating } = req.body;
    
    // Check if concern with same ID already exists
    const existingConcern = await HealthConcern.findOne({ id });
    if (existingConcern) {
      return res.status(400).json({
        success: false,
        message: 'Health concern with this ID already exists'
      });
    }
    
    const newConcern = new HealthConcern({
      id,
      title,
      iconKey: iconKey || 'FlaskConical',
      description,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      rating: rating || 3
    });
    
    const savedConcern = await newConcern.save();
    
    res.status(201).json({
      success: true,
      message: 'Health concern created successfully',
      data: savedConcern
    });
  } catch (error) {
    console.error('Error creating health concern:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating health concern',
      error: error.message
    });
  }
};

// Update health concern (Admin only)
const updateHealthConcern = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, iconKey, description, isActive, order, rating } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid health concern ID'
      });
    }
    
    const concern = await HealthConcern.findByIdAndUpdate(
      id,
      { title, iconKey, description, isActive, order, rating },
      { new: true, runValidators: true }
    );
    
    if (!concern) {
      return res.status(404).json({
        success: false,
        message: 'Health concern not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Health concern updated successfully',
      data: concern
    });
  } catch (error) {
    console.error('Error updating health concern:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating health concern',
      error: error.message
    });
  }
};

// Delete health concern (Admin only)
const deleteHealthConcern = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid health concern ID'
      });
    }
    
    const concern = await HealthConcern.findByIdAndDelete(id);
    
    if (!concern) {
      return res.status(404).json({
        success: false,
        message: 'Health concern not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Health concern deleted successfully',
      data: concern
    });
  } catch (error) {
    console.error('Error deleting health concern:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting health concern',
      error: error.message
    });
  }
};

// Seed health concerns data (Admin only)
const seedHealthConcerns = async (req, res) => {
  try {
    const healthConcernsData = [
      { id: "liver", title: "Liver", iconKey: "FlaskConical", description: "Liver function tests", isActive: true, order: 1, rating: 4 },
      { id: "lungs", title: "Lungs", iconKey: "Activity", description: "Respiratory health screening", isActive: true, order: 2, rating: 4 },
      { id: "kidney", title: "Kidney", iconKey: "Droplets", description: "Kidney function tests", isActive: true, order: 3, rating: 4 },
      { id: "fever", title: "Fever", iconKey: "Droplets", description: "Fever and infection tests", isActive: true, order: 4, rating: 3 },
      { id: "thyroid", title: "Thyroid", iconKey: "FlaskConical", description: "Thyroid function tests", isActive: true, order: 5, rating: 4 },
      { id: "diabetes", title: "Diabetes", iconKey: "Droplets", description: "Blood sugar monitoring", isActive: true, order: 6, rating: 5 }
    ];

    // Clear existing health concerns
    await HealthConcern.deleteMany({});
    console.log('Cleared existing health concerns');

    // Insert new health concerns
    const insertedHealthConcerns = await HealthConcern.insertMany(healthConcernsData);
    console.log(`Inserted ${insertedHealthConcerns.length} health concerns`);

    res.status(200).json({
      success: true,
      message: 'Health concerns seeded successfully',
      data: insertedHealthConcerns,
      count: insertedHealthConcerns.length
    });
  } catch (error) {
    console.error('Error seeding health concerns:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding health concerns',
      error: error.message
    });
  }
};

module.exports = {
  getHealthConcerns,
  getHealthConcernById,
  createHealthConcern,
  updateHealthConcern,
  deleteHealthConcern,
  seedHealthConcerns
};
