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
import FooterNote from './Footernote';
import './App.css';
import WelcomePopup from './WelcomePopup';
import Cart from './Cart';
import Login from './Login';
import Signup from './Signup';
import ActivationPage from './ActivationPage';
import ReviewSystem from './ReviewSystem';
import axios from 'axios';
import { API_BASE_URL } from './config';
import LoginWelcomePage from './LoginWelcomePage';
import LoginPromptPage from './LoginPromptPage';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GisZimbabwe from './GIS-applications';


// Add all solid icons to library
library.add(fas);



// Optimized lazy loading with prefetch hint
const prefetchableLazy = (factory: () => Promise<{ default: React.ComponentType<any> }>) => {
  const Component = lazy(factory);
  // Prefetch the component when idle
  if (typeof window !== 'undefined') {
    window.requestIdleCallback?.(() => factory());
  }
  return Component;
};
const SmartCitySolutions=prefetchableLazy(()=> import('./Smartcitysolutions'))
const AIGIS=prefetchableLazy(() => import('./AI'))
const Home = prefetchableLazy(() => import('./Home'));
const Menu = prefetchableLazy(() => import('./Menu'));
const About = prefetchableLazy(() => import('./About'));
const Services = prefetchableLazy(() => import('./Services'));
const Bookings = prefetchableLazy(() => import('./Bookings'));
const InquireContactForm = prefetchableLazy(() => import('./InquireForm'));
const Confirmation = prefetchableLazy(() => import('./confirmation'));
const Contact = prefetchableLazy(() => import('./Contact'));
const TermsandConditions = prefetchableLazy(() => import('./TermsandConditions'));
const Privacy = prefetchableLazy(() => import('./privacy'));
const Forest = prefetchableLazy(() => import('./ForestArticle'));
const OAuthSuccess = prefetchableLazy(() => import('./OAuthsuccess'));
const ForgotPasswordPage = prefetchableLazy(() => import('./ForgotPasswordPage'));
const ResetPasswordPage = prefetchableLazy(() => import('./ResetPasswordPage'));
const Healthmap = prefetchableLazy(() => import('./Healthmap'));
const CovidMap = prefetchableLazy(() => import('./covid19map'));
const Webapplications=prefetchableLazy(() => import('./Webmaps'));
const Firetracker=prefetchableLazy(() => import('./Fire-tracker'));

const NotFound = prefetchableLazy(() => import('./NotFound'));
interface AppLocation extends Location {
  state: LocationState;
  pathname: string;
  search: string;
  hash: string;
  key?: string;
}

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
const App = () => {
  const location = useLocation() as AppLocation;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showConsent, setShowConsent] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [email, setEmail] = useState('');
  const [loginMessage, setLoginMessage] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(
    location.state?.showWelcomePopup || false
  );

  useEffect(() => {
    if (searchParams.get('welcome')) {
      const returnPath = sessionStorage.getItem('preAuthPath') || '/';
      sessionStorage.removeItem('preAuthPath');
      
      setShowWelcomePopup(true);
      window.history.replaceState({}, '', returnPath);
    }
  }, [searchParams]); 
   // In your LoginWelcomePopup component interface
interface LoginWelcomePopupProps {
  onClose: () => void;
  email: string;  // <-- This is where the error occurs
  method: 'email' | 'google';
}

