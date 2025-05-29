import React from 'react';
import PatientCard from './PatientCard';
import Spinner from '../common/Spinner';

const PatientList = ({ patients, loading }) => {
  if (loading) {
    return <Spinner className="my-8" />;
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="text-center my-8 p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No appointments found matching the current filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
};

export default PatientList;