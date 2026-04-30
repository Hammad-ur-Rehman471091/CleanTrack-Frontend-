import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg border border-blue-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, color = 'default' }) {
  const colorMap = {
    default: 'bg-white text-gray-700 border-blue-100',
    blue:    'bg-blue-50 text-blue-700 border-blue-200',
    red:     'bg-red-50 text-red-700 border-red-200',
    amber:   'bg-amber-50 text-amber-700 border-amber-200',
    green:   'bg-green-50 text-green-700 border-green-200',
    indigo:  'bg-indigo-50 text-indigo-700 border-indigo-200',
    sky:     'bg-sky-50 text-sky-700 border-sky-200',
  };
  return (
    <div className={`rounded-lg border p-5 shadow-sm ${colorMap[color] || colorMap.default}`}>
      <div className="text-xs font-medium uppercase tracking-wide opacity-60 mb-2">{label}</div>
      <div className="text-3xl font-semibold">{value ?? '—'}</div>
    </div>
  );
}
