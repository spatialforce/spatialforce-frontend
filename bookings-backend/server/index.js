import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import pgSession from 'connect-pg-simple';
import crypto from 'crypto';
import compression from 'compression'; 
import bcrypt from 'bcryptjs';




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

console.log('Environment:', {
  GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
  EMAIL_USER: !!process.env.EMAIL_USER,
  SESSION_SECRET: !!process.env.SESSION_SECRET
});

// 3. Database configuration unchanged
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587, // Keep using 587
  secure: false, // MUST BE FALSE FOR PORT 587
  auth: {
    user: 'apikey',
    pass:process.env.SENDGRID_API_KEY
 },
  sender: 'no-reply@spatialforce.co.zw'

});
// Verify connection
transporter.verify()
  .then(() => console.log('NEW TRANSPORTER READY'))
  .catch(err => console.error('FRESH TRANSPORTER ERROR:', err));


transporter.verify(function(error, success) {
  if (error) {
    console.log('Email connection error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('Email connection error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});


const app = express();
const PORT = process.env.PORT || 5001;
// Replace this line:
// app.use(helmet());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        connectSrc: ["'self'", "https://spatialforce.co.zw","https://www.spatialforce.co.zw"],
        imgSrc: ["'self'", "data:", "https://*.googleusercontent.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        frameSrc: ["'self'", "https://accounts.google.com"],
        objectSrc: ["'none'"]
      }
    },
    hsts: {
      maxAge: 63072000, // 2 years in seconds
      includeSubDomains: true,
      preload: true
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    frameguard: { action: 'deny' },
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use((req, res, next) => {
  if (req.url === '/favicon.ico') {
    res.status(204).end();
  } else {
    next();
  }
});
const allowedOrigins = [
  'https://www.spatialforce.co.zw',
  'https://spatialforce.co.zw'
  ];

app.use(cors({
  origin:function (origin,callback) {
  if (!origin) return callback(null,true);

   if (allowedOrigins.indexOf(origin) ===-1) {
     const msg ='The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
     }
     return callback(null, true);

    },
    credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

const PgSession = pgSession(session);
// In your session middleware
app.set('trust proxy', 1); // Required for secure cookies in production

app.use(session({
  name: 'spatialforce.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: new PgSession({
    pool: pool,
    tableName: 'user_sessions',
    createTableIfMissing: true,
    ttl:86400 * 7, // 24h in seconds
    pruneSessionInterval: 3600 // Prune expired every 60 minutes
  }),
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    domain: process.env.COOKIE_DOMAIN 
  
  },
  proxy: true

}));

app.use(passport.initialize());
app.use(passport.session());


const authenticateJWT = (req, res, next) => {
  const token = req.cookies?.auth_token?.trim() || 
               req.headers?.authorization?.split(' ')[1]?.trim() || 
               req.query?.token?.trim();

  if (!token || token === 'undefined') {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'MISSING_AUTH'
    });
  }

  try {
    // Synchronous verification with proper error handling
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check for token expiration
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 300) {
      const newToken = jwt.sign(
        { ...decoded, exp: now + 3600 },
        process.env.JWT_SECRET
      );
      res.cookie('auth_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Error:', {
      error: err.name,
      message: err.message,
      tokenPresent: !!token,
      tokenLength: token?.length
    });
    
    res.clearCookie('auth_token');
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED',
        solution: 'refresh_token'
      });
    }
    
    return res.status(403).json({ 
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
};
app.use((req, res, next) => {
  if (req.session.user && req.path !== '/auth/refresh') {
    // Generate new JWT with fresh expiration
    const newToken = jwt.sign(
      {
        userId: req.session.user.id,
        email: req.session.user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Reset JWT cookie expiration
    res.cookie('auth_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
  next();
});

// --------------------------
// Passport Configuration
// --------------------------
// Update the session serialization/deserialization
passport.serializeUser((user, done) => {
  done(null, { 
    id: user.id,
    provider: user.auth_provider 
  });
});

passport.deserializeUser(async (serialized, done) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, email, auth_provider 
       FROM users WHERE id = $1`,
      [serialized.id]
    );
    
    if (rows.length === 0) {
      return done(null, false);
    }
    
    const user = rows[0];
    
    if (user.auth_provider !== serialized.provider) {
      console.warn('Provider mismatch detected:', {
        sessionProvider: serialized.provider,
        dbProvider: user.auth_provider,
        userId: user.id
      });
      return done(null, false);
    }
    
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Update the Google Strategy's success handler:

// Update the serializeUser function:
passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    provider: user.auth_provider // Ensure this matches deserialize
  });
});
// Add isAuthenticated helper method if it's missing
app.use((req, res, next) => {
  req.isAuthenticated = function() {
    return !!req.user;
  };
  next();
});


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true,
  proxy: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const isSignupFlow = req.session.oauthSignup;
    const email = profile.emails?.[0]?.value?.toLowerCase();
    
    if (!email) {
      return done(new Error('No email found in Google profile'), null);
    }

    // 1. Check for ANY existing user (active or inactive)
    const existingUser = await pool.query(
      `SELECT 
        id, 
        auth_provider, 
        is_active,
        first_name,
        last_name,
        google_id
       FROM users 
       WHERE email = $1`,
      [email]
    );

    // 2. Handle Signup Flow
    if (isSignupFlow) {
      if (existingUser.rows.length > 0) {
        const user = existingUser.rows[0];
        
        // New case: Existing Google account
        if (user.auth_provider === 'google') {
          return done(null, false, { 
            message: 'existing_account',
            provider: 'google',
            email: email,
            solution: 'login'
          });
        }
    
        // Existing case: Different provider
        if (user.auth_provider !== 'google') {
          req.session.destroy(() => {
            return done(null, false, { 
              message: 'existing_account_diff_provider',
              provider: user.auth_provider,
              email: email
            });
          });
          return;
        }
    
        // Update existing Google user
        const { rows } = await pool.query(
          `UPDATE users SET
            is_active = TRUE,
            google_id = $1,
            first_name = COALESCE($2, first_name),
            last_name = COALESCE($3, last_name),
            last_login = NOW()
           WHERE id = $4
           RETURNING id, email, first_name, last_name`,
          [
            profile.id,
            profile.name?.givenName,
            profile.name?.familyName,
            user.id
          ]
        );
        return done(null, rows[0]);
      }
 
    

      // Case 2c: New user creation
      const { rows } = await pool.query(
        `INSERT INTO users (
          email, 
          first_name, 
          last_name,
          auth_provider,
          is_active,
          google_id
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, first_name, last_name`,
        [
          email,
          profile.name?.givenName || '',
          profile.name?.familyName || '',
          'google',
          true,
          profile.id
        ]
      );
      return done(null, rows[0]);
    }

    // 3. Handle Login Flow
    if (existingUser.rows.length === 0) {
      return done(null, false, { 
        message: 'google_account_not_found',
        email: email
      });
    }

    const user = existingUser.rows[0];
    
    // 4. Validate auth provider match
    if (user.auth_provider !== 'google') {
      return done(null, false, { 
        message: 'existing_account_diff_provider',
        provider: user.auth_provider 
      });
    }

    // Fixed syntax issue here - changed existingUser.rows[0].auth_provider to user.auth_provider
    if (user.auth_provider !== 'google') {
      return done(null, false, { 
        message: 'existing_account_diff_provider',
        provider: user.auth_provider,
        email: normalizedEmail
      });
    }

    // 5. Update existing Google user
    await pool.query(
      `UPDATE users SET
        last_login = NOW(),
        google_id = $1
       WHERE id = $2`,
      [profile.id, user.id]
    );

    return done(null, {
      id: user.id,
      email: email,
      firstName: user.first_name,
      lastName: user.last_name
    });

  } catch (error) {
    console.error('Google OAuth error:', {
      error: error.message,
      profile: {
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails
      }
    });
    done(error, null);
  }
}));

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && !/[<>]/.test(email);
}

app.get('/api/auth/google', (req, res, next) => {
  if (!req.session) {
    return res.status(500).json({ error: 'Session not initialized' });
  }

  // Regenerate session to prevent serialization issues
  req.session.regenerate((err) => {
    if (err) {
      console.error('Session regeneration error:', err);
      return res.status(500).json({ error: 'OAuth initialization failed' });
    }

    const isSignup = req.query.signup === 'true';
    const state = crypto.randomBytes(32).toString('hex');
    
    // Set fresh session values after regeneration
    req.session.oauthState = state;
    req.session.oauthSignup = isSignup;
    req.session.oauthOrigin = req.get('Referer') || '/';

    // Force session save before proceeding
    req.session.save((saveErr) => {
      if (saveErr) {
        console.error('Session save error:', saveErr);
        return res.status(500).json({ error: 'OAuth initialization failed' });
      }

      // Add prompt for existing session cases
      const authOptions = {
        scope: ['profile', 'email'],
        state: state,
        accessType: 'offline',
        prompt: isSignup ? 'select_account consent' : 'select_account'
      };

      passport.authenticate('google', authOptions)(req, res, next);
    });
  });
});
app.get('/api/auth/google/callback',
  (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const params = new URLSearchParams();

      try {
        if (err || !user) {
          // Handle known error cases
          if (info?.message === 'google_account_not_found') {
            params.append('auth_error', 'google_account_not_found');
            if (info.provider) params.append('provider', info.provider);
            if (info.email) params.append('email', info.email);
            
            if (info.provider === 'email') {
              params.set('auth_error', 'existing_account_diff_provider');
            }
          }
          else if (info?.message === 'existing_account_diff_provider') {
            params.append('auth_error', 'existing_account_diff_provider');
            if (info.provider) params.append('provider', info.provider);
            if (info.email) params.append('email', info.email);
          }
          else if (info?.message === 'existing_account') {
            params.append('auth_error', 'existing_account');
            params.append('provider', info.provider);
            params.append('email', info.email);
            params.append('signup', 'true');
            return res.redirect(`${baseUrl}/?${params.toString()}`);
          }
          else {
            params.append('auth_error', 'authentication_failed');
          }

          return res.redirect(`${baseUrl}/?${params.toString()}`);
        }

        // Successful authentication
        req.logIn(user, async (loginErr) => {
          if (loginErr) return next(loginErr);

          const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );

          res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 8 * 60 * 60 * 1000,
            domain: process.env.COOKIE_DOMAIN || 'localhost',
            path: '/'
          });

          const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/`;
         //res.redirect(`${redirectUrl}?welcome=1&email=${encodeURIComponent(req.user.email)}`);
         // In your Google OAuth callback route handler:
          res.redirect(`${process.env.FRONTEND_URL}/welcome?email=${encodeURIComponent(user.email)}&method=google`);
        });

      } catch (error) {
        console.error('Google authentication error:', error);
        params.append('auth_error', 'server_error');
        res.redirect(`${baseUrl}/?${params.toString()}`);
      }
    })(req, res, next);
  }
);
app.post('/api/auth/logout', (req, res) => {
  if (!req.session) {
    console.error('Session middleware not initialized');
    return res.status(500).json({ 
      error: 'Session system not available',
      code: 'SESSION_ERROR'
    });
  }

  // Clear cookies first
  res.clearCookie('auth_token', {
    domain: '.spatialforce.co.zw'|| 'localhost',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  });

  res.clearCookie('spatialforce.sid', {
    domain: process.env.COOKIE_DOMAIN || 'localhost',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  });

  // Handle session destruction safely
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).json({ 
        error: 'Could not destroy session',
        code: 'SESSION_DESTROY_FAILED'
      });
    }
    
    // Clear user context
    req.user = null;
    
    res.json({ 
      success: true,
      message: 'Logged out successfully'
    });
  });
});


