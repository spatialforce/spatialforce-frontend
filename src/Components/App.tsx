import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import Cookies from 'js-cookie';
import Navbar from './Navbar';
import CookieConsent from './Cookies';
import Services2 from './services2';
import ProtectedRoute from './ProtectedRoute';
import './App.css';
import WelcomePopup from './WelcomePopup';
import Cart from './Cart';
import Login from './Login';
import Signup from './Signup';
import ActivationPage from './ActivationPage';
import ReviewSystem from './ReviewSystem';
import ErrorBoundary from './ErrorBoundary';
import axios from 'axios';
import { API_BASE_URL } from './config';
import LoginWelcomePage from './LoginWelcomePage';
import LoginPromptPage from './LoginPromptPage';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import GisZimbabwe from './GIS-applications';
import generateSitemap from '../utils/generateSitemap';
import { Analytics } from "@vercel/analytics/react";
import GlobalLoader from './GlobalLoader';  // ✅ new global loader

library.add(fas);

// Lazy imports
const SmartCitySolutions = lazy(() => import('./Smartcitysolutions'));
const AIGIS = lazy(() => import('./AI'));
const Home = lazy(() => import('./Home'));
const Menu = lazy(() => import('./Menu'));
const About = lazy(() => import('./About'));
const Services = lazy(() => import('./Services'));
const Bookings = lazy(() => import('./Bookings'));
const InquireContactForm = lazy(() => import('./InquireForm'));
const Confirmation = lazy(() => import('./confirmation'));
const Contact = lazy(() => import('./Contact'));
const TermsandConditions = lazy(() => import('./TermsandConditions'));
const Privacy = lazy(() => import('./privacy'));
const Forest = lazy(() => import('./ForestArticle'));
const OAuthSuccess = lazy(() => import('./OAuthsuccess'));
const ForgotPasswordPage = lazy(() => import('./ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./ResetPasswordPage'));
const Healthmap = lazy(() => import('./Healthmap'));
const CovidMap = lazy(() => import('./covid19map'));
const Webapplications = lazy(() => import('./Webmaps'));
const Firetracker = lazy(() => import('./Fire-tracker'));
const NotFound = lazy(() => import('./NotFound'));

interface LocationState {
  from?: string;
  email?: string;
  showWelcomePopup?: boolean;
  justActivated?: boolean;
  message?: string;
  showLoginModal?: boolean;
  showSignupModal?: boolean;
  authError?: string;
  provider?: string;
  showLoginWelcome?: boolean;
  authMethod?: 'email' | 'google';
  loginWelcomeEmail?: string;
}

interface AppLocation extends Location {
  state: LocationState;
}

const ForgotPasswordWrapper: React.FC = () => {
  const navigate = useNavigate();
  return (
    <ForgotPasswordPage
      onLoginClick={() => navigate('/login')}
      onSignupClick={() => navigate('/signup')}
      onCodeSent={() => {}}
    />
  );
};

const Sitemap: React.FC = () => {
  const sitemapContent = generateSitemap();
  return (
    <div>
      <Helmet><title>Sitemap</title></Helmet>
      <pre>{sitemapContent}</pre>
    </div>
  );
};

