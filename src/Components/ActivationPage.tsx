import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from './config';
import Cookies from 'js-cookie';
import './ActivationPage.css';
interface CustomLocationState {
  from?: string;
  email?: string;
  message?: string;
  showWelcomePopup?: boolean;
  activationSuccess?: boolean;
  justActivated?: boolean;
  // Add any other custom state properties you need
}
interface ActivationPageProps {
  onSuccess?: (user: any) => void;
  onError?: (error: { message: string; email?: string }) => void;
}
const ActivationPage: React.FC<ActivationPageProps> = ({ 
  onSuccess, 
  onError 
})=> {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { login, checkSession } = useAuth();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(900);
  const state = location.state as CustomLocationState;
  const [showMessage, setShowMessage] = useState(!!state?.message);
  const [resendAttempts, setResendAttempts] = useState(0); 

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email) && 
           !/[<>"'`]/.test(email) && // Basic XSS check
           email.length <= 254;
  };
  
  useEffect(() => {
    const initializeEmail = () => {
      try {
        // First try to get email from URL params
        const emailParam = searchParams.get('email');
        if (emailParam) {
          const decodedEmail = decodeURIComponent(emailParam);
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(decodedEmail)) {
            throw new Error('Invalid email format');
          }
          if (!validateEmail(decodedEmail)) {
            throw new Error('Invalid email format');
          }
          setEmail(decodedEmail.toLowerCase());
          return;
        }
  
        // Fall back to location state if no URL param
        if (location.state?.email) {
          const stateEmail = location.state.email;
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(stateEmail)) {
            throw new Error('Invalid email format');
          }
          setEmail(stateEmail.toLowerCase());
          return;
        }
  
        throw new Error('Missing email parameter');
      } catch (error) {
        console.error('Email initialization error:', error);
        // Don't navigate away - just show error
        setError('Invalid activation link. Please check your email.');
      }
    };
  
    initializeEmail();
  }, [searchParams, location.state]); // Remove `navigate` from dependencies
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate code length
    if (code.length !== 6) {
      setError('Please enter a 6-digit activation code');
      return;
    }
  
    setError('');
    setIsLoading(true);
  
    try {
      // 1. Send activation request
      const response = await fetch(`${API_BASE_URL}/activate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          code: code.replace(/\D/g, '') // Remove non-digits
        }),
        credentials: 'include'
      });
  
      // 2. Handle response errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 
          `Activation failed (${response.status})`
        );
      }
  
      // 3. Extract user data and token
      const { user, token } = await response.json();
  
      // 4. Log the user in programmatically
      await login(user, token);
  
      // 5. Close any open modals (if activation was in a modal)
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
  
      // 6. Prepare navigation state
      const navigationState: CustomLocationState = {
        showWelcomePopup: true,
        email: user.email,
        justActivated: true, // New flag to prevent premature clearing
        from: location.state?.from // Preserve original destination
      };
  
      // 7. Redirect with welcome popup state
      navigate(location.state?.from || '/', {
        state: navigationState,
        replace: true // Replace in history stack
      });
  
    } catch (err) {
      // 8. Handle errors gracefully
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Activation failed. Please try again.';
      
      setError(errorMessage);
  
      // 9. Special handling for expired codes
      if (errorMessage.includes('expired')) {
        setCountdown(0); // Force "Code expired" UI state
      }
  
      // 10. Optional: Trigger error callback if provided
      if (onError) {
        onError({ 
          message: errorMessage, 
          email 
        });
      }
  
    } finally {
      // 11. Reset loading state
      setIsLoading(false);
    }
  };
  // Update your resend handler:
const handleResend = async () => {
  setError('');
  setIsLoading(true);
  setResendAttempts(prev => prev + 1);

  try {
    const response = await fetch(`${API_BASE_URL}/resend-activation`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Request-ID': crypto.randomUUID()
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json(); 

    if (!response.ok) {
      throw new Error(data.error || 'Resend failed');
    }

    setCountdown(120);
    setError('New activation code sent! Check your email.');
  } catch (err) {
    const errorMessage = err instanceof Error ? 
      err.message : 
      'Resend failed - please try again later';
      
    setError(errorMessage);
    
    // Only show temporary error if it's a network error
    if (err instanceof TypeError) {
      setTimeout(() => setError(''), 3000);
    }
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);useEffect(() => {
    if (code.length === 6) {
      const fakeEvent = { preventDefault: () => {} };
      handleSubmit(fakeEvent as React.FormEvent);
    }
  }, [code]);



    return (
      <div className="activation-wrapper">
        {/* Notification Toast */}
        {showMessage && (
          <div className="toast">
            <div className="toast-content">
              {location.state?.message}
              <button 
                className="toast-close" 
                onClick={() => setShowMessage(false)} 
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          </div>
        )}
    
        <main className="activation-main">
          <div className="activation-header">
            <svg className="activation-icon" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
            <h1>Verify Your Account</h1>
            <p className="activation-subtitle">Enter the 6-digit code sent to:</p>
            <div className="user-email">{email}</div>
            {resendAttempts > 0 && (
              <div className="resend-counter">Resend attempt #{resendAttempts}</div>
            )}
          </div>
    
          <form className="activation-form" onSubmit={handleSubmit}>
            <div className="code-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={code}
                onChange={(e) => {
                  const cleanValue = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(cleanValue);
                }}
                placeholder="• • • • • •"
                className={`code-input ${error ? 'error' : ''}`}
                autoFocus
                disabled={isLoading}
              />
            </div>
    
            {error && (
              <div className="error-alert">
                <svg className="error-icon" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <span>{error}</span>
                {error.includes('expired') && (
                  <button 
                    type="button" 
                    className="text-button" 
                    onClick={handleResend}
                  >
                    Resend Code
                  </button>
                )}
              </div>
            )}
    
            <button
              type="submit"
              className="verify-button"
              disabled={code.length !== 6 || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : 'Verify Account'}
            </button>
          </form>
    
          <div className="activation-footer">
            <div className="countdown-timer">
              <svg className="timer-icon" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.22-13h-.06c-.4 0-.72.32-.72.72v4.72c0 .35.18.68.49.86l4.15 2.49c.34.2.78.1.98-.24.21-.34.1-.79-.25-.99l-3.87-2.3V7.72c0-.4-.32-.72-.72-.72z"/>
              </svg>
              {countdown > 0 ? (
                `Code expires in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`
              ) : 'Code expired'}
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={handleResend}
              disabled={countdown > 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="loading-icon" viewBox="0 0 24 24">
                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                  </svg>
                  Sending...
                </>
              ) : 'Resend Code'}
            </button>
          </div>
        </main>
      </div>
    );
              }

export default ActivationPage;