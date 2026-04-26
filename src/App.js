// App.js
// Main app shell — uses simple state-based routing (no react-router)
// TODO (refactor): replace state-based navigation with react-router-dom
// TODO (refactor): add route guards as HOC or wrapper components
// TODO (refactor): add loading skeleton screens

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ReportIssuePage from './pages/ReportIssuePage';
import IssuesPage from './pages/IssuesPage';

// Inner app that has access to auth context
function AppInner() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full w-10 h-10 border-2 border-slate-200 border-t-violet-600" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Role-page guard: redirect to dashboard if user navigates to a forbidden page
  // TODO (refactor): centralize page access rules in a permissions config object
  const allowedPages = {
    manager: ['dashboard', 'projects', 'issues'],
    tester: ['dashboard', 'report', 'issues'],
    developer: ['dashboard', 'issues'],
  };

  const safePage = allowedPages[user.role]?.includes(currentPage)
    ? currentPage
    : 'dashboard';

  const renderPage = () => {
    switch (safePage) {
      case 'dashboard':
        return <DashboardPage setCurrentPage={setCurrentPage} />;
      case 'projects':
        return <ProjectsPage />;
      case 'report':
        return <ReportIssuePage setCurrentPage={setCurrentPage} />;
      case 'issues':
        return <IssuesPage />;
      default:
        return <DashboardPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navbar currentPage={safePage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
