const TermsContent = require('../models/termsContent');

// Get all terms content
const getAllTerms = async (req, res) => {
  try {
    let termsContent = await TermsContent.findOne({});
    
    if (!termsContent) {
      // Create default terms content if none exists
      termsContent = new TermsContent({
        sections: [],
        version: '1.0'
      });
      await termsContent.save();
    }

    res.status(200).json({
      success: true,
      data: termsContent
    });
  } catch (error) {
    console.error('Get all terms error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching terms content',
      error: error.message
    });
  }
};

// Get terms content by ID
const getTermsById = async (req, res) => {
  try {
    const { termsId } = req.params;
    
    const termsContent = await TermsContent.findById(termsId);
    
    if (!termsContent) {
      return res.status(404).json({
        success: false,
        message: 'Terms content not found'
      });
    }

    res.status(200).json({
      success: true,
      data: termsContent
    });
  } catch (error) {
    console.error('Get terms by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching terms content',
      error: error.message
    });
  }
};

// Create or update terms content
const updateTermsContent = async (req, res) => {
  try {
    const { sections, version } = req.body;
    
    let termsContent = await TermsContent.findOne({});
    
    if (!termsContent) {
      // Create new terms content
      termsContent = new TermsContent({
        sections: sections || [],
        version: version || '1.0',
        lastUpdated: new Date()
      });
    } else {
      // Update existing terms content
      if (sections) termsContent.sections = sections;
      if (version) termsContent.version = version;
      termsContent.lastUpdated = new Date();
    }
    
    await termsContent.save();

    res.status(200).json({
      success: true,
      message: 'Terms content updated successfully',
      data: termsContent
    });
  } catch (error) {
    console.error('Update terms content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating terms content',
      error: error.message
    });
  }
};

// Add a new section
const addSection = async (req, res) => {
  try {
    const { sectionNumber, title, content, order } = req.body;
    
    let termsContent = await TermsContent.findOne({});
    
    if (!termsContent) {
      termsContent = new TermsContent({
        sections: [],
        version: '1.0'
      });
    }
    
    // Check if section number already exists
    const existingSection = termsContent.sections.find(
      section => section.sectionNumber === sectionNumber
    );
    
    if (existingSection) {
      return res.status(400).json({
        success: false,
        message: 'Section number already exists'
      });
    }
    
    const newSection = {
      sectionNumber,
      title,
      content,
      order: order || termsContent.sections.length,
      isActive: true
    };
    
    termsContent.sections.push(newSection);
    termsContent.lastUpdated = new Date();
    await termsContent.save();

    res.status(201).json({
      success: true,
      message: 'Section added successfully',
      data: newSection
    });
  } catch (error) {
    console.error('Add section error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding section',
      error: error.message
    });
  }
};

// Update a section
const updateSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, content, order, isActive } = req.body;
    
    const termsContent = await TermsContent.findOne({});
    
    if (!termsContent) {
      return res.status(404).json({
        success: false,
        message: 'Terms content not found'
      });
    }
    
    const section = termsContent.sections.id(sectionId);
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }
    
    if (title !== undefined) section.title = title;
    if (content !== undefined) section.content = content;
    if (order !== undefined) section.order = order;
    if (isActive !== undefined) section.isActive = isActive;
    
    termsContent.lastUpdated = new Date();
    await termsContent.save();

    res.status(200).json({
      success: true,
      message: 'Section updated successfully',
      data: section
    });
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating section',
      error: error.message
    });
  }
};

// Delete a section
const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    
    const termsContent = await TermsContent.findOne({});
    
    if (!termsContent) {
      return res.status(404).json({
        success: false,
        message: 'Terms content not found'
      });
    }
    
    const section = termsContent.sections.id(sectionId);
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }
    
    section.remove();
    termsContent.lastUpdated = new Date();
    await termsContent.save();

    res.status(200).json({
      success: true,
      message: 'Section deleted successfully'
    });
  } catch (error) {
    console.error('Delete section error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting section',
      error: error.message
    });
  }
};

// Get active sections only (for public display)
const getActiveTerms = async (req, res) => {
  try {
    const termsContent = await TermsContent.findOne({});
    
    if (!termsContent || !termsContent.sections.length) {
      return res.status(404).json({
        success: false,
        message: 'No terms content available'
      });
    }
    
    const activeSections = termsContent.sections
      .filter(section => section.isActive)
      .sort((a, b) => a.order - b.order);

    res.status(200).json({
      success: true,
      data: {
        sections: activeSections,
        version: termsContent.version,
        lastUpdated: termsContent.lastUpdated
      }
    });
  } catch (error) {
    console.error('Get active terms error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active terms',
      error: error.message
    });
  }
};

module.exports = {
  getAllTerms,
  getTermsById,
  updateTermsContent,
  addSection,
  updateSection,
  deleteSection,
  getActiveTerms
};
