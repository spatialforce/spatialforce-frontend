import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './modal.css';

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  image?: string;
  details: any;
  name: string;
  description: string;
  id: string;
}> = ({ isOpen, onClose, image, details, name, description, id }) => {
  const { addToCart, toggleCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.title = `Spatial Force - ${name}`;
    }
  }, [isOpen, name]);

  const handleBookNow = () => {
    onClose();
    navigate('/bookings', {
      state: {
        serviceDetails: {
          id,
          name,
          description,
          image,
          duration: details.duration
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1001 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2>{name}</h2>

        {image && (
          <img
            src={image}
            alt={name}
            className="modal-image"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}

        <p>{description}</p>

        <div className="details-section">
          <h3>{details.cta || "Service Details"}</h3>
          
          <div className="detail-item">
            <strong>Duration:</strong>
            <p>{details.duration || "Duration not available."}</p>
          </div>
          
          <div className="detail-item">
            <strong>Target Audience:</strong>
            <p>{details.targetAudience || "No target audience specified."}</p>
          </div>
          
          <div className="detail-item">
            <strong>Related Services:</strong>
            <ul>
              {details.relatedServices?.length > 0 ? (
                details.relatedServices.map((service: string, index: number) => (
                  <li key={index}>{service}</li>
                ))
              ) : (
                <li>None</li>
              )}
            </ul>
          </div>

          <div className="faq-section">
            <h4>FAQs</h4>
            {details.faqs?.length > 0 ? (
              details.faqs.map((faq: any, index: number) => (
                <div key={index} className="faq-item">
                  <strong>{faq.question}</strong>
                  <p>{faq.answer}</p>
                </div>
              ))
            ) : (
              <p>No FAQs available.</p>
            )}
          </div>

          <div className="cta-section">
            <div className="cta-content">
              <p className="cta-text">Ready to request this service?</p>
              <div className="cta-animation">
                <svg
                  className="animated-arrow"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path fill="var(--primary)" d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 12v-6h-2v6h-3l4 5 4-5h-3z"/>
                </svg>
                <button 
                  className="book-now-button"
                  onClick={handleBookNow}
                >
                  Book Now
                  <svg
                    className="arrow-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path fill="var(--light)" d="M21 12l-7.121 7.121-1.414-1.414 4.467-4.467h-14.032v-2h14.032l-4.467-4.467 1.414-1.414z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;