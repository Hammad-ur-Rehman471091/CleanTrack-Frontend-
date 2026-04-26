// components/ui/Button.js
// Extracted from UI.js (Phase 1 refactor)

import React from 'react';

export function Button({ children, onClick, type = 'button', disabled, variant = 'primary', className = '' }) {
  const variants = {
    primary:   'bg-violet-600 text-white hover:bg-violet-700 disabled:bg-violet-300',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50',
    danger:    'bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-300',
    ghost:     'text-slate-600 hover:bg-slate-100 disabled:opacity-50',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
