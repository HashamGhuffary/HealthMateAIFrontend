import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Base API URL - Change in production
const API_URL = 'http://192.168.18.55:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get auth token', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and not already retrying, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        
        if (!refreshToken) {
          // No refresh token available, user needs to login again
          throw new Error('No refresh token available');
        }

        // Try to get a new access token
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken
        });

        const { access, refresh } = response.data;
        
        // Store the new tokens
        await SecureStore.setItemAsync('auth_token', access);
        if (refresh) {
          await SecureStore.setItemAsync('refresh_token', refresh);
        }
        
        // Retry the original request with new token
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('refresh_token');
        
        // This redirect logic should be handled by auth context
        console.error('Token refresh failed, redirect to login');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API services
export const authService = {
  login: (email, password) => api.post('/auth/login/', { email, password }),
  register: (userData) => api.post('/auth/register/', userData),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (userData) => api.patch('/auth/profile/', userData),
};

export const chatService = {
  sendMessage: async (message) => {
    try {
      const response = await api.post('/chat/chat/', { message });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getChatHistory: async () => {
    try {
      const response = await api.get('/chat/history/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserSymptoms: async () => {
    try {
      const response = await api.get('/symptoms/user-symptoms/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRecentSymptomChecks: async () => {
    try {
      const response = await api.get('/symptoms/checks/recent/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const doctorService = {
  getDoctors: (filters = {}) => api.get('/doctors/', { params: filters }),
  getDoctorById: (id) => api.get(`/doctors/${id}/`),
  updateDoctorProfile: (data) => api.patch('/doctors/profile/', data),
  getDoctorReviews: (doctorId) => api.get(`/doctors/${doctorId}/reviews/`),
  createDoctorReview: (doctorId, reviewData) => 
    api.post(`/doctors/${doctorId}/reviews/create/`, reviewData),
};

export const appointmentService = {
  getAppointments: (filters = {}) => api.get('/appointments/', { params: filters }),
  getAppointmentById: (id) => api.get(`/appointments/${id}/`),
  createAppointment: (appointmentData) => api.post('/appointments/', appointmentData),
  updateAppointment: (id, appointmentData) => api.put(`/appointments/${id}/`, appointmentData),
  cancelAppointment: (id) => api.patch(`/appointments/${id}/`, { status: 'cancelled' }),
  addNotes: (id, notes) => api.post(`/appointments/${id}/add_notes/`, { notes }),
  updateStatus: (id, status) => api.post(`/appointments/${id}/update_status/`, { status }),
};

export const medicalRecordService = {
  getRecords: (filters = {}) => api.get('/records/', { params: filters }),
  getRecordById: (id) => api.get(`/records/${id}/`),
  createRecord: (recordData) => api.post('/records/', recordData),
  updateRecord: (id, recordData) => api.put(`/records/${id}/`, recordData),
  deleteRecord: (id) => api.delete(`/records/${id}/`),
};

export const dashboardService = {
  getDashboardData: () => api.get('/dashboard/'),
};

export const symptomService = {
  getPredefinedSymptoms: (filters = {}) => api.get('/symptoms/predefined/', { params: filters }),
  getUserSymptoms: (filters = {}) => api.get('/symptoms/user-symptoms/', { params: filters }),
  getActiveSymptoms: () => api.get('/symptoms/user-symptoms/active/'),
  createUserSymptom: (symptomData) => api.post('/symptoms/user-symptoms/', symptomData),
  updateUserSymptom: (id, symptomData) => api.patch(`/symptoms/user-symptoms/${id}/`, symptomData),
  deleteUserSymptom: (id) => api.delete(`/symptoms/user-symptoms/${id}/`),
  createSymptomCheck: (checkData) => api.post('/symptoms/checks/', checkData),
  getSymptomChecks: () => api.get('/symptoms/checks/'),
  getRecentSymptomCheck: () => api.get('/symptoms/checks/recent/'),
};

export const diagnosticService = {
  getDiagnoses: (filters = {}) => api.get('/diagnostics/diagnoses/', { params: filters }),
  getDiagnosisById: (id) => api.get(`/diagnostics/diagnoses/${id}/`),
  createDiagnosis: (diagnosisData) => api.post('/diagnostics/diagnoses/', diagnosisData),
  updateDiagnosis: (id, diagnosisData) => api.patch(`/diagnostics/diagnoses/${id}/`, diagnosisData),
  deleteDiagnosis: (id) => api.delete(`/diagnostics/diagnoses/${id}/`),
  resolveDiagnosis: (id) => api.post(`/diagnostics/diagnoses/${id}/resolve/`),
  markChronic: (id) => api.post(`/diagnostics/diagnoses/${id}/mark_chronic/`),
  generateTreatment: (id) => api.post(`/diagnostics/diagnoses/${id}/generate_treatment/`),
  createDiagnosisFromSymptomCheck: (checkData) => 
    api.post('/diagnostics/diagnoses/from_symptom_check/', checkData),
};

export const treatmentService = {
  getTreatments: (filters = {}) => api.get('/diagnostics/treatments/', { params: filters }),
  getTreatmentById: (id) => api.get(`/diagnostics/treatments/${id}/`),
  createTreatment: (treatmentData) => api.post('/diagnostics/treatments/', treatmentData),
  updateTreatment: (id, treatmentData) => api.patch(`/diagnostics/treatments/${id}/`, treatmentData),
  deleteTreatment: (id) => api.delete(`/diagnostics/treatments/${id}/`),
  completeTreatment: (id) => api.post(`/diagnostics/treatments/${id}/complete/`),
  discontinueTreatment: (id) => api.post(`/diagnostics/treatments/${id}/discontinue/`),
  rateTreatment: (id, ratingData) => api.post(`/diagnostics/treatments/${id}/rate/`, ratingData),
};

export const healthInsightService = {
  getInsights: (filters = {}) => api.get('/health-insights/insights/', { params: filters }),
  generateInsights: () => api.post('/health-insights/insights/generate/'),
  markInsightAsRead: (id) => api.post(`/health-insights/insights/${id}/mark_as_read/`),
  getHealthGoals: (filters = {}) => api.get('/health-insights/goals/', { params: filters }),
  getActiveGoals: () => api.get('/health-insights/goals/active/'),
  createHealthGoal: (goalData) => api.post('/health-insights/goals/', goalData),
  updateHealthGoal: (id, goalData) => api.patch(`/health-insights/goals/${id}/`, goalData),
  completeHealthGoal: (id) => api.post(`/health-insights/goals/${id}/complete/`),
  abandonHealthGoal: (id) => api.post(`/health-insights/goals/${id}/abandon/`),
  getHealthMetrics: (filters = {}) => api.get('/health-insights/metrics/', { params: filters }),
  getLatestMetrics: () => api.get('/health-insights/metrics/latest/'),
  createHealthMetric: (metricData) => api.post('/health-insights/metrics/', metricData),
  getRecommendations: (filters = {}) => api.get('/health-insights/recommendations/', { params: filters }),
  completeRecommendation: (id) => api.post(`/health-insights/recommendations/${id}/complete/`),
  dismissRecommendation: (id) => api.post(`/health-insights/recommendations/${id}/dismiss/`),
};

export const reminderService = {
  getReminders: (filters = {}) => api.get('/reminders/', { params: filters }),
  getTodayReminders: () => api.get('/reminders/today/'),
  getMedicationReminders: () => api.get('/reminders/medications/'),
  createReminder: (reminderData) => api.post('/reminders/', reminderData),
  updateReminder: (id, reminderData) => api.patch(`/reminders/${id}/`, reminderData),
  deleteReminder: (id) => api.delete(`/reminders/${id}/`),
  getReminderLogs: () => api.get('/reminders/logs/'),
  updateReminderLogStatus: (id, status) => 
    api.patch(`/reminders/logs/${id}/update_status/`, { status }),
};

export const emergencyService = {
  getEmergencyContacts: () => api.get('/emergency/contacts/'),
  getPrimaryContact: () => api.get('/emergency/contacts/primary/'),
  createEmergencyContact: (contactData) => api.post('/emergency/contacts/', contactData),
  updateEmergencyContact: (id, contactData) => api.patch(`/emergency/contacts/${id}/`, contactData),
  deleteEmergencyContact: (id) => api.delete(`/emergency/contacts/${id}/`),
  getEmergencyAlerts: () => api.get('/emergency/alerts/'),
  getActiveAlerts: () => api.get('/emergency/alerts/active/'),
  createEmergencyAlert: (alertData) => api.post('/emergency/alerts/', alertData),
  resolveAlert: (id) => api.post(`/emergency/alerts/${id}/resolve/`),
  markFalseAlarm: (id) => api.post(`/emergency/alerts/${id}/false_alarm/`),
};

export default api; 