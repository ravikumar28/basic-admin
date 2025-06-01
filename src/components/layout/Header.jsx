import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../common/Modal';

const Header = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <header className="bg-primary-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 
              className="text-xl font-bold cursor-pointer" 
              onClick={() => navigate('/')}
            >
              Vital Insights - Admin Portal
            </h1>
          </div>
          
          {currentUser && (
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                {currentUser.name || 'User'}
              </span>
              <button
                className="px-3 py-1 rounded hover:bg-primary-600 transition-colors border border-white"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        size="sm"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
          <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded"
              onClick={confirmLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;