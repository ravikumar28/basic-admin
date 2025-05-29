import api from '../utils/api';

export const authService = {
  login: (credentials) => {
    return api.post('/admin/login', credentials);
  },
  
  validateToken: () => {
    return api.get('/admin/validate-token');
  },
  
  logout: () => {
    return api.post('/admin/logout');
  }
};