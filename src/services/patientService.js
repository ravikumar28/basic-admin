import api from '../utils/api';
import { format } from 'date-fns';

export const patientService = {
  getPatients: (filters = {}) => {
    let params = {};
    
    if (filters.startDate) {
      params.from_date = format(new Date(filters.startDate), 'yyyy-MM-dd');
    }
    
    if (filters.endDate) {
      params.to_date = format(new Date(filters.endDate), 'yyyy-MM-dd');
    }
    
    if (filters.branchId) {
      params.branch_id = filters.branchId;
    }
    
    return api.get('/admin/appointments', { params });
  },
  
  getPatientById: (patientId) => {
    return api.get(`/admin/appointments/${patientId}`);
  }
};