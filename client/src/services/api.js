import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campus_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const getCurrentUser = () => api.get('/auth/me');

// Diagnostic Flow (The fast check-first pattern)
export const analyzeReport = (formData) =>
  api.post('/tickets/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Tickets
export const createTicket = (formData) =>
  api.post('/tickets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getTickets = (params) => api.get('/tickets', { params });
export const getTicketById = (id) => api.get(`/tickets/${id}`);
export const updateTicketStatus = (id, data) => api.patch(`/tickets/${id}/status`, data);
export const deleteTicket = (id) => api.delete(`/tickets/${id}`);

// Outages
export const getOutages = (params) => api.get('/outages', { params });
export const getActiveOutages = () => api.get('/outages/active');
export const createOutage = (data) => api.post('/outages', data);
export const updateOutage = (id, data) => api.patch(`/outages/${id}`, data);
export const deleteOutage = (id) => api.delete(`/outages/${id}`);

// Labs
export const getAllLabs = () => api.get('/labs');
export const updateLabStatus = (id, data) => api.patch(`/labs/${id}`, data);

// Knowledge Base
export const getAllKB = (params) => api.get('/kb', { params });
export const getKBById = (id) => api.get(`/kb/${id}`);
export const createKB = (data) => api.post('/kb', data);
export const deleteKB = (id) => api.delete(`/kb/${id}`);

// Analytics
export const getDashboardStats = () => api.get('/analytics/dashboard');

// System
export const seedDatabase = () => api.post('/system/seed');
export const getSystemHealth = () => api.get('/system/health');

export default api;
