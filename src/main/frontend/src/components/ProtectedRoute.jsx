import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Laden...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  if (requiredRole) {
    const allowedRoles = requiredRole.split(',').map(r => r.trim());
    const hasRole = allowedRoles.some(role => user.roles?.includes(role));
    if (!hasRole) return <Navigate to="/admin" replace />;
  }

  return children;
};
