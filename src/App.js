import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { canAccess } from './config/permissions';
import Navbar        from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { Spinner }   from './components/UI';

import AuthPage        from './pages/AuthPage';
import DashboardPage   from './pages/DashboardPage';
import TeamsPage       from './pages/TeamsPage';
import ProjectsPage    from './pages/ProjectsPage';
import ReportIssuePage from './pages/ReportIssuePage';
import IssuesPage      from './pages/IssuesPage';

function ProtectedRoute({ pageKey, children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <Spinner size="lg" />
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  if (pageKey && !canAccess(user.role, pageKey)) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-blue-50">
      <Navbar />
      <main className="flex-1 p-7 overflow-y-auto">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <Spinner size="lg" />
    </div>
  );

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute pageKey="dashboard">
          <AppLayout><ErrorBoundary><DashboardPage /></ErrorBoundary></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/teams" element={
        <ProtectedRoute pageKey="teams">
          <AppLayout><ErrorBoundary><TeamsPage /></ErrorBoundary></AppLayout>
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

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/auth'} replace />} />
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
