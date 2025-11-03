import { useEffect } from 'react';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Welcome = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Verify token with backend
      const verifyToken = async () => {
        try {
          const response = await fetch('http://localhost:5001/api/verify-token', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const userData = await response.json();
          login(userData.user, token);
          navigate('/dashboard');
        } catch (error) {
          console.error('Welcome error:', error);
          navigate('/login');
        }
      };

      verifyToken();
    } else {
      navigate('/signup');
    }
  }, [token, login, navigate]);

  return (
    <div className="welcome-page">
      <h1>Welcome to Spatial Force!</h1>
      <p>Setting up your account...</p>
    </div>
  );
};

export default Welcome;