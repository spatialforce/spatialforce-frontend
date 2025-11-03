import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import './WelcomePopup.css';

interface WelcomePopupProps {
  onClose: () => void;
  email?: string;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose, email }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get email from either props, location state, or URL params
  const displayEmail = email || location.state?.email || searchParams.get('email');

  // Check if we should show from URL params (Google auth) or location state (email verification)
  const shouldShow = searchParams.get('welcome') === '1' || location.state?.showWelcomePopup;

  useEffect(() => {
    if (shouldShow) {
      // Lock body scroll when popup is open
      document.body.style.overflow = 'hidden';
      
      // Trigger entrance animation
      setIsVisible(true);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      
      return () => {
        document.body.style.overflow = '';
        clearTimeout(timer);
      };
    }
  }, [shouldShow]);

  const handleClose = () => {
    // Trigger exit animation
    setIsAnimating(true);
    
    // Wait for animation to complete before closing
    setTimeout(() => {
      setIsVisible(false);
      onClose();
      
      // Clean up URL if we came from Google auth
      if (searchParams.get('welcome')) {
        navigate(location.pathname, { replace: true });
      }
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`welcome-popup-overlay ${isAnimating ? 'animating' : ''}`}
      onClick={handleClose}
    >
      <div 
        className={`welcome-popup-container ${isAnimating ? 'animating' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="welcome-popup-content">
          {/* Animated checkmark circle */}
          <div className="success-animation">
            <svg className="checkmark" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>

          <h2 className="welcome-title">Welcome to SpatialForce!</h2>
          
          <div className="welcome-message">
            <p>Your account <strong>{displayEmail}</strong> is now active.</p>
            <p>You're ready to explore our geospatial solutions!</p>
          </div>

          <div className="welcome-actions">
            <button 
              className="primary-action-button"
              onClick={handleClose}
            >
              Get Started
            </button>
            
            <div className="quick-tips">
              <h4>Quick Tips:</h4>
              <ul>
                <li>📌 Book a consultation</li>
                <li>🗺️ Explore geospatial services</li>
                <li>⚙️ read artcicles</li>
              </ul>
            </div>
          </div>

          <button 
            className="close-button"
            onClick={handleClose}
            aria-label="Close welcome popup"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;