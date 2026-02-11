const mongoose = require('mongoose');

// Mock data for health concerns (in a real app, this would come from a database)
let healthConcerns = [
  { id: "liver", title: "Liver", iconKey: "FlaskConical", description: "Liver function tests" },
  { id: "lungs", title: "Lungs", iconKey: "Activity", description: "Respiratory health screening" },
  { id: "kidney", title: "Kidney", iconKey: "Droplets", description: "Kidney function tests" },
  { id: "fever", title: "Fever", iconKey: "Droplets", description: "Fever and infection tests" },
  { id: "thyroid", title: "Thyroid", iconKey: "FlaskConical", description: "Thyroid function tests" },
  { id: "diabetes", title: "Diabetes", iconKey: "Droplets", description: "Blood sugar monitoring" }
];

// Get all health concerns
const getHealthConcerns = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: healthConcerns,
      count: healthConcerns.length
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
    const concern = healthConcerns.find(c => c.id === id);
    
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
    const { id, title, iconKey, description } = req.body;
    
    // Check if concern with same ID already exists
    const existingConcern = healthConcerns.find(c => c.id === id);
    if (existingConcern) {
      return res.status(400).json({
        success: false,
        message: 'Health concern with this ID already exists'
      });
    }
    
    const newConcern = {
      id,
      title,
      iconKey: iconKey || 'FlaskConical',
      description
    };
    
    healthConcerns.push(newConcern);
    
    res.status(201).json({
      success: true,
      message: 'Health concern created successfully',
      data: newConcern
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
    const { title, iconKey, description } = req.body;
    
    const concernIndex = healthConcerns.findIndex(c => c.id === id);
    if (concernIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Health concern not found'
      });
    }
    
    // Update the concern
    healthConcerns[concernIndex] = {
      ...healthConcerns[concernIndex],
      title: title || healthConcerns[concernIndex].title,
      iconKey: iconKey || healthConcerns[concernIndex].iconKey,
      description: description || healthConcerns[concernIndex].description
    };
    
    res.status(200).json({
      success: true,
      message: 'Health concern updated successfully',
      data: healthConcerns[concernIndex]
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
    
    const concernIndex = healthConcerns.findIndex(c => c.id === id);
    if (concernIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Health concern not found'
      });
    }
    
    const deletedConcern = healthConcerns.splice(concernIndex, 1)[0];
    
    res.status(200).json({
      success: true,
      message: 'Health concern deleted successfully',
      data: deletedConcern
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

module.exports = {
  getHealthConcerns,
  getHealthConcernById,
  createHealthConcern,
  updateHealthConcern,
  deleteHealthConcern
};
