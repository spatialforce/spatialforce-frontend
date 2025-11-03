import React from 'react';
import { Link } from 'react-router-dom';
import './Footernote.css'; // Import the CSS for styling

const FooterNote = () => {
  return (
    <div className="footer-note">
      <span>© 2025 SpatialForce. All rights reserved.</span>
      <span>
      <a href="/privacy" target="_blank" rel="noopener noreferrer">
                   Privacy Policy
                  </a>
        <a href="/terms" target="_blank" rel="noopener noreferrer">
                   Terms and Conditions 
                  </a>
      </span>
    </div>
  );
};

export default FooterNote;