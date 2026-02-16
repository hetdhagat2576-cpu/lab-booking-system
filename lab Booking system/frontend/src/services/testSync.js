/**
 * Utility functions for synchronizing test data between All Tests page and health package pages
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

// Get test title (handle both API data structure and static data structure)
export const getTestTitle = (test) => {
  if (typeof test === 'string') return test;
  if (test && typeof test === 'object') {
    if (typeof test.name === 'string') return test.name;
    if (typeof test.title === 'string') return test.title;
    if (test.name && typeof test.name === 'object') return test.name.name || test.name.title || JSON.stringify(test.name);
    if (test.title && typeof test.title === 'object') return test.title.name || test.title.title || JSON.stringify(test.title);
  }
  return 'Unknown Test';
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
    description: typeof test.description === 'string' ? test.description : 
                (test.description?.name || test.description?.title || JSON.stringify(test.description) || ''),
    sampleType: typeof test.sampleType === 'string' ? test.sampleType : 
                (test.sampleType?.name || test.sampleType?.title || 'Blood'),
    reportTime: test.reportTime || '24 Hrs',
    fastingRequired: test.fastingRequired || false
  };
};
