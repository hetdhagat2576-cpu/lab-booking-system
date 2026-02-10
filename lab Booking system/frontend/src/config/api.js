// API configuration for the lab booking system

// Base URL for API calls - change this to match your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Function to create full API URLs
export const createApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Function to validate API parameters and prevent invalid calls
export const validateApiCall = (url, id = null) => {
  // Check if URL contains undefined in the path
  if (url.includes('/undefined')) {
    console.error('Invalid API call detected: URL contains undefined', url);
    return false;
  }
  
  // Check if ID is provided when required - only validate ID for endpoints that need it
  // List endpoints (like /api/tests, /api/packages) don't need ID validation
  const needsIdValidation = url.match(/\/\d+$/) || // Ends with number (ID)
                          url.includes('/edit/') || 
                          url.includes('/delete/') ||
                          url.includes('/update/') ||
                          url.includes('/toggle/') ||
                          (id !== null && url.includes('?')); // If ID is explicitly provided
  
  if (needsIdValidation && (id === undefined || id === null)) {
    console.error('Invalid API call: ID is required for this endpoint', { url, id });
    return false;
  }
  
  return true;
};

// Safe fetch wrapper that validates calls before making them
export const safeFetch = async (url, options = {}) => {
  if (!validateApiCall(url)) {
    throw new Error('Invalid API call parameters');
  }
  
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Export the base URL for reference
export { API_BASE_URL };
