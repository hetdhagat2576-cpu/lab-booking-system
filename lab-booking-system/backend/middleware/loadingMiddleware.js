// Loading middleware for API responses
const showLoadingIndicator = (req, res, next) => {
  // Set loading headers
  res.setHeader('X-Loading', 'true');
  res.setHeader('X-Loading-Message', 'Processing your request...');
  
  // Continue to next middleware
  next();
};

const hideLoadingIndicator = (req, res, next) => {
  // Remove loading headers
  res.removeHeader('X-Loading');
  res.removeHeader('X-Loading-Message');
  
  // Continue to next middleware
  next();
};

module.exports = {
  showLoadingIndicator,
  hideLoadingIndicator
};
