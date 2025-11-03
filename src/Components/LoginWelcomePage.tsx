import { useEffect } from 'react';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './LoginWelcomePage.css'; // Create this CSS file

const LoginWelcomePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const email = searchParams.get('email') || '';
  const method = searchParams.get('method') || 'email';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/'); // Redirect to home after 5 seconds
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="login-welcome-page">
      <div className="welcome-card">
        <FontAwesomeIcon 
          icon={faCheckCircle} 
          className="success-icon" 
          size="3x" 
        />
        <h1>Welcome To Spatial Force !</h1>
        <div className="user-details">
          <p>Logged in as: <strong>{email}</strong></p>
          <p>Authentication method: {method === 'google' ? 'Google' : 'Email'}</p>
        </div>
        <p className="redirect-message">
          Redirecting to homepage in 5 seconds...
        </p>
        <button
          className="go-home-button"
          onClick={() => navigate('/')}
        >
          Go to Home Now
        </button>
      </div>
    </div>
  );
};

export default LoginWelcomePage;