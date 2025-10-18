// src/components/ui/Input.jsx
import React from 'react';

const Input = ({ 
  label, 
  error, 
  ...props 
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          transition-all duration-200
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${props.disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
