import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  return (
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
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;