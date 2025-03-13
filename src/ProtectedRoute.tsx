import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useSelector((state: any) => state.auth);

  if (!isAuthenticated) {
    return 
    (<Navigate to="/login" />);
  }

  if (requiredRole && role !== requiredRole) {
    return (<Navigate to="/unauthorized" />);
  }

  return <>{children}</>;
};

export default ProtectedRoute;
