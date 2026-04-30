import React from 'react';

export function Alert({ message, type = 'error' }) {
  if (!message) return null;
  const styles = {
    error:   'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info:    'bg-blue-50 border-blue-200 text-blue-700',
  };
  return (
    <div className={`border rounded-md px-4 py-3 text-sm ${styles[type]}`}>{message}</div>
  );
}

export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div className={`animate-spin rounded-full border-2 border-blue-100 border-t-blue-600 ${sizes[size]}`} />
  );
}

export function EmptyState({ title, subtitle, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <div className="mb-4 text-blue-200">
        {icon || (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-6l-2 3H10l-2-3H2"/>
            <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
          </svg>
        )}
      </div>
      <div className="text-base font-medium text-gray-500">{title}</div>
      {subtitle && <div className="text-sm mt-1 text-gray-400">{subtitle}</div>}
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border border-blue-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
