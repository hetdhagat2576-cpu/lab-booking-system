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
  return test.name || test.title || 'Unknown Test';
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
    displayDiscount: getTestDiscount(test)
  };
};
