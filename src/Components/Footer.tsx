import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Spatial Force",
  url: "https://spatialforce.co.zw",
  logo: "https://spatialforce.co.zw/images/spatial-force-logo.png",
  description:
    "Leading provider of geospatial solutions and innovative mapping services in Zimbabwe",
  address: {
    "@type": "PostalAddress",
    streetAddress: "17 Longhurst Northlynne",
    addressLocality: "Bulawayo",
    addressCountry: "ZW",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+263-779-135-076",
    contactType: "customer service",
    email: "info@spatialforce.co.zw",
    areaServed: "ZW",
    availableLanguage: "en",
  },
};

const Footer: React.FC = () => {
  return (
    <footer className="sf3-footer">
      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <div className="sf3-container">
        {/* 3 equal columns, equal gaps, centered content */}
        <div className="sf3-grid">
          {/* About */}
          <section className="sf3-col" aria-labelledby="sf3-about">
            <h3 id="sf3-about" className="sf3-heading">About Spatial Force</h3>
            <p className="sf3-text">
              Spatial Force is Zimbabwe&apos;s leading provider of innovative geospatial
              solutions, dedicated to delivering excellence and creativity in GIS
              mapping and spatial analysis.
            </p>
            <div className="sf3-company">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:info@spatialforce.co.zw">info@spatialforce.co.zw</a>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href="tel:+263779135076">+263 779 135 076</a>
              </p>
              <p>
                <strong>Address:</strong> 17 Longhurst Northlynne, Bulawayo, Zimbabwe
              </p>
            </div>
          </section>

          {/* Quick Links */}
          <nav className="sf3-col" aria-labelledby="sf3-links" role="navigation">
            <h3 id="sf3-links" className="sf3-heading">Quick Links</h3>
            <ul className="sf3-list">
              <li><Link to="/articles-and-projects" className="sf3-link">GIS Articles &amp; Projects</Link></li>
              <li><Link to="/services2" className="sf3-link">Geospatial Services</Link></li>
              <li><Link to="/bookings" className="sf3-link">Project Bookings</Link></li>
              <li><Link to="/about" className="sf3-link">About Our Team</Link></li>
              <li><Link to="/contact" className="sf3-link">Contact Spatial Force</Link></li>
            </ul>
          </nav>

          {/* Our Services */}
          <section className="sf3-col" aria-labelledby="sf3-services">
            <h3 id="sf3-services" className="sf3-heading">Our Services</h3>
            <ul className="sf3-list sf3-list--plain">
              <li>GIS Mapping &amp; Analysis</li>
              <li>Web GIS Development</li>
              <li>Spatial Data Solutions</li>
              <li>Remote Sensing</li>
              <li>Location Intelligence</li>
            </ul>
          </section>
        </div>

        {/* WhatsApp CTA */}
        <div className="sf3-cta-row">
          <a
            href="https://wa.me/263779135076?text=Hi%20Spatial%20Force%2C%20please%20share%20a%20quote%20for..."
            target="_blank"
            rel="noopener noreferrer"
            className="sf3-cta"
            aria-label="Request a quote over WhatsApp for quick responses"
          >
            <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true" className="sf3-wa">
              <path d="M19.1 17.6c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.6.1s-.7.8-.8.9-.3.2-.5.1c-.2-.1-.9-.3-1.8-1.1-.7-.6-1.1-1.3-1.2-1.5-.1-.2 0-.3.1-.5.1-.1.2-.3.3-.4.1-.1.1-.2.2-.4.1-.1 0-.3 0-.4 0-.1-.6-1.5-.9-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 3.9 3.5 2.3 1 2.3.7 2.7.7.4 0 1.3-.5 1.4-1 .1-.5.1-.9 0-1-.1-.1-.2-.1-.4-.2z" />
              <path d="M26.6 5.4C23.8 2.6 20 1 16 1S8.2 2.6 5.4 5.4 1 12 1 16c0 2.2.6 4.2 1.6 6L1 31l9.1-1.6c1.8 1 3.9 1.6 6 1.6 4 0 7.8-1.6 10.6-4.4S31 20 31 16s-1.6-7.8-4.4-10.6zm-10.6 23c-1.9 0-3.8-.5-5.5-1.4l-.4-.2-5.4 1 1-5.3-.2-.4C4.5 20.1 4 18.1 4 16 4 9.4 9.4 4 16 4s12 5.4 12 12-5.4 12-12 12z" />
            </svg>
            <span>Request a quote over WhatsApp for quick responses</span>
          </a>
        </div>

        {/* Bottom */}
        <div className="sf3-bottom">
          <p className="sf3-copy">
            &copy; {new Date().getFullYear()} Spatial Force Geospatial Solutions. All Rights Reserved.
          </p>
          <p className="sf3-legal">
            <Link to="/privacy" className="sf3-legal-link">Privacy Policy</Link>
            <span aria-hidden="true"> • </span>
            <Link to="/terms" className="sf3-legal-link">Terms &amp; Conditions</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
