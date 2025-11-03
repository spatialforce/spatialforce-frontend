import { useEffect } from 'react';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const OAuthCallback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if this is a success redirect from backend
        if (new URLSearchParams(location.search).has('authSuccess')) {
          // Get user data from session
          const response = await fetch('/api/auth/session', {
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.authenticated) {
              login(data.user);
              navigate('/', { replace: true });
              return;
            }
          }
        }

        // Handle error cases
        const error = new URLSearchParams(location.search).get('error');
        if (error) {
          navigate('/', {
            state: {
              shouldShowLoginModal: true,
              authError: error === 'auth_failed' 
                ? 'Google authentication failed. Please try again.'
                : 'Authentication error'
            },
            replace: true
          });
          return;
        }

        // Default case - shouldn't normally happen
        navigate('/', { replace: true });

      } catch (error) {
        navigate('/', {
          state: {
            shouldShowLoginModal: true,
            authError: 'An unexpected error occurred'
          },
          replace: true
        });
      }
    };

    verifyAuth();
  }, [navigate, login, location]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          Completing authentication...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;