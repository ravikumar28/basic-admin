import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  className = '',
  disabled = false,
  onClick,
  ...rest 
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;