import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';
import './OAuthSuccess.css';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles?: string[];
}

const OAuthSuccess: React.FC = () => {
  const { setUser, setAuthError, setShowLoginModal } = useAuth();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAndLogin = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check for error in URL params first
        const errorParam = searchParams.get('error');
        if (errorParam) {
          throw new Error(errorParam);
        }

        // Get tokens from URL params or cookies
        const accessToken = searchParams.get('access_token') || Cookies.get('accessToken');
        const refreshToken = searchParams.get('refresh_token') || Cookies.get('refreshToken');

        if (!accessToken || !refreshToken) {
          throw new Error('Missing authentication tokens');
        }

        // Verify tokens with backend
        const response = await fetch('/api/auth/verify-oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          credentials: 'include',
          body: JSON.stringify({ refreshToken })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Token verification failed');
        }

        const data = await response.json();
        
        // Update auth context
        setUser({
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          roles: data.user.roles || [],
          isAuthenticated: true
        });

        // Store tokens securely
        const cookieOptions = {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' as const,
          httpOnly: false
        };

        Cookies.set('accessToken', data.accessToken, { 
          ...cookieOptions,
          expires: 1 / 24 // 1 hour
        });

        Cookies.set('refreshToken', data.refreshToken, {
          ...cookieOptions,
          expires: 7 // 7 days
        });

        // Clear URL tokens if they existed
        if (searchParams.get('access_token')) {
          window.history.replaceState({}, '', window.location.pathname);
        }

        // Check if this is a signup (Google registration)
        const isSignup = searchParams.get('signup') === 'true';
        if (isSignup) {
          // Navigate to home with welcome state
          navigate('/', {
            state: {
              showWelcomePopup: true,
              email: data.user.email,
              justActivated: true,
              from: location.state?.from || '/'
            },
            replace: true
          });
        }

      } catch (error) {
        console.error('OAuth verification failed:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        
        // Clear invalid tokens
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        
        // Show error in login modal instead of redirecting
        setAuthError(error instanceof Error ? error.message : 'OAuth login failed');
        setShowLoginModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAndLogin();

    return () => {
      // Cleanup if needed
    };
  }, [setUser, searchParams, setAuthError, setShowLoginModal, navigate, location.state]);

  return (
    <div className="oauth-success-container">
      <div className="oauth-success-content">
        {isLoading ? (
          <>
            <h2>Completing Your Login</h2>
            <div className="spinner"></div>
            <p>Please wait while we verify your account...</p>
          </>
        ) : error ? (
          <>
            <h2>Login Failed</h2>
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            <p>You can try again through the login modal.</p>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default OAuthSuccess;