import React from "react";
import './cookies.css'

const CookieConsent = ({ onAccept, onDecline }) => {
  return (
    <div className="cookie-consent">
      <div className="cookie-content">
        <h3>🍪 We Use Cookies</h3>
        <p>
          We use cookies to improve your experience, analyze traffic, 
          and serve personalized content. By continuing to use our site,
          you consent to our use of cookies.
        </p>
        <div className="cookie-buttons">
          <button onClick={onAccept} className="accept-btn">
            Accept All
          </button>
          <button onClick={onDecline} className="decline-btn">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;