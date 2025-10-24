// src/components/ui/Input.jsx
import React from 'react';

const Input = ({ 
  label, 
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  ...props 
}) => {
  const hasIcon = leftIcon || rightIcon;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          className={`
            w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            transition-all duration-200 bg-white
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : success
                ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                : 'border-gray-300 hover:border-gray-400'
            }
            ${props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
            ${hasIcon ? (leftIcon ? 'pl-10' : 'pr-10') : ''}
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
