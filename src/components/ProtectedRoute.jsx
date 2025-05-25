import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute; 