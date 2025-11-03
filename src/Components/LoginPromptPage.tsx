// LoginPromptPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import './LoginPrompt.css';

const LoginPromptPage = () => {
  const navigate = useNavigate();

  const handleOpenLogin = () => {
    navigate('/', { state: { showLoginModal: true } });
  };

  const handleOpenSignup = () => {
    navigate('/', { state: { showSignupModal: true } });
  };

  return (
    <div className="login-prompt-container">
      <div className="login-prompt-card">
        <div className="prompt-header">
          <FaExclamationTriangle className="warning-icon" />
          <h1>Login Required</h1>
        </div>
        
        <div className="prompt-content">
          <p>
            To schedule a consultation or make a booking, you need to be logged in. 
            Please sign in to your account or create a new one to continue.
          </p>
          
          <div className="action-buttons">
            <button onClick={handleOpenLogin} className="login-button">
              <FaSignInAlt className="button-icon" />
              Login
            </button>
            
            <p className="signup-text">
              Don't have an account?{' '}
              <button onClick={handleOpenSignup} className="signup-link">
                <FaUserPlus className="link-icon" />
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptPage;