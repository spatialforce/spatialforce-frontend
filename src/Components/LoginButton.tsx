import React from 'react';
import { useAuth } from './AuthContext';

const LoginButton = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="auth-button-container">
      {isAuthenticated ? (
        <button className="user-email-button">
          {user?.email}
        </button>
      ) : (
        <a href="/login" className="login-button">
          Sign In
        </a>
      )}
    </div>
  );
};

export default LoginButton;