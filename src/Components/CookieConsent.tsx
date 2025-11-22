import React, { useEffect, useState } from "react";
import "./CookieConsent.css";

const COOKIE_KEY = "sf_cookie_consent"; // stored in localStorage

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true
    }));
    setVisible(false);
  };

  const declineAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false
    }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="sf-cookie-banner">
      <div className="sf-cookie-text">
        <h4>We use cookies</h4>
        <p>
          SpatialForce uses essential cookies to make the site work, 
          and optional analytics cookies to improve your experience. 
          You can accept or decline them.
        </p>
      </div>

      <div className="sf-cookie-actions">
        <button className="sf-btn decline" onClick={declineAll}>
          Decline
        </button>
        <button className="sf-btn accept" onClick={acceptAll}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