const App: React.FC = () => {
  const location = useLocation() as unknown as AppLocation; // only if you need to silence TS later

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showLoginWelcome, setShowLoginWelcome] = useState(false);
  const [loginWelcomeData, setLoginWelcomeData] = useState({
  email: '',
  method: 'email' as 'email' | 'google'
});

  const [showConsent, setShowConsent] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [email, setEmail] = useState('');
  const [loginMessage, setLoginMessage] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(
    location.state?.showWelcomePopup || false
  );

  // ✅ Handle ?welcome=1 trigger
  useEffect(() => {
    if (searchParams.get('welcome')) {
      const returnPath = sessionStorage.getItem('preAuthPath') || '/';
      sessionStorage.removeItem('preAuthPath');
      setShowWelcomePopup(true);
      window.history.replaceState({}, '', returnPath);
    }
  }, [searchParams]);

  // ✅ Handle OAuth or Auth errors
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('auth_error') || location.state?.authError;
    const providerParam = params.get('provider') || location.state?.provider;
    const emailParam = params.get('email') || location.state?.email;
    const isSignupFlow = params.get('signup') === 'true';

    if (errorParam) {
      Cookies.remove('auth_token', { domain: 'localhost' });
      localStorage.removeItem('authState');
      axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });

      let providerName = providerParam
        ? providerParam.charAt(0).toUpperCase() + providerParam.slice(1)
        : 'Google';

      let message = 'Authentication failed. Please try again.';
      if (errorParam === 'account_inactive') message = 'Please check your email for activation link.';
      if (errorParam === 'wrong_provider') message = `Please login using ${providerName}.`;

      setAuthError(message);
      setShowLoginModal(true);
      setEmail(emailParam || '');
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // ✅ Keep session alive
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/auth/session`, { withCredentials: true });
        if (data.authenticated) {
          document.cookie = `auth_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        }
      } catch {
        // ignore network fails
      }
    };
    checkSession();
    const interval = setInterval(checkSession, 300000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Welcome popup after activation
  useEffect(() => {
    if (location.state?.showWelcomePopup && location.state?.justActivated) {
      setShowWelcomePopup(true);
      navigate(location.pathname, {
        state: { ...location.state, showWelcomePopup: undefined, justActivated: false },
        replace: true
      });
    }
  }, [location.state, navigate]);

  // ✅ Determine navbar visibility
  const showNavbar = ![
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/oauth-success',
    '/gis-forest-resources-zimbabwe',
    '/Bulawayo-webmap-showcase',
    '/Covid19-tracker',
    '/fire-tracker'
  ].includes(location.pathname) && !location.pathname.startsWith('/contact/');

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setAuthError(null);
  };

  return (
    <div className="app-container">
      <Analytics />
      <Helmet>
        <title>Spatial Force - Geospatial Solutions & GIS Services</title>
        <meta
          name="description"
          content="Professional GIS services, geospatial solutions and spatial data analysis. Expert mapping, remote sensing and environmental monitoring services based in Bulawayo."
        />
        <meta
          name="keywords"
          content="GIS services, geospatial solutions, mapping, spatial analysis, remote sensing, environmental monitoring"
        />
      </Helmet>

      {showNavbar && (
        <Navbar
          onLoginClick={() => setShowLoginModal(true)}
          onSignupClick={() => setShowSignupModal(true)}
        />
      )}

      {/* ✅ Fullscreen loader when pages lazy-load */}
      <Suspense fallback={<GlobalLoader message="Loading Spatial Force..." />}>
        {(showWelcomePopup || location.state?.showWelcomePopup) && (
          <WelcomePopup
            onClose={() => {
              setShowWelcomePopup(false);
              navigate(location.pathname, {
                state: { ...location.state, showWelcomePopup: undefined },
                replace: true
              });
            }}
            email={location.state?.email || searchParams.get('email') || undefined}
          />
        )}

        <Cart />

        {showConsent && (
          <CookieConsent
            onAccept={() => {
              Cookies.set('cookieConsent', 'accepted', { expires: 30 });
              setShowConsent(false);
            }}
          />
        )}

        {/* ✅ Signup Modal */}
        {showSignupModal && (
          <div className="modal-backdrop">
            <Signup
              onClose={() => setShowSignupModal(false)}
              onLoginClick={() => {
                setShowSignupModal(false);
                setShowLoginModal(true);
              }}
              onSuccess={(email) => {
                navigate(`/activate?email=${encodeURIComponent(email)}`, {
                  state: {
                    message: 'Thank you for signing up! Check your email for activation code.',
                    from: location.pathname
                  },
                  replace: true
                });
              }}
            />
          </div>
        )}

        {/* ✅ Login Modal */}
        {showLoginModal && (
  <div className="modal-backdrop">
    <Login
      setShowLoginModal={setShowLoginModal}
      setShowLoginWelcome={setShowLoginWelcome}
      setLoginWelcomeData={setLoginWelcomeData}
      onClose={closeAllModals}
      onSignupClick={() => {
        setShowLoginModal(false);
        setShowSignupModal(true);
      }}
      onForgotPasswordClick={() => {
        setShowLoginModal(false);
        navigate('/forgot-password');
      }}
      initialError={authError}
      initialMessage={loginMessage}
      initialEmail={email}
      onSuccessfulLogin={closeAllModals}
      email={email}
      method="email"
    />
  </div>
)}


        {/* ✅ Main Routes */}
        <div className="app-content">
          <Suspense fallback={<GlobalLoader message="Loading page..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/sitemap.xml" element={<Sitemap />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services2" element={<Services2 />} />
              <Route path="/booking-login-prompt" element={<LoginPromptPage />} />
              <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
              <Route path="/contact/:inquiryType" element={<InquireContactForm />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<TermsandConditions />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/articles-and-projects" element={<GisZimbabwe />} />
              <Route path="/gis-forest-resources-zimbabwe" element={<Forest />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/welcome" element={<LoginWelcomePage />} />
              <Route path="/smartcitysolutions" element={<SmartCitySolutions />} />
              <Route path="/Artificial-Intelligence" element={<AIGIS />} />
              <Route path="/Bulawayo-webmap-showcase" element={<Healthmap />} />
              <Route path="/web-applications" element={<Webapplications />} />
              <Route path="/fire-tracker" element={<Firetracker />} />
              <Route
                path="/Covid19-tracker"
                element={
                  <div className="fullscreen-map-container">
                    <CovidMap />
                  </div>
                }
              />
              <Route path="/forgot-password" element={<ForgotPasswordWrapper />} />
              <Route
                path="/reviews"
                element={<ReviewSystem onLoginClick={() => setShowLoginModal(true)} />}
              />
              <Route
                path="/activate"
                element={
                  <ActivationPage
                    onSuccess={(user) => {
                      navigate('/', {
                        state: {
                          showWelcomePopup: true,
                          email: user.email,
                          justActivated: true,
                          from: location.pathname
                        },
                        replace: true
                      });
                    }}
                  />
                }
              />
              <Route path="/oauth-success" element={<OAuthSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </Suspense>
    </div>
  );
};

const AppShell: React.FC = () => (
  <HelmetProvider>
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <App />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  </HelmetProvider>
);

export default AppShell;
