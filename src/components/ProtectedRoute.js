// components/ProtectedRoute.js
// Phase 2 refactor: route guard extracted from App.js inline logic
// Redirects to /login if not authenticated, or to /dashboard if role is not allowed.

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccess } from '../config/permissions';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full w-10 h-10 border-2 border-slate-200 border-t-violet-600" />
      </div>
    );
  }

  // Not logged in → send to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but role doesn't allow this route → send to dashboard
  if (!canAccess(user.role, location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
