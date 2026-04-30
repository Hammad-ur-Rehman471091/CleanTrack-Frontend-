import React from 'react';

export function Button({ children, onClick, type = 'button', disabled, variant = 'primary', className = '' }) {
  const variants = {
    primary:   'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
    secondary: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-50',
    danger:    'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
    ghost:     'text-blue-600 hover:bg-blue-50 disabled:opacity-50',
    outline:   'border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
