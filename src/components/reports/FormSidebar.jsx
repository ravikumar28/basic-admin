import React from 'react';
import Card from '../common/Card';

const FormSidebar = ({ 
  sections,
  currentSection,
  onSectionChange,
  patient,
  existingReport,
  isEditingAllowed,
  currentDateTime
}) => {
  return (
    <div className="space-y-4">
      {patient && (
        <Card>
          <h3 className="font-semibold">{patient.profile?.name}</h3>
          <p className="text-sm text-gray-600">ID: {patient.sukra_id}</p>
          <p className="text-sm text-gray-600">Branch: {patient.facility?.branch_name}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Appointment Date:</span> {new Date(patient.slot_start_time).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-medium">Current Date:</span> {currentDateTime}
          </p>
          {existingReport && (
            <>
              {existingReport.created_at && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Created:</span> {existingReport.created_at}
                </p>
              )}
              {existingReport.updated_at && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Last Updated:</span> {existingReport.updated_at}
                </p>
              )}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-sm font-medium">
                  Status: <span className={isEditingAllowed ? "text-primary-500" : "text-yellow-600"}>
                    {isEditingAllowed ? "Editable" : "View Only"}
                  </span>
                </p>
              </div>
            </>
          )}
        </Card>
      )}
      
      <Card>
        <h3 className="font-semibold mb-3 text-primary-500">Report Sections</h3>
        <ul className="space-y-2">
          {sections.map((section, index) => (
            <li key={section.id}>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
                  index === currentSection 
                    ? 'bg-primary-100 text-primary-600 font-medium border-l-4 border-primary-500' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => onSectionChange(index)}
              >
                <span>{section.label}</span>
                {index < currentSection && (
                  <span className="text-primary-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default FormSidebar;