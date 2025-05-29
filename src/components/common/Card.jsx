import React from 'react';

const Card = ({ children, className = '', ...rest }) => {
  return (
    <div className={`card ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default Card;