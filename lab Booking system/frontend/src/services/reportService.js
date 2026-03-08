import axios from 'axios';
import { createApiUrl } from "../config/api";

const API_BASE_URL = process.env.REACT_APP_API_URL || createApiUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('lab_user');
  console.log('ReportService - Stored user found:', !!storedUser);
  
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      console.log('ReportService - User data parsed:', !!userData);
      console.log('ReportService - Token found:', !!userData.token);
      
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
        console.log('ReportService - Authorization header set:', config.headers.Authorization);
      }
    } catch (error) {
      console.error('Error parsing user data for token:', error);
    }
  }
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('ReportService - Response successful:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('ReportService - Response error:', error.response?.status, error.response?.data, error.config?.url);
    if (error.response?.status === 401) {
      console.error('ReportService - Authentication failed. Token may be expired or invalid.');
    }
    return Promise.reject(error);
  }
);

export const reportService = {
  // Get all reports (for lab technicians/admins)
  getAllReports: async (params = {}) => {
    const response = await api.get('/api/reports', { params });
    return response.data;
  },

  // Get reports for a specific patient
  getPatientReports: async (patientId) => {
    const response = await api.get(`/api/reports/patient/${patientId}`);
    return response.data;
  },

  // Get report by booking ID
  getReportByBookingId: async (bookingId) => {
    const response = await api.get(`/api/reports/booking/${bookingId}`);
    return response.data;
  },

  // Get single report by ID
  getReportById: async (reportId) => {
    const response = await api.get(`/api/reports/${reportId}`);
    return response.data;
  },

  // Create new report (for lab technicians)
  createReport: async (reportData) => {
    const response = await api.post('/api/reports', reportData);
    return response.data;
  },

  // Get pending reports for lab technicians
  getPendingReports: async () => {
    const response = await api.get('/api/reports/pending/reports');
    return response.data;
  },

  // Update report (for lab technicians)
  updateReport: async (reportId, reportData) => {
    const response = await api.put(`/api/reports/${reportId}`, reportData);
    return response.data;
  },

  // Delete report (for lab technicians/admins)
  deleteReport: async (reportId) => {
    const response = await api.delete(`/api/reports/${reportId}`);
    return response.data;
  },

  // Generate fake report (for testing)
  generateFakeReport: async (appointmentId) => {
    const response = await api.post('/api/reports/generate-fake', { appointmentId });
    return response.data;
  },

  // Download report as PDF
  downloadReportPDF: async (reportId) => {
    const response = await api.get(`/api/reports/${reportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default reportService;
