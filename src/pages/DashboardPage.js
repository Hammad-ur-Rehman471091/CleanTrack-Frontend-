// pages/DashboardPage.js
// Phase 2 refactor:
//   - raw fetch() replaced with useStats() custom hook
//   - navigation uses useNavigate() from react-router-dom

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StatCard, Spinner, Alert } from '../components/UI';
import { useStats } from '../hooks/useStats';

function DashboardPage() {
  const { user }              = useAuth();
  const navigate              = useNavigate();
  const { stats, loading, error } = useStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name}</h1>
        <p className="text-slate-500 mt-1 text-sm capitalize">{user?.role} Dashboard</p>
      </div>

      {error && <Alert message={error} type="error" />}

      {user?.role === 'manager' && stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Projects" value={stats.totalProjects}    color="violet" />
            <StatCard label="Total Issues"   value={stats.totalIssues}      color="slate"  />
            <StatCard label="Unassigned"     value={stats.unassigned}       color="rose"   />
            <StatCard label="Open"           value={stats.openIssues}       color="rose"   />
            <StatCard label="In Progress"    value={stats.inProgressIssues} color="amber"  />
            <StatCard label="Resolved"       value={stats.resolvedIssues}   color="emerald"/>
          </div>
          <QuickActions role="manager" navigate={navigate} />
        </>
      )}

      {user?.role === 'tester' && stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="My Reports"  value={stats.myIssues}   color="sky"    />
            <StatCard label="Open"        value={stats.openIssues} color="rose"   />
            <StatCard label="In Progress" value={stats.inProgress} color="amber"  />
            <StatCard label="Resolved"    value={stats.resolved}   color="emerald"/>
          </div>
          <QuickActions role="tester" navigate={navigate} />
        </>
      )}

      {user?.role === 'developer' && stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Assigned"    value={stats.assigned}   color="teal"   />
            <StatCard label="Open"        value={stats.open}       color="rose"   />
            <StatCard label="In Progress" value={stats.inProgress} color="amber"  />
            <StatCard label="Resolved"    value={stats.resolved}   color="emerald"/>
          </div>
          <QuickActions role="developer" navigate={navigate} />
        </>
      )}
    </div>
  );
}

// SVG icons (same as before, kept here for now)
const BugIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-violet-500 transition-colors">
    <path d="M8 2l1.88 1.88"/><path d="M14.12 3.88L16 2"/>
    <path d="M9 7.13v-1a3.003 3.003 0 016 0v1"/>
    <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 014-4h4a4 4 0 014 4v3c0 3.3-2.7 6-6 6z"/>
    <path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/>
    <path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/>
    <path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
  </svg>
);
const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-violet-500 transition-colors">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-violet-500 transition-colors">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);
const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-violet-500 transition-colors">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  </svg>
);
const WrenchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-violet-500 transition-colors">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
);

const ACTION_CONFIG = {
  manager:   [
    { label: 'View All Issues',  path: '/issues',   desc: 'See and manage every reported bug', Icon: BugIcon },
    { label: 'Manage Projects',  path: '/projects', desc: 'Create or view projects',           Icon: FolderIcon },
  ],
  tester:    [
    { label: 'Report a Bug', path: '/report',  desc: 'Submit a new bug report',    Icon: PlusIcon },
    { label: 'My Reports',   path: '/issues',  desc: 'Track bugs you reported',    Icon: ClipboardIcon },
  ],
  developer: [
    { label: 'View Assigned Issues', path: '/issues', desc: 'See your work queue', Icon: WrenchIcon },
  ],
};

function QuickActions({ role, navigate }) {
  const actions = ACTION_CONFIG[role] || [];
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {actions.map(action => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-violet-300 hover:shadow-sm transition-all text-left group"
          >
            <div className="mt-0.5"><action.Icon /></div>
            <div>
              <div className="font-medium text-slate-800 group-hover:text-violet-700 transition-colors">{action.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{action.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
