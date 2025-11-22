import React from 'react';
import { Helmet } from 'react-helmet-async';
import './Webmaps.css';

const WebMaps = () => {
  return (
    <div className="sf-webmaps-page">
      <Helmet>
        <title>Interactive Web Mapping Solutions | Spatial Force Zimbabwe</title>
        <meta name="description" content="Discover powerful web mapping applications designed for Zimbabwe. Our interactive GIS solutions help organizations make data-driven spatial decisions." />
        <meta name="keywords" content="Zimbabwe web mapping, GIS applications, interactive maps, spatial data visualization, health facility mapping" />
        <meta property="og:title" content="Interactive Web Mapping Solutions | SpatialForce Zimbabwe" />
        <meta property="og:description" content="Transform your spatial data into actionable insights with our custom web mapping solutions." />
        <link rel="canonical" href="https://www.spatialforce.co.zw/web-applications" />
      </Helmet>

      {/* Hero Section */}
      <section className="sf-webmaps-hero">
        <div className="sf-webmaps-hero-container">
          <h1 className="sf-webmaps-hero-title">
            Spatial Intelligence <br className="sf-webmaps-hero-break" />for Zimbabwe
          </h1>
          <p className="sf-webmaps-hero-subtitle">
            Transforming complex spatial data into intuitive and interactive maps that drive better decisions.
          </p>
          <div className="sf-webmaps-hero-buttons">
          </div>
        </div>
      </section>

      {/* Featured Maps Section */}
      <section id="maps" className="sf-webmaps-maps-section">
        <div className="sf-webmaps-section-header">
          <h2 className="sf-webmaps-section-title">Interactive Mapping Solutions</h2>
          <div className="sf-webmaps-section-divider"></div>
          <p className="sf-webmaps-section-description">
            Our web mapping applications are designed to solve real-world problems with intuitive 
            interfaces and powerful functionality.
          </p>
        </div>

        <div className="sf-webmaps-grid">
          {/* Map Card 1 */}
          <div className="sf-webmaps-card">
            <div className="sf-webmaps-card-header sf-webmaps-blue-gradient">
              <svg className="sf-webmaps-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="sf-webmaps-card-body">
              <h3 className="sf-webmaps-card-title">Bulawayo Health Facilities</h3>
              <p className="sf-webmaps-card-description">
                Comprehensive mapping of healthcare providers across Bulawayo with real-time status
                 updates and service information.
              </p>
              <a href="Bulawayo-webmap-showcase" className="sf-webmaps-card-link">
                Launch Map
                <svg className="sf-webmaps-link-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Map Card 2 */}
          <div className="sf-webmaps-card">
            <div className="sf-webmaps-card-header sf-webmaps-green-gradient">
              <svg className="sf-webmaps-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="sf-webmaps-card-body">
              <h3 className="sf-webmaps-card-title">COVID-19 Tracker</h3>
              <p className="sf-webmaps-card-description">
                Global pandemic visualization with country level statistics, trends and 
                vaccination progress indicators.
              </p>
              <a href="/Covid19-tracker" className="sf-webmaps-card-link">
                Explore Tracker
                <svg className="sf-webmaps-link-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

       {/* Air Quality Webmap Card */}
<div className="sf-webmaps-card">
  <div className="sf-webmaps-card-header sf-webmaps-purple-gradient">
    {/* Air quality / pollution icon – cloud + wavy air lines */}
    <svg
      className="sf-webmaps-card-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cloud */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 18h9a4 4 0 000-8 5 5 0 00-9.584-2A3.5 3.5 0 007 18z"
      />
      {/* Air / pollution lines */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 9.5c1.2-1 2.5-1 3.7 0M4 13.5c1.2-1 2.5-1 3.7 0"
      />
    </svg>
  </div>

  <div className="sf-webmaps-card-body">
    <h3 className="sf-webmaps-card-title">Explore Air Pollution</h3>
    <p className="sf-webmaps-card-description">
  Explore gas concentration patterns contributing to air pollution in Bulawayo.
</p>


    {/* Link with arrow (no bell) */}
    <a href="/air-quality" className="sf-webmaps-card-link">
      See Air Quality
      <svg
        className="sf-webmaps-link-arrow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Same arrow as your COVID card */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </a>
  </div>
</div>

        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="sf-webmaps-value-section">
        <div className="sf-webmaps-section-header">
          <h2 className="sf-webmaps-section-title">Why Choose Our Mapping Solutions?</h2>
          <div className="sf-webmaps-section-divider"></div>
          <p className="sf-webmaps-section-description">
            We combine cutting-edge technology with deep local knowledge to deliver maps that
             truly make a difference.
          </p>
        </div>

        <div className="sf-webmaps-value-grid">
          <div className="sf-webmaps-value-item">
            <div className="sf-webmaps-value-icon sf-webmaps-blue-bg">
              <svg className="sf-webmaps-value-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="sf-webmaps-value-title">Lightning Fast</h3>
            <p className="sf-webmaps-value-description">
              Optimized for Zimbabwe's internet speeds with offline capabilities and progressive loading.
            </p>
          </div>

          <div className="sf-webmaps-value-item">
            <div className="sf-webmaps-value-icon sf-webmaps-green-bg">
              <svg className="sf-webmaps-value-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="sf-webmaps-value-title">Data Integrity</h3>
            <p className="sf-webmaps-value-description">
              Rigorous validation processes ensure our spatial data is accurate and reliable.
            </p>
          </div>

          <div className="sf-webmaps-value-item">
            <div className="sf-webmaps-value-icon sf-webmaps-purple-bg">
              <svg className="sf-webmaps-value-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="sf-webmaps-value-title">Mobile First</h3>
            <p className="sf-webmaps-value-description">
              Designed for field use on smartphones with touch-friendly interfaces and GPS integration.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="sf-webmaps-tech-section">
        <div className="sf-webmaps-section-header">
          <h2 className="sf-webmaps-section-title">Our Technology Stack</h2>
          <div className="sf-webmaps-section-divider"></div>
          <p className="sf-webmaps-section-description">
            We leverage the best open-source and proprietary tools to deliver robust mapping solutions.
          </p>
        </div>

        <div className="sf-webmaps-tech-grid">
          <div className="sf-webmaps-tech-item">
            <img src="images/leaflet.png" alt="Leaflet" className="sf-webmaps-tech-logo" />
            <span className="sf-webmaps-tech-name">Leaflet</span>
          </div>
          <div className="sf-webmaps-tech-item">
            <img src="images/openlayers.png" alt="OpenLayers" className="sf-webmaps-tech-logo" />
            <span className="sf-webmaps-tech-name">OpenLayers</span>
          </div>
          <div className="sf-webmaps-tech-item">
            <img src="images/postgis.png" alt="PostGIS" className="sf-webmaps-tech-logo" />
            <span className="sf-webmaps-tech-name">PostGIS</span>
          </div>
          <div className="sf-webmaps-tech-item">
            <img src="images/QGIS.png" alt="QGIS" className="sf-webmaps-tech-logo" />
            <span className="sf-webmaps-tech-name">QGIS</span>
          </div>
          <div className="sf-webmaps-tech-item">
            <img src="images/python.png" alt="Python" className="sf-webmaps-tech-logo" />
            <span className="sf-webmaps-tech-name">Python + Django</span>
          </div>
          <div className="sf-webmaps-tech-item">
            <img src="images/react.png" alt="React" className="sf-webmaps-tech-logo" />
            <span className="sf-webmaps-tech-name">React</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="sf-webmaps-cta-section">
        <div className="sf-webmaps-cta-container">
          <h2 className="sf-webmaps-cta-title">Ready to Map Your Data?</h2>
          <p className="sf-webmaps-cta-description">
            Whether you need a simple interactive map or a complex GIS application 
            we can help bring your spatial data to life.
          </p>
          <div className="sf-webmaps-cta-buttons">
            <a href="/contact" className="sf-webmaps-btn sf-webmaps-btn-primary">
              Get Started Today
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="sf-webmaps-footer">
        <div className="sf-webmaps-footer-container">
          <div className="sf-webmaps-footer-grid">
            <div className="sf-webmaps-footer-col">
              <h3 className="sf-webmaps-footer-title">SpatialForce</h3>
              <p className="sf-webmaps-footer-text">
                Empowering organizations in Zimbabwe with spatial intelligence solutions since 2022.
              </p>
            </div>
            <div className="sf-webmaps-footer-col">
              <h3 className="sf-webmaps-footer-title">Quick Links</h3>
              <ul className="sf-webmaps-footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/services2">Services</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            <div className="sf-webmaps-footer-col">
              <h3 className="sf-webmaps-footer-title">Legal</h3>
              <ul className="sf-webmaps-footer-links">
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
              </ul>
            </div>
            <div className="sf-webmaps-footer-col">
              <h3 className="sf-webmaps-footer-title">Connect</h3>
              <div className="sf-webmaps-social-icons">
                <a href="#">
                  <svg className="sf-webmaps-social-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#">
                  <svg className="sf-webmaps-social-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a href="#">
                  <svg className="sf-webmaps-social-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#">
                  <svg className="sf-webmaps-social-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="sf-webmaps-footer-bottom">
            <p>&copy; {new Date().getFullYear()} SpatialForce Zimbabwe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebMaps;