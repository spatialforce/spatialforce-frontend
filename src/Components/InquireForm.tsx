import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet'; // Import Helmet for SEO
import './InquireForm.css';
import { API_BASE_URL } from './config';

type InquiryType = 'environment-analysis' | 'agricultural-solutions' | 'resource-management';

const InquireForm: React.FC = () => {
  const { inquiryType } = useParams<{ inquiryType: InquiryType }>();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
    specific_field: '',
    project_size: '',
    timeline: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validation function
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getFormTitle = () => {
    switch (inquiryType) {
      case 'environment-analysis':
        return 'Environmental Analysis Request';
      case 'agricultural-solutions':
        return 'Agricultural Solutions Inquiry';
      case 'resource-management':
        return 'Resource Management Consultation';
      default:
        return 'General Inquiry';
    }
  };

  const getSpecificFieldLabel = () => {
    switch (inquiryType) {
      case 'environment-analysis':
        return 'Area of Interest (Coordinates) *';
      case 'agricultural-solutions':
        return 'Crop Type/Agricultural Focus *';
      case 'resource-management':
        return 'Resource Type (Minerals/Water/etc) *';
      default:
        return 'Specific Information *';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
  
    // Client-side validation
    if (!validateEmail(formData.email)) {
      setSubmitError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const payload = {
        ...formData,
        inquiry_type: inquiryType,
      };
  
      const response = await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed. Please try again.');
      }
  
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        organization: '',
        message: '',
        specific_field: '',
        project_size: '',
        timeline: '',
      });
  
      // Auto-close after 2 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    document.title = 'Spatial Force | Inquiries'; // Update the title
  }, []);

  return (
    <div className="form-container">
      {/* SEO Metadata */}
      <Helmet>
        <title>{getFormTitle()} - Spatial Force</title>
        <meta
          name="description"
          content="Submit your inquiry to Spatial Force for environmental analysis, agricultural solutions, or resource management. Our experts will respond within 24 hours."
        />
        <meta
          name="keywords"
          content="inquiry, spatial force, environmental analysis, agricultural solutions, resource management, consultation"
        />
        <meta property="og:title" content={`${getFormTitle()} - Spatial Force`} />
        <meta
          property="og:description"
          content="Submit your inquiry to Spatial Force for expert consultation services. We specialize in environmental analysis, agricultural solutions, and resource management."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://spatialforce.co.zw/inquire/${inquiryType}`} />
        <meta property="og:image" content="https://spatialforce.co.zw/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${getFormTitle()} - Spatial Force`} />
        <meta
          name="twitter:description"
          content="Submit your inquiry to Spatial Force for expert consultation services. We specialize in environmental analysis, agricultural solutions, and resource management."
        />
        <meta name="twitter:image" content="https://spatialforce.co.zw/logo.png" />
        <link rel="canonical" href={`https://spatialforce.co.zw/inquire/${inquiryType}`} />
      </Helmet>

      <div className="form-header">
        <h2>{getFormTitle()}</h2>
        <p className="form-description">
          Please provide detailed information about your project needs. We will respond within 24 hours.
        </p>
      </div>

      {submitSuccess ? (
        <div className="success-message">
          <h3>✓ Inquiry Submitted Successfully</h3>
          <p>Our team will contact you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                className="form-input"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Organization/Institution</label>
              <input
                type="text"
                className="form-input"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{getSpecificFieldLabel()}</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.specific_field}
                onChange={(e) => setFormData({ ...formData, specific_field: e.target.value })}
              />
            </div>
          </div>

          {inquiryType === 'environment-analysis' && (
            <div className="form-group">
              <label>Project Area Size (km²)</label>
              <input
                type="number"
                className="form-input"
                min="0"
                value={formData.project_size}
                onChange={(e) => setFormData({ ...formData, project_size: e.target.value })}
              />
            </div>
          )}

          {inquiryType === 'resource-management' && (
            <div className="form-group">
              <label>Preferred Timeline</label>
              <select
                className="form-input"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              >
                <option value="">Select timeline</option>
                <option value="urgent">Urgent (1-2 weeks)</option>
                <option value="standard">Standard (3-4 weeks)</option>
                <option value="long-term">Long-term Project</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Project Details *</label>
            <textarea
              className="form-textarea"
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              placeholder="Describe your project requirements, goals, and any specific needs..."
            />
          </div>

          <button
            type="submit"
            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Send Inquiry'}
          </button>

          {submitError && (
            <div className="error-message">
              <p>⚠️ {submitError}</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default InquireForm;