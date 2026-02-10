const ServiceContent = require('../models/serviceContent');

// Get service features
const getServiceFeatures = async (req, res) => {
  try {
    let serviceContent = await ServiceContent.findOne();
    
    if (!serviceContent) {
      serviceContent = await ServiceContent.create({
        features: [],
        highlights: []
      });
    }
    
    res.status(200).json({
      success: true,
      data: serviceContent.features || []
    });
  } catch (error) {
    console.error('Error fetching service features:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service features',
      error: error.message
    });
  }
};

// Get service highlights
const getServiceHighlights = async (req, res) => {
  try {
    let serviceContent = await ServiceContent.findOne();
    
    if (!serviceContent) {
      serviceContent = await ServiceContent.create({
        features: [],
        highlights: []
      });
    }
    
    res.status(200).json({
      success: true,
      data: serviceContent.highlights || []
    });
  } catch (error) {
    console.error('Error fetching service highlights:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service highlights',
      error: error.message
    });
  }
};

// Get all service content (for backward compatibility)
const getServiceContent = async (req, res) => {
  try {
    let serviceContent = await ServiceContent.findOne();
    
    if (!serviceContent) {
      // Create default content if none exists
      serviceContent = await ServiceContent.create({
        features: [],
        highlights: []
      });
    }
    
    res.status(200).json({
      success: true,
      data: serviceContent
    });
  } catch (error) {
    console.error('Error fetching service content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service content',
      error: error.message
    });
  }
};

// Update service content (admin only)
const updateServiceContent = async (req, res) => {
  try {
    const { features, highlights, heroTitle, heroDescription, ecosystemTitle, ecosystemSubtitle, efficiencyBadge, campusTitle, campusDescription, ctaTitle, ctaDescription, ctaButtonText } = req.body;
    
    let serviceContent = await ServiceContent.findOne();
    
    if (!serviceContent) {
      serviceContent = new ServiceContent();
    }
    
    if (features) serviceContent.features = features;
    if (highlights) serviceContent.highlights = highlights;
    if (heroTitle) serviceContent.heroTitle = heroTitle;
    if (heroDescription) serviceContent.heroDescription = heroDescription;
    if (ecosystemTitle) serviceContent.ecosystemTitle = ecosystemTitle;
    if (ecosystemSubtitle) serviceContent.ecosystemSubtitle = ecosystemSubtitle;
    if (efficiencyBadge) serviceContent.efficiencyBadge = efficiencyBadge;
    if (campusTitle) serviceContent.campusTitle = campusTitle;
    if (campusDescription) serviceContent.campusDescription = campusDescription;
    if (ctaTitle) serviceContent.ctaTitle = ctaTitle;
    if (ctaDescription) serviceContent.ctaDescription = ctaDescription;
    if (ctaButtonText) serviceContent.ctaButtonText = ctaButtonText;
    
    await serviceContent.save();
    
    res.status(200).json({
      success: true,
      message: 'Service content updated successfully',
      data: serviceContent
    });
  } catch (error) {
    console.error('Error updating service content:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service content',
      error: error.message
    });
  }
};

// Add feature (admin only)
const addServiceFeature = async (req, res) => {
  try {
    const { title, description, iconKey, order } = req.body;
    
    let serviceContent = await ServiceContent.findOne();
    if (!serviceContent) {
      serviceContent = await ServiceContent.create({ features: [], highlights: [] });
    }
    
    const newFeature = {
      title,
      description,
      iconKey,
      order: order || serviceContent.features.length
    };
    
    serviceContent.features.push(newFeature);
    await serviceContent.save();
    
    res.status(200).json({
      success: true,
      message: 'Feature added successfully',
      data: newFeature
    });
  } catch (error) {
    console.error('Error adding feature:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding feature',
      error: error.message
    });
  }
};

// Update feature (admin only)
const updateServiceFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, iconKey, order, isActive } = req.body;
    
    let serviceContent = await ServiceContent.findOne();
    if (!serviceContent) {
      return res.status(404).json({
        success: false,
        message: 'Service content not found'
      });
    }
    
    const feature = serviceContent.features.id(id);
    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
      });
    }
    
    if (title !== undefined) feature.title = title;
    if (description !== undefined) feature.description = description;
    if (iconKey !== undefined) feature.iconKey = iconKey;
    if (order !== undefined) feature.order = order;
    if (isActive !== undefined) feature.isActive = isActive;
    
    await serviceContent.save();
    
    res.status(200).json({
      success: true,
      message: 'Feature updated successfully',
      data: feature
    });
  } catch (error) {
    console.error('Error updating feature:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating feature',
      error: error.message
    });
  }
};

// Delete feature (admin only)
const deleteServiceFeature = async (req, res) => {
  try {
    const { id } = req.params;
    
    let serviceContent = await ServiceContent.findOne();
    if (!serviceContent) {
      return res.status(404).json({
        success: false,
        message: 'Service content not found'
      });
    }
    
    serviceContent.features.pull(id);
    await serviceContent.save();
    
    res.status(200).json({
      success: true,
      message: 'Feature deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting feature:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting feature',
      error: error.message
    });
  }
};

// Add highlight (admin only)
const addServiceHighlight = async (req, res) => {
  try {
    const { title, description, iconKey, order } = req.body;
    
    let serviceContent = await ServiceContent.findOne();
    if (!serviceContent) {
      serviceContent = await ServiceContent.create({ features: [], highlights: [] });
    }
    
    const newHighlight = {
      title,
      description,
      iconKey,
      order: order || serviceContent.highlights.length
    };
    
    serviceContent.highlights.push(newHighlight);
    await serviceContent.save();
    
    res.status(200).json({
      success: true,
      message: 'Highlight added successfully',
      data: newHighlight
    });
  } catch (error) {
    console.error('Error adding highlight:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding highlight',
      error: error.message
    });
  }
};

// Update highlight (admin only)
const updateServiceHighlight = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, iconKey, order, isActive } = req.body;
    
    let serviceContent = await ServiceContent.findOne();
    if (!serviceContent) {
      return res.status(404).json({
        success: false,
        message: 'Service content not found'
      });
    }
    
    const highlight = serviceContent.highlights.id(id);
    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: 'Highlight not found'
      });
    }
    
    if (title !== undefined) highlight.title = title;
    if (description !== undefined) highlight.description = description;
    if (iconKey !== undefined) highlight.iconKey = iconKey;
    if (order !== undefined) highlight.order = order;
    if (isActive !== undefined) highlight.isActive = isActive;
    
    await serviceContent.save();
    
    res.status(200).json({
      success: true,
      message: 'Highlight updated successfully',
      data: highlight
    });
  } catch (error) {
    console.error('Error updating highlight:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating highlight',
      error: error.message
    });
  }
};

// Delete highlight (admin only)
const deleteServiceHighlight = async (req, res) => {
  try {
    const { id } = req.params;
    
    let serviceContent = await ServiceContent.findOne();
    if (!serviceContent) {
      return res.status(404).json({
        success: false,
        message: 'Service content not found'
      });
    }
    
    serviceContent.highlights.pull(id);
    await serviceContent.save();
    
    res.status(200).json({
      success: true,
      message: 'Highlight deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting highlight:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting highlight',
      error: error.message
    });
  }
};

module.exports = {
  getServiceFeatures,
  getServiceHighlights,
  getServiceContent,
  updateServiceContent,
  addServiceFeature,
  updateServiceFeature,
  deleteServiceFeature,
  addServiceHighlight,
  updateServiceHighlight,
  deleteServiceHighlight
};
