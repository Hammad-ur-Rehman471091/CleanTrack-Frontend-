// App.js
// Phase 2 refactor: react-router-dom v6, ProtectedRoute, permissions config
// Phase 3 refactor: ErrorBoundary wraps every protected page

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { canAccess } from './config/permissions';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ReportIssuePage from './pages/ReportIssuePage';
import IssuesPage from './pages/IssuesPage';
import { Spinner } from './components/UI';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * ProtectedRoute — renders children only when:
 *   1. User is authenticated
 *   2. User's role is allowed to access this page (via permissions config)
 * Otherwise redirects to /auth or /dashboard accordingly.
 */
function ProtectedRoute({ pageKey, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (pageKey && !canAccess(user.role, pageKey)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Shared layout wrapper for authenticated pages
function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/auth"
        element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />}
      />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute pageKey="dashboard">
          <AppLayout><ErrorBoundary><DashboardPage /></ErrorBoundary></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/projects" element={
        <ProtectedRoute pageKey="projects">
          <AppLayout><ErrorBoundary><ProjectsPage /></ErrorBoundary></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/report" element={
        <ProtectedRoute pageKey="report">
          <AppLayout><ErrorBoundary><ReportIssuePage /></ErrorBoundary></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/issues" element={
        <ProtectedRoute pageKey="issues">
          <AppLayout><ErrorBoundary><IssuesPage /></ErrorBoundary></AppLayout>
        </ProtectedRoute>
      } />

      {/* Catch-all: redirect to dashboard if logged in, else auth */}
      <Route
        path="*"
        element={<Navigate to={user ? '/dashboard' : '/auth'} replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
