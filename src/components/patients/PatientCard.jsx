import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import PDFModal from '../common/PDFModal';

const PatientCard = ({ patient }) => {
  let bloodReport = null;
  if (patient.report_urls) {
    bloodReport = patient.report_urls.find(report => report.report_type === 'bloodReport');
  }

  const navigate = useNavigate();
  const [isPDFModalOpen, setPDFModalOpen] = useState(false);

  const getOverallStatus = () => {
    const dexaStatus = patient.dexaReport?.report_status;
    const hasBloodReport = !!bloodReport?.report_url;
    
    if (dexaStatus === 'published' && hasBloodReport) {
      return { text: 'Completed', class: 'bg-green-100 text-green-800' };
    }
    if (dexaStatus || hasBloodReport) {
      return { text: 'In Progress', class: 'bg-yellow-50 text-yellow-800' };
    }
    return { text: 'Not Started', class: 'bg-gray-100 text-gray-700' };
  };

  const getBloodButtonStyle = () => {
    if (bloodReport?.report_url) {
      return 'bg-green-100 hover:bg-green-200 text-green-800';
    }
    return 'bg-gray-50 hover:bg-gray-100 text-gray-600';
  };

  const getDexaButtonStyle = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 hover:bg-green-200 text-green-800';
      case 'submitted':
        return 'bg-yellow-50 hover:bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-50 hover:bg-gray-100 text-gray-600';
    }
  };

  const status = getOverallStatus();

  return (
    <Card className="border-t-[3px] border-primary-500 p-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{patient.profile?.name || 'Unknown'}</h3>
          <p className="text-sm text-gray-600">ID: {patient.sukra_id || 'N/A'}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${status.class}`}>
          {status.text}
        </span>
      </div>

      <div className="text-sm space-y-0.5 mb-3">
        <p>Branch: {patient.facility?.branch_name || 'Unknown'}</p>
        <p>Appt: {patient.slot_start_time}</p>
        <p>
          Age: {patient.profile?.age || '-'}
          <span className="ml-3">Sex: {patient.profile?.gender || '-'}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => bloodReport?.report_url && setPDFModalOpen(true)}
          className={`py-1.5 px-3 rounded text-sm font-medium ${getBloodButtonStyle()}`}
          disabled={!bloodReport?.report_url}
        >
          Blood Report
        </button>
        <button
          onClick={() => navigate(`/report/${patient.id}`)}
          className={`py-1.5 px-3 rounded text-sm font-medium ${getDexaButtonStyle(patient.dexaReport?.report_status)}`}
        >
          DEXA Report
        </button>
      </div>

      <PDFModal
        isOpen={isPDFModalOpen}
        onClose={() => setPDFModalOpen(false)}
        pdfUrl={bloodReport?.report_url}
      />
    </Card>
  );
};

export default PatientCard;