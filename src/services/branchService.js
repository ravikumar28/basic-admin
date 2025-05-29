import api from '../utils/api';

export const branchService = {
  getBranches: () => {
    return api.get('/admin/branches');
  }
};