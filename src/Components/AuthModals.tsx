import React, { useState } from 'react';
import Login from './Login';
import ForgotPassword from './ForgotPasswordPage';
import './Auth.css';

const AuthModals: React.FC = () => {
  const [activeModal, setActiveModal] = useState<
    'login' | 'signup' | 'forgot-password' | null
  >(null);

  // Debug: State tracking
  console.log('[AuthModals] Current modal state:', activeModal);

  // Unified handler with prop validation
  const handleLoginActions = {
    onClose: () => {
      console.log('[AuthModals] Closing modal');
      setActiveModal(null);
    },
    onSignupClick: () => {
      console.log('[AuthModals] Switching to signup');
      setActiveModal('signup');
    },
    onForgotPasswordClick: () => {
      console.log('[AuthModals] Initiating password reset flow');
      setActiveModal('forgot-password');
    }
  };

  return (
    <>
      <button 
        onClick={() => {
          console.log('[AuthModals] Login button clicked');
          setActiveModal('login');
        }}
        aria-label="Open login form"
      >
        Show Login
      </button>

      {activeModal === 'login' && (
        <Login
          {...handleLoginActions}
          key="login-modal" // Force re-render on state change
        />
      )}

      {activeModal === 'forgot-password' && (
        <ForgotPassword
          onClose={handleLoginActions.onClose}
          onLoginClick={() => setActiveModal('login')}
          key="forgot-password-modal"
        />
      )}
    </>
  );
};

export default AuthModals;