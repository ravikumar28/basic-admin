import api from '../utils/api';

export const reportService = {
  getReportByPatientId: (patientId) => {
    return api.get(`/admin/dexa-reports/by-appointment/${patientId}`);
  },
  
  createReport: (patientId, reportData) => {
    const payload = {
      data: {
        appointment_id: patientId,
        ...reportData
      }
    };
    return api.post('/admin/dexa-reports', payload);
  },
  
  updateReport: (reportId, reportData) => {
    const payload = {
      data: {
        ...reportData
      }
    };
    return api.put(`/admin/dexa-reports/${reportId}`, payload);
  }
};