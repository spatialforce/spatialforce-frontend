import React from 'react';
import { Helmet } from 'react-helmet-async';
import './About.css';
import { FaCode, FaGlobe, FaDatabase, FaRocket, FaUniversity, FaHandsHelping } from 'react-icons/fa';
import consultantPhoto from '../assets/consultant-profile.jpg';
import projectWorkflow from '../assets/project-process.png';
import Footer from './Footer';

const AboutSection = () => {
  // Structured data for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://spatialforce.co.zw/#kudzanai-chakavarika",
        "name": "Kudzanai Chakavarika",
        "jobTitle": "Lead Geospatial Consultant",
        "url": "https://spatialforce.co.zw",
        "sameAs": [
          "https://linkedin.com/in/kudzanaichakavarika",
          "https://twitter.com/SpatialForce",
          "https://github.com/kudzanaichakavarika"
        ],
        "description": "Zimbabwe's premier geospatial consultant specializing in advanced GIS solutions, spatial data science, and location intelligence.",
        "image": "https://spatialforce.co.zw/assets/KudzanaiChakavarika.jpeg",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "ZW",
          "addressRegion": "Bulawayo"
        },
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "National University of Science and Technology"
        },
        "knowsAbout": [
          "Geographic Information Systems",
          "Remote Sensing",
          "Spatial Data Analysis",
          "Web GIS Development",
          "Environmental Conservation"
        ]
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://spatialforce.co.zw/#spatialforce",
        "name": "Spatial Force",
        "url": "https://spatialforce.co.zw",
        "logo": "https://spatialforce.co.zw/logo.png",
        "description": "Zimbabwe's leading geospatial intelligence consultancy providing cutting-edge GIS solutions since 2021.",
        "founder": {
          "@id": "https://spatialforce.co.zw/#kudzanai-chakavarika"
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "17 Longhurst, Northlynne",
          "addressLocality": "Bulawayo",
          "addressRegion": "Matabeleland",
          "addressCountry": "ZW"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "-20.094090",
          "longitude": "28.596844"
        },
        "telephone": "+263717428085",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "17:00"
        },
        "priceRange": "$$",
        "areaServed": {
          "@type": "Country",
          "name": "Zimbabwe"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "GIS Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Custom GIS Development"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Spatial Data Analysis"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Web Mapping Solutions"
              }
            }
          ]
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://spatialforce.co.zw/about/#webpage",
        "url": "https://spatialforce.co.zw/about",
        "name": "About Kudzanai Chakavarika - Zimbabwe's Top GIS Consultant | Spatial Force",
        "description": "Learn about Zimbabwe's premier geospatial consultancy led by Kudzanai Chakavarika. Specializing in GIS, remote sensing, and spatial data solutions since 2021.",
        "isPartOf": {
          "@id": "https://spatialforce.co.zw/#website"
        },
        "about": {
          "@id": "https://spatialforce.co.zw/#kudzanai-chakavarika"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://spatialforce.co.zw/assets/Kudzanai.png"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://spatialforce.co.zw/about/#breadcrumb",
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
            "name": "About"
          }
        ]
      }
    ]
  };
