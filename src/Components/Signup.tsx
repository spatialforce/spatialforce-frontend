// Signup.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './Signup.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from './config';
import ReCAPTCHA from 'react-google-recaptcha';
import { RECAPTCHA_SITE_KEY } from "./config";


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
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
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

  const googleLogo = "/images/google-logo.svg";

  // OAuth callback handling
  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    const provider = searchParams.get('provider');

    if (error) {
      setError(message || 'Authentication failed');
      navigate(window.location.pathname, { replace: true });
    }
    if (error === 'existing_account') {
      setError(`Account already exists with ${provider} - please login instead`);
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      validatePasswordInRealTime(value);
    }
  };

  const validatePasswordInRealTime = (password: string) => {
    const validation = validatePassword(password);
    setPasswordValidation({
      ...validation.requirements,
      errors: validation.errors
    });
  };

  const validatePassword = (password: string): PasswordValidationResult => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
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

  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaToken(value);
    if (value && error === 'Please confirm you are not a robot') {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!agreeToTerms) {
      setError('You must agree to the Terms and Conditions');
      setIsLoading(false);
      return;
    }

    if (!recaptchaToken) {
      setError('Please confirm you are not a robot');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const passwordValidationResult = validatePassword(formData.password);
    if (!passwordValidationResult.isValid) {
      setError(`Password must contain: ${passwordValidationResult.errors.join(', ')}`);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,   // 🔹 send the token to backend
        }),
        credentials: 'include'
      });
      

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Registration failed (${response.status})`);
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const email = formData.email;

      navigate(`/activate?email=${encodeURIComponent(email)}`, {
        state: {
          message: 'Thank you for signing up! Check your email for activation code.',
          from: '/signup'
        },
        replace: true
      });

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    const state = crypto.randomUUID();
    sessionStorage.setItem('oauthState', state);
    setError(null);
    sessionStorage.setItem('preAuthPath', window.location.pathname);
    window.location.href = `${API_BASE_URL}/auth/${provider}?signup=true`;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const goToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="signup-page">
      <div className="signup-content" ref={formRef}>
        <form 
          onSubmit={handleSubmit} 
          className="signup-form"
          id="signup-form"
        > 
          <h2>Create Your Account</h2>
          {error && <div className="error-message">{error}</div>}

          <div className="oauth-buttons">
            <button 
              type="button" 
              className="oauth-button google-button" 
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <img src={googleLogo} alt="Google Logo" className="oauth-logo" />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="separator">
            <span>or</span>
          </div>

          <div className="signup-form-grid">
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                autoComplete="username"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="new-password"
                autoComplete="new-password"
                data-webauthn="true"
                data-1p-ignore
                data-lpignore="true"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={() => {
                  if (!error || error === 'Passwords do not match' || error === 'You must agree to the Terms and Conditions') {
                    setShowPasswordRequirements(false);
                  }
                }}
                placeholder="Password"
                required
                minLength={8}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            <div className="form-group password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                id="confirm-password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {showPasswordRequirements && passwordValidation.errors && passwordValidation.errors.length > 0 && (
              <div className="password-errors">
                <p>Password must contain:</p>
                <ul>
                  {passwordValidation.errors.map((error: string, index: number) => (
                    <li key={index} className="invalid">{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              required
            />
            <label htmlFor="agreeToTerms">
              I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
            </label>
          </div>

          {/* reCAPTCHA */}
          <div className="recaptcha-wrapper">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
              name="recaptchaToken"
              id="recaptchaToken"
            />
          </div>

          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading}
            id="signup-button"
          >
            {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Sign Up'}
          </button>

          <div className="terms-link">
            <p>
              <span className='terms-link-paragraph'>Already have an account?{' '}</span>
              <button type="button" className="text-link" onClick={goToLogin}>
                Log in
              </button>
            </p>
          </div>

          {/* Legal footer */}
          <div className="signup-legal-footer">
            <p>© 2025 Spatial Force. All Rights Reserved.</p>
            <p>
              <a href="/privacy" className="legal-link">Privacy Policy</a>
              <span className="legal-separator"> • </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
