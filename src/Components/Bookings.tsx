import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaCheckCircle, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './Bookings.css';

const BookingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const serviceDetails = location.state?.serviceDetails || {};

  const [formData, setFormData] = useState({
    name: user?.name || '',
    service: serviceDetails.name || '',
    date: '',
    time: '',
    consultationMethod: '',
    whatsappContact: '',
  });

  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState({
    whatsappContact: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    document.title = 'Book Consultation | Spatial Force';
    if (!user) {
      navigate('/booking-login-prompt');
    }
  }, [user, navigate]);

  const today = new Date().toISOString().split('T')[0];

  const validateWhatsapp = (number: string) => {
    const regex = /^\+263(77|78|71|73)\d{7}$/;
    if (!regex.test(number)) {
      setErrors(prev => ({ ...prev, whatsappContact: 'Invalid Zimbabwean WhatsApp number' }));
      return false;
    }
    return true;
  };

  const validateDateTime = () => {
    const now = new Date();
    const selectedDate = new Date(`${formData.date}T${formData.time}`);
    if (selectedDate < now) {
      setErrors(prev => ({ ...prev, date: 'Cannot select past date/time' }));
      return false;
    }
    return true;
  };

  // Bookings.tsx (Updated)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({ whatsappContact: '', date: '', time: '' });

  if (formData.consultationMethod === 'WhatsApp Call' && !validateWhatsapp(formData.whatsappContact)) return;
  if (!validateDateTime()) return;

  setSubmissionStatus('loading');

  try {
    const response = await axios.post(`${API_BASE_URL}/bookings`, {
      ...formData,
      email: user?.email,
      serviceDetails
    }, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    // Remove the separate email endpoint call
    setSubmissionStatus('success');
    setTimeout(() => navigate('/'), 2000);
  } catch (error) {
    console.error('Booking error:', error);
    setSubmissionStatus('error');
    setTimeout(() => setSubmissionStatus('idle'), 3000);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!user) return null;

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        <header className="bookings-header">
          <h1>Schedule Your Consultation</h1>
          {serviceDetails.name && (
            <div className="service-preview">
              <p>Selected Service: <strong>{serviceDetails.name}</strong></p>
              {serviceDetails.duration && <span>{serviceDetails.duration}</span>}
            </div>
          )}
        </header>

        {submissionStatus === 'success' ? (
          <div className="submission-success">
            <FaCheckCircle className="success-icon" />
            <h3>Booking Confirmed!</h3>
            <p>Check your email for confirmation details</p>
          </div>
        ) : submissionStatus === 'error' ? (
          <div className="submission-error">
            <h3>Booking Failed</h3>
            <p>Please try again or contact support</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-grid">
              <div className="form-group">
                <label>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>
                
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="disabled-field"
                />
              </div>

              <div className="form-group">
                <label>
                  Service Type
                </label>
                <select
                  name="service"
                  required
                  value={formData.service}
                  onChange={handleChange}
                >
                  <option value="">Select Service</option>
                  <option value="GIS Solutions">GIS Solutions</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Consultation Method
                </label>
                <select
                  name="consultationMethod"
                  required
                  value={formData.consultationMethod}
                  onChange={handleChange}
                >
                  <option value="">Select Method</option>
                  <option value="Teams">Microsoft Teams</option>
                  <option value="WhatsApp Call">WhatsApp Call</option>
                </select>
              </div>

              {formData.consultationMethod === 'WhatsApp Call' && (
                <div className="form-group whatsapp-group">
                  <label>
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsappContact"
                    pattern="\+263[77|78|71|73][0-9]{7}"
                    value={formData.whatsappContact}
                    onChange={handleChange}
                    required
                    placeholder="+263 77 123 4567"
                  />
                  {errors.whatsappContact && (
                    <span className="error-message">{errors.whatsappContact}</span>
                  )}
                </div>
              )}

              <div className="form-group">
                <label>
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label>
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={submissionStatus === 'loading'}
            >
              {submissionStatus === 'loading' ? (
                <>
                  <span className="loading-spinner" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm Booking
                  <FaArrowRight className="button-icon" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;