;

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title> About | Spatial Force - Geospatial Solutions</title>
        <meta
          name="description"
          content="Learn about Spatial Force, a geospatial consultancy specializing in advanced spatial solutions, computational geography, and earth observation. Explore our technical expertise and project methodology."
        />
        <meta
          name="keywords"
          content="geospatial intelligence, spatial informatics, GIS consulting, computational geography, earth observation, spatial data architecture"
        />
        <meta property="og:title" content="Spatial Force - About | Geospatial Intelligence & Spatial Informatics" />
        <meta
          property="og:description"
          content="Learn about Spatial Force, a geospatial consultancy specializing in advanced spatial solutions, computational geography, and earth observation."
        />
        <meta property="og:image" content="https://spatialforce.co.zw/assets/consultant-profile.jpg" />
        <meta property="og:url" content="https://spatialforce.co.zw/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Spatial Force - About | Geospatial Intelligence & Spatial Informatics" />
        <meta
          name="twitter:description"
          content="Learn about Spatial Force, a geospatial consultancy specializing in advanced spatial solutions, computational geography, and earth observation."
        />
        <meta name="twitter:image" content="https://spatialforce.co.zw/assets/Kudzanai.png" />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      {/* Main Content */}
      <section className="about-container">
        {/* Personal Introduction */}
        <header className="about-personal-hero">
          <div className="about-hero-content">
            <div className="about-hero-text">
              <h1 className="about-hero-title">
                <span className="about-gradient-text">Spatial Force</span><br />
                Geospatial Intelligence & Spatial Informatics
              </h1>
              <p className="about-hero-subtitle">
                Individual consultancy specializing in transformative spatial solutions through advanced geocomputation.
              </p>
            </div>
            <img
              src={consultantPhoto}
              alt="Kudzanai Chakavarika, Geospatial Consultant at Spatial Force"
              className="profile-photo"
              loading="lazy"
            />
          </div>
        </header>

        {/* Personal Journey */}
        <section className="journey-section">
          <h2 className="section-title">My Geospatial Odyssey</h2>
          <div className="journey-timeline">
            <div className="timeline-item">
              <div className="timeline-year">2022-2026</div>
              <div className="timeline-content">
                <h3>Academic Foundations</h3>
                <p>
                  Doing a BSc in Geographical Information Systems and Remote Sensing focusing on  GIS analyis,development and conservation. Developed several web applications and compiled multiple reports which documents all the researches that i did in environment and conservation works.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2024-2025</div>
              <div className="timeline-content">
                <h3>Industry Immersion</h3>
                <p>
                  Worked with Forest Commission of Zimbabwe to come up with Land use maps for all the gazzette forests in Matebeleland North for conservation purposes.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2021-Present</div>
              <div className="timeline-content">
                <h3>Consulting Practice</h3>
                <p>
                  Established an independent consultancy focusing on bespoke geospatial solutions. Successfully delivered 50+ projects ranging from municipal GIS systems to agricultural land optimization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Philosophy */}
        <section className="philosophy-section">
          <h2 className="section-title">Spatial Problem-Solving Framework</h2>
          <div className="philosophy-grid">
            <div className="philosophy-card">
              <FaCode className="philosophy-icon" />
              <h3>Computational Geography</h3>
              <p>Implementing algorithms for spatial pattern detection and predictive modeling using Python and R.</p>
            </div>

            <div className="philosophy-card">
              <FaDatabase className="philosophy-icon" />
              <h3>Data Architecture</h3>
              <p>Designing robust spatial data infrastructures with PostGIS and cloud-based solutions.</p>
            </div>

            <div className="philosophy-card">
              <FaGlobe className="philosophy-icon" />
              <h3>Earth Observation</h3>
              <p>Processing multi-spectral imagery through Google Earth Engine for environmental monitoring.</p>
            </div>
          </div>
        </section>

        {/* Methodology Deep Dive */}
        <section className="methodology-section">
          <h2 className="section-title">Solution Development Process</h2>
          <img
            src={projectWorkflow}
            alt="Project workflow diagram for geospatial solutions"
            className="workflow-diagram"
            loading="lazy"
          />
          <div className="methodology-steps">
            <div className="method-step">
              <div className="step-number">1</div>
              <h3>Spatial Requirement Analysis</h3>
              <p>Conducting needs assessment through geospatial stakeholder interviews and existing system audits.</p>
            </div>

            <div className="method-step">
              <div className="step-number">2</div>
              <h3>Technical Specification</h3>
              <p>Developing system architecture diagrams and data flow models for complex spatial systems.</p>
            </div>

            <div className="method-step">
              <div className="step-number">3</div>
              <h3>Iterative Prototyping</h3>
              <p>Building functional MVPs using agile methodologies with continuous client feedback integration.</p>
            </div>
          </div>
        </section>

        {/* Technical Capabilities */}
        <section className="capabilities-section">
          <h2 className="section-title">Advanced Technical Arsenal</h2>
          <div className="capability-layers">
            <div className="tech-layer">
              <h3>Core Technologies</h3>
              <ul className="tech-list">
                <li>PostGIS Spatial Databases</li>
                <li>Geospatial Python Stack (GDAL, GeoPandas, Rasterio)</li>
                <li>Cloud GIS (AWS Spatial, Google Earth Engine)</li>
              </ul>
            </div>

            <div className="tech-layer">
              <h3>Specialized Tools</h3>
              <ul className="tech-list">
                <li>LiDAR Processing (LAStools, PDAL)</li>
                <li>Hydrological Modeling (SWAT, HEC-RAS)</li>
                <li>3D Visualization (CesiumJS, Three.js)</li>
              </ul>
            </div>

            <div className="tech-layer">
              <h3>Emerging Techniques</h3>
              <ul className="tech-list">
                <li>Deep Learning for Image Segmentation</li>
                <li>Graph Databases for Spatial Networks</li>
                <li>Real-time Sensor Data Integration</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Client Engagement */}
        <section className="engagement-section">
          <h2 className="section-title">Collaboration Model</h2>
          <div className="engagement-principles">
            <div className="principle-card">
              <FaHandsHelping className="principle-icon" />
              <h3>Direct Partnership</h3>
              <p>Single point of contact ensuring complete project ownership and accountability.</p>
            </div>

            <div className="principle-card">
              <FaUniversity className="principle-icon" />
              <h3>Knowledge Transfer</h3>
              <p>Comprehensive documentation and training sessions for solution ownership.</p>
            </div>

            <div className="principle-card">
              <FaRocket className="principle-icon" />
              <h3>Scalable Solutions</h3>
              <p>Architecting systems with modular components for future expansion.</p>
            </div>
          </div>
        </section>

        {/* Continuous Learning */}
        <section className="learning-section">
          <h2 className="section-title">Commitment to Expertise</h2>
          <div className="learning-components">
            <div className="learning-card">
              <h3>Academic Contributions</h3>
              <ul>
                <li>Peer-reviewed publications in IJGIS</li>
                <li>Open-source geospatial tool development</li>
                <li>Conference presentations (FOSS4G, Esri UC)</li>
              </ul>
            </div>

            <div className="learning-card">
              <h3>Professional Development</h3>
              <ul>
                <li>Advanced certifications in cloud spatial services</li>
                <li>Continuous training in machine learning applications</li>
                <li>Participation in OGC standards working groups</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Ethical Practice */}
        <section className="ethics-section">
          <h2 className="section-title">Spatial Ethics Framework</h2>
          <div className="ethics-principles">
            <div className="ethic-card">
              <h3>Data Sovereignty</h3>
              <p>Strict adherence to indigenous data governance protocols.</p>
            </div>

            <div className="ethic-card">
              <h3>Algorithmic Transparency</h3>
              <p>Documented model provenance and validation processes.</p>
            </div>

            <div className="ethic-card">
              <h3>Environmental Impact</h3>
              <p>Carbon-neutral computing practices for spatial analysis.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
       
      </section>
      <Footer/>
    </>
   
  );
};

export default AboutSection;