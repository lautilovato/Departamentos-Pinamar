import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = apiService.auth.isAuthenticated();

  if (!isAuthenticated) {
    // Redirigir al login, guardando la ubicación actual
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;