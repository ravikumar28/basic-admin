import { useContext } from 'react';
import { PatientContext } from '../contexts/PatientContext';

export const usePatients = () => {
  const context = useContext(PatientContext);
  
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  
  return context;
};