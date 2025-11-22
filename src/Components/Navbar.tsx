import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineBars3, HiChevronDown, HiXMark } from 'react-icons/hi2';
import { useAuth } from './AuthContext';
import './Nav.css';

interface NavbarProps {
  onSignupClick: () => void;
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignupClick, onLoginClick }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [geoDropdownOpen, setGeoDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [industriesDropdownOpen, setIndustriesDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const geoDropdownRef = useRef<HTMLLIElement | null>(null);
  const servicesDropdownRef = useRef<HTMLLIElement | null>(null);
  const industriesDropdownRef = useRef<HTMLLIElement | null>(null);
  const resourcesDropdownRef = useRef<HTMLLIElement | null>(null);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const Navlogo = '/images/Navlogo.png';

  const coreLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const geoLinks = [
    { path: '/web-applications', label: 'Web Applications' },
    { path: '/smartcitysolutions', label: 'Smart City Solutions' },
    { path: '/gis-forest-resources-zimbabwe', label: 'Zimbabwe Gazzetted Forests' },
    { path: '/Artificial-Intelligence', label: 'AI in GIS' },
    { path: '/articles-and-projects', label: 'GIS in Zimbabwe' },
  ];

  const servicesSubLinks = [
    { path: '/services2', label: 'Services Overview' },
    { path: '/default', label: 'Spatial Consulting' },
    { path: '/default', label: 'Capacity Building & Training' },
    { path: '/default', label: 'Data Preparation & Cleaning' },
    { path: '/default', label: 'Interactive Dashboards' },
  ];

  const industriesLinks = [
    { path: '/default', label: 'Local Government' },
    { path: '/default', label: 'Urban Planning' },
    { path: '/default', label: 'Agriculture & Food Systems' },
    { path: '/default', label: 'Disaster Risk & Early Warning' },
    { path: '/default', label: 'Forestry & Wildlife' },
  ];

  const resourcesLinks = [
    { path: '/default', label: 'Resources Overview' },
    { path: '/default', label: 'Guides' },
    { path: '/default', label: 'Tutorials' },
    { path: '/default', label: 'Case Studies' },
    { path: '/default', label: 'FAQs' },
  ];

  const avatarSrc =
    user?.avatar ||
    'https://api.dicebear.com/7.x/avataaars/svg?seed=spatialforce&backgroundColor=b6e3f4,ffffff&radius=50';

  const isActive = (path: string) => location.pathname === path;

  const isServicesActive =
    location.pathname.startsWith('/services') ||
    isActive('/services2') ||
    servicesSubLinks.some((s) => isActive(s.path));

  const isGeoActive =
    location.pathname.startsWith('/geo-solutions') ||
    geoLinks.some((g) => isActive(g.path));

  const isIndustriesActive = location.pathname.startsWith('/industries');

  const isResourcesActive =
    location.pathname.startsWith('/resources') ||
    location.pathname.startsWith('/guides') ||
    location.pathname.startsWith('/tutorials') ||
    location.pathname.startsWith('/case-studies') ||
    location.pathname.startsWith('/faqs');

  // Close stuff on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setGeoDropdownOpen(false);
    setServicesDropdownOpen(false);
    setIndustriesDropdownOpen(false);
    setResourcesDropdownOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  // Click outside to close
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;

      if (geoDropdownOpen && geoDropdownRef.current && !geoDropdownRef.current.contains(t)) {
        setGeoDropdownOpen(false);
      }
      if (servicesDropdownOpen && servicesDropdownRef.current && !servicesDropdownRef.current.contains(t)) {
        setServicesDropdownOpen(false);
      }
      if (industriesDropdownOpen && industriesDropdownRef.current && !industriesDropdownRef.current.contains(t)) {
        setIndustriesDropdownOpen(false);
      }
      if (resourcesDropdownOpen && resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(t)) {
        setResourcesDropdownOpen(false);
      }
      if (accountOpen && accountMenuRef.current && !accountMenuRef.current.contains(t)) {
        setAccountOpen(false);
      }
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(t)) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [
    geoDropdownOpen,
    servicesDropdownOpen,
    industriesDropdownOpen,
    resourcesDropdownOpen,
    accountOpen,
    mobileMenuOpen,
  ]);

  const toggleMobile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileMenuOpen((v) => !v);
  };

  return (
    <nav className="sf-nav" aria-label="Main navigation">
      <div className="sf-nav__outer">
        <div className="sf-nav__wrap">
          {/* LEFT: Logo */}
          <div className="sf-nav__left">
            <Link to="/" className="sf-nav__logo" aria-label="Spatial Force Home">
              <img src={Navlogo} alt="Spatial Force logo" width={120} height={120} loading="eager" />
            </Link>
          </div>

          {/* CENTER: desktop links */}
          <div className="sf-nav__center">
            <ul className="sf-nav__links">
              {/* Home */}
              <li className="sf-nav__item">
                <Link to="/" className={`sf-link ${isActive('/') ? 'is-active' : ''}`}>
                  Home
                </Link>
              </li>

              {/* Services */}
              <li
                ref={servicesDropdownRef}
                className={`sf-nav__item sf-nav__item--has-dropdown ${
                  servicesDropdownOpen ? 'is-open' : ''
                }`}
              >
                <div className={`sf-link-group ${isServicesActive ? 'is-active' : ''}`}>
                  <Link
                    to="/services2"
                    className={`sf-link ${isServicesActive ? 'is-active' : ''}`}
                  >
                    Services
                  </Link>
                  <button
                    type="button"
                    className="sf-link__chev-btn"
                    aria-label="Toggle services menu"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setServicesDropdownOpen((v) => !v);
                      setGeoDropdownOpen(false);
                      setIndustriesDropdownOpen(false);
                      setResourcesDropdownOpen(false);
                    }}
                  >
                    <HiChevronDown />
                  </button>
                </div>
                <div className={`sf-dropdown ${servicesDropdownOpen ? 'open' : ''}`}>
                  {servicesSubLinks.map((s) => (
                    <Link
                      key={s.path}
                      to={s.path}
                      className="sf-dropdown__link"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </li>

              {/* Geo-Solutions */}
              <li
                ref={geoDropdownRef}
                className={`sf-nav__item sf-nav__item--has-dropdown ${
                  geoDropdownOpen ? 'is-open' : ''
                }`}
              >
                <div className={`sf-link-group ${isGeoActive ? 'is-active' : ''}`}>
                  <Link
                    to="/geo-solutions"
                    className={`sf-link ${isGeoActive ? 'is-active' : ''}`}
                  >
                    Geo-Solutions
                  </Link>
                  <button
                    type="button"
                    className="sf-link__chev-btn"
                    aria-label="Toggle geo-solutions menu"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setGeoDropdownOpen((v) => !v);
                      setServicesDropdownOpen(false);
                      setIndustriesDropdownOpen(false);
                      setResourcesDropdownOpen(false);
                    }}
                  >
                    <HiChevronDown />
                  </button>
                </div>
                <div className={`sf-dropdown ${geoDropdownOpen ? 'open' : ''}`}>
                  {geoLinks.map((g) => (
                    <Link
                      key={g.path}
                      to={g.path}
                      className="sf-dropdown__link"
                      onClick={() => setGeoDropdownOpen(false)}
                    >
                      {g.label}
                    </Link>
                  ))}
                </div>
              </li>

              {/* Industries */}
              <li
                ref={industriesDropdownRef}
                className={`sf-nav__item sf-nav__item--has-dropdown ${
                  industriesDropdownOpen ? 'is-open' : ''
                }`}
              >
                <div className={`sf-link-group ${isIndustriesActive ? 'is-active' : ''}`}>
                  <Link
                    to="/default"
                    className={`sf-link ${isIndustriesActive ? 'is-active' : ''}`}
                  >
                    Industries
                  </Link>
                  <button
                    type="button"
                    className="sf-link__chev-btn"
                    aria-label="Toggle industries menu"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIndustriesDropdownOpen((v) => !v);
                      setServicesDropdownOpen(false);
                      setGeoDropdownOpen(false);
                      setResourcesDropdownOpen(false);
                    }}
                  >
                    <HiChevronDown />
                  </button>
                </div>
                <div className={`sf-dropdown ${industriesDropdownOpen ? 'open' : ''}`}>
                  {industriesLinks.map((ind) => (
                    <Link
                      key={ind.path}
                      to={ind.path}
                      className="sf-dropdown__link"
                      onClick={() => setIndustriesDropdownOpen(false)}
                    >
                      {ind.label}
                    </Link>
                  ))}
                </div>
              </li>

              {/* Resources */}
              <li
                ref={resourcesDropdownRef}
                className={`sf-nav__item sf-nav__item--has-dropdown ${
                  resourcesDropdownOpen ? 'is-open' : ''
                }`}
              >
                <div className={`sf-link-group ${isResourcesActive ? 'is-active' : ''}`}>
                  <Link
                    to="/default"
                    className={`sf-link ${isResourcesActive ? 'is-active' : ''}`}
                  >
                    Resources
                  </Link>
                  <button
                    type="button"
                    className="sf-link__chev-btn"
                    aria-label="Toggle resources menu"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setResourcesDropdownOpen((v) => !v);
                      setServicesDropdownOpen(false);
                      setGeoDropdownOpen(false);
                      setIndustriesDropdownOpen(false);
                    }}
                  >
                    <HiChevronDown />
                  </button>
                </div>
                <div className={`sf-dropdown ${resourcesDropdownOpen ? 'open' : ''}`}>
                  {resourcesLinks.map((r) => (
                    <Link
                      key={r.path}
                      to={r.path}
                      className="sf-dropdown__link"
                      onClick={() => setResourcesDropdownOpen(false)}
                    >
                      {r.label}
                    </Link>
                  ))}
                </div>
              </li>

              {/* About */}
              <li className="sf-nav__item">
                <Link
                  to="/about"
                  className={`sf-link ${isActive('/about') ? 'is-active' : ''}`}
                >
                  About
                </Link>
              </li>

              {/* Contact */}
              <li className="sf-nav__item">
                <Link
                  to="/contact"
                  className={`sf-link ${isActive('/contact') ? 'is-active' : ''}`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* RIGHT: desktop avatar + mobile burger */}
          <div className="sf-nav__right">
            <div className="sf-desktop-only">
              <button
                className="sf-avatar-btn"
                aria-label="Account menu"
                onClick={() => setAccountOpen((v) => !v)}
              >
                <img className="sf-avatar-img" src={avatarSrc} alt="Account" />
              </button>

              {/* Account dropdown */}
              <div
                ref={accountMenuRef}
                className={`sf-account ${accountOpen ? 'open' : ''}`}
                role="menu"
                aria-label="Account menu"
              >
                {!isAuthenticated ? (
                  <>
                    <div className="sf-account__header">
                      <div className="sf-account__title">Account</div>
                      <div className="sf-account__subtitle">
                        Sign in to manage bookings and access personalised GIS support.
                      </div>
                    </div>

                    <div className="sf-account__btn-row">
                      <button
                        className="sf-account__btn sf-account__btn--primary"
                        onClick={() => {
                          setAccountOpen(false);
                          onSignupClick();
                        }}
                      >
                        Sign Up
                      </button>
                      <button
                        className="sf-account__btn"
                        onClick={() => {
                          setAccountOpen(false);
                          onLoginClick();
                        }}
                      >
                        Login
                      </button>
                    </div>

                    <div className="sf-account__note">
                      No spam. Just focused GIS and remote sensing collaboration.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="sf-account__header">
                      <div className="sf-account__title">
                        {user?.firstName || user?.email?.split('@')[0] || 'Account'}
                      </div>
                      {user?.email && (
                        <div className="sf-account__subtitle sf-account__subtitle--small">
                          {user.email}
                        </div>
                      )}
                    </div>

                    <div className="sf-account__list">
                      <button
                        className="sf-account__item sf-account__item--link"
                        onClick={() => {
                          setAccountOpen(false);
                          navigate('/bookings');
                        }}
                      >
                        View bookings
                      </button>
                      <button
                        className="sf-account__item sf-account__item--link"
                        onClick={() => {
                          setAccountOpen(false);
                          navigate('/account');
                        }}
                      >
                        Profile & settings
                      </button>
                    </div>

                    <button
                      className="sf-account__item sf-account__item--danger"
                      onClick={() => {
                        setAccountOpen(false);
                        logout();
                        navigate('/');
                      }}
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile burger (only on small screens) */}
            <button
              className="sf-burger"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              onClick={toggleMobile}
            >
              {mobileMenuOpen ? <HiXMark /> : <HiOutlineBars3 />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`sf-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sf-drawer__overlay" onClick={() => setMobileMenuOpen(false)} />
        <div className="sf-drawer__panel" ref={mobileMenuRef} role="dialog" aria-modal="true">
          <div className="sf-drawer__content">
            <nav className="sf-drawer__nav">
              {/* Main */}
              <div className="sf-drawer__section">
                <h3 className="sf-drawer__title">Main</h3>
                <ul className="sf-drawer__list">
                  {coreLinks.map((link) => (
                    <li key={link.path} className="sf-drawer__item">
                      <Link
                        to={link.path}
                        className={`sf-drawer__link ${
                          isActive(link.path) ? 'is-active' : ''
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Geo-Solutions */}
              <div className="sf-drawer__section">
                <h3 className="sf-drawer__title">Geo-Solutions</h3>
                <ul className="sf-drawer__list">
                  <li className="sf-drawer__item">
                    <Link
                      to="/geo-solutions"
                      className={`sf-drawer__link ${
                        isActive('/geo-solutions') ? 'is-active' : ''
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Overview
                    </Link>
                  </li>
                  {geoLinks.map((g) => (
                    <li key={g.path} className="sf-drawer__item">
                      <Link
                        to={g.path}
                        className="sf-drawer__sublink"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {g.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div className="sf-drawer__section">
                <h3 className="sf-drawer__title">Services</h3>
                <ul className="sf-drawer__list">
                  {servicesSubLinks.map((s) => (
                    <li key={s.path} className="sf-drawer__item">
                      <Link
                        to={s.path}
                        className="sf-drawer__link"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Industries */}
              <div className="sf-drawer__section">
                <h3 className="sf-drawer__title">Industries</h3>
                <ul className="sf-drawer__list">
                  {industriesLinks.map((ind) => (
                    <li key={ind.path} className="sf-drawer__item">
                      <Link
                        to={ind.path}
                        className="sf-drawer__link"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {ind.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div className="sf-drawer__section">
                <h3 className="sf-drawer__title">Resources</h3>
                <ul className="sf-drawer__list">
                  {resourcesLinks.map((r) => (
                    <li key={r.path} className="sf-drawer__item">
                      <Link
                        to={r.path}
                        className="sf-drawer__link"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* Account actions */}
            <div className="sf-drawer__account">
              {!isAuthenticated ? (
                <>
                  <button
                    className="sf-drawer__action"
                    onClick={() => {
                      onLoginClick();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </button>
                  <button
                    className="sf-drawer__action sf-drawer__action--solid"
                    onClick={() => {
                      onSignupClick();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <div className="sf-drawer__who">
                    {user?.firstName || user?.email?.split('@')[0] || 'User'}
                    {user?.email && (
                      <small className="sf-drawer__email">{user.email}</small>
                    )}
                  </div>
                  <button
                    className="sf-drawer__action"
                    onClick={() => {
                      navigate('/account');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="sf-drawer__action"
                    onClick={() => {
                      navigate('/bookings');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Bookings
                  </button>
                  <button
                    className="sf-drawer__action sf-drawer__action--danger"
                    onClick={() => {
                      logout();
                      navigate('/');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