// Update the component usage with proper type safety
// In App.tsx
// Add this state
const [showLoginWelcome, setShowLoginWelcome] = useState(false);
const [loginWelcomeData, setLoginWelcomeData] = useState({
  email: '',
  method: 'email' as 'email' | 'google'
});


  useEffect(() => {
    const error = new URLSearchParams(location.search).get('auth_error');
    if (error) {
      setShowLoginModal(true);
      navigate(location.pathname, { replace: true }); // Clean URL
    }
  }, [location.search]);

  useEffect(() => {

    if (searchParams.get('welcome') === '1') {
      setShowWelcomePopup(true);

      navigate(location.pathname, { replace: true });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!showConsent && !Cookies.get('adDismissed')) {
      const timer = setTimeout(() => setShowAd(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [showConsent]);
  useEffect(() => {
    if (location.state?.showWelcomePopup && location.state?.justActivated) {
      setShowWelcomePopup(true);
      
      navigate(location.pathname, {
        state: { 
          ...location.state,
          showWelcomePopup: undefined,
          justActivated: false
        },
        replace: true
      });
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    if (location.state?.showSignupModal) {
      setShowSignupModal(true);
      setShowLoginModal(false);
      
      // Clear the state after reading
      navigate(location.pathname, { 
        state: { ...location.state, showSignupModal: undefined },
        replace: true
      });
    }
  }, [location.state]);
 
  useEffect(() => {
    const checkPersistedSession = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/auth/session`, {
          withCredentials: true
        });
        
        if (data.authenticated) {
          // Automatically renew session cookies
          document.cookie = `auth_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        }
      } catch (error) {
        console.log('Session persistence check failed');
      }
    };

    checkPersistedSession();
    const interval = setInterval(checkPersistedSession, 300000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.state?.showLoginModal) {
      setShowLoginModal(true);
      setAuthError(null);
      setLoginMessage(location.state.message || '');
      
      // Clear the state
      navigate(location.pathname, { 
        state: { ...location.state, showLoginModal: undefined, message: undefined },
        replace: true
      });
    }
  }, [location.state]);

  // Add this useEffect hook to your App component
useEffect(() => {
  // Fix for anchor links
  const handleHashChange = () => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Run once on mount
  handleHashChange();
  
  // Add event listener
  window.addEventListener('hashchange', handleHashChange);
  
  return () => {
    window.removeEventListener('hashchange', handleHashChange);
  };
}, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('auth_error') || location.state?.authError;
    const providerParam = params.get('provider') || location.state?.provider;
    const emailParam = params.get('email') || location.state?.email;
    const isSignupFlow = params.get('signup') === 'true';
  
    const handleAuthError = () => {
      // Clear existing auth state on any error
      Cookies.remove('auth_token', { domain: 'localhost' });
      localStorage.removeItem('authState');
      axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
  
      let errorMessage = 'Authentication failed. Please try again.';
      const formattedProvider = providerParam 
        ? providerParam.charAt(0).toUpperCase() + providerParam.slice(1).replace(/_/g, ' ')
        : 'Google';
  
      switch(errorParam) {
        case 'existing_account':
          setAuthError(`Account already exists with ${formattedProvider}. Please login instead.`);
          setShowLoginModal(true);
          setShowSignupModal(false);
          break;
  
        case 'existing_account_diff_provider':
          errorMessage = providerParam === 'email' 
            ? 'This account uses email/password. Please sign in with your credentials.'
            : `Please use ${formattedProvider} to log in.`;
          setAuthError(errorMessage);
          setShowLoginModal(true);
          break;
  
        case 'google_account_not_found':
          errorMessage = providerParam === 'email'
            ? 'Account exists with email authentication. Use email/password to login.'
            : 'No Google account found with these credentials.';
          setAuthError(errorMessage);
          setShowLoginModal(true);
          break;
  
        case 'wrong_provider':
          setAuthError(`Please login with ${formattedProvider}`);
          setShowLoginModal(true);
          break;
  
        case 'account_inactive':
          setAuthError('Please check your email for activation link.');
          setShowLoginModal(true);
          break;
  
        case 'not_registered':
          navigate(`/signup?oauth_provider=${providerParam || 'google'}&email=${encodeURIComponent(emailParam || '')}`, {
            state: {
              oauthSignup: true,
              provider: formattedProvider,
              email: emailParam
            }
          });
          return;
  
        default:
          setAuthError('Authentication service unavailable. Please try again.');
          setShowLoginModal(true);
          break;
      }
  
      if (emailParam) setEmail(emailParam);
  
      // Clean URL while preserving state
      navigate(location.pathname, {
        replace: true,
        state: {
          ...location.state,
          showLoginModal: !isSignupFlow,
          showSignupModal: isSignupFlow,
          authError: errorParam,
          provider: providerParam,
          email: emailParam
        }
      });
    };
  
    if (errorParam) {
      handleAuthError();
    }
  }, [
    location.search,
    location.pathname,
    location.state,
    navigate,
    API_BASE_URL,
    setShowLoginModal,
    setAuthError,
    setEmail
  ]); 

  

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
      <Helmet>
        <title>Spatial Force | Geospatial Intelligence & Solutions</title>
        <meta name="description" content="Spatial Force offers advanced geospatial solutions..." />
      </Helmet>
      {showNavbar && (
      <Navbar 
        onLoginClick={() => setShowLoginModal(true)}
        onSignupClick={() => setShowSignupModal(true)}
      />
    )}
      

<Suspense fallback={null}>
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
</Suspense>
      <Suspense fallback={<div className="instant-loader">Loading...</div>}>
        <Cart />
      </Suspense>

      {showConsent && (
        <CookieConsent onAccept={() => {
          Cookies.set('cookieConsent', 'accepted', { expires: 30 });
          setShowConsent(false);
        }} />
      )}

     

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
    />
  </div>
)}

      <div className="app-content">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking-login-prompt" element={<LoginPromptPage />} />
          <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="/contact/:inquiryType" element={<InquireContactForm />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<TermsandConditions />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/articles-and-projects" element={<GisZimbabwe />} />
          <Route path="/gis-forest-resources-zimbabwe" element={<Forest />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/reviews" element={<ReviewSystem/>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/welcome" element={<LoginWelcomePage />} />
          <Route path="/services2" element={<Services2 />} />
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


    <Route path="/activate" element={
    <ActivationPage 
      onSuccess={(user) => {
        navigate('/', { 
          state: { 
            showWelcomePopup: true,
            email: user.email,
            justActivated: true,
            from: location.pathname // Preserve original location
          },
          replace: true
        });
      }}
    />
  } />
        </Routes>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <HelmetProvider>
    <AuthProvider>
      <CartProvider>
        <Router>
          <App />
        </Router>
      </CartProvider>
    </AuthProvider>
  </HelmetProvider>
);

export default AppWrapper;