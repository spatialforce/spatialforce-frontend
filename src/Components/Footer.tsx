import React, { useState } from 'react';
import './footer.css'; // Ensure this is the correct path to your CSS
import FacebookIcon from '../assets/facebook.svg';
import TwitterIcon from '../assets/twitter.png';
import LinkedInIcon from '../assets/linkedin.svg';
import InstagramIcon from '../assets/instagram.svg';
import { Link } from 'react-router-dom';


const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!isValidEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // Replace with your backend API endpoint
      const response = await fetch('https://your-backend-url.com/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setMessage('Subscription failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer-section">
      <div className="footer-content">
        {/* About Us Column */}
        <div className="footer-column">
          <h3>About Us</h3>
          <p>Spatial Force is a leading provider of innovative solutions, dedicated to delivering excellence and creativity in every project.</p>
          <div className="company-info">
            <p><strong>Email:</strong> <a href="mailto:info@spatialforce.co.zw">info@spatialforce.co.zw</a></p>
            <p><strong>Phone:</strong> <a href="tel:+263717428085">+263717428085</a></p>
            <p><strong>Address:</strong>17 Longhurst Northlynne, Bulawayo</p>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
          <li> <a href="/articles-and-projects" target="_blank" rel="noopener noreferrer">
                Articles
                  </a></li>
          <li> <a href="/services2" target="_blank" rel="noopener noreferrer">
                Services
                  </a></li>
                  <li> <a href="/" target="_blank" rel="noopener noreferrer">
                Bookings
                  </a></li>
          <li> <a href="/about" target="_blank" rel="noopener noreferrer">
                About Us
                  </a></li>
            <li><a href="/contact" target="_blank" rel="noopener noreferrer">
                   Contact
                  </a></li>
          </ul>
        </div>

        {/* Newsletter Column */}
      

        {/* Follow Us Column */}
        <div className="footer-column">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={FacebookIcon} alt="Facebook" className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src={TwitterIcon} alt="Twitter" className="social-icon" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src={LinkedInIcon} alt="LinkedIn" className="social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={InstagramIcon} alt="Instagram" className="social-icon" />
            </a>
          </div>
          <p>Connect with us on social media for the latest updates and insights.</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2025 Spatialforce. All Rights Reserved.</p>
        <p>
        <a href="/terms" target="_blank" rel="noopener noreferrer">
                   Privacy Policy
                  </a> |
                             <a href="/terms" target="_blank" rel="noopener noreferrer">
                        Terms and Conditions
                  </a> 
        </p>
      </div>
    </footer>
  );
};

export default Footer;