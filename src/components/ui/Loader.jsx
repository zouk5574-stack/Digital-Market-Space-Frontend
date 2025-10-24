// src/components/ui/Loader.jsx
import React from 'react';

const Loader = ({ 
  size = 'medium', 
  color = 'indigo',
  className = '' 
}) => {
  const sizes = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4'
  };

  const colors = {
    indigo: 'border-gray-200 border-t-indigo-600',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-gray-600'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`
          animate-spin rounded-full
          ${sizes[size]} 
          ${colors[color]}
        `}
      ></div>
    </div>
  );
};

export default Loader;
