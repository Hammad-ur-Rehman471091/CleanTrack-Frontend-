// components/UI.js
// All small shared components lumped together intentionally (unstructured)
// TODO (refactor): split each component into its own file under components/ui/
// TODO (refactor): add a proper design token system / theme file

import React from 'react';

// Status badge with color mapping
export function StatusBadge({ status }) {
  const map = {
    open: 'bg-rose-100 text-rose-700 border border-rose-200',
    in_progress: 'bg-amber-100 text-amber-700 border border-amber-200',
    resolved: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  };
  const label = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {label[status] || status}
    </span>
  );
}

// Role badge
export function RoleBadge({ role }) {
  const map = {
    manager: 'bg-violet-100 text-violet-700 border border-violet-200',
    tester: 'bg-sky-100 text-sky-700 border border-sky-200',
    developer: 'bg-teal-100 text-teal-700 border border-teal-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[role] || ''}`}>
      {role}
    </span>
  );
}

// Simple card
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// Stat card for dashboard
export function StatCard({ label, value, color = 'slate' }) {
  const colorMap = {
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
    sky: 'bg-sky-50 text-sky-700 border-sky-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
  };
  return (
    <div className={`rounded-xl border p-5 ${colorMap[color]}`}>
      <div className="text-sm font-medium opacity-70 mb-2">{label}</div>
      <div className="text-3xl font-bold">{value ?? '—'}</div>
    </div>
  );
}

// Primary button
export function Button({ children, onClick, type = 'button', disabled, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-violet-600 text-white hover:bg-violet-700 disabled:bg-violet-300',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-300',
    ghost: 'text-slate-600 hover:bg-slate-100 disabled:opacity-50',
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

// Form input
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        className={`border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition ${error ? 'border-rose-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}

// Textarea
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <textarea
        className={`border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition resize-none ${error ? 'border-rose-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}

// Select
export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <select
        className={`border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition bg-white ${error ? 'border-rose-400' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}

// Alert / error message
export function Alert({ message, type = 'error' }) {
  if (!message) return null;
  const styles = {
    error: 'bg-rose-50 border-rose-200 text-rose-700',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    info: 'bg-sky-50 border-sky-200 text-sky-700',
  };
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
}

// Spinner
export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div className={`animate-spin rounded-full border-2 border-slate-200 border-t-violet-600 ${sizes[size]}`} />
  );
}

// Empty state — renders an SVG icon or falls back to a generic inbox icon
export function EmptyState({ title, subtitle, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <div className="mb-4 text-slate-300">
        {icon || (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-6l-2 3H10l-2-3H2"/>
            <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
          </svg>
        )}
      </div>
      <div className="text-base font-medium text-slate-500">{title}</div>
      {subtitle && <div className="text-sm mt-1">{subtitle}</div>}
    </div>
  );
}

// Modal
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
