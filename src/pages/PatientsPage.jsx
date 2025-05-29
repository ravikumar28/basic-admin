import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import PatientList from '../components/patients/PatientList';
import FilterPanel from '../components/patients/FilterPanel';
import PaginationControls from '../components/patients/PaginationControls';
import { usePatients } from '../hooks/usePatients';

const PatientsPage = () => {
  const { patients, loadPatients, loading } = usePatients();
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(9);
  
  useEffect(() => {
    loadPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Get current patients for pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(patients.length / patientsPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <p className="text-gray-600">Manage and view patient records</p>
      </div>
      
      <FilterPanel />
      
      <PatientList 
        patients={currentPatients} 
        loading={loading} 
      />
      
      {totalPages > 1 && (
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Layout>
  );
};

export default PatientsPage;