// Add this session verification middleware BEFORE your routes
app.use((req, res, next) => {
  if (!req.session) {
    console.warn('Session middleware not loaded for request:', req.method, req.path);
  }
  next();
});

// Add session regeneration middleware after successful login
app.use((req, res, next) => {
  const originalSend = res.send;
  
  res.send = function (body) {
    if (req.session && req.path === '/api/auth/login' && res.statusCode === 200) {
      req.session.regenerate((err) => {
        if (err) console.error('Session regeneration error:', err);
      });
    }
    originalSend.call(this, body);
  };
  
  next();
});
// Add this to store the error message in session
app.use((req, res, next) => {
  if (req.path === '/api/auth/google/callback' && req.query.error) {
    req.session.oauthError = req.query.error;
    req.session.oauthEmail = req.query.email;
  }
  next();
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Enhanced validation with early return
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'Email and password are required',
      code: 'MISSING_CREDENTIALS',
      fields: {
        email: !email ? 'Required' : 'Valid',
        password: !password ? 'Required' : 'Valid'
      }
    });
  }

  const client = await pool.connect();
  try {
    const normalizedEmail = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        code: 'INVALID_EMAIL'
      });
    }

    const { rows } = await client.query(
      `SELECT 
        id, email, password_hash, is_active, auth_provider,
        first_name, last_name, login_attempts, last_login
       FROM users 
       WHERE email = $1`, 
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const user = rows[0];


    if (user.auth_provider !== 'email') {
      return res.status(400).json({ 
        success: false,
        error: `Please login with ${user.auth_provider} (this account was created with ${user.auth_provider} authentication)`,
        code: 'AUTH_PROVIDER_MISMATCH',
        provider: user.auth_provider
      });
    }
9
    if (user.login_attempts >= 5 && Date.now() - user.last_login < 900000) {
      return res.status(429).json({
        success: false,
        error: 'Account temporarily locked',
        code: 'ACCOUNT_LOCKED'
      });
    }

    if (!user.is_active) {
      return res.status(403).json({ 
        success: false,
        error: 'Account not activated',
        code: 'ACCOUNT_NOT_ACTIVE',
        solution: 'resend_activation'
      });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      await client.query(
        'UPDATE users SET login_attempts = login_attempts + 1 WHERE id = $1',
        [user.id]
      );
      
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS',
        remaining_attempts: 5 - (user.login_attempts + 1)
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Establish session
    req.login(user, async (err) => {
      if (err) {
        console.error('Session creation error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Login failed',
          code: 'SESSION_ERROR'
        });
      }

      // Set cookies
      res.cookie('auth_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 604800000, // 7 days
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        path: '/'
      });

      // Update user status
      await client.query(
        `UPDATE users SET 
          login_attempts = 0,
          last_login = NOW()
         WHERE id = $1`,
        [user.id]
      );

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        },
        token: accessToken,
        refreshToken
      });
    });

  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      stack: error.stack,
      input: { email: email?.substring(0, 3) + '***' }
    });

    res.status(500).json({ 
      success: false,
      error: 'Authentication service unavailable',
      code: 'SERVER_ERROR',
      retryable: true
    });
  } finally {
    client.release();
  }
});
const sessionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  message: {
    error: 'Too many session requests',
    code: 'SESSION_RATE_LIMIT',
    solution: 'Please wait 15 minutes before trying again'
  },
  standardHeaders: true, // Return rate limit info in standard headers
  legacyHeaders: false, // Disable the deprecated X-RateLimit-* headers
  keyGenerator: (req) => {
    // Use session ID + IP address for tracking
    return `${req.sessionID || 'no-session'}-${req.ip}`;
  },
  handler: (req, res) => {
    console.warn('Rate limit exceeded:', {
      ip: req.ip,
      path: req.path,
      sessionId: req.sessionID
    });
    res.status(429).json({
      error: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  },
  skip: (req) => {
    // Skip rate limiting for authenticated users
    return req.isAuthenticated && req.isAuthenticated();
  }
});
// Apply to login routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});
app.use('/api/auth/login', authLimiter);

