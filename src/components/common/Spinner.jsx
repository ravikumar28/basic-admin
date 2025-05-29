import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`border-t-4 border-primary-500 border-solid rounded-full animate-spin ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default Spinner;