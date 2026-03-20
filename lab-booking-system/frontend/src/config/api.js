
// Determine the base API URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in production (deployed on Vercel)
  if (window.location.hostname.includes('vercel.app')) {
    // Production - use the deployed backend URL
    return 'https://backend-qcwowsoj8-hetdhagat2576-8656s-projects.vercel.app';
  }
  
  // Development - use localhost
  console.log('Using local development API URL');
  return 'http://localhost:5001';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🚀 API Configuration initialized:', {
  baseUrl: API_BASE_URL,
  environment: process.env.NODE_ENV,
  hostname: window.location.hostname
});

// API call lock mechanism to prevent concurrent calls
const apiCallLocks = new Map();
const pendingCalls = new Map();

export const createApiUrl = (endpoint) => {
  if (endpoint.startsWith(API_BASE_URL)) {
    return endpoint;
  }

  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  // we need to avoid duplication.
  if (API_BASE_URL.endsWith('/api') && cleanEndpoint.startsWith('api/')) {
    // Just append the part of the endpoint that comes after 'api/'
    const specificPath = cleanEndpoint.substring(4);
    return `${API_BASE_URL}/${specificPath}`;
  }

  // If the endpoint already starts with 'api/', construct the URL directly
  if (cleanEndpoint.startsWith('api/')) {
    return `${API_BASE_URL}/${cleanEndpoint}`;
  }

  // Otherwise, add the /api prefix
  return `${API_BASE_URL}/api/${cleanEndpoint}`;
};

export const validateApiCall = (url, id = null) => {
  if (url.includes('/undefined')) {
    console.error('Invalid API call detected: URL contains undefined', url);
    return false;
  }
  
  if (url.includes('undefined/')) {
    console.error('Invalid API call detected: URL contains undefined in path', url);
    return false;
  }
  
  if (url.includes('?undefined')) {
    console.error('Invalid API call detected: URL contains undefined in query params', url);
    return false;
  }
  
  if (url.includes('undefined=')) {
    console.error('Invalid API call detected: URL contains undefined in query value', url);
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

// Safe fetch wrapper with credentials
export const safeFetch = async (url, options = {}) => {
  if (!validateApiCall(url)) {
    throw new Error('Invalid API call parameters');
  }

  // ✅ IMPORTANT: Add credentials to support cookies/sessions
  const defaultOptions = {
    credentials: 'include', // This is crucial for authentication
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
  
  const mergedOptions = { ...defaultOptions, ...options };

  // Create a unique key for this API call
  const callKey = `${url}:${JSON.stringify(mergedOptions)}`;
  
  // Check if this exact call is already in progress
  if (apiCallLocks.has(callKey)) {
    console.log('API call already in progress, waiting for result:', url);
    
    try {
      const existingResult = await apiCallLocks.get(callKey);
      return existingResult.clone();
    } catch (error) {
      console.log('Existing API call failed, proceeding with new call:', url);
      apiCallLocks.delete(callKey);
    }
  }

  // Check for similar pending calls
  const urlKey = url.split('?')[0];
  if (pendingCalls.has(urlKey)) {
    console.log('Similar API call detected, cancelling previous call:', url);
    
    const previousCall = pendingCalls.get(urlKey);
    if (previousCall && previousCall.abortController) {
      previousCall.abortController.abort();
    }
    pendingCalls.delete(urlKey);
  }

  // Create abort controller
  const abortController = new AbortController();
  const requestOptions = {
    ...mergedOptions,
    signal: abortController.signal
  };

  // Store the call
  const callPromise = (async () => {
    try {
      console.log('📡 Making API call:', url);
      const response = await fetch(url, requestOptions);
      
      apiCallLocks.delete(callKey);
      pendingCalls.delete(urlKey);
      
      // Handle unauthorized responses
      if (response.status === 401) {
        console.warn('⚠️ Unauthorized: Token may be expired');
        // Optionally redirect to login or refresh token
      }
      
      return response;
    } catch (error) {
      apiCallLocks.delete(callKey);
      pendingCalls.delete(urlKey);
      
      if (error.name === 'AbortError') {
        console.log('API call was aborted:', url);
        throw new Error('API call was cancelled due to a newer request');
      }
      
      console.error('❌ API call failed:', error);
      throw error;
    }
  })();

  apiCallLocks.set(callKey, callPromise);
  pendingCalls.set(urlKey, { abortController, callPromise });

  return callPromise;
};

// Safe API call builder to prevent undefined parameters
export const buildApiUrl = (baseUrl, params = {}) => {
  const cleanParams = {};
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== 'undefined') {
      cleanParams[key] = value;
    }
  });
  
  const queryString = new URLSearchParams(cleanParams).toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Safe endpoint builder
export const buildEndpoint = (baseEndpoint, ...pathParts) => {
  const cleanParts = pathParts.filter(part => 
    part !== undefined && 
    part !== null && 
    part !== 'undefined' && 
    part !== ''
  );
  
  const cleanEndpoint = baseEndpoint.startsWith('/') ? baseEndpoint.slice(1) : baseEndpoint;
  const fullPath = cleanParts.length > 0 ? `${cleanEndpoint}/${cleanParts.join('/')}` : cleanEndpoint;
  
  return createApiUrl(fullPath);
};

// Export the base URL for reference
export { API_BASE_URL };

// Utility function to clear all API call locks
export const clearApiCallLocks = () => {
  console.log('Clearing all API call locks');
  
  pendingCalls.forEach((call) => {
    if (call.abortController) {
      call.abortController.abort();
    }
  });
  
  apiCallLocks.clear();
  pendingCalls.clear();
};

// Utility function to check if an API call is in progress
export const isApiCallInProgress = (url) => {
  const urlKey = url.split('?')[0];
  return pendingCalls.has(urlKey) || Array.from(apiCallLocks.keys()).some(key => key.includes(url));
};

// Debounced API call utility
export const debouncedApiCall = (debounceTime = 300) => {
  const debounceTimers = new Map();
  
  return (url, options = {}) => {
    const callKey = `${url}:${JSON.stringify(options)}`;
    
    if (debounceTimers.has(callKey)) {
      clearTimeout(debounceTimers.get(callKey));
    }
    
    return new Promise((resolve, reject) => {
      const timer = setTimeout(async () => {
        try {
          const result = await safeFetch(url, options);
          debounceTimers.delete(callKey);
          resolve(result);
        } catch (error) {
          debounceTimers.delete(callKey);
          reject(error);
        }
      }, debounceTime);
      
      debounceTimers.set(callKey, timer);
    });
  };
};
