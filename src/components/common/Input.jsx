import React from 'react';

const Input = ({ 
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder = '',
  required = false,
  className = '',
  disabled = false,
  ...rest
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`input ${error ? 'border-red-500' : ''} ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''} ${className}`}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;