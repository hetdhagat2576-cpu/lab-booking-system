const PrivacyPolicy = require('../models/privacyPolicy');
const { protect } = require('../middleware/authMiddleware');

// Get privacy policy (public endpoint)
const getPrivacyPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.getPolicy();
    res.status(200).json({
      success: true,
      data: policy
    });
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching privacy policy',
      error: error.message
    });
  }
};

// Update privacy policy (admin only)
const updatePrivacyPolicy = async (req, res) => {
  try {
    const { title, sections } = req.body;

    if (!title || !sections || !Array.isArray(sections)) {
      return res.status(400).json({
        success: false,
        message: 'Title and sections array are required'
      });
    }

    // Validate sections
    for (const section of sections) {
      if (!section.title || !section.content) {
        return res.status(400).json({
          success: false,
          message: 'Each section must have a title and content'
        });
      }
    }

    let policy = await PrivacyPolicy.getPolicy();
    
    // Update the policy
    policy.title = title;
    policy.sections = sections.map((section, index) => ({
      ...section,
      order: section.order || index + 1
    }));
    policy.lastUpdated = new Date();
    policy.updatedBy = req.user._id;

    await policy.save();

    res.status(200).json({
      success: true,
      message: 'Privacy policy updated successfully',
      data: policy
    });
  } catch (error) {
    console.error('Error updating privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating privacy policy',
      error: error.message
    });
  }
};

// Add new section to privacy policy
const addPrivacySection = async (req, res) => {
  try {
    const { title, content, order } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    let policy = await PrivacyPolicy.getPolicy();
    
    const newSection = {
      title,
      content,
      order: order || policy.sections.length + 1
    };

    policy.sections.push(newSection);
    policy.lastUpdated = new Date();
    policy.updatedBy = req.user._id;

    await policy.save();

    res.status(201).json({
      success: true,
      message: 'Section added successfully',
      data: newSection
    });
  } catch (error) {
    console.error('Error adding privacy section:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding section',
      error: error.message
    });
  }
};

// Update specific section
const updatePrivacySection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, content, order } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    let policy = await PrivacyPolicy.getPolicy();
    
    const sectionIndex = policy.sections.findIndex(
      section => section._id.toString() === sectionId
    );

    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    policy.sections[sectionIndex] = {
      ...policy.sections[sectionIndex],
      title,
      content,
      order: order || policy.sections[sectionIndex].order
    };

    policy.lastUpdated = new Date();
    policy.updatedBy = req.user._id;

    await policy.save();

    res.status(200).json({
      success: true,
      message: 'Section updated successfully',
      data: policy.sections[sectionIndex]
    });
  } catch (error) {
    console.error('Error updating privacy section:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating section',
      error: error.message
    });
  }
};

// Delete section
const deletePrivacySection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    let policy = await PrivacyPolicy.getPolicy();
    
    const sectionIndex = policy.sections.findIndex(
      section => section._id.toString() === sectionId
    );

    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    policy.sections.splice(sectionIndex, 1);
    policy.lastUpdated = new Date();
    policy.updatedBy = req.user._id;

    await policy.save();

    res.status(200).json({
      success: true,
      message: 'Section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting privacy section:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting section',
      error: error.message
    });
  }
};

module.exports = {
  getPrivacyPolicy,
  updatePrivacyPolicy,
  addPrivacySection,
  updatePrivacySection,
  deletePrivacySection
};
