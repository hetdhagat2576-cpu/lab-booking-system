// Example API service using the updated configuration
import { createApiUrl, safeFetch } from '../config/api';

// Example API service functions
export const apiService = {
  // GET request example
  async get(endpoint) {
    const url = createApiUrl(endpoint);
    console.log('📡 GET Request:', url);
    const response = await safeFetch(url);
    return response.json();
  },

  // POST request example
  async post(endpoint, data) {
    const url = createApiUrl(endpoint);
    console.log('📡 POST Request:', url);
    const response = await safeFetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // PUT request example
  async put(endpoint, data) {
    const url = createApiUrl(endpoint);
    console.log('📡 PUT Request:', url);
    const response = await safeFetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // DELETE request example
  async delete(endpoint) {
    const url = createApiUrl(endpoint);
    console.log('📡 DELETE Request:', url);
    const response = await safeFetch(url, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Specific API endpoints examples
  auth: {
    login: (credentials) => apiService.post('auth/login', credentials),
    register: (userData) => apiService.post('auth/register', userData),
    logout: () => apiService.post('auth/logout'),
    verifyOtp: (otpData) => apiService.post('auth/verify-otp', otpData),
  },

  bookings: {
    getAll: () => apiService.get('bookings'),
    getById: (id) => apiService.get(`bookings/${id}`),
    create: (bookingData) => apiService.post('bookings', bookingData),
    update: (id, bookingData) => apiService.put(`bookings/${id}`, bookingData),
    delete: (id) => apiService.delete(`bookings/${id}`),
  },

  tests: {
    getAll: () => apiService.get('tests'),
    getById: (id) => apiService.get(`tests/${id}`),
    create: (testData) => apiService.post('tests', testData),
    update: (id, testData) => apiService.put(`tests/${id}`, testData),
    delete: (id) => apiService.delete(`tests/${id}`),
  },

  packages: {
    getAll: () => apiService.get('packages'),
    getById: (id) => apiService.get(`packages/${id}`),
    create: (packageData) => apiService.post('packages', packageData),
    update: (id, packageData) => apiService.put(`packages/${id}`, packageData),
    delete: (id) => apiService.delete(`packages/${id}`),
  },

  feedback: {
    getAll: () => apiService.get('feedback'),
    getReviewed: () => apiService.get('feedback/reviewed'),
    create: (feedbackData) => apiService.post('feedback', feedbackData),
  },

  content: {
    getHomeWhyBook: () => apiService.get('content/home/why-book'),
    getHomeHowItWorks: () => apiService.get('content/home/how-it-works'),
    getFaq: () => apiService.get('faq'),
    getAbout: () => apiService.get('about'),
    getTerms: () => apiService.get('terms'),
    getPrivacy: () => apiService.get('privacy'),
  }
};

export default apiService;
