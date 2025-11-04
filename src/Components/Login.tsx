import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import googleLogo from '../assets/google-logo.svg';
import './Login.css';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { API_BASE_URL } from './config';


interface LoginProps {
  onClose?: () => void;
  onSignupClick: () => void;
  onForgotPasswordClick: () => void;
  initialEmail?: string;
  initialError?: string | null;
  initialMessage?: string | null;
  onSuccessfulLogin?: () => void;
  setShowLoginModal: (show: boolean) => void;
  setShowLoginWelcome: (show: boolean) => void;
  setLoginWelcomeData: (data: { email: string; method: 'email' | 'google' }) => void;
  email: string;
  method: 'email' | 'google';
}

const Login: React.FC<LoginProps> = ({
  onClose,
  onSignupClick,
  onForgotPasswordClick,
  initialEmail = '',
  initialError = null,
  initialMessage = '',
  onSuccessfulLogin,
  setShowLoginModal
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(initialError);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [message, setMessage] = useState(initialMessage);
  const [provider, setProvider] = useState<string | null>(null); 
  const providerParam = searchParams.get('provider');
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('auth_error');
    const providerParam = params.get('provider');
    const emailParam = params.get('email');
    const activationSuccess = params.get('activationSuccess');
    const activationError = params.get('activationError');
  
    const handleAuthState = () => {
      // Clean up auth tokens on any error state
      if (errorParam || activationError) {
        Cookies.remove('auth_token', { domain: 'localhost' });
        localStorage.removeItem('authState');
        axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
      }
  
      if (typeof setShowLoginModal === 'function') {
        // Handle existing account error
        if (errorParam === 'existing_account') {
          setError(`Account already exists with ${providerParam}. Please login instead.`);
          setErrorType('EXISTING_ACCOUNT');
          setShowLoginModal(true);
          //setShowSignupModal(false);
          navigate(location.pathname, { replace: true });
          return;
        }
  
        // Handle provider mismatch errors
        if (errorParam === 'existing_account_diff_provider') {
          const providerDisplay = providerParam === 'email' 
            ? 'email/password' 
            : providerParam?.replace(/_/g, ' ') || 'another method';
          setError(`This account was created with ${providerDisplay}. Please use that method.`);
          setErrorType('AUTH_PROVIDER_MISMATCH');
          if (emailParam) setEmail(emailParam);
          setShowLoginModal(true);
          return;
        }
  
        // Handle Google account not found errors
        if (errorParam === 'google_account_not_found') {
          const isEmailAccount = providerParam === 'email';
          setError(isEmailAccount
            ? 'This account uses email/password. Please sign in with your credentials.'
            : 'No account found with these Google credentials.');
          setErrorType(isEmailAccount ? 'AUTH_PROVIDER_MISMATCH' : 'GOOGLE_ACCOUNT_NOT_FOUND');
          if (emailParam) setEmail(emailParam);
          setShowLoginModal(true);
          return;
        }
  
        // Handle activation states
        if (activationSuccess) {
          setError('Account successfully activated! Please sign in.');
          setErrorType('ACTIVATION_SUCCESS');
          setShowLoginModal(true);
          return;
        }
  
        if (activationError) {
          setError(`Account activation failed: ${activationError}`);
          setErrorType('ACTIVATION_ERROR');
          setShowLoginModal(true);
          return;
        }
  
        // Handle generic authentication errors
        if (errorParam) {
          setError('Authentication service unavailable. Please try again.');
          setErrorType('GENERIC_ERROR');
          setShowLoginModal(true);
        }
      }
  
      // Clean URL parameters while preserving modal state
      if (errorParam || activationSuccess || activationError) {
        navigate(location.pathname, {
          replace: true,
          state: {
            ...(location.state || {}),
            showLoginModal: true,
            authError: errorParam,
            provider: providerParam,
            email: emailParam,
            activationSuccess,
            activationError
          }
        });
      }
    };
  
    handleAuthState();
  }, [
    location.search,
    location.pathname,
    location.state,
    navigate,
    API_BASE_URL,
    setShowLoginModal
  ]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setErrorType(null);
    setProvider(null);
  
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(),
          password: password
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Handle provider mismatch
        if (data.code === 'AUTH_PROVIDER_MISMATCH') {
          setError(`Account was created with ${data.provider}. Please use ${data.provider} login.`);
          setErrorType('AUTH_PROVIDER_MISMATCH');
          setErrorType(null);
          setProvider(data.provider);
          return;
        }
  
        // Handle other errors
        let errorMessage = 'Login failed. Please try again.';
        let errorType = 'GENERIC_ERROR';
        
        if (data.code === 'INVALID_CREDENTIALS') {
          errorMessage = 'Invalid email or password';
          errorType = 'INVALID_CREDENTIALS';
        } else if (data.code === 'ACCOUNT_INACTIVE') {
          errorMessage = 'Account not activated. Please check your email.';
          errorType = 'ACCOUNT_INACTIVE';
        } else if (data.error) {
          errorMessage = data.error;
        }
  
        setError(errorMessage);
        setErrorType(errorType);
        throw new Error(errorMessage);
      }
  
      // Handle successful login
      const authToken = data.token;
      if (!authToken) {
        throw new Error('Authentication failed. Please try again.');
      }
  
      login({
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        authProvider: data.user.auth_provider,
        isActive: data.user.is_active,
        token: authToken
      }, authToken);
      navigate(`/welcome?email=${encodeURIComponent(data.user.email)}&method=email`);
  
      Cookies.set('auth_token', authToken, {
        domain: 'localhost',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: 7
      });
      setTimeout(() => {
        if (onClose) onClose();
        if (onSuccessfulLogin) onSuccessfulLogin();
      }, 100);
       
    
 

    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      let errorType = 'GENERIC_ERROR';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        if (err.message.includes('invalid') || err.message.includes('credentials')) {
          errorMessage = 'Invalid email or password';
          errorType = 'INVALID_CREDENTIALS';
        }
      }
  
      setError(errorMessage);
      setErrorType(errorType);
      
      if (typeof setShowLoginModal === 'function') {
        setShowLoginModal(true);
      }
      
      // Cleanup on error
      Cookies.remove('auth_token', { domain: 'localhost' });
      localStorage.removeItem('authState');
      axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
  
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendActivation = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }

    setIsResending(true);
    setError(null);
    setErrorType(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-activation`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('auth_token')}` 
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to resend email');
      setMessage('Activation email resent. Please check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend activation');
    } finally {
      setIsResending(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = () => {
    const redirectUrl = encodeURIComponent(
      `${window.location.origin}${location.pathname}`
    );
    window.location.href = `${API_BASE_URL}/auth/google?redirect_uri=${redirectUrl}`;
  };

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = new URLSearchParams(window.location.search).get('token');
      
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/session`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.authenticated) {
            const userData = response.data.user;
            login({
              ...userData,
              token,
              authProvider: 'google'
            }, token);

            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
            
            if (typeof setShowLoginModal === 'function') {
              setShowLoginModal(false);
            }
            if (onClose) onClose();
            if (onSuccessfulLogin) onSuccessfulLogin();
          }
        } catch (error) {
          console.error('Google login failed:', error);
          setError('Google authentication failed');
          Cookies.remove('auth_token');
          if (typeof setShowLoginModal === 'function') {
            setShowLoginModal(true);
          }
        }
      }
    };

    handleOAuthCallback();
  }, [location.search, login, onClose, onSuccessfulLogin, navigate, setShowLoginModal]);

  // Session validation
  useEffect(() => {
    const validateSession = async () => {
      try {
        const token = Cookies.get('auth_token');
        if (!token) {
          Cookies.remove('auth_token', { domain: 'localhost' });
          return;
        }
  
        const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
  
        if (!response.ok) {
          Cookies.remove('auth_token', { domain: 'localhost' });
          return;
        }
  
        const { user } = await response.json();
        login(user, token);
      } catch (error) {
        Cookies.remove('auth_token', { domain: 'localhost' });
      }
    };

    validateSession();
    const interval = setInterval(validateSession, 300000);
    return () => clearInterval(interval);
  }, [login]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Cookies.remove('auth_token', { domain: 'localhost' });
      localStorage.removeItem('authState');
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Login | Spatial Force</title>
        <meta name="description" content="Sign in to your account" />
      </Helmet>

      <div className="login-modal">
        <div className="login-content">
          {onClose && (
            <button 
              className="close-button" 
              onClick={onClose} 
              aria-label="Close"
              disabled={isLoading}
            >
              {/* Close button SVG */}
            </button>
          )}

          <form onSubmit={handleSubmit} className="login-form">
          
            <h2>Welcome Back</h2>
            <p className="login-subtitle">Sign in to continue</p>

            {(error || message) && (
              <div className={`auth-message ${error ? 'error' : 'success'} ${errorType || ''}`}>
                {error || message}
                {error?.includes('not active') && (
                  <button
                    type="button"
                    className="text-link"
                    onClick={handleResendActivation}
                    disabled={isResending}
                  >
                    {isResending ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Resend Email'}
                  </button>
                )}
                {errorType === 'AUTH_PROVIDER_MISMATCH'}
              </div>
            )}


{error && (
  <div className={`auth-error ${errorType}`}>
    <div className="error-content">
      <div className="error-message">{error}</div>
      
      {(errorType === 'AUTH_PROVIDER_MISMATCH' || errorType === 'GOOGLE_ACCOUNT_NOT_FOUND') && (
        <div className="error-actions">
          {errorType === 'AUTH_PROVIDER_MISMATCH' && providerParam === 'email'}
          
          {errorType === 'GOOGLE_ACCOUNT_NOT_FOUND'}
        </div>
      )}
    </div>
  </div>
)}
             {onClose && (
  <button 
    className="close-button" 
    onClick={onClose} 
    aria-label="Close"
    disabled={isLoading}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
        fill="currentColor"
      />
    </svg>
  </button>
)}
            <div className="oauth-buttons">
              <button
                type="button"
                className="oauth-button google-button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <img src={googleLogo} alt="Google" className="oauth-logo" />
                Continue with Google
              </button>
            </div>

            <div className="separator">
              <span>or</span>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="login-footer">
              <button
                type="button"
                className="text-link"
                onClick={onForgotPasswordClick}
                disabled={isLoading}
              >
                Forgot password?
              </button>
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="text-link"
                  onClick={onSignupClick}
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;