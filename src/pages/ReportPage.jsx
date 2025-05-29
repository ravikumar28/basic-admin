import React from 'react';
import Layout from '../components/layout/Layout';
import ReportForm from '../components/reports/ReportForm';

const ReportPage = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Patient Report</h1>
        <p className="text-gray-600">Add or edit patient report details</p>
      </div>
      
      <ReportForm />
    </Layout>
  );
};

export default ReportPage;