app.get('/api/auth/session', 
  sessionRateLimiter,
  async (req, res) => {
    try {
      let isAuthenticated = req.isAuthenticated();
      let userData = req.user;

      if (!isAuthenticated) {
        const token = req.cookies?.auth_token?.trim() || 
                     req.headers?.authorization?.split(' ')[1]?.trim();

        if (token) {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get fresh user data
            const { rows } = await pool.query(
              `SELECT id, email, first_name, last_name, auth_provider
               FROM users WHERE id = $1`,
              [decoded.userId]
            );

            if (rows.length > 0) {
              userData = rows[0];
              isAuthenticated = true;
              
              // Establish session for subsequent requests
              req.session.regenerate((err) => {
                if (err) throw err;
                req.session.user = userData;
              });
            }
          } catch (jwtError) {
            console.log('JWT verification failed:', jwtError.message);
            res.clearCookie('auth_token');
          }
        }
      }

      if (isAuthenticated) {
        // Refresh session expiration
        req.session.touch();
        
        return res.json({
          authenticated: true,
          user: {
            id: userData.id,
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            authProvider: userData.auth_provider
          },
          session: {
            expires: req.session.cookie.expires
          }
        });
      }

      // Clear invalid credentials
      res.clearCookie('auth_token');
      res.json({ 
        authenticated: false,
        sessionStatus: {
          hasSession: !!req.sessionID,
          sessionAge: req.session?.cookie?.maxAge
        }
      });

    } catch (error) {
      console.error('Session check error:', error);
      res.status(500).json({ 
        error: 'Session check failed',
        code: 'SESSION_CHECK_ERROR'
      });
    }
  }
);
// Session debug endpoint
app.get('/api/session-debug', (req, res) => {
  res.json({
    sessionId: req.sessionID,
    sessionData: req.session,
    cookies: req.cookies,
    headers: req.headers
  });
});
// Add this middleware at the top of your server file
app.use((req, res, next) => {
  // Force JSON responses for all API routes
  if (req.path.startsWith('/api')) {
    res.setHeader('Content-Type', 'application/json');
  }
  next();
});



// In your server routes (e.g., authRoutes.ts)
app.post('api/auth/refresh', async (req, res) => {

  try {
    const refreshToken = req.cookies?.refresh_token;
    
    if (!refreshToken) {
      return res.status(401).json({ 
        error: 'Refresh token required',
        code: 'MISSING_REFRESH_TOKEN' 
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    
    // Check if token exists in database (if you're storing them)
    const tokenExists = await pool.query(
      'SELECT 1 FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );

    if (!tokenExists.rows.length) {
      return res.status(401).json({ 
        error: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Generate new tokens
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      process.env.REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Update database with new refresh token
    await pool.query('BEGIN');
    await pool.query(
      'DELETE FROM refresh_tokens WHERE token = $1',
      [refreshToken]
    );
    await pool.query(
      'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)',
      [newRefreshToken, decoded.userId, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );
    await pool.query('COMMIT');

    // Set cookies
    res.cookie('auth_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/'
    });

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Refresh error:', error);
    
    // Clear invalid tokens
    res.clearCookie('auth_token');
    res.clearCookie('refresh_token');
    
    return res.status(401).json({ 
      error: 'Session expired - please login again',
      code: 'SESSION_EXPIRED'
    });
  }
});

// Add this middleware right after session setup
app.use((req, res, next) => {
  req.session.save((err) => {
    if (err) console.error('Session save error:', err);
    next();
  });
});


app.post('/api/validate-token', (req, res) => {
  const token = req.cookies?.auth_token;
  
  if (!token) return res.json({ valid: false, reason: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      valid: true,
      expiresIn: decoded.exp - Math.floor(Date.now()/1000),
      user: decoded
    });
  } catch (err) {
    res.json({
      valid: false,
      reason: err.name,
      message: err.message
    });
  }
});

app.post('/api/activate', async (req, res) => {
  // Validate environment configuration
  if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
    console.error('JWT secrets not configured');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error',
      code: 'SERVER_CONFIG'
    });
  }

  const client = await pool.connect();
  try {
    // Validate request body format
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format',
        code: 'INVALID_REQUEST'
      });
    }

    const { email, code } = req.body;
    
    // Validate required fields
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        error: 'Email and code are required',
        code: 'MISSING_FIELDS',
        fields: {
          email: !email ? 'Required' : 'Valid',
          code: !code ? 'Required' : 'Valid'
        }
      });
    }

    // Sanitize inputs
    const cleanCode = code.toString().replace(/\D/g, '');
    const normalizedEmail = email.toString().toLowerCase().trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        code: 'INVALID_EMAIL',
        received: normalizedEmail
      });
    }

    // Validate code format
    if (cleanCode.length !== 6) {
      return res.status(400).json({
        success: false,
        error: 'Invalid code format (must be 6 digits)',
        code: 'INVALID_CODE_FORMAT',
        received: code.toString().slice(0, 20) // Truncate for security
      });
    }

    await client.query('BEGIN');

    // Atomic activation check
    const activationResult = await client.query(
      `UPDATE users SET
        is_active = TRUE,
        activation_code = NULL,
        activation_expiry = NULL
       WHERE email = $1
         AND activation_code = $2
         AND activation_expiry > NOW()
       RETURNING id, email, first_name, last_name, auth_provider`,
      [normalizedEmail, cleanCode]
    );

    if (activationResult.rowCount === 0) {
      // Check if code exists but expired
      const expiredCheck = await client.query(
        `SELECT 1 FROM users 
         WHERE email = $1 AND activation_code = $2 
         AND activation_expiry <= NOW()`,
        [normalizedEmail, cleanCode]
      );

      await client.query('ROLLBACK');

      const isExpired = expiredCheck.rowCount > 0;
      return res.status(400).json({
        success: false,
        error: isExpired 
          ? 'Activation code has expired' 
          : 'Invalid activation code',
        code: isExpired ? 'CODE_EXPIRED' : 'INVALID_CODE',
        meta: {
          email: normalizedEmail,
          code_length: cleanCode.length,
          attempt_time: new Date().toISOString()
        }
      });
    }

    // Generate tokens
    const user = activationResult.rows[0];
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        authProvider: user.auth_provider
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { 
        userId: user.id,
        authProvider: user.auth_provider 
      },
      process.env.REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Commit transaction
    await client.query('COMMIT');

    // Set secure cookies
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 900000, // 15 minutes
      path: '/'
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800000, // 7 days
      path: '/'
    });

    // Send response
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isActive: true,
        authProvider: user.auth_provider
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    
    console.error('Activation Error:', {
      message: error.message,
      stack: error.stack,
      input: {
        email: req.body.email?.slice(0, 3) + '***', // Partial logging
        code: req.body.code?.slice(0, 1) + '*****' // Obscure code
      }
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error during activation',
      code: 'SERVER_ERROR',
      requestId: crypto.randomUUID()
    });
  } finally {
    client.release();
  }
});

