import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  className = '', 
  disabled = false,
  onClick,
  variant = 'primary'
}) => {
  const baseStyles = "px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: `bg-orange-500 hover:bg-orange-600 text-white 
              disabled:bg-orange-300 disabled:cursor-not-allowed
              focus:ring-orange-200`,
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;