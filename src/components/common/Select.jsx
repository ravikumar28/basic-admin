import React from 'react';

const Select = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  error,
  placeholder = 'Select an option',
  required = false,
  className = '',
  ...rest
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`input ${error ? 'border-red-500' : ''} ${className}`}
        required={required}
        {...rest}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;