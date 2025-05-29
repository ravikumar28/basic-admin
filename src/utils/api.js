import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://vitaldev.vitalinsights.in';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - could redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          break;
        case 403:
          // Forbidden
          break;
        case 404:
          // Not found
          break;
        case 500:
          // Server error
          break;
        default:
          // Other errors
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;