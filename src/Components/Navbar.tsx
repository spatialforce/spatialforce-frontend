import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { HiOutlineBars3, HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { Avatar } from '@mui/material';
import UserAvatar from './UserAvatar';
import './Nav.css';

interface NavbarProps {
  onSignupClick: () => void;
  onLoginClick: () => void;
}

const getAvatarColor = (email: string): string => {
  if (!email) return '#3a7068';
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#3a7068', '#2a5550', '#f44336', '#2196f3', 
    '#9c27b0', '#ff9800', '#009688'
  ];
  return colors[Math.abs(hash) % colors.length];
};

const Navbar = ({ onSignupClick, onLoginClick }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileGeoDropdownOpen, setMobileGeoDropdownOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const [geoDropdownOpen, setGeoDropdownOpen] = useState(false);
  const geoDropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleBookNow = () => {
    isAuthenticated ? navigate('/bookings') : setShowLoginNotice(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!mobileMenuOpen) return;
      
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.mobile-menu-button')
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services2', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileMenuOpen(prev => !prev);
  };

  const toggleMobileGeoDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMobileGeoDropdownOpen(prev => !prev);
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      {showLoginNotice && (
        <div className="login-notice-popup">
          <div className="login-notice-content">
            <p>Please log in to make bookings</p>
            <div className="login-notice-buttons">
              <button onClick={() => { 
                setShowLoginNotice(false); 
                onLoginClick(); 
              }}>
                Login
              </button>
              <button onClick={() => setShowLoginNotice(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Spatial Force
        </Link>

        <div className="desktop-nav">
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${
                    location.pathname === link.path ? 'active' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            
            <li className="dropdown-container">
              <div
                className="dropdown"
                ref={geoDropdownRef}
                onMouseEnter={() => {
                  if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                  setGeoDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  closeTimeoutRef.current = setTimeout(() => {
                    setGeoDropdownOpen(false);
                  }, 200);
                }}
              >
                <button 
                  className="nav-link dropdown-toggle" 
                  aria-expanded={geoDropdownOpen}
                >
                  Geo-Solutions {geoDropdownOpen ? '▲' : '▼'}
                </button>
                <div className={`dropdown-menu ${geoDropdownOpen ? 'show' : ''}`}>
                  <Link to="/web-applications" className="dropdown-item">
                    Web Applications
                  </Link>
                  <Link to="/smartcitysolutions" className="dropdown-item">
                    Smart City Solutions
                  </Link>
                  <Link to="/gis-forest-resources-zimbabwe" className="dropdown-item">
                    Zimbabwe Gazzetted Forests
                  </Link>
                  <Link to="/Artificial-Intelligence" className="dropdown-item">
                    AI in GIS 
                  </Link>
                  <Link to="/articles-and-projects" className="dropdown-item">
                    GIS in Zimbabwe 
                  </Link>
                </div>
              </div>
            </li>
          </ul>

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <button
                  className="primary-button"
                  onClick={() => navigate('/bookings')}
                >
                  Book Now
                </button>
                <UserAvatar onSignupClick={onSignupClick} />
              </>
            ) : (
              <>
                <button className="secondary-button" onClick={onLoginClick}>
                  Login
                </button>
                <button className="primary-button" onClick={onSignupClick}>
                  Sign Up
                </button>
                <button
                  className="primary-button"
                  onClick={handleBookNow}
                >
                  Book Now
                </button>
              </>
            )}
          </div>
        </div>

        <button
          className="mobile-menu-button"
          onClick={toggleMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          <HiOutlineBars3 size={24} />
        </button>

        {mobileMenuOpen && (
          <div 
            className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} 
            ref={mobileMenuRef}
            onClick={(e) => e.stopPropagation()}
          >
            {isAuthenticated && (
              <div className="mobile-user-info">
                <Avatar
                  className="mobile-user-avatar"
                  src={user?.avatar}
                  sx={{ 
                    bgcolor: getAvatarColor(user?.email || ''),
                    width: 40,
                    height: 40
                  }}
                >
                  {user?.firstName?.charAt(0).toUpperCase() || 
                  user?.email?.charAt(0).toUpperCase()}
                </Avatar>
                <div className="mobile-user-details">
                  <div className="mobile-user-name">
                    {user?.firstName || (user?.email ? user.email.split('@')[0] : '')}
                  </div>
                  {user?.email && (
                    <div className="mobile-user-email">
                      {user.email}
                    </div>
                  )}
                </div>
              </div>
            )}

            <ul>
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`mobile-nav-link ${
                      location.pathname === link.path ? 'active' : ''
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              
              <li className="mobile-dropdown-item">
  <div 
    className="mobile-dropdown-header"
    onClick={toggleMobileGeoDropdown}
    style={{ textAlign: 'center' }} // Ensure center alignment
  >
    <span style={{ flex: 1 }}>Geo-Solutions</span> 
    {mobileGeoDropdownOpen ? 
      <HiChevronUp className={mobileGeoDropdownOpen ? "rotate" : ""} /> : 
      <HiChevronDown className={mobileGeoDropdownOpen ? "rotate" : ""} />
    }
  </div>
  <div className={`mobile-dropdown-content ${mobileGeoDropdownOpen ? "open" : ""}`}>
                  <Link
                    to="/web-applications"
                    className="mobile-nav-link sub-item"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Web Applications
                  </Link>
                  <Link
                    to="/smartcitysolutions"
                    className="mobile-nav-link sub-item"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Smart City Solutions
                  </Link>
                  <Link
                    to="/gis-forest-resources-zimbabwe"
                    className="mobile-nav-link sub-item"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Zimbabwe Gazzetted Forests
                  </Link>
                  <Link
                    to="/Artificial-Intelligence"
                    className="mobile-nav-link sub-item"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    AI in GIS
                  </Link>
                  <Link
                    to="/articles-and-projects"
                    className="mobile-nav-link sub-item"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    GIS in Zimbabwe
                  </Link>
                </div>
              </li>
            </ul>

            <div className="mobile-actions">
              {isAuthenticated ? (
                <>
                  <button
                    className="mobile-primary-button"
                    onClick={() => {
                      navigate('/bookings');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Book Now
                  </button>
                  <button
                    className="mobile-logout-button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="mobile-secondary-button"
                    onClick={() => {
                      onLoginClick();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </button>
                  <button 
                    className="mobile-primary-button"
                    onClick={() => {
                      onSignupClick();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;