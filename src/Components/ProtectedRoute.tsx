import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement<{ state?: unknown }>;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return React.cloneElement(children, {
      state: {
        ...(children.props.state || {}),
        authRequired: true,
        from: location
      }
    });
  }

  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => 
      user?.roles?.includes(role)
    );

    if (!hasRequiredRole) {
      return React.cloneElement(children, {
        state: {
          ...(children.props.state || {}),
          error: {
            code: 403,
            message: "You don't have permission to access this page"
          }
        }
      });
    }
  }

  return children;
};

export default ProtectedRoute;