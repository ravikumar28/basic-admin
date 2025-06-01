import React from 'react';

const NetworkError = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
      <svg 
        className="w-16 h-16 text-gray-400 mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Connection Error
      </h3>
      
      <p className="text-gray-600 text-center mb-4">
        Unable to connect to the server. Please check your internet connection.
      </p>
      
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-200"
      >
        Try Again
      </button>
    </div>
  );
};

export default NetworkError; 