app.post('/api/resend-code', async (req, res) => {
  const client = await pool.connect();
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format',
        code: 'INVALID_REQUEST'
      });
    }

    const { email } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
        code: 'MISSING_EMAIL'
      });
    }

    // Sanitize and validate email
    const normalizedEmail = email.toString().toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        code: 'INVALID_EMAIL',
        received: normalizedEmail
      });
    }

    await client.query('BEGIN');

    // Check if user exists
    const userCheck = await client.query(
      `SELECT id, is_active FROM users WHERE email = $1`,
      [normalizedEmail]
    );

    if (userCheck.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'Account not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Prevent resend for active accounts
    if (userCheck.rows[0].is_active) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: 'Account already activated',
        code: 'ALREADY_ACTIVE'
      });
    }

    // Generate new code
    const newCode = crypto.randomInt(100000, 999999).toString();
    const newExpiry = new Date(Date.now() + 1 * 60 * 1000); // 15 minutes

    // Update user record
    const updateResult = await client.query(
      `UPDATE users SET
        activation_code = $1,
        activation_expiry = $2,
        updated_at = NOW()
       WHERE email = $3
       RETURNING id, activation_expiry`,
      [newCode, newExpiry, normalizedEmail]
    );

    if (updateResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(500).json({
        success: false,
        error: 'Failed to update activation code',
        code: 'UPDATE_FAILED'
      });
    }

    // Commit transaction
    await client.query('COMMIT');

    // Send email
    try {
      await transporter.sendMail({
        from: {
          name: process.env.MAIL_FROM_NAME || 'Spatial Force',
          address: process.env.MAIL_FROM || 'no-reply@spatialforce.co.zw'
        },
        to: normalizedEmail,
        subject: 'Your New Activation Code',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #2B6CB0;">New Activation Code</h2>
            <p>Your new activation code is:</p>
            <div style="font-size: 24px; letter-spacing: 2px; margin: 20px 0; padding: 15px; background: #F7FAFC;">
              ${newCode}
            </div>
            <p>This code will expire at ${newExpiry.toLocaleTimeString()}.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email send failed:', {
        error: emailError.message,
        email: normalizedEmail.slice(0, 3) + '***'
      });
      return res.status(500).json({
        success: false,
        error: 'Code generated but failed to send email',
        code: 'EMAIL_FAILURE',
        generatedCode: process.env.NODE_ENV === 'development' ? newCode : undefined
      });
    }

    res.json({
      success: true,
      message: 'New activation code sent',
      meta: {
        email: normalizedEmail,
        expiry: newExpiry.toISOString(),
        resendTime: new Date().toISOString()
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    
    console.error('Resend Error:', {
      message: error.message,
      stack: error.stack,
      input: {
        email: req.body.email?.slice(0, 3) + '***'
      }
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error during resend',
      code: 'SERVER_ERROR',
      requestId: crypto.randomUUID()
    });
  } finally {
    client.release();
  }
});




export const validatePassword= (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);


  if (password.length < minLength) return 'Password must be at least 8 characters';
  if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
  if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
  if (!hasNumber) return 'Password must contain at least one number';

  return null;
};

