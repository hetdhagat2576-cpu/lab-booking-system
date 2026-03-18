const Lab = require('../models/lab');

// Get all labs
const getLabs = async (req, res) => {
  try {
    const labs = await Lab.find({});
    res.status(200).json({
      success: true,
      data: labs
    });
  } catch (error) {
    console.error('Error fetching labs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching labs',
      error: error.message
    });
  }
};

module.exports = {
  getLabs,
};
