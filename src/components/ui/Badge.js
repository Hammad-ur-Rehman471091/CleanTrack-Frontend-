// components/ui/Badge.js
// Extracted from UI.js (Phase 1 refactor)

import React from 'react';

export function StatusBadge({ status }) {
  const map = {
    open:        'bg-rose-100 text-rose-700 border border-rose-200',
    in_progress: 'bg-amber-100 text-amber-700 border border-amber-200',
    resolved:    'bg-emerald-100 text-emerald-700 border border-emerald-200',
  };
  const label = {
    open:        'Open',
    in_progress: 'In Progress',
    resolved:    'Resolved',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {label[status] || status}
    </span>
  );
}

export function RoleBadge({ role }) {
  const map = {
    manager:   'bg-violet-100 text-violet-700 border border-violet-200',
    tester:    'bg-sky-100 text-sky-700 border border-sky-200',
    developer: 'bg-teal-100 text-teal-700 border border-teal-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[role] || ''}`}>
      {role}
    </span>
  );
}
