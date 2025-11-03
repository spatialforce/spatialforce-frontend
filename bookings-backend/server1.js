import express from 'express';
import session from 'express-session';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import pkg from 'pg';
import path from 'path';
import axios from 'axios'
import { fileURLToPath } from 'url';
const { Pool } = pkg;
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import fetch from 'node-fetch'; // Add this at the top // ✅ Named import
import pgSession from 'connect-pg-simple';
import crypto from 'crypto'
import { GoogleAuth } from 'google-auth-library';
//const router = express.Router()
const pgSessionStore = pgSession(session);





// ==============
// Initialization
// ==============
dotenv.config();
const app = express();
const router = express.Router()
const PORT = process.env.PORT || 5001
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// ==============
// Database Setup
// ==============
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true' ? { 
    rejectUnauthorized: false 
  } : false
});

// Add this BEFORE creating your transporter
delete require.cache[require.resolve('nodemailer')];
const freshNodemailer = require('nodemailer');
const transporter = freshNodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  // Explicitly disable all caching
  pool: false,
  logger: true,
  debug: true
});

// Verify connection
transporter.verify()
  .then(() => console.log('NEW TRANSPORTER READY'))
  .catch(err => console.error('FRESH TRANSPORTER ERROR:', err));

// Middleware
// ==============
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use((req, res, next) => {
    res.locals.metaTags = {
      title: 'Spatial Force - Your Trusted Partner',
      description: 'Spatial Force offers top-notch services for your needs. Book a consultation today!',
      keywords: 'spatial force, consultation, booking, services',
      canonicalUrl: `https://spatialforce.co.zw${req.path}`,
    };
    next();
  });
  app.use((req, res, next) => {
    res.locals.openGraphTags = {
      title: 'Spatial Force - Your Trusted Partner',
      description: 'Professional consultation services',
      image: 'https://spatialforce.co.zw/logo.png',
      url: `https://spatialforce.co.zw${req.path}`,
    };
    next();
  });

