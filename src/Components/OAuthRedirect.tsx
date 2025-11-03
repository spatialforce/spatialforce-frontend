import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import React from 'react';

const OAuthRedirect = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      const params = new URLSearchParams(location.search);
      
      // Successful Google auth
      if (params.has('authSuccess')) {
        try {
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
          throw new Error('Session verification failed');
        } catch (error) {
          navigate('/', { 
            state: { 
              shouldShowLoginModal: true,
              authError: 'Failed to complete login' 
            },
            replace: true 
          });
        }
      }
      
      // Failed Google auth
      else if (params.has('error')) {
        const errorType = params.get('error');
        let errorMessage = 'Authentication error';
        
        if (errorType === 'auth_failed') {
          errorMessage = 'Google authentication failed';
        } 
        else if (errorType === 'account_exists_other_provider') {
          errorMessage = 'This account was created with another method. Please use your original login.';
        }

        navigate('/', { 
          state: { 
            shouldShowLoginModal: true,
            authError: errorMessage
          },
          replace: true 
        });
      }
      
      // Default case
      else {
        navigate('/', { replace: true });
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

export default OAuthRedirect;