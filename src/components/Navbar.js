// components/Navbar.js
// Phase 2 refactor:
//   - setCurrentPage prop replaced with react-router NavLink
//   - nav item config sourced from config/navConfig.js

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from './UI';

// SVG icons (unchanged)
const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconFolder = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
  </svg>
);
const IconBug = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2l1.88 1.88"/><path d="M14.12 3.88L16 2"/><path d="M9 7.13v-1a3.003 3.003 0 016 0v1"/>
    <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 014-4h4a4 4 0 014 4v3c0 3.3-2.7 6-6 6z"/>
    <path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/>
    <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconClipboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  </svg>
);
const IconWrench = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
);

// Nav items config per role — paths match react-router routes
const NAV_CONFIG = {
  manager:   [
    { path: '/dashboard', label: 'Dashboard',  Icon: IconDashboard },
    { path: '/projects',  label: 'Projects',   Icon: IconFolder    },
    { path: '/issues',    label: 'All Issues', Icon: IconBug       },
  ],
  tester:    [
    { path: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
    { path: '/report',    label: 'Report Bug', Icon: IconPlus      },
    { path: '/issues',    label: 'My Reports', Icon: IconClipboard },
  ],
  developer: [
    { path: '/dashboard', label: 'Dashboard',       Icon: IconDashboard },
    { path: '/issues',    label: 'Assigned Issues', Icon: IconWrench    },
  ],
};

function Navbar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const items            = NAV_CONFIG[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-200 flex flex-col">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">CT</div>
          <span className="font-bold text-slate-800 text-lg">CleanTrack</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
               ${isActive ? 'bg-violet-50 text-violet-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`
            }
          >
            <item.Icon />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-100">
        <div className="mb-3">
          <div className="text-sm font-semibold text-slate-800 truncate">{user?.name}</div>
          <div className="text-xs text-slate-500 truncate mb-1">{user?.email}</div>
          <RoleBadge role={user?.role} />
        </div>
        <button onClick={handleLogout}
          className="w-full text-left text-xs text-slate-500 hover:text-rose-600 transition-colors py-1">
          Sign out →
        </button>
      </div>
    </aside>
  );
}

export default Navbar;
