import React from 'react';

export function StatusBadge({ status }) {
  const map = {
    open:        'bg-red-50 text-red-600 border border-red-200',
    in_progress: 'bg-blue-50 text-blue-600 border border-blue-200',
    resolved:    'bg-green-50 text-green-600 border border-green-200',
  };
  const label = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {label[status] || status}
    </span>
  );
}

export function RoleBadge({ role }) {
  const map = {
    manager:   'bg-blue-100 text-blue-700 border border-blue-200',
    tester:    'bg-sky-100 text-sky-700 border border-sky-200',
    developer: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[role] || ''}`}>
      {role}
    </span>
  );
}
