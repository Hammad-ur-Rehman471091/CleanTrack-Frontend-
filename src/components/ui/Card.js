// components/ui/Card.js
// Extracted from UI.js (Phase 1 refactor)

import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, color = 'slate' }) {
  const colorMap = {
    slate:   'bg-slate-50 text-slate-700 border-slate-200',
    rose:    'bg-rose-50 text-rose-700 border-rose-200',
    amber:   'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    violet:  'bg-violet-50 text-violet-700 border-violet-200',
    sky:     'bg-sky-50 text-sky-700 border-sky-200',
    teal:    'bg-teal-50 text-teal-700 border-teal-200',
  };
  return (
    <div className={`rounded-xl border p-5 ${colorMap[color]}`}>
      <div className="text-sm font-medium opacity-70 mb-2">{label}</div>
      <div className="text-3xl font-bold">{value ?? '—'}</div>
    </div>
  );
}
