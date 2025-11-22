import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./modal.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  image?: string;
  details: any;
  name: string;
  description: string;
  id: string;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  image,
  details,
  name,
  description,
  id,
}) => {
  const navigate = useNavigate();

  // Lock scroll + ESC close
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Page title
  useEffect(() => {
    if (isOpen) {
      document.title = `Spatial Force - ${name}`;
    }
  }, [isOpen, name]);

  const handleBookNow = () => {
    onClose();
    navigate("/bookings", {
      state: {
        serviceDetails: {
          id,
          name,
          description,
          image,
          duration: details?.duration,
        },
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="sf-modal-overlay" onClick={onClose} style={{ zIndex: 1001 }}>
      <div
        className="sf-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <header className="sf-modal-header">
          <h2 className="sf-modal-title">{name}</h2>
          <button
            className="sf-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </header>

        {/* Body */}
        <div className="sf-modal-body">
          {image && (
            <img
              src={image}
              alt={name}
              className="sf-modal-image"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}

          {description && (
            <p className="sf-modal-description">{description}</p>
          )}

          <section className="sf-modal-section">
            <h3 className="sf-modal-section-title">
              {details?.cta || "Service Details"}
            </h3>

            <div className="sf-modal-detail-group">
              <div className="sf-modal-detail-item">
                <span className="sf-modal-detail-label">Duration</span>
                <span className="sf-modal-detail-value">
                  {details?.duration || "Duration not available."}
                </span>
              </div>

              <div className="sf-modal-detail-item">
                <span className="sf-modal-detail-label">Target Audience</span>
                <span className="sf-modal-detail-value">
                  {details?.targetAudience || "No target audience specified."}
                </span>
              </div>

              <div className="sf-modal-detail-item">
                <span className="sf-modal-detail-label">Related Services</span>
                <ul className="sf-modal-related-list">
                  {details?.relatedServices?.length ? (
                    details.relatedServices.map(
                      (service: string, index: number) => (
                        <li key={index}>{service}</li>
                      )
                    )
                  ) : (
                    <li>None</li>
                  )}
                </ul>
              </div>
            </div>
          </section>

          <section className="sf-modal-section">
            <h3 className="sf-modal-section-title">FAQs</h3>
            {details?.faqs?.length ? (
              <div className="sf-modal-faq-list">
                {details.faqs.map((faq: any, index: number) => (
                  <div key={index} className="sf-modal-faq-item">
                    <p className="sf-modal-faq-q">{faq.question}</p>
                    <p className="sf-modal-faq-a">{faq.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="sf-modal-empty">No FAQs available.</p>
            )}
          </section>
        </div>

        {/* Footer CTA – ALWAYS at the bottom, not overlapping anything */}
        <footer className="sf-modal-footer">
          <div className="sf-modal-cta-card">
            <p className="sf-modal-cta-text">
              Ready to request this service?
            </p>
            <button className="sf-modal-book-btn" onClick={handleBookNow}>
              <span>Book Now</span>
              <svg
                className="sf-modal-book-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M21 12l-7.121 7.121-1.414-1.414 4.467-4.467H3v-2h13.932l-4.467-4.467 1.414-1.414z"
                />
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Modal;
