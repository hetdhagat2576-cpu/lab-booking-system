// API configuration for the lab booking system

// Base URL for API calls - change this to match your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Function to create full API URLs
export const createApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export const validateApiCall = (url, id = null) => {
  if (url.includes('/undefined')) {
    console.error('Invalid API call detected: URL contains undefined', url);
    return false;
  }
  
  const needsIdValidation = url.match(/\/\d+$/) || 
                          url.includes('/edit/') || 
                          url.includes('/delete/') ||
                          url.includes('/update/') ||
                          url.includes('/toggle/') ||
                          (id !== null && url.includes('?'));
  
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
