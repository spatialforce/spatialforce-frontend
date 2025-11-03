import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import FooterNote from './Footernote';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from './config';

interface ForgotPasswordPageProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onCodeSent: (email: string) => void; // Callback for successful code sending
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ 
  onLoginClick, 
  onSignupClick,
  onCodeSent
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [lastResendTime, setLastResendTime] = useState<number | null>(null);

  const validateEmail = (email:string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) && !/[<>]/.test(email);
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      
      if (!response.ok) {
        if (data.code === 'WRONG_AUTH_PROVIDER') {
          throw new Error(
            `This account was created with ${data.provider}. ` +
            `Please use ${data.provider} to sign in.`
          );
        }
        throw new Error(data.error || 'Failed to send reset code');
      }
      if (response.ok) {
        setMessage('A 6-digit reset code has been sent to your email.');
        navigate('/reset-password', { 
          state: { 
            email: email,
            from: 'forgot-password' 
          },
          replace: true
        });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset code');
      if (err.message.includes('created with')) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }


  };
  const handleBackToLogin = () => {
    // Navigate to home route and trigger login modal
    navigate('/', { 
      state: { showLoginModal: true },
      replace: true
    });
    onLoginClick();
  };
  
  const handleSignupClick = () => {
    // Navigate to home route and trigger signup modal
    navigate('/', { 
      state: { showSignupModal: true },
      replace: true
    });
    onSignupClick();
  };


  return (
    <div className="forgot-password-page">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <div className="auth-header">
          <h2>Forgot Password?</h2>
          <p>Enter your email to receive a password reset code</p>
        </div>

        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}

        <div className="input-group">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
            disabled={isLoading}
            autoFocus
          />
        </div>

        <button 
          type="submit" 
          className="auth-button" 
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin />
              <span style={{ marginLeft: '8px' }}>Sending Code...</span>
            </>
          ) : (
            'Send Reset Code'
          )}
        </button>

        <div className="auth-footer">
          <p>
            Remember your password?{' '}
            <button
              type="button"
              className="text-link"
              onClick={handleBackToLogin}
              disabled={isLoading}
            >
              Back to Login
            </button>
          </p>
          <p>
     Don't have an account?{' '}
    <button
    type="button"
    className="text-link"
    onClick={handleSignupClick}
    disabled={isLoading}
  >
    Sign up
    </button>
    </p>
        </div>
      </form>

      <FooterNote />
    </div>
  );
};

export default ForgotPasswordPage;