app.post('/api/signup', async (req, res) => {
  const requestId = crypto.randomUUID();
  const client = await pool.connect();
  
  // Initialize masked body at the top level
  const maskedBody = {
    firstName: '***',
    lastName: '***',
    email: '***',
    password: '***',
    confirmPassword: '***'
  };

  try {
    // Destructure and normalize input
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    // Update masked values
    maskedBody.firstName = firstName?.slice(0, 1) + '***' || 'missing';
    maskedBody.lastName = lastName?.slice(0, 1) + '***' || 'missing';
    maskedBody.email = normalizedEmail[0] + '***' || 'missing';

    console.log(`[Signup ${requestId}] Initiated`, {
      client: req.ip,
      userAgent: req.get('User-Agent'),
      ...maskedBody
    });

    // Validation phase
    const validationErrors = [];
    
    // Required fields check
    if (!firstName?.trim()) validationErrors.push('First name is required');
    if (!lastName?.trim()) validationErrors.push('Last name is required');
    if (!email?.trim()) validationErrors.push('Email is required');
    if (!password?.trim()) validationErrors.push('Password is required');
    if (!confirmPassword?.trim()) validationErrors.push('Confirm password is required');

    // Password match check
    if (password !== confirmPassword) {
      validationErrors.push('Passwords do not match');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      validationErrors.push('Invalid email format');
    }

    // Password strength validation
    const passwordError = validatePassword(password);
    if (passwordError) validationErrors.push(passwordError);

    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false,
        errors: validationErrors, // Send array of errors
        fields: {
          email: !email ? 'Required' : emailRegex.test(email) ? 'Valid' : 'Invalid',
          password: passwordError ? 'Invalid' : 'Valid'
        },
        code: 'VALIDATION_ERROR'
      });
    }

    await client.query('BEGIN');

    // Check for existing users using generated email_lower column
    const existingUser = await client.query(
      `SELECT id, is_active, auth_provider 
       FROM users 
       WHERE email_lower = $1`,
      [normalizedEmail]
    );

    // Handle existing accounts
    if (existingUser.rowCount > 0) {
      if (existingUser.rows[0].is_active) {
        console.log(`[Signup ${requestId}] Email already registered`, {
          ...maskedBody,
          existingUserId: existingUser.rows[0].id
        });
        await client.query('ROLLBACK');
        return res.status(409).json({
          success: false,
          error: 'Email already registered',
          code: 'EMAIL_EXISTS',
          requestId
        });
      }

      // Remove inactive account
      await client.query(
        'DELETE FROM users WHERE id = $1',
        [existingUser.rows[0].id]
      );
      console.log(`[Signup ${requestId}] Removed inactive account`, {
        ...maskedBody,
        deletedUserId: existingUser.rows[0].id
      });
    }

    // Generate activation details
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const activationExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // Create new user (email_lower is generated by database)
    const { rows } = await client.query(
      `INSERT INTO users (
        first_name, 
        last_name, 
        email,
        password_hash, 
        activation_code, 
        activation_expiry,
        auth_provider
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, created_at`,
      [
        firstName.trim(),
        lastName.trim(),
        normalizedEmail,
        await bcrypt.hash(password, 12),
        activationCode,
        activationExpiry,
        'email'
      ]
    );
    console.log('Attempting to send to:', normalizedEmail);
    if (normalizedEmail === 'kudzanaichakavarika67@gmail.com') {
      throw new Error('TEST: Would have sent to admin email instead of user');
    }
    try {
      await transporter.sendMail({
        from: {
          name: process.env.MAIL_FROM_NAME || 'Spatial Force',
          address: process.env.MAIL_FROM || 'no-reply@spatialforce.co.zw'
        },
        to: normalizedEmail, 
        subject: 'Account Activation Required',
        html: `
        <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: auto; border: 1px solid #E2E8F0; border-radius: 8px; background-color: #FFFFFF;">
        <h2 style="color: #2B6CB0; text-align: center;">Welcome to Spatial Force!</h2>
        
        <p style="font-size: 1.1em;">Thank you for choosing Spatial Force. We are excited to have you on board! To get started with your account, please verify your email address by using the activation code provided below.</p>
        
        <p style="font-size: 1.1em;">Your activation code is:</p>
        
        <div style="font-size: 36px; letter-spacing: 5px; margin: 25px 0; 
          padding: 20px; background: #F7FAFC; text-align: center; border-radius: 5px; 
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <strong>${activationCode}</strong>
        </div>
        
        <p style="font-size: 1em;">Please note that this code is time-sensitive and will expire in <strong>15 minutes</strong>. If you do not enter the code in time, you will need to request a new one.</p>
        
        <p style="color: #718096; font-size: 0.9em; text-align: center;">
          If you didn’t create an account with us, please ignore this email. Your security is important to us, and we want to ensure that you only receive emails related to your account.
        </p>
        
        <p style="text-align: center; margin-top: 30px;">
          <a href="#" style="text-decoration: none; color: #2B6CB0; font-weight: bold;">Visit our website</a>
          to learn more about our services and how we can assist you in achieving your goals.
        </p>
      </div>
        `,
        headers: {
          'X-Entity-Ref-ID': crypto.randomBytes(16).toString('hex')
        }
      });
      console.log('Activation email sent to:', normalizedEmail); // Add this for debugging
    } catch (error) {
      console.error('Error sending activation email:', {
        intendedRecipient: normalizedEmail,
        error: error.message
      });
      throw error;
    }
 

    await client.query('COMMIT');

    // Successful response
    return res.status(201).json({
      success: true,
      message: 'Registration successful - check your email',
      requestId,
      redirect: `/activate?email=${encodeURIComponent(normalizedEmail)}`,
      expires: activationExpiry.toISOString()
    });

  } catch (error) {
    // Handle database errors
    await client.query('ROLLBACK');
    
    // Log detailed error information
    console.error(`[Signup ${requestId}] Server error`, {
      error: error.message,
      stack: error.stack,
      code: error.code,
      query: error.query,
      parameters: error.parameters,
      ...maskedBody
    });

    // Determine error type
    const isDuplicateError = error.code === '23505';
    const errorMessage = isDuplicateError 
      ? 'Email already registered' 
      : 'Registration failed';

    const errorCode = isDuplicateError 
      ? 'EMAIL_EXISTS' 
      : 'SERVER_ERROR';

    return res.status(isDuplicateError ? 409 : 500).json({
      success: false,
      error: errorMessage,
      code: errorCode,
      requestId
    });
  } finally {
    // Release client back to pool
    client.release();
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Validate input
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const client = await pool.connect();
  try {
    // 1. First check authentication provider
    const authCheck = await client.query(
      `SELECT auth_provider FROM users WHERE email = $1`,
      [email]
    );

    if (authCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    if (authCheck.rows[0].auth_provider !== 'email') {
      return res.status(403).json({
        error: `This account was created using ${authCheck.rows[0].auth_provider} authentication`,
        code: 'WRONG_AUTH_PROVIDER',
        provider: authCheck.rows[0].auth_provider
      });
    }

    // 2. Generate reset code (only for email-based accounts)
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // 3. Update reset code
    const { rows } = await client.query(
      `UPDATE users SET
        reset_code = $1,
        reset_code_expires_at = $2
       WHERE email = $3
       RETURNING id, email`,
      [resetCode, resetCodeExpires, email]
    );

    if (rows.length === 0) {
      return res.status(500).json({ error: 'Failed to generate reset code' });
    }
    await transporter.sendMail({
      from:{
         name: process.env.Mail_FROM_NAME || 'Spatial Force',
         address: process.env.MAIL_FROM || 'no-reply@spatialcorce.co.zw'
        },
      to: email,
      subject: 'Password Reset Code',
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Dear User,</p>
        <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
        <p>Your password reset code is:</p>
        <div style="font-size: 24px; letter-spacing: 2px; margin: 20px 0; padding: 15px; background: #F7FAFC; border: 1px solid #ccc; border-radius: 4px;">
          ${resetCode}
        </div>
        <p>This code will expire in 15 minutes. Please enter it in the password reset form to proceed with resetting your password.</p>
        <p>If you have any issues or did not request a password reset, please contact our support team at <a href="mailto:support@example.com">support@example.com</a>.</p>
        <p>Thank you for your attention.</p>
        <p>Best regards,<br>The Support Team</p>
      </div>
    `,
    });



    res.status(200).json({ message: 'Reset code sent to email.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process reset request.' });
  } finally {
    client.release();
  }
});

app.get('/api/check-reset-token', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token is required.' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires_at > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Check reset token error:', error);
    res.status(500).json({ error: 'Failed to validate token.' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  // Validate input first
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Get user with valid reset code
    const userResult = await client.query(
      `SELECT id, password_hash 
       FROM users 
       WHERE email = $1 
         AND reset_code = $2
         AND reset_code_expires_at > NOW()
       FOR UPDATE`, // Lock the row
      [email, code]
    );

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    const user = userResult.rows[0];

    // 2. Compare passwords
    const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
    if (isSamePassword) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'New password must be different from current password' 
      });
    }

    // 3. Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await client.query(
      `UPDATE users SET
        password_hash = $1,
        reset_code = NULL,
        reset_code_expires_at = NULL
       WHERE id = $2`,
      [hashedPassword, user.id]
    );

    await client.query('COMMIT');
    res.status(200).json({ message: 'Password reset successful' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  } finally {
    client.release();
  }
});

app.post('/api/resend-reset-code', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if user exists
    const userResult = await client.query(
      `SELECT id, reset_code_expires_at 
       FROM users 
       WHERE email = $1 
       FOR UPDATE`,
      [email]
    );

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    
    // Prevent resend spam
    if (user.reset_code_expires_at && user.reset_code_expires_at > new Date()) {
      const remainingTime = Math.ceil(
        (new Date(user.reset_code_expires_at).getTime() - Date.now()) / 1000
      );
      
      await client.query('ROLLBACK');
      return res.status(429).json({ 
        error: `Please wait ${remainingTime} seconds before requesting new code`
      });
    }

    // Generate new code
    const newCode = crypto.randomInt(100000, 999999).toString();
    const newExpiry = new Date(Date.now() + 2* 60 * 1000); // 15 minutes

    await client.query(
      `UPDATE users SET
        reset_code = $1,
        reset_code_expires_at = $2
       WHERE id = $3`,
      [newCode, newExpiry, user.id]
    );

    // Send email
    await transporter.sendMail({
      from: {
        name: process.env.MAIL_FROM_NAME || 'Spatial Force',
        address: process.env.MAIL_FROM || 'no-reply@spatialforce.co.zw'
      },
      to: normalizedEmail,
      subject: 'New Password Reset Code',
      html: `
      <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: auto; border: 1px solid #E2E8F0; border-radius: 8px; background-color: #FFFFFF;">
      <h2 style="color: #2B6CB0; text-align: center;">New Password Reset Code Request</h2>
      
      <p style="font-size: 1.1em;">We received a request to reset your password. To proceed, please use the code provided below to verify your identity and set a new password for your account.</p>
      
      <p style="font-size: 1.1em;">Your new password reset code is:</p>
      
      <div style="font-size: 36px; letter-spacing: 5px; margin: 25px 0; 
        padding: 20px; background: #F7FAFC; text-align: center; border-radius: 5px; 
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
        <strong>${newCode}</strong>
      </div>
      
      <p style="font-size: 1em;">Please note: This code is valid for <strong>15 minutes</strong>. If you do not use it within this time frame, you will need to request a new code.</p>
      
      <p style="color: #718096; font-size: 0.9em; text-align: center;">
        If you did not request this password reset, please disregard this email. Your account security is our top priority.
      </p>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="https://spatialforce.co.zw" style="text-decoration: none; color: #2B6CB0; font-weight: bold;">Visit our website</a>
        for more information or assistance.
      </p>
    </div>
      `,
    });

    await client.query('COMMIT');
    res.status(200).json({ success: true });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Resend code error:', error);
    res.status(500).json({ error: 'Failed to resend code' });
  } finally {
    client.release();
  }
});

app.post('/api/check-password', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT password_hash FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isSame = await bcrypt.compare(password, userResult.rows[0].password_hash);
    res.json({ isSame });
    
  } catch (error) {
    console.error('Password check error:', error);
    res.status(500).json({ error: 'Password check failed' });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const userId = req.user?.userId; // Get authenticated user ID if exists

    const query = userId ? 
      `SELECT 
        r.id::integer,
        COALESCE(r.rating, 0)::integer as rating,
        COALESCE(r.comment, '') as comment,
        r.created_at as date,
        COALESCE(r.likes, 0)::integer as likes,
        u.id::integer as user_id,
        COALESCE(u.first_name, 'Anonymous') as first_name,
        COALESCE(u.last_name, '') as last_name,
        EXISTS(
          SELECT 1 FROM review_likes 
          WHERE review_id = r.id AND user_id = $1
        ) as has_liked
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.is_active = TRUE
      ORDER BY r.created_at DESC`
      : 
      `SELECT 
        r.id::integer,
        COALESCE(r.rating, 0)::integer as rating,
        COALESCE(r.comment, '') as comment,
        r.created_at as date,
        COALESCE(r.likes, 0)::integer as likes,
        u.id::integer as user_id,
        COALESCE(u.first_name, 'Anonymous') as first_name,
        COALESCE(u.last_name, '') as last_name,
        false as has_liked
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.is_active = TRUE
      ORDER BY r.created_at DESC`;

    const { rows } = await pool.query(query, userId ? [userId] : []);

    res.json({ 
      reviews: rows.map(row => ({
        ...row,
        firstName: row.first_name,
        lastName: row.last_name,
        hasLiked: row.has_liked
      }))
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});
// PUT /api/reviews/:id
app.put('/api/reviews/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.userId;

  // Add validation
  if (typeof rating === 'undefined' || typeof comment === 'undefined') {
    return res.status(400).json({ 
      error: 'Rating and comment are required' 
    });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE reviews SET
        rating = $1,
        comment = $2,
        updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING id, rating, comment, created_at as date`,
      [rating, comment.trim(), id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const userResult = await pool.query(
      'SELECT first_name, last_name FROM users WHERE id = $1',
      [userId]
    );

    res.json({
      ...rows[0],
      firstName: userResult.rows[0].first_name,
      lastName: userResult.rows[0].last_name
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});


app.delete('/api/reviews/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM reviews WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// POST /api/reviews - Add input validation
app.post('/api/reviews', authenticateJWT, async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user.userId;

  if (!rating || !comment) {
    return res.status(400).json({
      success: false,
      error: 'Rating and comment are required'
    });
  }

  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({
      success: false,
      error: 'Invalid rating value'
    });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO reviews (
        user_id,
        rating,
        comment
      ) VALUES ($1, $2, $3 )
      RETURNING id, user_id,rating, comment, created_at as date`,
      [userId, numericRating, comment] 
    );
    const userResult = await pool.query(
      'SELECT first_name, last_name FROM users WHERE id = $1', 
      [userId]
    );
    

    console.log('New review created:', rows[0]);
    res.status(201).json({
      success: true,
      review: {
        ...rows[0],
        firstName: userResult.rows[0].first_name,
        lastName: userResult.rows[0].last_name
      }
    })  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit review'
    });
  }
});
// POST /api/reviews/:id/like
app.post('/api/reviews/:id/like', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await pool.query('BEGIN');
    
    // Insert like and get current like status
    const { rows } = await pool.query(
      `WITH inserted_like AS (
        INSERT INTO review_likes (review_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (review_id, user_id) DO NOTHING
        RETURNING 1
      )
      UPDATE reviews
      SET likes = likes + (SELECT COUNT(*) FROM inserted_like)
      WHERE id = $1
      RETURNING id, likes`,
      [id, userId]
    );

    // Check if user currently likes the review
    const likeStatus = await pool.query(
      `SELECT EXISTS(
        SELECT 1 FROM review_likes 
        WHERE review_id = $1 AND user_id = $2
      ) AS has_liked`,
      [id, userId]
    );

    await pool.query('COMMIT');
    
    res.json({
      likes: rows[0].likes,
      hasLiked: likeStatus.rows[0].has_liked
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Like error:', error);
    res.status(500).json({ error: 'Failed to like review' });
  }
});

// DELETE /api/reviews/:id/like
app.delete('/api/reviews/:id/like', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await pool.query('BEGIN');

    const { rows } = await pool.query(
      `WITH deleted AS (
        DELETE FROM review_likes 
        WHERE review_id = $1 AND user_id = $2
        RETURNING 1
      )
      UPDATE reviews
      SET likes = GREATEST(likes - (SELECT COUNT(*) FROM deleted), 0)
      WHERE id = $1
      RETURNING id, likes`,
      [id, userId]
    );

    await pool.query('COMMIT');
    
    res.json({
      likes: rows[0].likes,
      hasLiked: false // After delete, always false
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Unlike error:', error);
    res.status(500).json({ error: 'Failed to remove like' });
  }
});



// ====================
// ====================
// Booking Routes
// ====================

// Validate Booking Middleware
const validateBooking = (req, res, next) => {
  const requiredFields = ['name', 'email', 'service', 'date', 'time', 'consultationMethod'];
  const errors = [];
  const received = {};

  requiredFields.forEach(field => {
    received[field] = req.body[field] || '';
    if (!req.body[field]?.trim()) {
      errors.push(`${field} is required`);
    }
  });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email?.trim())) {
    errors.push('Invalid email format');
  }

  const validMethods = ['Teams', 'WhatsApp Call', 'Other'];
  if (!validMethods.includes(req.body.consultationMethod?.trim())) {
    errors.push(`Invalid consultation method. Valid options: ${validMethods.join(', ')}`);
  }

  if (req.body.consultationMethod === 'WhatsApp Call' && !req.body.whatsappContact?.trim()) {
    errors.push('WhatsApp contact required for WhatsApp calls');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
      received
    });
  }

  next();
};


// Email Templates
// ====================

const bookingEmailTemplate = (data) => `
  <div style="font-family: Arial, sans-serif; padding: 25px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 25px;">
      <h1 style="color: #2b6cb0; margin: 0;">Booking Confirmed!</h1>
      <p style="color: #4a5568; margin-top: 10px;">
        Thank you for choosing Spatial Force, ${data.name}! We're excited to work with you.
      </p>
    </div>

    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="color: #2d3748; margin-top: 0; margin-bottom: 15px;">Your Booking Details</h3>
      
      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 10px; margin-bottom: 15px;">
        <span style="color: #718096;">Service:</span>
        <span style="color: #2d3748;">${data.service}</span>
        <span style="color: #718096;">Date:</span>
        <span style="color: #2d3748;">${new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span style="color: #718096;">Time:</span>
        <span style="color: #2d3748;">${data.time} (Local Time)</span>
        <span style="color: #718096;">Consultation Method:</span>
        <span style="color: #2d3748;">${data.consultationMethod}</span>
      </div>

      ${data.teamsLink ? `
      <div style="background: #ebf8ff; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <h4 style="color: #3182ce; margin: 0 0 10px 0;">Microsoft Teams Meeting</h4>
        <p style="margin: 5px 0;">
          Join your meeting using this link: 
          <a href="${data.teamsLink}" style="color: #3182ce; text-decoration: none;">Join Meeting</a>
        </p>
      </div>` : ''}

      ${data.whatsappContact ? `
      <div style="background: #f0fff4; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <h4 style="color: #38a169; margin: 0 0 10px 0;">WhatsApp Consultation</h4>
        <p style="margin: 5px 0;">
          We will contact you at: <strong>${data.whatsappContact}</strong>
        </p>
      </div>` : ''}
    </div>

    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
      <p style="color: #718096; margin: 0; font-size: 0.9em;">
        <strong>Note:</strong> If you did not make this booking, please contact us immediately.
      </p>
    </div>
  </div>
`;

const inquiryEmailTemplate = (data) => `
  <div style="font-family: Arial, sans-serif; padding: 25px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 25px;">
      <h1 style="color: #2b6cb0; margin: 0;">Inquiry Received!</h1>
      <p style="color: #4a5568; margin-top: 10px;">
        Thank you for contacting us, ${data.name}! We'll respond shortly.
      </p>
    </div>

    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="color: #2d3748; margin-top: 0; margin-bottom: 15px;">Your Inquiry Details</h3>
      
      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 10px; margin-bottom: 15px;">
        <span style="color: #718096;">Inquiry Type:</span>
        <span style="color: #2d3748;">${data.inquiry_type}</span>
        <span style="color: #718096;">Name:</span>
        <span style="color: #2d3748;">${data.name}</span>
        <span style="color: #718096;">Email:</span>
        <span style="color: #2d3748;">${data.email}</span>
        ${data.organization ? `
        <span style="color: #718096;">Organization:</span>
        <span style="color: #2d3748;">${data.organization}</span>
        ` : ''}
      </div>
    </div>

    <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="color: #2d3748; margin-top: 0; margin-bottom: 15px;">Your Message</h3>
      <div style="background: #f8fafc; padding: 15px; border-radius: 6px;">
        <div style="white-space: pre-wrap; line-height: 1.6;">
          ${data.message}
        </div>
      </div>
    </div>
  </div>
`;


app.post('/api/bookings', validateBooking, async (req, res) => {
  try {
    const { name, email, service, date, time, consultationMethod, whatsappContact } = req.body;
    const teamsLink = consultationMethod === 'Teams'
      ? `https://teams.microsoft.com/l/meeting/new?subject=${encodeURIComponent(service)}&attendees=${email}`
      : null;

    // Database Insert
    const { rows } = await pool.query(
      `INSERT INTO bookings (
        name, email, service, date, time,
        consultation_method, whatsapp_contact, teams_link
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, created_at`,
      [
        name.trim(),
        email.trim(),
        service.trim(),
        date,
        time,
        consultationMethod.trim(),
        consultationMethod === 'WhatsApp Call' ? whatsappContact.trim() : null,
        teamsLink
      ]
    );

    // Client Confirmation Email
    await transporter.sendMail({
      from: {
        name: process.env.MAIL_FROM_NAME || 'Spatial Force',
        address: process.env.MAIL_FROM || 'no-reply@spatialforce.co.zw'
      },
      to: process.env.ADMIN_EMAIL,
      subject: `Booking Confirmation: ${service}`,
      html: bookingEmailTemplate({ 
        name, 
        email, 
        service, 
        date, 
        time, 
        consultationMethod, 
        whatsappContact, 
        teamsLink 
      })
    });

    // Admin Notification
    if (process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        from: {
          name: process.env.MAIL_FROM_NAME || 'Spatial Force',
          address: process.env.MAIL_FROM || 'no-reply@spatialforce.co.zw'
        },
        to: process.env.ADMIN_EMAIL,
        subject: `NEW BOOKING: ${service} by ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #2b6cb0;">New Booking Alert</h2>
            <p>A new booking has been created:</p>
            <ul>
              <li><strong>Client:</strong> ${name}</li>
              <li><strong>Service:</strong> ${service}</li>
              <li><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</li>
              <li><strong>Time:</strong> ${time}</li>
              <li><strong>Method:</strong> ${consultationMethod}</li>
              ${teamsLink ? `<li><strong>Teams Link:</strong> <a href="${teamsLink}">Join Meeting</a></li>` : ''}
              ${whatsappContact ? `<li><strong>WhatsApp:</strong> ${whatsappContact}</li>` : ''}
            </ul>
          </div>
        `
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      bookingId: rows[0].id,
      teamsLink
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking'
    });
  }
});

// ====================
// Inquiry Routes
// ====================

// Validate Inquiry Middleware
const validateInquiry = (req, res, next) => {
  const requiredFields = ['name', 'email', 'message', 'inquiry_type'];
  const errors = [];
  const received = {};

  requiredFields.forEach(field => {
    received[field] = req.body[field] || '';
    if (!req.body[field]?.trim()) {
      errors.push(`${field} is required`);
    }
  });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email?.trim())) {
    errors.push('Invalid email format');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
      received
    });
  }

  next();
};

app.post('/api/inquiries', validateInquiry, async (req, res) => {
  try {
    const { name, email, organization, message, inquiry_type } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO inquiries (
        name, email, organization, message, inquiry_type
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at`,
      [
        name.trim(),
        email.trim(),
        organization?.trim() || null,
        message.trim(),
        inquiry_type.trim()
      ]
    );

    // Client Confirmation
    await transporter.sendMail({
      from: `"Spatial Force " <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Inquiry Received: ${inquiry_type}`,
      html: inquiryEmailTemplate(req.body)
    });

    // Admin Notification
    if (process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        from: {
          name: process.env.MAIL_FROM_NAME || 'Spatial Force',
          address: process.env.MAIL_FROM || 'no-reply@spatialforce.co.zw'
        },
        to: process.env.ADMIN_EMAIL,
        subject: `NEW INQUIRY: ${inquiry_type} from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #2b6cb0;">New Inquiry Alert</h2>
            <p>Details:</p>
            <ul>
              <li><strong>From:</strong> ${name} (${email})</li>
              <li><strong>Type:</strong> ${inquiry_type}</li>
              ${organization ? `<li><strong>Organization:</strong> ${organization}</li>` : ''}
              <li><strong>Message:</strong> ${message}</li>
            </ul>
          </div>
        `
      });
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      inquiryId: rows[0].id
    });
  } catch (error) {
    console.error('Inquiry error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit inquiry'
    });
  }
});

// Add this middleware to validate Google sessions
app.use((req, res, next) => {
  if (req.path === '/api/auth/session' && req.user?.authProvider === 'google') {
    jwt.verify(req.user.token, process.env.JWT_SECRET, (err) => {
      if (!err) return next();
      res.clearCookie('auth_token');
      res.status(401).json({ authenticated: false });
    });
  } else {
    next();
  }
});

app.get('/api/test-email', async (req, res) => {
  try {
    await transporter.sendMail({
      from: `Test <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Email Test',
      text: 'This is a test email from SpatialForce'
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Email Test Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ====================
// Utility Routes
// ====================

// Health Check
app.get('/api/health', async (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unchecked',
      email: 'unchecked'
    },
    environment: process.env.NODE_ENV || 'development'
  };

  try {
    await pool.query('SELECT NOW()');
    healthCheck.services.database = 'healthy';
    
    if (process.env.EMAIL_USER) {
      await transporter.verify();
      healthCheck.services.email = 'authenticated';
    } else {
      healthCheck.services.email = 'disabled';
    }
    
    res.json(healthCheck);
  } catch (error) {
    healthCheck.status = 'degraded';
    healthCheck.error = error.message;
    res.status(503).json(healthCheck);
  }
});





// Trust first proxy if behind load balancer
app.set('trust proxy', 1);

// Cookie parser middleware
app.use(cookieParser());

// Secure cookie settings middleware
app.use((req, res, next) => {
  res.cookie('test-cookie', 'value', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true
  });
  next();
});
app.use((req, res, next) => {
  req.session.save((err) => {
    if (err) console.error('Session save error:', err);
    next();
  });
});
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
      user: req.user?.id || 'guest'
    });
  });
  next();
});

