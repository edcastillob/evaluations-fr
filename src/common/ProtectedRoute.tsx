import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}'); 

  const userRole = user.role;
  const hasAccess = userRole && allowedRoles.includes(userRole);

  const location = useLocation();

  return hasAccess ? (
    element
  ) : (
    <Navigate to="/home" state={{ from: location }} />
  );
};

export default ProtectedRoute;
