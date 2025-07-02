import axios from 'axios';

// Create axios instance with base URL - GUARANTEED localhost:5000 backend
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // FIXED backend URL - never changes
  timeout: 15000, // 15 second timeout for reliability
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Disable credentials for CORS
  validateStatus: function (status) {
    // Accept status codes from 200-299 and 401 (for auth handling)
    return (status >= 200 && status < 300) || status === 401;
  },
});

// Add request interceptor to attach JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors - BULLETPROOF ERROR HANDLING
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors gracefully
    if (!error.response) {
      console.warn('Network error - backend may not be running on localhost:5000');
      // Don't redirect on network errors, let components handle it
      return Promise.reject({
        ...error,
        message: 'Unable to connect to server. Please ensure the backend is running.',
        isNetworkError: true
      });
    }

    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if we're not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Handle 500 errors gracefully
    if (error.response.status >= 500) {
      console.error('Server error:', error.response.data);
      return Promise.reject({
        ...error,
        message: 'Server error. Please try again later.',
        isServerError: true
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