// ================
// Validation Logic
// ================
const validateEmail = (email) => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateBooking = (req, res, next) => {
  const requiredFields = [
    'name', 'email', 'service', 
    'date', 'time', 'consultationMethod'
  ];
  
  const errors = [];
  const received = {};

  requiredFields.forEach(field => {
    received[field] = req.body[field] || '';
    if (!req.body[field]?.trim()) {
      errors.push(`${field} is required`);
    }
  });

  if (!validateEmail(req.body.email?.trim())) {
    errors.push('Invalid email format');
  }

  const validMethods = ['Teams', 'WhatsApp Call', 'Other'];
  if (!validMethods.includes(req.body.consultationMethod?.trim())) {
    errors.push(`Invalid consultation method. Valid options: ${validMethods.join(', ')}`);
  }

  if (req.body.consultationMethod === 'WhatsApp Call' && 
      !req.body.whatsappContact?.trim()) {
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

  if (!validateEmail(req.body.email?.trim())) {
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


// Initialize Google Auth

// Email Templates
// ================
const bookingEmailTemplate = (data) => `
  <div style="font-family: Arial, sans-serif; padding: 25px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px;">
    <!-- Header Section -->
    <div style="text-align: center; margin-bottom: 25px;">
      <h1 style="color: #2b6cb0; margin: 0;">Booking Confirmed!</h1>
      <p style="color: #4a5568; margin-top: 10px;">
        Thank you for choosing Spatial Force, ${data.name}! We're excited to work with you and provide the best service for your needs.
      </p>
    </div>

    <!-- Booking Details -->
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
        <small style="color: #718096;">
          Please join 5 minutes before the scheduled time to ensure a smooth start.
        </small>
      </div>` : ''}

      ${data.whatsappContact ? `
      <div style="background: #f0fff4; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <h4 style="color: #38a169; margin: 0 0 10px 0;">WhatsApp Consultation</h4>
        <p style="margin: 5px 0;">
          We will contact you at: <strong>${data.whatsappContact}</strong>
        </p>
        <small style="color: #718096;">
          Ensure WhatsApp is installed and active on this number at the scheduled time.
        </small>
      </div>` : ''}
    </div>

    <!-- Additional Information -->
    <div style="background: #fffaf0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="color: #dd6b20; margin-top: 0; margin-bottom: 15px;">What to Expect</h3>
      <ul style="color: #718096; padding-left: 20px; margin: 0;">
        <li>Our team will prepare all necessary materials for your consultation.</li>
        <li>You'll receive a reminder 1 hour before your scheduled time.</li>
        <li>Feel free to bring any questions or documents to the session.</li>
      </ul>
    </div>

    <!-- Security Notice -->
    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
      <p style="color: #718096; margin: 0; font-size: 0.9em;">
        <strong>Security Notice:</strong> If you did not make this booking or believe this was sent in error, 
        please contact us immediately at 
        <a href="mailto:security@spatialforce.com" style="color: #2b6cb0; text-decoration: none;">security@spatialforce.com</a>.
      </p>
    </div>
  </div>
`;
// ==============
// API Endpoints

// Payment Intent
// Keep your existing payment intent endpoint
// Backend route handler
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      description: 'Test payment' // Add description for clarity
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add webhook endpoint for post-payment processing
app.post('/stripe-webhook', 
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle successful payments
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log(`Payment succeeded: ${paymentIntent.id}`);
      // Update your database here
    }

    res.json({ received: true });
  }
);


app.post('/api/verify-token', async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'User not found.' });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).json({ error: 'Invalid token.' });
  }
});


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
      from: `"Spatial Force Bookings" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Booking Confirmation: ${service} - ${new Date(date).toDateString()}`,
      html: bookingEmailTemplate({ ...req.body, teamsLink })
    });

    // Admin Notification
    if (process.env.ADMIN_EMAIL) {
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2b6cb0;">New Booking Alert 🔔</h2>
          <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">Client</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">Service</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${service}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">Date/Time</td>
              <td style="padding: 8px; border: 1px solid #ddd;">
                ${new Date(date).toLocaleDateString()} ${time}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">Contact Method</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${consultationMethod}</td>
            </tr>
            ${teamsLink ? `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">Teams Link</td>
              <td style="padding: 8px; border: 1px solid #ddd;">
                <a href="${teamsLink}">Join Meeting</a>
              </td>
            </tr>` : ''}
            ${whatsappContact ? `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;">WhatsApp</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${whatsappContact}</td>
            </tr>` : ''}
          </table>
          <div style="margin-top: 20px; color: #718096;">
            <p>Booking ID: ${rows[0].id}</p>
            <p>Received at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"Booking System" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `NEW BOOKING: ${service} by ${name}`,
        html: adminHtml
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      bookingId: rows[0].id,
      teamsLink
    });

  } catch (error) {
    console.error('[Booking Error]', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/inquiries', validateInquiry, async (req, res) => {
  try {
    const { name, email, organization, message, inquiry_type, specific_field, project_size, timeline } = req.body;

    // Database Insert
    const { rows } = await pool.query(
      `INSERT INTO inquiries (
        name, email, organization, message,
        inquiry_type, specific_field, project_size, timeline
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, created_at`,
      [
        name.trim(),
        email.trim(),
        organization?.trim() || null,
        message.trim(),
        inquiry_type.trim(),
        specific_field?.trim() || null,
        project_size?.trim() || null,
        timeline?.trim() || null
      ]
    );

    // Client Confirmation Email
    await transporter.sendMail({
      from: `"Spatial Force Inquiries" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Inquiry Received: ${inquiry_type}`,
      html: inquiryEmailTemplate(req.body)
    });

    // Admin Notification
    if (process.env.ADMIN_EMAIL) {
      const adminHtml = `
      <div style="font-family: Arial, sans-serif; padding: 25px; max-width: 800px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px;">
        <!-- Header Section -->
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #2b6cb0; margin: 0;">📨 New Inquiry Alert</h1>
          <p style="color: #4a5568; margin-top: 10px;">A new inquiry has been submitted through the Spatial Force website.</p>
        </div>
    
        <!-- Inquiry Summary -->
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #2d3748; margin-top: 0; margin-bottom: 15px;">Inquiry Summary</h3>
          
          <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f0f4f8; width: 30%;">From</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name} &lt;${email}&gt;</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f0f4f8;">Inquiry Type</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${inquiry_type}</td>
            </tr>
            ${organization ? `
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f0f4f8;">Organization</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${organization}</td>
            </tr>` : ''}
            ${project_size ? `
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f0f4f8;">Project Size</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${project_size}</td>
            </tr>` : ''}
            ${timeline ? `
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f0f4f8;">Timeline</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${timeline}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f0f4f8;">Submission Time</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f0f4f8;">Inquiry ID</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${rows[0].id}</td>
            </tr>
          </table>
        </div>
    
        <!-- Message Preview -->
        <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #2d3748; margin-top: 0; margin-bottom: 15px;">Message Details</h3>
          <div style="background: #f8fafc; padding: 15px; border-radius: 6px;">
            <h4 style="color: #3182ce; margin: 0 0 10px 0;">Full Message</h4>
            <div style="white-space: pre-wrap; max-height: 300px; overflow: auto; line-height: 1.6;">
              ${message}
            </div>
          </div>
        </div>
    
        <!-- Action Section -->
        <div style="background: #ebf8ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #2b6cb0; margin-top: 0; margin-bottom: 15px;">Next Steps</h3>
          <ol style="color: #4a5568; padding-left: 20px; margin: 0;">
            <li>Review the inquiry details above</li>
            <li>Check for any attachments or additional information</li>
            <li>Respond to the client within 24 hours</li>
            <li>Update the CRM system with the inquiry status</li>
          </ol>
        </div>
    
        <!-- Footer Section -->
        <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
          <p style="color: #718096; margin: 0; font-size: 0.9em;">
            <strong>Note:</strong> This is an automated notification. If you believe this inquiry was submitted in error, 
            please contact <a href="mailto:security@spatialforce.com" style="color: #2b6cb0; text-decoration: none;">security@spatialforce.com</a>.
          </p>
          <p style="color: #718096; margin: 10px 0 0 0; font-size: 0.9em;">
            &copy; ${new Date().getFullYear()} Spatial Force. All rights reserved.
          </p>
        </div>
      </div>
    `;

      await transporter.sendMail({
        from: `"Inquiry System" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `NEW INQUIRY: ${inquiry_type} from ${name}`,
        html: adminHtml
      });
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      inquiryId: rows[0].id
    });

  } catch (error) {
    console.error('[Inquiry Error]', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit inquiry',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ==================
// Health Check Route
// ==================
app.get('/api/health', async (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unchecked',
      email: 'unchecked'
    },
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version
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
    healthCheck.error = {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
    res.status(503).json(healthCheck);
  }
});
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true, // Add this line
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Add this
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());


app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, dateOfBirth, address, password } = req.body;

  try {
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'First name, last name, email, and password are required.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Check if user already exists
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate activation token
    const activationToken = crypto.randomBytes(20).toString('hex');
    const activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Insert user into database (set is_active to false by default)
    const { rows: newUser } = await pool.query(
      `INSERT INTO users (
        first_name,
        last_name,
        email,
        phone_number,
        date_of_birth,
        address,
        password_hash,
        activation_token,
        activation_token_expires,
        is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, first_name, email`,
      [firstName, lastName, email, phoneNumber, dateOfBirth, address, passwordHash, activationToken, activationTokenExpires, false] // is_active is false
    );

    // Send activation email
    const activationLink = `http://localhost:5001/api/activate?token=${activationToken}`;
    await transporter.sendMail({
      from: `"Spatial Force" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Activate Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Spatial Force!</h2>
          <p>Please click the link below to activate your account:</p>
          <a href="${activationLink}" style="background-color: #2b6cb0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Activate Account</a>
          <p>If you did not sign up for an account, please ignore this email.</p>
        </div>
      `
    });

    // Respond with success message
    res.status(201).json({
      success: true,
      message: 'Signup successful! Please check your email to activate your account.',
      user: { 
        id: newUser[0].id, 
        firstName: newUser[0].first_name,
        email: newUser[0].email 
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to sign up.' });
  }
});
// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5001/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        
        // Check existing user
        const { rows } = await pool.query(
          'SELECT * FROM users WHERE email = $1', 
          [email]
        );

        if (rows.length > 0) return done(null, rows[0]);

        // Create new user
        const { rows: [newUser] } = await pool.query(
          `INSERT INTO users (
            first_name,
            last_name,
            email,
            auth_provider
          ) VALUES ($1, $2, $3, $4)
          RETURNING *`,
          [
            profile.name.givenName,
            profile.name.familyName,
            email,
            'google'
          ]
        );

        done(null, newUser);
      } catch (error) {
        done(error);
      }
    }
  )
);
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:5001/api/auth/github/callback',
      scope: ['user:email'],
      userAgent: 'SpatialForce-App'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = await getPrimaryEmail(accessToken);
        
        if (!email) {
          return done(new Error('No verified email found with GitHub account'));
        }

        const { rows } = await pool.query(
          'SELECT * FROM users WHERE email = $1', 
          [email]
        );

        if (rows.length > 0) return done(null, rows[0]);

        const name = profile.displayName || 'GitHub User';
        const [firstName, ...lastNameParts] = name.split(' ');
        const lastName = lastNameParts.join(' ') || 'User';

        const { rows: [newUser] } = await pool.query(
          `INSERT INTO users (
            first_name,
            last_name, 
            email, 
            auth_provider
          ) VALUES ($1, $2, $3, $4)
          RETURNING *`,
          [firstName, lastName, email, 'github'] // Now 4 values
        );

        done(null, newUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Helper to fetch primary email
async function getPrimaryEmail(accessToken) {
  try {
    const response = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${accessToken}`,
        'User-Agent': 'SpatialForce-App'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch emails');
    
    const emails = await response.json();
    const verifiedEmails = emails.filter(email => email.verified);
    
    if (verifiedEmails.length === 0) {
      throw new Error('No verified emails found');
    }
    
    const primary = verifiedEmails.find(email => email.primary) || verifiedEmails[0];
    return primary.email;
  } catch (error) {
    console.error('GitHub email error:', error.message);
    throw error;
  }
}

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    
    // Add user existence check
    if (!rows || rows.length === 0) {
      return done(null, false); // Explicitly state no user found
    }
    
    done(null, rows[0]);
  } catch (error) {
    done(error, null);
  }
});

// ==============
// Routes
// ==============

// Google OAuth Routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, generate JWT token
    const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

// GitHub OAuth Routes
app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get(
  '/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, generate JWT token
    const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);
app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    
    // Clear session cookie
    req.session.destroy((err) => {
      if (err) console.error('Session destruction error:', err);
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
});
app.use('/api', router)

app.use(
  session({
    store: new pgSessionStore({
      pool: pool,
      tableName: 'user_sessions'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);
app.use(
  session({
    store: new pgSessionStore({
      pool: pool,
      tableName: 'user_sessions',
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

// ==============


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    // Check if the account is activated
    if (!user.is_active) {
      return res.status(400).json({ error: 'Account not activated' });
    }

    // Compare the password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ user: { id: user.id, email: user.email }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to log in.' });
  }
});

app.post('/api/resend-activation', async (req, res) => {
  const { email } = req.body;

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    if (user.is_active) {
      return res.status(400).json({ error: 'Account is already activated.' });
    }

    // Generate a new activation token
    const activationToken = crypto.randomBytes(20).toString('hex');
    const activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update the user with the new activation token
    await pool.query(
      'UPDATE users SET activation_token = $1, activation_token_expires = $2 WHERE id = $3',
      [activationToken, activationTokenExpires, user.id]
    );

    // Send activation email
    const activationLink = `http://localhost:5001/api/activate?token=${activationToken}`;
    await transporter.sendMail({
      from:`"Spatial spatial" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Activate Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Spatial Force!</h2>
          <p>Please click the link below to activate your account:</p>
          <a href="${activationLink}" style="background-color: #2b6cb0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Activate Account</a>
          <p>If you did not sign up for an account, please ignore this email.</p>
        </div>
      `
    });

    res.json({ success: true, message: 'Activation email has been resent.' });
  } catch (error) {
    console.error('Resend activation error:', error);
    res.status(500).json({ error: 'Failed to resend activation email.' });
  }
});

app.post('/api/google-signin', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    // Check if the user already exists
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = rows[0];

    if (!user) {
      // Create a new user if they don't exist
      const { rows: newUser } = await pool.query(
        `INSERT INTO users (
          first_name,
          last_name,
          email
        ) VALUES ($1, $2, $3) RETURNING id, email`,
        [given_name, family_name, email]
      );
      user = newUser[0];
    }

    // Generate a JWT token
    const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Return the user and token
    res.json({ user: { id: user.id, email: user.email }, token: jwtToken });
  } catch (error) {
    console.error('Google Sign-In error:', error);
    res.status(500).json({ error: 'Failed to sign in with Google.' });
  }
});

app.get('/api/activate', async (req, res) => {
  const { token } = req.query;

  try {
    // Find user by activation token
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE activation_token = $1 AND activation_token_expires > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired activation token.' });
    }

    const user = rows[0];

    // Activate the user
    await pool.query(
      'UPDATE users SET is_active = true, activation_token = NULL, activation_token_expires = NULL WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/?token=${jwtToken}`);
  } catch (error) {
    console.error('Activation error:', error);
    res.status(500).json({ error: 'Failed to activate account.' });
  }
});
app.post('/api/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      user: {
        id: rows[0].id,
        email: rows[0].email
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    console.log('Received forgot password request for:', email); // Debugging

    // Check if the user exists in the database
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      console.log('User not found for email:', email); // Debugging
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = rows[0];

    // Generate a reset token and set an expiration time (1 hour from now)
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour

    // Update the user's reset token and expiration time in the database
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires_at = $2 WHERE id = $3',
      [resetToken, resetTokenExpiresAt, user.id]
    );

    // Generate the reset link
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    console.log('Reset link:', resetLink); // Debugging

    // Send the reset email
    await transporter.sendMail({
      from: `"Spatial Force" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}" style="background-color: #2b6cb0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    // Respond with success
    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send password reset email.' });
  }
});
router.get('/check-reset-token', async (req, res) => {
  const { token } = req.query;

  try {
    // 1. Find the user by the reset token and check if it's still valid
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
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // 1. Validate the new password
    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required.' });
    }

    // 2. Find the user by the reset token and check if it's still valid
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires_at > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    const user = rows[0];

    // 3. Hash the new password
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 4. Update the user's password and clear the reset token
    await pool.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires_at = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});






 // ✅ ES Modules export
// Server Lifecycle
// ================



// Derive __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});



const auth = new GoogleAuth({
  keyFilename: path.join(__dirname, 'config', 'kudzanaichakavarika-exol-06df5fbe5be1.json'), // Path to your key file
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

app.post('/api/dialogflow', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    // Validate request body
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Missing required fields: message or sessionId' });
    }

    // Get access token
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    // Call Dialogflow API
    const response = await axios.post(
      `https://dialogflow.googleapis.com/v2/projects/kudzanaichakavarika-exol/agent/sessions/${sessionId}:detectIntent`,
      {
        queryInput: {
          text: {
            text: message,
            languageCode: 'en',
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
      }
    );

    // Handle empty responses
    const fulfillmentText = response.data.queryResult.fulfillmentText ||
      "I'm sorry, I couldn't understand your question. Please contact us on WhatsApp at +263717428085 for assistance.";

    res.json({ response: { queryResult: { fulfillmentText } } });
  } catch (error) {
    console.error('Dialogflow API error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to process message' });
  }
});




const startup = async () => {
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
      Database:     ${process.env.DB_NAME}@${process.env.DB_HOST}
      Email Service: ${process.env.EMAIL_USER ? 'Enabled' : 'Disabled'}
      Environment:  ${process.env.NODE_ENV || 'development'}
      ===========================================`);
    });
  } catch (startupError) {
    console.error('🚨 Failed to start server:', startupError);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
  try {
    await pool.end();
    transporter.close();
    console.log('✅ Services closed');
    process.exit(0);
  } catch (shutdownError) {
    console.error('❌ Shutdown errors:', shutdownError);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
  try {
    await pool.end();
    transporter.close();
    console.log('✅ Services closed');
    process.exit(0);
  } catch (shutdownError) {
    console.error('❌ Shutdown errors:', shutdownError);
    process.exit(1);
  }
});

export default router;
startup();