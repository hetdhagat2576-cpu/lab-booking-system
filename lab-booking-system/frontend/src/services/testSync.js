/**
 * Test synchronization and safe rendering utilities
 * Prevents "Objects are not valid as a React child" errors
 */

// Get synchronized tests for a specific health concern from localStorage
export const getSynchronizedTests = (healthConcern) => {
  try {
    const storedTests = localStorage.getItem(`health_concern_${healthConcern}_tests`);
    if (storedTests) {
      const tests = JSON.parse(storedTests);
      return tests;
    }
  } catch (error) {
    console.error(`Error loading synchronized tests for ${healthConcern}:`, error);
  }
  return [];
};

/**
 * Safely extracts a string value from various data structures
 * @param {*} value - The value to extract string from
 * @param {string} fallback - Default fallback string
 * @returns {string} - Safe string value
 */
export const safeString = (value, fallback = 'Unknown') => {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return fallback;
  }
  
  // Return strings directly
  if (typeof value === 'string') {
    return value;
  }
  
  // Handle numbers
  if (typeof value === 'number') {
    return value.toString();
  }
  
  // Handle booleans
  if (typeof value === 'boolean') {
    return value.toString();
  }
  
  // Handle objects with common properties
  if (typeof value === 'object') {
    // Check for common name properties
    if (value.name && typeof value.name === 'string') {
      return value.name;
    }
    if (value.title && typeof value.title === 'string') {
      return value.title;
    }
    if (value.testName && typeof value.testName === 'string') {
      return value.testName;
    }
    if (value.label && typeof value.label === 'string') {
      return value.label;
    }
    
    // Check for _id for fallback
    if (value._id) {
      return `${fallback} ${value._id}`;
    }
    if (value.id) {
      return `${fallback} ${value.id}`;
    }
  }
  
  return fallback;
};

/**
 * Safely renders test name from various test data structures
 * @param {*} test - Test object or string
 * @returns {string} - Safe test name
 */
export const safeTestName = (test) => {
  if (typeof test === 'string') {
    return test;
  }
  
  if (test && typeof test === 'object') {
    // Direct properties
    if (test.name && typeof test.name === 'string') {
      return test.name;
    }
    if (test.title && typeof test.title === 'string') {
      return test.title;
    }
    if (test.testName && typeof test.testName === 'string') {
      return test.testName;
    }
    
    // Nested object properties
    if (test.name && typeof test.name === 'object') {
      return test.name.name || test.name.title || safeString(test.name);
    }
    if (test.title && typeof test.title === 'object') {
      return test.title.name || test.title.title || safeString(test.title);
    }
    
    // ID fallback
    if (test._id) {
      return `Test ${test._id}`;
    }
    if (test.id) {
      return `Test ${test.id}`;
    }
  }
  
  return 'Unknown Test';
};

/**
 * Safely renders sample type from various data structures
 * @param {*} sampleType - Sample type data
 * @returns {string} - Safe sample type
 */
export const safeSampleType = (sampleType) => {
  if (typeof sampleType === 'string') {
    return sampleType;
  }
  
  if (sampleType && typeof sampleType === 'object') {
    if (sampleType.sampleType && typeof sampleType.sampleType === 'string') {
      return sampleType.sampleType;
    }
    if (sampleType.name && typeof sampleType.name === 'string') {
      return sampleType.name;
    }
  }
  
  return 'Blood'; // Default fallback
};

/**
 * Safely maps over an array with proper error handling
 * @param {Array} array - Array to map over
 * @param {Function} mapFn - Map function
 * @param {*} fallback - Fallback value if array is invalid
 * @returns {Array} - Mapped array or fallback
 */
export const safeMap = (array, mapFn, fallback = []) => {
  if (!Array.isArray(array)) {
    return fallback;
  }
  
  try {
    return array.map(mapFn);
  } catch (error) {
    console.error('Error in safeMap:', error);
    return fallback;
  }
};

/**
 * Safely gets array length
 * @param {*} array - Array to check
 * @returns {number} - Array length or 0
 */
export const safeLength = (array) => {
  return Array.isArray(array) ? array.length : 0;
};

// Get test title (handle both API data structure and static data structure)
export const getTestTitle = (test) => {
  return safeTestName(test);
};

// Get test ID (handle both API data structure and static data structure)
export const getTestId = (test) => {
  return test._id || test.id;
};

// Get test price (handle both API data structure and static data structure)
export const getTestPrice = (test) => {
  return test.price || 0;
};

// Get test original price if available
export const getTestOriginalPrice = (test) => {
  return test.originalPrice || null;
};

// Get test discount if available
export const getTestDiscount = (test) => {
  return test.discount || null;
};

// Format test data for consistent display across health package pages
export const formatTestForDisplay = (test) => {
  return {
    ...test,
    displayTitle: getTestTitle(test),
    displayId: getTestId(test),
    displayPrice: getTestPrice(test),
    displayOriginalPrice: getTestOriginalPrice(test),
    displayDiscount: getTestDiscount(test),
    description: safeString(test.description, 'Test description'),
    sampleType: safeSampleType(test.sampleType),
    reportTime: safeString(test.reportTime, '24 Hrs'),
    fastingRequired: test.fastingRequired || false
  };
};
