import React, { createContext, useState } from 'react';
import { patientService } from '../services/patientService';
import { branchService } from '../services/branchService';

export const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    branchId: ''
  });
  
  const loadBranches = async () => {
    setLoading(true);
    try {
      const response = await branchService.getBranches();
      if (response.data && response.data.success && response.data.data) {
        setBranches(response.data.data);
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error loading branches:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async (filterParams = filters) => {
    setLoading(true);
    try {
      const response = await patientService.getPatients(filterParams);
      if (response.data && response.data.success && response.data.data) {
        setPatients(response.data.data);
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error loading patients:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    return loadPatients(updatedFilters);
  };

  return (
    <PatientContext.Provider value={{ 
      patients, 
      branches,
      loadPatients, 
      loadBranches,
      updateFilters,
      filters,
      loading 
    }}>
      {children}
    </PatientContext.Provider>
  );
};