const AboutContent = require('../models/AboutContent');

// Get all about content
exports.getAboutContent = async (req, res) => {
  try {
    let aboutContent = await AboutContent.findOne();
    
    if (!aboutContent) {
      // Return default structure if no content exists
      return res.status(200).json({
        mainHeading: 'Why Our System is Smarter Care',
        sections: []
      });
    }
    
    res.status(200).json(aboutContent);
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ message: 'Error fetching about content', error: error.message });
  }
};

// Create or update about content
exports.updateAboutContent = async (req, res) => {
  try {
    const { mainHeading, sections } = req.body;
    
    if (!mainHeading || !sections || !Array.isArray(sections)) {
      return res.status(400).json({ message: 'Main heading and sections array are required' });
    }
    
    // Validate each section
    for (const section of sections) {
      if (!section.title || !section.description) {
        return res.status(400).json({ message: 'Each section must have a title and description' });
      }
    }
    
    let aboutContent = await AboutContent.findOne();
    
    if (aboutContent) {
      // Update existing content
      aboutContent.mainHeading = mainHeading;
      aboutContent.sections = sections;
      aboutContent.lastUpdated = new Date();
      aboutContent.updatedBy = req.user?.id || null;
    } else {
      // Create new content
      aboutContent = new AboutContent({
        mainHeading,
        sections,
        updatedBy: req.user?.id || null
      });
    }
    
    await aboutContent.save();
    
    res.status(200).json({
      message: 'About content updated successfully',
      data: aboutContent
    });
  } catch (error) {
    console.error('Error updating about content:', error);
    res.status(500).json({ message: 'Error updating about content', error: error.message });
  }
};

// Add a new section
exports.addSection = async (req, res) => {
  try {
    const { icon, title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    let aboutContent = await AboutContent.findOne();
    
    if (!aboutContent) {
      // Create new about content if it doesn't exist
      aboutContent = new AboutContent({
        mainHeading: 'Why Our System is Smarter Care',
        sections: []
      });
    }
    
    // Add new section
    aboutContent.sections.push({
      icon: icon || 'bolt',
      title,
      description
    });
    
    aboutContent.lastUpdated = new Date();
    aboutContent.updatedBy = req.user?.id || null;
    
    await aboutContent.save();
    
    res.status(201).json({
      message: 'Section added successfully',
      data: aboutContent
    });
  } catch (error) {
    console.error('Error adding section:', error);
    res.status(500).json({ message: 'Error adding section', error: error.message });
  }
};

// Update a specific section
exports.updateSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { icon, title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const aboutContent = await AboutContent.findOne();
    
    if (!aboutContent) {
      return res.status(404).json({ message: 'About content not found' });
    }
    
    const section = aboutContent.sections.id(sectionId);
    
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    // Update section
    section.icon = icon || section.icon;
    section.title = title;
    section.description = description;
    
    aboutContent.lastUpdated = new Date();
    aboutContent.updatedBy = req.user?.id || null;
    
    await aboutContent.save();
    
    res.status(200).json({
      message: 'Section updated successfully',
      data: aboutContent
    });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ message: 'Error updating section', error: error.message });
  }
};

// Delete a section
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    
    const aboutContent = await AboutContent.findOne();
    
    if (!aboutContent) {
      return res.status(404).json({ message: 'About content not found' });
    }
    
    const section = aboutContent.sections.id(sectionId);
    
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    // Remove section using pull operation
    aboutContent.sections.pull({ _id: sectionId });
    
    aboutContent.lastUpdated = new Date();
    aboutContent.updatedBy = req.user?.id || null;
    
    await aboutContent.save();
    
    res.status(200).json({
      message: 'Section deleted successfully',
      data: aboutContent
    });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ message: 'Error deleting section', error: error.message });
  }
};
