import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResetPassword.css';
import { API_BASE_URL } from './config';
import { FaCheckCircle, FaTimesCircle,  FaKey, FaEnvelope ,FaEye,FaEyeSlash} from 'react-icons/fa';

interface LocationState {
  email: string;
}

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSameAsOld, setIsSameAsOld] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });


  const handleResendCode = async () => {
    setResendError('');
    setResendSuccess(false);
    setResendLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/resend-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to resend code');
      
      setResendSuccess(true);
      setCooldown(60); // 60 second cooldown
      startCooldownTimer();
    } catch (err) {
      setResendError(err instanceof Error ? err.message : 'Resend failed');
    } finally {
      setResendLoading(false);
    }
  };

  // Cooldown timer
  const startCooldownTimer = () => {
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) clearInterval(timer);
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!location.state?.email) {
      navigate('/forgot-password');
    } else {
      setEmail((location.state as LocationState).email);
    }
  }, [location.state, navigate]);

  const validatePassword = (password: string) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

useEffect(() => {
  const checkPasswordSimilarity = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/check-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: newPassword }),
      });
      
      const data = await response.json();
      setIsSameAsOld(data.isSame);
    } catch (error) {
      console.error('Password check failed:', error);
    }
  };

  if (newPassword) {
    checkPasswordSimilarity();
  }
}, [newPassword, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    const valid = Object.values(passwordValidation).every(Boolean);
    if (!valid) {
      setError('Password does not meet requirements');
      return;
    }

    if (isSameAsOld) {
      setError('New password cannot be the same as old password');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({ email, code, newPassword }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Handle specific error message from server
        const errorMessage = data.error.includes('same as old password')
          ? 'New password cannot be the same as your current password'
          : 'Password reset failed';
        
        throw new Error(errorMessage);
      }
  
      navigate('/', {
        state: { 
          showLoginModal: true,
          message: 'Password reset successfully! Please login with your new password.'
        },
        replace: true
      });
  
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="messages-container">
  {error && (
    <div className="alert error">
      <FaTimesCircle />
      {error}
    </div>
  )}
  {message && (
    <div className="alert success">
      <FaCheckCircle />
      {message}
    </div>
  )}
  {resendError && (
    <div className="alert error">
      <FaTimesCircle />
      {resendError}
    </div>
  )}
  {resendSuccess && (
    <div className="alert success">
      <FaCheckCircle />
      New code sent!
    </div>
  )}
</div>

      <div className="reset-password-container">
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <div className="auth-header">
            <h2>Reset Password</h2>
            <p>Enter verification code sent to {email}</p>
          </div>
  
          {/* Input Fields */}
          <div className="input-group">
           
            <div className="input-wrapper">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6-digit code"
              />
              <FaKey className="input-icon" />
            </div>
          </div>
  
          <div className="input-group">
  <div className="input-wrapper">
    <input
      type={showNewPassword ? "text" : "password"}
      value={newPassword}
      onChange={(e) => {
        setNewPassword(e.target.value);
        validatePassword(e.target.value);
      }}
      placeholder="New password"
    />
    {showNewPassword ? (
      <FaEyeSlash 
        className="password-toggle"
        onClick={() => setShowNewPassword(!showNewPassword)}
      />
    ) : (
      <FaEye
        className="password-toggle"
        onClick={() => setShowNewPassword(!showNewPassword)}
      />
    )}
  </div>
</div>
          <div className="input-group">
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
              {showConfirmPassword ? (
                <FaEyeSlash 
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              ) : (
                <FaEye
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}
            </div>
          </div>
  
          {/* Password Requirements */}
          <div className="password-requirements">
            <ul>
              {Object.entries(passwordValidation).map(([key, isValid]) => (
                <li key={key} className={isValid ? 'valid' : ''}>
                  {isValid ? <FaCheckCircle size={12} /> : <FaTimesCircle size={12} />}
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </li>
              ))}
              <li className={!isSameAsOld ? 'valid' : ''}>
                {!isSameAsOld ? <FaCheckCircle size={12} /> : <FaTimesCircle size={12} />}
                different from old
              </li>
            </ul>
          </div>
  
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Reset Password'}
          </button>
  
          <div className="resend-code-section">
            <button
              type="button"
              className="text-link"
              onClick={handleResendCode}
              disabled={resendLoading || cooldown > 0}
            >
              {resendLoading ? 'Sending...' : cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
              }

export default ResetPasswordPage;