import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if exists
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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network errors
    if (!error.response) {
      error.message = 'Network Error';
      // You could dispatch to a global state manager here if needed
    }
    
    // Session expired
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Server errors
    if (error.response?.status >= 500) {
      error.message = 'Server Error';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 