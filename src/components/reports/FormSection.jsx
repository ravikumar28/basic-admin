import React from 'react';

const FormSection = ({ children }) => {
  return (
    <div className="py-2 border-t border-gray-100">
      <div className="grid grid-cols-1 gap-6">
        {children}
      </div>
    </div>
  );
};

export default FormSection;