app.use((err, req, res, next) => {
  console.error('Server Error:', {
    message: err.message,
    stack: err.stack,
    query: req.query,
    body: req.body
  });
  res.status(500).json({ error: 'Internal server error' });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

app.use((err, req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  } else {
    next(err);
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.use((req, res, next) => {
  if (req.user && req.session.userId !== req.user.userId) {
    req.session.userId = req.user.userId;
    req.session.save();
  }
  next();
});


// Remove stack traces in production
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    delete err.stack;
  }
  res.status(500).json({ error: 'Internal Server Error' });
});


// ADD THIS AT THE VERY END OF server/index.js:

// Export the Express app for Vercel
export default app;

// Only start server directly if NOT in Vercel
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5001;
  
  const startup = async () => {
    await checkDatabase(); 
    try {
      await pool.query('SELECT 1');
      console.log('✅ Database connection established');

      if (process.env.EMAIL_USER) {
        await transporter.verify();
        console.log('✅ Email service authenticated');
      }

      app.listen(PORT, () => {
        console.log(`
        ===========================================
         Spatial Force Service API
        -------------------------------------------
         Status:       Operational
         Port:         ${PORT}
         Environment:  ${process.env.NODE_ENV || 'development'}
        ===========================================`);
      });
    } catch (startupError) {
      console.error('🚨 Failed to start server:', startupError);
      process.exit(1);
    }
  };

  startup();
}