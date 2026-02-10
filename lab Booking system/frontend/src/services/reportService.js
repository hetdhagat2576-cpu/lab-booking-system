import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
