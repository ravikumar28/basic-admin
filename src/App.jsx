import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LoginPage from './pages/LoginPage';
import PatientsPage from './pages/PatientsPage';
import ReportPage from './pages/ReportPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/DashboardPage';

// Components
import Layout from './components/layout/Layout';

// Context providers
import { AuthProvider } from './contexts/AuthContext';
import { PatientProvider } from './contexts/PatientContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <PatientProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            <Route 
              path="/patients" 
              element={
                <ProtectedRoute>
                  <PatientsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/report/:patientId" 
              element={
                <ProtectedRoute>
                  <ReportPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PatientProvider>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;