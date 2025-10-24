// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;
  
  const variants = {
    primary: `
      bg-indigo-600 text-white 
      hover:bg-indigo-700 
      focus:ring-indigo-500 
      active:bg-indigo-800
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-white text-gray-900 border border-gray-300
      hover:bg-gray-50 hover:border-gray-400
      focus:ring-gray-500
      active:bg-gray-100
      shadow-sm hover:shadow-md
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700 
      focus:ring-red-500
      active:bg-red-800
      shadow-sm hover:shadow-md
    `,
    ghost: `
      bg-transparent text-gray-600
      hover:bg-gray-100
      focus:ring-gray-500
      active:bg-gray-200
    `,
    success: `
      bg-green-600 text-white
      hover:bg-green-700
      focus:ring-green-500
      active:bg-green-800
      shadow-sm hover:shadow-md
    `
  };

  const sizes = {
    small: 'px-3 py-2 text-sm gap-1.5',
    medium: 'px-4 py-3 text-sm gap-2',
    large: 'px-6 py-3.5 text-base gap-2.5'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  const classes = `
    ${baseClasses} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${widthClass}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button 
      className={classes} 
      disabled={disabled || loading} 
      {...props}
    >
      {loading && (
        <svg 
          className={`animate-spin ${iconSizes[size]}`} 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {!loading && leftIcon && (
        <span className={iconSizes[size]}>{leftIcon}</span>
      )}
      
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
      
      {!loading && rightIcon && (
        <span className={iconSizes[size]}>{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
