import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ServiceItem from './ServiceItem';
import Modal from './modal';
import './services2.css';
import { serviceList } from './Services-list';
import { Link } from 'react-router-dom';

import { 
  FiLayers,       // For Foundation Technologies icon
  FiMap,          // For Cartographic Modeling
  FiDatabase,     // For Spatial Statistics
  FiGlobe,        // For Remote Sensing
  FiCpu,          // For Innovation Technologies icon
  FiCode,         // For AI/ML Integration
  FiNavigation,   // For 3D Web GIS
  FiPackage       // For Real-Time Analytics
} from 'react-icons/fi';

const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<typeof serviceList[0] | null>(null);
  const [showMore, setShowMore] = useState(false);

  // Enhanced Schema.org structured data
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": serviceList.map((service, index) => ({
      "@type": "Service",
      "name": service.name,
      "description": service.description,
      "image": service.image,
      "serviceType": "Geospatial Solutions",
      "provider": {
        "@type": "Organization",
        "name": "Spatial Force",
        "url": "https://spatialforce.co.zw",
        "sameAs": [
          "https://www.linkedin.com/company/spatial-force",
          "https://twitter.com/spatial_force"
        ]
      },
      "areaServed": "Global",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "USD",
        "category": "GIS Services"
      }
    }))
  };

  const companySchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Spatial Force",
    "url": "https://spatialforce.co.zw",
    "logo": "https://spatialforce.co.zw/logo.png",
    "description": "Leading provider of geospatial solutions and GIS services with 15+ years expertise",
    "sameAs": [
      "https://www.linkedin.com/company/spatial-force",
      "https://twitter.com/spatial_force"
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://spatialforce.co.zw/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://spatialforce.co.zw/services"
      }
    ]
  };
  const QGIS = "/images/qgis.svg";
  const ARCMAP = "/images/arcmap.png";
  const ARCGISPRO = "/images/ARCGISPRO.png";

  useEffect(() => {
    document.title = 'Professional GIS Services | Spatial Force - Geospatial Solutions';
  }, []);

  return (
    <div className='services-container'>
      <Helmet>
        <title>GIS Services & Geospatial Solutions Company | Spatial Force</title>
        <meta name="description" content="Top-rated GIS services provider offering custom mapping, spatial analysis & environmental monitoring. with expertise in geospatial solutions for businesses & governments." />
        <meta name="keywords" content="GIS services, geospatial solutions, mapping services, spatial data analysis, environmental monitoring, urban planning GIS, QGIS training, ArcMap experts" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://spatialforce.co.zw/services2" />
        <meta property="og:title" content="Professional GIS Mapping Services & Geospatial Analysis | Spatial Force" />
        <meta property="og:description" content="Certified GIS experts providing precision mapping, spatial analytics and custom geospatial solutions. Get free consultation for your mapping projects." />
        <meta property="og:image" content="https://spatialforce.co.zw/og-services.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GIS Services & Geospatial Solutions | Spatial Force" />
        <meta name="twitter:description" content="Enterprise-grade geospatial solutions with SLA-backed accuracy guarantees. 24/7 GIS support and consulting services." />
        <meta name="twitter:image" content="https://spatialforce.co.zw/Kudzanai.png" />

        <link rel="canonical" href="https://spatialforce.co.zw/services" />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(companySchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <main id="main-content" aria-label="GIS Services Overview">
      <header
  className="services-header"
  itemScope
  itemType="https://schema.org/WPHeader"
>
  <div itemScope itemType="https://schema.org/Organization">
    <meta itemProp="name" content="Spatial Force" />
    <meta itemProp="logo" content="https://spatialforce.co.zw/logo.png" />
  </div>

  <div className="services-hero-layout">
    {/* LEFT: main text */}
    <div className="services-hero-text">
      <p className="services-eyebrow">
        Geospatial consulting for real-world decisions
      </p>

      <h1 className="services-main-title">
        Expert GIS services and IT solutions
      </h1>

      <p className="services-lead">
        Spatial Force works as a practical GIS partner for individuals,
        consultants and small organisations who need maps and analysis that
        stand up in the field, in reports and in front of stakeholders.
      </p>

      <ul className="services-pill-list">
        <li>Urban planning &amp; settlement growth</li>
        <li>Environmental &amp; natural resource management</li>
        <li>Infrastructure, utilities &amp; access to services</li>
      </ul>

      <div className="services-meta-row">
        <span className="services-meta-pill">
          Tailored to small teams &amp; solo practitioners
        </span>
        <span className="services-meta-pill">
          From one-off maps to full workflows
        </span>
      </div>
    </div>

    {/* RIGHT: tech + methods */}
    <aside className="services-hero-panel" aria-label="Core geospatial stack">
      <p className="panel-label">How we work</p>

      <div className="panel-tools-row">
        <div className="panel-tool-chip">
          <FiMap className="panel-tool-icon" />
          <span>GIS mapping &amp; analysis</span>
        </div>
        <div className="panel-tool-chip">
          <FiGlobe className="panel-tool-icon" />
          <span>Remote sensing &amp; LiDAR</span>
        </div>
        <div className="panel-tool-chip">
          <FiCpu className="panel-tool-icon" />
          <span>AI-powered analytics</span>
        </div>
      </div>

      <div className="services-highlight-box">
        <p>
          We combine GIS, LiDAR and AI-driven analytics to turn raw spatial
          data into clear, defensible evidence for better planning and
          policy decisions.
        </p>
      </div>
    </aside>
  </div>
</header>


        <section aria-labelledby="core-services-heading" className="core-services">
          <h2 id="core-services-heading" className="section-heading">
            Our Geospatial Service Portfolio
          </h2>
          <div className="services-grid" role="list">
            {serviceList.slice(0, showMore ? serviceList.length : 3).map((service) => (
              <article 
                key={service.id}
                role="listitem"
                className="service-card"
                itemScope
                itemType="https://schema.org/Service"
              >
                <ServiceItem 
                  image={service.image}
                  name={service.name}
                  description={service.description}
                  onClick={() => setSelectedService(service)}
                  aria-labelledby={`service-${service.id}-title`}
                />
                <meta itemProp="provider" content="Spatial Force" />
                <meta itemProp="serviceType" content="Geospatial Solutions" />
              </article>
            ))}
          </div>
          <button 
            onClick={() => setShowMore(!showMore)} 
            className="show-more-button"
            aria-expanded={showMore}
            aria-controls="services-grid"
          >
            {showMore ? 'View Less Services' : 'Explore All 10+ Geospatial Services'}
          </button>
        </section>

        <section aria-labelledby="industry-applications-heading" className="industry-applications">
  <h2 id="industry-applications-heading" className="section-heading">Industry-Specific GIS Applications</h2>

  <div className="industry-grid centered">
    <div className="industry-card center-card" itemScope itemType="https://schema.org/Service">
      <h3 className="center-title" itemProp="name">Urban Planning &amp; Smart Cities</h3>
      <ul className="list-clean list-centered" role="list">
        <li itemProp="description">Zoning analysis and land use optimization</li>
        <li itemProp="description">3D city modeling and infrastructure planning</li>
        <li itemProp="description">Traffic flow simulation and route optimization</li>
      </ul>
    </div>

    <div className="industry-card center-card" itemScope itemType="https://schema.org/Service">
      <h3 className="center-title" itemProp="name">Environmental Management</h3>
      <ul className="list-clean list-centered" role="list">
        <li itemProp="description">NDVI vegetation health monitoring</li>
        <li itemProp="description">Watershed analysis and flood prediction</li>
        <li itemProp="description">Carbon footprint mapping</li>
      </ul>
    </div>
  </div>
</section>


<section aria-labelledby="technology-stack-heading" className="technology-stack">
  <h2 id="technology-stack-heading" className="section-heading">Advanced Geospatial Technology Stack</h2>

  <div className="tech-list centered">
    <div className="tech-item center-card">
      <h3 className="center-title">Data Acquisition</h3>
      <ul className="list-clean list-centered" role="list">
        <li>Satellite Imagery (Sentinel-2, Landsat 9)</li>
        <li>UAV/Drone Photogrammetry</li>
        <li>LiDAR Point Cloud Processing</li>
      </ul>
    </div>

    <div className="tech-item center-card">
      <h3 className="center-title">Analysis &amp; Processing</h3>
      <ul className="list-clean list-centered" role="list">
        <li>ArcGIS Pro Advanced Suite</li>
        <li>QGIS with Python Scripting</li>
        <li>Google Earth Engine API</li>
      </ul>
    </div>
  </div>
</section>

        <section aria-labelledby="case-studies-heading" className="case-studies">
          <h2 id="case-studies-heading" className="section-heading">
            Recent GIS Projects & Case Studies
          </h2>
          <div className="case-study" itemScope itemType="https://schema.org/CreativeWork">
            <h4 itemProp="name">Web Map for Health Facilities in Bulawayo</h4>
            <p itemProp="description">
              Created an interactive web map to visualize the distribution of health facilities across Bulawayo
              helping stakeholders identify service gaps and improve access to healthcare services for the 
              community.
            </p>
          </div>
          <div className="case-study" itemScope itemType="https://schema.org/CreativeWork">
            <h4 itemProp="name">Land Use Mapping for Gazette Forests in Matebeleland North</h4>
            <p itemProp="description">
              Produced detailed land use maps for the ten gazetted forests in Matebeleland North providing 
              valuable insights 
              for conservation efforts and sustainable land management practices in the region.
            </p>
          </div>
        </section>

        <aside className="service-faq" itemScope itemType="https://schema.org/FAQPage">
          <h2 id="faq-heading" className="section-heading">
            Frequently Asked Questions
          </h2>
          <dl className="faq-list">
            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <dt itemProp="name">What industries benefit most from GIS services?</dt>
              <dd itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text">
                  Our geospatial solutions serve diverse sectors including urban planning, agriculture, 
                  environmental management, logistics and telecommunications. Specific applications range 
                  from site selection analysis to network optimization.
                </p>
              </dd>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <dt itemProp="name">How do you ensure data accuracy in spatial analysis?</dt>
              <dd itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text">
                  We implement rigorous QA/QC protocols including ground truth validation, multi-source data
                  verification and precision calibration of remote sensing equipment.
                </p>
              </dd>
            </div>
          </dl>
        </aside>

        {selectedService && (
          <Modal 
            isOpen={!!selectedService}
            onClose={() => setSelectedService(null)}
            image={selectedService.image}
            details={selectedService.details}
            name={selectedService.name}
            description={selectedService.description}
            id={selectedService.id}
          />
        )}

<section className="tech-spectrum-section" aria-labelledby="tech-spectrum-heading">
  <div className="tech-spectrum-container">
    <h2 id="tech-spectrum-heading" className="tech-spectrum-title">
      Our Geospatial Technology Spectrum
    </h2>
    <p className="tech-spectrum-subtitle">
      Bridging traditional expertise with innovative spatial technologies
    </p>
    
    <div className="tech-spectrum-cards">
      <div className="tech-spectrum-card foundation">
        <div className="card-header">
          <div className="card-icon">
            <FiLayers />
          </div>
          <h3 className="card-title">Foundation Technologies</h3>
        </div>
        <p className="card-description">
          Time-tested geospatial methodologies that form the bedrock of our work:
        </p>
        <ul className="tech-features-list">
          <li className="tech-feature">
            <span className="feature-icon"><FiMap /></span>
            <div className="feature-content">
              <strong>Cartographic Modeling</strong>
              <p>Advanced map production using ArcGIS & QGIS</p>
            </div>
          </li>
          <li className="tech-feature">
            <span className="feature-icon"><FiDatabase /></span>
            <div className="feature-content">
              <strong>Spatial Statistics</strong>
              <p>Hotspot analysis, interpolation and geostatistics</p>
            </div>
          </li>
          <li className="tech-feature">
            <span className="feature-icon"><FiGlobe /></span>
            <div className="feature-content">
              <strong>Remote Sensing</strong>
              <p>Multispectral analysis with ENVI & ERDAS Imagine</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="tech-spectrum-card innovation">
        <div className="card-header">
          <div className="card-icon">
            <FiCpu />
          </div>
          <h3 className="card-title">Innovation Technologies</h3>
        </div>
        <p className="card-description">
          Cutting-edge solutions pushing the boundaries of spatial analysis:
        </p>
        <ul className="tech-features-list">
          <li className="tech-feature">
            <span className="feature-icon"><FiCode /></span>
            <div className="feature-content">
              <strong>AI/ML Integration</strong>
              <p>Predictive modeling with TensorFlow Geo</p>
            </div>
          </li>
          <li className="tech-feature">
            <span className="feature-icon"><FiNavigation /></span>
            <div className="feature-content">
              <strong>3D Web GIS</strong>
              <p>CesiumJS & Deck.gl for immersive visualization</p>
            </div>
          </li>
          <li className="tech-feature">
            <span className="feature-icon"><FiPackage /></span>
            <div className="feature-content">
              <strong>Real-Time Analytics</strong>
              <p>IoT sensor integration with GeoEvent Server</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div className="tech-convergence">
      <h3 className="convergence-title">Convergence Technologies</h3>
      <p className="convergence-description">
        We specialize in combining spatial intelligence with accessible technologies
        that enhance our services and solutions.
      </p>
      <div className="convergence-grid">
        <div className="convergence-item">
          <div className="tech-pair">
            <span className="tech-badge blockchain">Blockchain</span>
            <span className="plus-icon">+</span>
            <span className="tech-badge spatial">Land Registry</span>
          </div>
          <p className="convergence-text">
            We create secure property record systems using digital certificates
            ensuring that ownership and land use information is reliable and easily verifiable.
          </p>
        </div>
        <div className="convergence-item">
          <div className="tech-pair">
            <span className="tech-badge ai">Computer Vision</span>
            <span className="plus-icon">+</span>
            <span className="tech-badge spatial">Image Analysis</span>
          </div>
          <p className="convergence-text">
            We utilize computer vision techniques to analyze images
            and extract valuable features, helping clients gain insights from various types
            of visual data.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

        <section className="software-training" aria-labelledby="software-training-heading">
          <div className="training-container">
            <h2 id="software-training-heading" className="section-heading">
              Master GIS Software with Expert Guidance
            </h2>
            
            <div className="training-content">
              <div className="training-text">
                <p className="training-lead">
                  Struggling with GIS software? Gain professional proficiency in 3 weeks!
                </p>
                
                <div className="software-grid">
                <div className="software-card" itemScope itemType="https://schema.org/Product">
  <img 
    src={QGIS}
    alt="QGIS Professional Training" 
    className="software-icon"
    loading="lazy"
    width="120"
    height="120"
    itemProp="image"
  />
  <h3 itemProp="name">QGIS Mastery</h3>
  <p itemProp="description">Open-source GIS solution training</p>
  <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
    <meta itemProp="priceCurrency" content="USD" />
    <meta itemProp="price" content="100" />
    <link itemProp="availability" href="https://schema.org/InStock" />
    <meta itemProp="url" content="https://spatialforce.co.zw/training/qgis" />
  </div>
  <meta itemProp="brand" content="Spatial Force" />
</div>

<div className="software-card" itemScope itemType="https://schema.org/Product">
  <img 
    src={ARCMAP} 
    alt="ArcMap Training Course - Professional GIS Certification" 
    className="software-icon"
    loading="lazy"
    width="120"
    height="120"
    itemProp="image"
  />
  <h3 itemProp="name">ArcMap Essentials</h3>
  <p itemProp="description">Legacy ESRI platform training</p>
  <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
    <meta itemProp="priceCurrency" content="USD" />
    <meta itemProp="price" content="100" />
    <link itemProp="availability" href="https://schema.org/InStock" />
    <meta itemProp="url" content="https://spatialforce.co.zw/training/arcmap" />
  </div>
  <meta itemProp="brand" content="Spatial Force" />
</div>

<div className="software-card" itemScope itemType="https://schema.org/Product">
  <img 
    src={ARCGISPRO} 
    alt="ArcGIS Pro Training - Modern GIS Workflows" 
    className="software-icon"
    loading="lazy"
    width="120"
    height="120"
    itemProp="image"
  />
  <h3 itemProp="name">ArcGIS Pro</h3>
  <p itemProp="description">Modern ESRI ecosystem training</p>
  <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
    <meta itemProp="priceCurrency" content="USD" />
    <meta itemProp="price" content="100" />
    <link itemProp="availability" href="https://schema.org/InStock" />
    <meta itemProp="url" content="https://spatialforce.co.zw/training/arcgispro" />
  </div>
  <meta itemProp="brand" content="Spatial Force" />
</div>
                </div>

                <div className="pricing-box" itemScope itemType="https://schema.org/Offer">
                  <p className="price-tag">
                    <span className="original-price" itemProp="priceCurrency" content="USD">$299</span>
                    <strong className="discount-price" itemProp="price" content="100">$100</strong>
                    <span className="discount-badge">67% OFF</span>
                  </p>
                  <p className="duration" itemProp="description">3-Week Intensive Program</p>
                </div>
              </div>

              <div className="cta-box">
                <h3>Start Your GIS Journey Today!</h3>
                <p className="cta-text">
                  Includes 12 hands-on projects
                </p>
                <Link 
                  to="/bookings" 
                  className="booking-button"
                  aria-label="Book your GIS software training consultation"
                  itemProp="url"
                >
                  Book Consultation
                  <svg aria-hidden="true" className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="comprehensive-support" aria-labelledby="comprehensive-heading">
          <div className="support-container">
            <h2 id="comprehensive-heading" className="section-heading">
              Beyond Listed Services - Full Geospatial Support
            </h2>
            
            <div className="support-grid">
              <div className="support-card" itemScope itemType="https://schema.org/Service">
                <div className="support-icon">🕰️</div>
                <h3 itemProp="name">Historical Data Mining</h3>
                <p itemProp="description">Extract insights from archival maps and legacy 
                spatial data formats</p>
              </div>

              <div className="support-card" itemScope itemType="https://schema.org/Service">
                <div className="support-icon">🧹</div>
                <h3 itemProp="name">Data Cleaning</h3>
                <p itemProp="description">Rectify coordinate mismatches and topology errors in your datasets</p>
              </div>

              <div className="support-card" itemScope itemType="https://schema.org/Service">
                <div className="support-icon">🔄</div>
                <h3 itemProp="name">Coordinate Conversions</h3>
                <p itemProp="description">Transform between CRS systems (WGS84, UTM, State Plane) accurately</p>
              </div>

              <div className="support-card" itemScope itemType="https://schema.org/Service">
                <div className="support-icon">💻</div>
                <h3 itemProp="name">Software Setup</h3>
                <p itemProp="description">GIS environment configuration and extension development</p>
              </div>
            </div>

            <div className="support-cta">
              <p className="cta-text">
                Can't find your specific need? Let's craft a custom solution!
              </p>
              <Link 
                to="/contact" 
                className="support-button"
                aria-label="Contact us for custom geospatial solutions"
                itemProp="url"
              >
                Contact
                <svg aria-hidden="true" className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="partnership" aria-labelledby="partnership-heading">
          <div className="partnership-background">
            <img 
              src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
              alt="Collaborative map analysis session with GIS experts" 
              className="background-image"
              loading="lazy"
              width="1200"
              height="800"
            />
            <div className="overlay"></div>
          </div>
          
          <div className="partnership-content">
            <h2 id="partnership-heading" className="section-heading">
              Your Geospatial Journey Starts Here
            </h2>
            <p className="partnership-text">
              From concept to implementation, we partner with you through every coordinate. 
              Let's transform raw spatial data into actionable intelligence together.
            </p>
            <Link 
              to="/contact" 
              className="cta-button"
              aria-label="Start your geospatial partnership"
              itemProp="url"
            >
              Collaborate
              <svg aria-hidden="true" className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>
        </section>

        <nav className="related-links" aria-label="Related Services">
          <div className="related-links-content">
            <h2 className="visually-hidden">Additional Resources</h2>
            <div className="link-group">
              <p className="link-intro">
                Explore deeper geospatial capabilities through our specialized offerings:
              </p>
              <ul>
                <li>
                  <a href="/smartcitysolutions" className="related-link" target="_blank" rel="noopener noreferrer">
                   Smart City Solutions
                  </a>
                  

                  <span className="link-description">
                    - IoT integration and urban analytics for sustainable development
                  </span>
                </li>
                <li>
                  <a href="/Artificial-Intelligence" className="related-link" target="_blank" rel="noopener noreferrer" >
                    AI in Geospatial Analysis
                  </a>
                  <span className="link-description">
                    - Machine learning-powered spatial pattern recognition
                  </span>
                </li>
                <li>
                  <a href="/contact" className="related-link" itemProp="url">
                    Request Custom Solution
                  </a>
                  <span className="link-description">
                    - Bespoke workflows for unique spatial challenges
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="expertise-note">
              <p className="note-text">
                We are one of the fastest <strong>RISING!</strong> GIS and IT consultants with cutting-edge 
                technologies to deliver solutions that:
              </p>
              <ul className="expertise-list">
                <li>Transform raw data into actionable insights</li>
                <li>Bridge legacy systems with modern platforms</li>
                <li>Maintain full data sovereignty compliance</li>
              </ul>
            </div>
          </div>
        </nav>

        <section className="closing-cta" aria-labelledby="closing-heading">
          <div className="cta-background">
            <img 
              src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
              alt="Geospatial team collaborating on mapping project" 
              className="cta-image"
              loading="lazy"
              width="1200"
              height="800"
            />
            <div className="cta-overlay"></div>
          </div>
          
          <div className="cta-content">
            <div className="cta-text-block">
              <h2 id="closing-heading" className="cta-heading">
                Ready to Spatialize Your Vision?
              </h2>
              <p className="cta-message">
                Whether you're mapping urban landscapes or analyzing environmental patterns,<br/> 
                our geospatial expertise becomes your strategic advantage.
              </p>
              
              <div className="trust-markers">
                <div className="trust-item">
                    <span className="trust-number">100%</span>
                    <span className="trust-label">Client Satisfaction</span>
                </div>
                <div className="trust-item">
                    <span className="trust-number">500+</span>
                    <span className="trust-label">Data Points Analyzed</span>
                </div>
              </div>
            </div>

            <div className="cta-action">
              <Link 
                to="/contact" 
                className="cta-button"
                aria-label="Start your geospatial project"
                itemProp="url"
              >
                Begin Your Mapping Journey
                <svg aria-hidden="true" className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
              <p className="commitment-text">
                <span className="highlight">Free consultation</span> with our GIS experts
              </p>
            </div>
          </div>
        </section>

        <footer className="gratitude-footer" itemScope itemType="https://schema.org/LocalBusiness">
          <div className="footer-content">
            <p className="appreciation-note">
              Thank you for choosing SpatialForce as your geospatial partner. Your trust in our expertise drives our continuous commitment to excellence. 
              To our valued clients who've partnered with us on previous consultations - we're honored by your continued collaboration and look forward 
              to future innovations in spatial intelligence.
            </p>
            
            <div className="legal-links">
              <span className="copyright">
                © {new Date().getFullYear()} SpatialForce. All rights reserved.
              </span>
              <a href="/privacy" className="related-link" target="_blank" rel="noopener noreferrer">
                   Privacy Policy
                  </a>
                  <a href="/terms" className="related-link" target="_blank" rel="noopener noreferrer">
                  Terms and Conditions
                  </a>
            </div>
          </div>
          <meta itemProp="name" content="Spatial Force" />
          <meta itemProp="image" content="https://spatialforce.co.zw/logo.png" />
          <meta itemProp="priceRange" content="$$" />
          <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <meta itemProp="addressLocality" content="Bulawayo" />
            <meta itemProp="addressRegion" content="Matebeleland" />
            <meta itemProp="addressCountry" content="Zimbabwe" />
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Services;