// src/components/ui/Loader.jsx
import React from 'react';

const Loader = ({ size = 'medium' }) => {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 ${sizes[size]}`}></div>
    </div>
  );
};

export default Loader;
