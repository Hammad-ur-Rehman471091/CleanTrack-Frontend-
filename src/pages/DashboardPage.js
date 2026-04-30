import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StatCard, Alert, DashboardSkeleton } from '../components/UI';
import { useStats } from '../hooks/useStats';

const IconBug = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-blue-500 transition-colors">
    <path d="M8 2l1.88 1.88"/><path d="M14.12 3.88L16 2"/>
    <path d="M9 7.13v-1a3.003 3.003 0 016 0v1"/>
    <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 014-4h4a4 4 0 014 4v3c0 3.3-2.7 6-6 6z"/>
    <path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/>
    <path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/>
    <path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
  </svg>
);
const IconTeam = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-blue-500 transition-colors">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
    <path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IconFolder = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-blue-500 transition-colors">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
  </svg>
);
const IconPlus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-blue-500 transition-colors">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);
const IconClipboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-blue-500 transition-colors">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  </svg>
);
const IconWrench = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-blue-500 transition-colors">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
);

const ACTION_CONFIG = {
  manager: [
    { label: 'Manage Teams',    path: '/teams',    desc: 'Create teams and share join codes', Icon: IconTeam    },
    { label: 'Manage Projects', path: '/projects', desc: 'Create projects inside your teams',  Icon: IconFolder  },
    { label: 'View All Issues', path: '/issues',   desc: 'See and assign reported bugs',       Icon: IconBug     },
  ],
  tester: [
    { label: 'My Teams',    path: '/teams',  desc: 'View teams you have joined',   Icon: IconTeam      },
    { label: 'Report a Bug', path: '/report', desc: 'Submit a new bug report',      Icon: IconPlus      },
    { label: 'My Reports',  path: '/issues', desc: 'Track bugs you have reported', Icon: IconClipboard },
  ],
  developer: [
    { label: 'My Teams',          path: '/teams',  desc: 'View teams you have joined', Icon: IconTeam    },
    { label: 'Assigned Issues',   path: '/issues', desc: 'See your work queue',        Icon: IconWrench  },
  ],
};

function DashboardPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const { stats, loading, error } = useStats();

  if (loading) return <DashboardSkeleton count={user?.role === 'manager' ? 6 : 4} />;

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name}</h1>
        <p className="text-gray-400 text-sm mt-0.5 capitalize">{user?.role} Dashboard</p>
      </div>

      {error && <Alert message={error} type="error" />}

      {user?.role === 'manager' && stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-7">
            <StatCard label="Teams"       value={stats.totalTeams}       color="blue"   />
            <StatCard label="Projects"    value={stats.totalProjects}    color="indigo" />
            <StatCard label="Open"        value={stats.openIssues}       color="red"    />
            <StatCard label="In Progress" value={stats.inProgressIssues} color="amber"  />
            <StatCard label="Resolved"    value={stats.resolvedIssues}   color="green"  />
            <StatCard label="Unassigned"  value={stats.unassigned}       color="sky"    />
          </div>
          <QuickActions role="manager" navigate={navigate} />
        </>
      )}

      {user?.role === 'tester' && stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
            <StatCard label="My Teams"    value={stats.myTeams}    color="blue"   />
            <StatCard label="My Reports"  value={stats.myIssues}   color="indigo" />
            <StatCard label="In Progress" value={stats.inProgress} color="amber"  />
            <StatCard label="Resolved"    value={stats.resolved}   color="green"  />
          </div>
          <QuickActions role="tester" navigate={navigate} />
        </>
      )}

      {user?.role === 'developer' && stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
            <StatCard label="My Teams"    value={stats.myTeams}    color="blue"   />
            <StatCard label="Assigned"    value={stats.assigned}   color="indigo" />
            <StatCard label="In Progress" value={stats.inProgress} color="amber"  />
            <StatCard label="Resolved"    value={stats.resolved}   color="green"  />
          </div>
          <QuickActions role="developer" navigate={navigate} />
        </>
      )}
    </div>
  );
}

function QuickActions({ role, navigate }) {
  const actions = ACTION_CONFIG[role] || [];
  return (
    <div>
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {actions.map(action => (
          <button key={action.path} onClick={() => navigate(action.path)}
            className="flex items-start gap-4 p-4 bg-white border border-blue-100 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-left group">
            <div className="mt-0.5"><action.Icon /></div>
            <div>
              <div className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-sm">{action.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{action.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
