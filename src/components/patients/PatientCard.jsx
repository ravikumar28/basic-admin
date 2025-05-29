import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { format } from 'date-fns';

const PatientCard = ({ patient }) => {
  const navigate = useNavigate();
  
  const handleViewReport = () => {
    navigate(`/report/${patient.id}`);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'not_started': 'bg-primary-100 text-primary-800'
    };
    
    const statusLabels = {
      'completed': 'Completed',
      'pending': 'Pending',
      'not_started': 'Not Started'
    };
    
    const className = statusClasses[status] || statusClasses.not_started;
    const label = statusLabels[status] || 'Not Started';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {label}
      </span>
    );
  };

  const formatAppointmentDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <Card className="h-full flex flex-col border-t-4 border-primary-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{patient.profile?.name || 'Unknown'}</h3>
          <p className="text-gray-600 text-sm">ID: {patient.sukra_id || 'N/A'}</p>
        </div>
        {getStatusBadge(patient.report_status)}
      </div>
      
      <div className="mt-3 space-y-1 text-sm">
        <p><span className="font-medium">Branch:</span> {patient.facility?.branch_name || 'Unknown'}</p>
        <p><span className="font-medium">Appointment:</span> {formatAppointmentDate(patient.slot_start_time)}</p>
        <p><span className="font-medium">Gender:</span> {patient.profile?.gender ? patient.profile.gender.charAt(0).toUpperCase() + patient.profile.gender.slice(1) : 'Unknown'}</p>
        <p><span className="font-medium">Age:</span> {patient.profile?.age || 'Unknown'}</p>
      </div>
      
      <div className="mt-auto pt-4">
        <Button 
          onClick={handleViewReport}
          variant={patient.report_status === 'completed' ? 'secondary' : 'primary'}
          className="w-full"
        >
          {patient.report_status === 'completed' ? 'View Report' : 'Add Report'}
        </Button>
      </div>
    </Card>
  );
};

export default PatientCard;