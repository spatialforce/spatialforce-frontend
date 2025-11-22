import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { API_BASE_URL } from './config';

interface LoginProps {
  onClose?: () => void;
  onSignupClick: () => void;
  onForgotPasswordClick: () => void;
  initialEmail?: string;
  initialError?: string | null;
  initialMessage?: string | null;
  onSuccessfulLogin?: () => void;
  setShowLoginModal?: (show: boolean) => void;
  setShowLoginWelcome?: (show: boolean) => void;
  setLoginWelcomeData?: (data: { email: string; method: 'email' | 'google' }) => void;
  email?: string;
  method?: 'email' | 'google';
}

const Login: React.FC<LoginProps> = ({
  onSignupClick,
  onForgotPasswordClick,
  initialEmail = '',
  initialError = null,
  initialMessage = '',
  onSuccessfulLogin
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

  const googleLogo = "/images/google-logo.svg";

  // Handle auth_error / activation params on the URL, as a page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('auth_error');
    const providerParam = params.get('provider');
    const emailParam = params.get('email');
    const activationSuccess = params.get('activationSuccess');
    const activationError = params.get('activationError');
  
    if (errorParam === 'existing_account') {
      setError(`Account already exists with ${providerParam}. Please login instead.`);
      setErrorType('EXISTING_ACCOUNT');
      if (emailParam) setEmail(emailParam);
      navigate(location.pathname, { replace: true });
      return;
    }
  
    if (errorParam === 'existing_account_diff_provider') {
      const providerDisplay = providerParam === 'email'
        ? 'email/password'
        : providerParam?.replace(/_/g, ' ') || 'another method';
      setError(`This account was created with ${providerDisplay}. Please use that method.`);
      setErrorType('AUTH_PROVIDER_MISMATCH');
      if (emailParam) setEmail(emailParam);
      navigate(location.pathname, { replace: true });
      return;
    }
  
    if (errorParam === 'google_account_not_found') {
      const isEmailAccount = providerParam === 'email';
      setError(
        isEmailAccount
          ? 'This account uses email/password. Please sign in with your credentials.'
          : 'No account found with these Google credentials.'
      );
      setErrorType(isEmailAccount ? 'AUTH_PROVIDER_MISMATCH' : 'GOOGLE_ACCOUNT_NOT_FOUND');
      if (emailParam) setEmail(emailParam);
      navigate(location.pathname, { replace: true });
      return;
    }
  
    if (activationSuccess) {
      setError('Account successfully activated! Please sign in.');
      setErrorType('ACTIVATION_SUCCESS');
      navigate(location.pathname, { replace: true });
      return;
    }
  
    if (activationError) {
      setError(`Account activation failed: ${activationError}`);
      setErrorType('ACTIVATION_ERROR');
      navigate(location.pathname, { replace: true });
      return;
    }
  
    if (errorParam) {
      setError('Authentication service unavailable. Please try again.');
      setErrorType('GENERIC_ERROR');
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);
  

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
        if (data.code === 'AUTH_PROVIDER_MISMATCH') {
          setError(`Account was created with ${data.provider}. Please use ${data.provider} login.`);
          setErrorType('AUTH_PROVIDER_MISMATCH');
          setProvider(data.provider);
          return;
        }

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

    
      if (!data.user) {
        throw new Error('Authentication failed. Please try again.');
      }
      
      await login(
        {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          authProvider: data.user.auth_provider,
          isActive: data.user.is_active,
          token: null // optional, not used for auth
        },
        '' // token not needed anymore
      );
      
      // no Cookies.set('auth_token', ...) here
      // server has already set the HttpOnly cookie
      navigate(`/welcome?email=${encodeURIComponent(data.user.email)}&method=email`);
      
      if (onSuccessfulLogin) {
        onSuccessfulLogin();
      }
      
      // As a page: just go to welcome screen
      navigate(`/welcome?email=${encodeURIComponent(data.user.email)}&method=email`);

      if (onSuccessfulLogin) {
        onSuccessfulLogin();
      }

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
          'Content-Type': 'application/json'
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

  return (
    <>
      <Helmet>
        <title>Login | Spatial Force</title>
        <meta name="description" content="Sign in to your account" />
      </Helmet>

      {/* As a page now */}
      <div className="login-page">
        <div className="login-content">
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

            <div className="oauth-buttons">
              <button
                type="button"
                className="oauth-button google-button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <img 
                  src={googleLogo} 
                  alt="Google" 
                  className="oauth-logo" 
                  width="20"
                  height="20"
                  loading="lazy"
                />
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
