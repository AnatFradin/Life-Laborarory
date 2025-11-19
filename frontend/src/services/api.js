import axios from 'axios';

/**
 * API client service configured for Laboratory of Life backend
 * 
 * Base URL: http://localhost:3000/api
 * All requests go through this instance for consistent error handling
 */

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds (AI responses may take time)
});

// Request interceptor for logging in development
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log('[API Request]', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for gentle error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('[API Error]', error.response?.data || error.message);
    }

    // Extract gentle error message from backend
    const backendMessage = error.response?.data?.message;
    const suggestions = error.response?.data?.suggestions || [];

    // Create enhanced error with user-friendly details
    const enhancedError = new Error(
      backendMessage || 'Something unexpected happened. Please try again.'
    );
    enhancedError.suggestions = suggestions;
    enhancedError.originalError = error;
    enhancedError.statusCode = error.response?.status;

    return Promise.reject(enhancedError);
  }
);

export default apiClient;

/**
 * API endpoints
 * These will be used by composables in the next phase
 */

export const reflectionsAPI = {
  getAll: () => apiClient.get('/reflections'),
  getById: (id) => apiClient.get(`/reflections/${id}`),
  create: (reflection) => apiClient.post('/reflections', reflection),
  delete: (id) => apiClient.delete(`/reflections/${id}`),
  deleteAll: (confirmation) =>
    apiClient.post('/reflections/delete-all', { confirmation }),
};

export const aiAPI = {
  generateMirror: (prompt, model, provider) =>
    apiClient.post('/ai/mirror', { prompt, model, provider }),
};

export const exportAPI = {
  exportToMarkdown: (format, includeMetadata = true) => 
    apiClient.post('/export', { format, includeMetadata }),
};

export const preferencesAPI = {
  get: () => apiClient.get('/preferences'),
  update: (preferences) => apiClient.put('/preferences', preferences),
};
