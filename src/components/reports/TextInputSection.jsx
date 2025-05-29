import React from 'react';

const TextInputSection = ({ value, onChange, label, rows = 4, disabled = false }) => {
  return (
    <div className="form-group">
      <label className="form-label mb-2">{label}</label>
      <textarea
        className={`input min-h-24 ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={`Enter ${label.toLowerCase()}...`}
        disabled={disabled}
      />
    </div>
  );
};

export default TextInputSection;