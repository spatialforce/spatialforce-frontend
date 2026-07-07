// Signup.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
  faSpinner,
  faArrowLeft,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

import './Signup.css';
import { API_BASE_URL, RECAPTCHA_SITE_KEY } from './config';

interface PasswordValidation {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  errors?: string[];
}

interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  requirements: PasswordValidation;
}

const Signup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(0); // 0 = name, 1 = email, 2 = password + captcha

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    errors: []
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const googleLogo = '/images/google-logo.svg';

  // Handle OAuth errors (if user comes back from Google)
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');
    const providerParam = searchParams.get('provider');

    if (errorParam) {
      const msg =
        errorParam === 'existing_account'
          ? `Account already exists with ${providerParam} - please login instead`
          : messageParam || 'Authentication failed';

      setError(msg);
      // clean query params
      navigate(window.location.pathname, { replace: true });
    }
  }, [searchParams, navigate]);

  const validatePassword = (password: string): PasswordValidationResult => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password)
    };

    const errors: string[] = [];
    if (!requirements.minLength) errors.push('at least 8 characters');
    if (!requirements.hasUpperCase) errors.push('one uppercase letter');
    if (!requirements.hasLowerCase) errors.push('one lowercase letter');
    if (!requirements.hasNumber) errors.push('one number');

    return {
      isValid: errors.length === 0,
      errors,
      requirements
    };
  };

  const validatePasswordInRealTime = (password: string) => {
    const validation = validatePassword(password);
    setPasswordValidation({
      ...validation.requirements,
      errors: validation.errors
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      validatePasswordInRealTime(value);
    }
  };

  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaToken(value);
    if (value && error === 'Please confirm you are not a robot') {
      setError(null);
    }
  };

  // Step-level validation
  const validateStep = (): boolean => {
    setError(null);

    if (step === 0) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError('Please enter your first and last name');
        return false;
      }
    }

    if (step === 1) {
      const email = formData.email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        setError('Please enter your email address');
        return false;
      }
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return false;
      }
    }

    if (step === 2) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }

      const passwordValidationResult = validatePassword(formData.password);
      if (!passwordValidationResult.isValid) {
        setError(
          `Password must contain: ${passwordValidationResult.errors.join(', ')}`
        );
        return false;
      }

      if (!agreeToTerms) {
        setError('You must agree to the Terms and Conditions');
        return false;
      }

      if (!recaptchaToken) {
        setError('Please confirm you are not a robot');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 2) {
      setStep(prev => prev + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        })
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          await response.text();
          throw new Error(`Registration failed (${response.status})`);
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const email = formData.email.trim().toLowerCase();

      navigate(`/activate?email=${encodeURIComponent(email)}`, {
        state: {
          message:
            'Thank you for signing up! Check your email for the activation code.',
          from: '/signup'
        },
        replace: true
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    const state = crypto.randomUUID();
    sessionStorage.setItem('oauthState', state);
    sessionStorage.setItem('preAuthPath', window.location.pathname);
    setError(null);
    window.location.href = `${API_BASE_URL}/auth/${provider}?signup=true`;
  };

  const goToLogin = () => {
    navigate('/login', { replace: true });
  };

  const goHome = () => {
    navigate('/');
  };

  const renderStepDots = () => {
    return (
      <div className="signup-step-dots">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className={`signup-step-dot ${step === i ? 'is-active' : ''}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="signup-page">
      {/* Home button in top-left */}
      <button
        type="button"
        className="signup-home-btn"
        onClick={goHome}
        aria-label="Back to home"
      >
        <FontAwesomeIcon icon={faHome} />
      </button>

      <div className="signup-card">
        <form onSubmit={handleSubmit} className="signup-form-wizard">
          {/* Header */}
          <div className="signup-header">
            {renderStepDots()}
            <div className="signup-header-text">
              {step === 0 && (
                <>
                  <h2>Create Your Account</h2>
                  <p>Let’s start with your name.</p>
                </>
              )}
              {step === 1 && (
                <>
                  <h2>Contact Details</h2>
                  <p>Where should we send important updates?</p>
                </>
              )}
              {step === 2 && (
                <>
                  <h2>Secure Your Account</h2>
                  <p>Choose a strong password you can remember.</p>
                </>
              )}
            </div>
          </div>

          {/* Error */}
          {error && <div className="signup-error-banner">{error}</div>}

          {/* Body / steps */}
          <div className="signup-body">
            {/* Step 0: First + Last Name + Google button */}
            {step === 0 && (
              <>
                <div className="signup-oauth-row">
                  <button
                    type="button"
                    className="signup-oauth-btn"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                  >
                    <img
                      src={googleLogo}
                      alt="Google"
                      className="signup-oauth-logo"
                    />
                    Continue with Google
                  </button>
                </div>

                <div className="signup-row">
                  <div className="signup-field">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      disabled={isLoading}
                      autoComplete="given-name"
                    />
                  </div>

                  <div className="signup-field">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      disabled={isLoading}
                      autoComplete="family-name"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 1: Email */}
            {step === 1 && (
              <div className="signup-row single">
                <div className="signup-field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Password + Confirm + Terms + reCAPTCHA */}
            {step === 2 && (
              <>
                <div className="signup-row">
                  <div className="signup-field">
                    <label htmlFor="password">Password</label>
                    <div className="password-input-wrapper">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        disabled={isLoading}
                        autoComplete="new-password"
                        onFocus={() => setShowPasswordRequirements(true)}
                        onBlur={() => {
                          // keep requirements visible only when really needed
                          if (
                            !error ||
                            error === 'Passwords do not match' ||
                            error ===
                              'You must agree to the Terms and Conditions'
                          ) {
                            setShowPasswordRequirements(false);
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(prev => !prev)}
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="signup-field">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="password-input-wrapper">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat password"
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(prev => !prev)
                        }
                        aria-label={
                          showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        <FontAwesomeIcon
                          icon={showConfirmPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {showPasswordRequirements &&
                  passwordValidation.errors &&
                  passwordValidation.errors.length > 0 && (
                    <div className="password-errors">
                      <p>Password must contain:</p>
                      <ul>
                        {passwordValidation.errors.map((errText, idx) => (
                          <li key={idx} className="invalid">
                            {errText}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                <div className="terms-checkbox">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={agreeToTerms}
                    onChange={e => setAgreeToTerms(e.target.checked)}
                    disabled={isLoading}
                  />
                  <label htmlFor="agreeToTerms">
                    I agree to the{' '}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>

                <div className="recaptcha-wrapper">
                  <ReCAPTCHA
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={handleRecaptchaChange}
                    size="compact"
                    className="sf-recaptcha"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer buttons + login link */}
          <div className="signup-footer">
            <div className="signup-footer-left">
              {step > 0 && (
                <button
                  type="button"
                  className="signup-back-btn"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="signup-footer-right">
              {step < 2 ? (
                <button
                  type="button"
                  className="signup-next-btn"
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    'Next'
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  className="signup-next-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="signup-login-link">
            <span>Already have an account?</span>
            <button
              type="button"
              className="signup-text-link"
              onClick={goToLogin}
              disabled={isLoading}
            >
              Log in
            </button>
          </div>

          <div className="signup-legal-footer">
            <p>© 2025 Spatial Force. All Rights Reserved.</p>
            <p>
              <a href="/privacy" className="legal-link">
                Privacy Policy
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
