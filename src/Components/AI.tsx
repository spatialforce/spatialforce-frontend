// src/Pages/AIGIS.tsx or AIGIS.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBrain,
  faMapMarkedAlt,
  faSatellite,
  faRobot,
  faLightbulb,
  faChartLine,
  faCloud,
  faShieldAlt,
  faGlobe,
  faSeedling,
  faCity,
  faTint,
  faTree,
  faSignal,
  faGraduationCap,
  faDollarSign,
  faInfinity,
  faNetworkWired,
  faLeaf,
  faCalendarAlt,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faHandshake,
  faQuoteLeft,
} from '@fortawesome/free-solid-svg-icons';
import './AI.css';
import Footer from './Footer'

const AIGIS: React.FC = () => {
  const featuredImage = 'https://spatialforce.co.zw/images/ai-gis-zimbabwe-featured.jpg';
  const logoImage = 'https://spatialforce.co.zw/images/spatial-force-logo.png';

  return (
    <div className="ai-page">
      <Helmet>
        <title>
          AI in GIS for Developing Countries | Zimbabwe Spatial Intelligence | SpatialForce
        </title>
        <meta
          name="description"
          content="Discover how AI-powered GIS is transforming development in Zimbabwe - from agriculture to urban planning. Learn about Africa's geospatial revolution."
        />
        <meta
          name="keywords"
          content="AI GIS Zimbabwe, geospatial AI Africa, Zimbabwe spatial intelligence, AI urban planning, precision agriculture Zimbabwe"
        />
        <meta name="author" content="SpatialForce" />

        {/* Open Graph */}
        <meta property="og:title" content="AI-Powered GIS Revolution in Zimbabwe | SpatialForce" />
        <meta
          property="og:description"
          content="How AI is transforming spatial analysis for sustainable development in Zimbabwe and across Africa"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://spatialforce.co.zw/Artificial-Intelligence"
        />
        <meta property="og:image" content={featuredImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="AI-Powered GIS Revolution in Zimbabwe | SpatialForce"
        />
        <meta
          name="twitter:description"
          content="How AI is transforming spatial analysis for sustainable development in Zimbabwe"
        />
        <meta name="twitter:image" content={featuredImage} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'AI-Powered GIS Transformation in Developing Economies',
            description:
              'How artificial intelligence is revolutionizing geographic information systems in Zimbabwe and across Africa',
            image: featuredImage,
            author: {
              '@type': 'Organization',
              name: 'SpatialForce',
              logo: logoImage,
            },
            publisher: {
              '@type': 'Organization',
              name: 'SpatialForce',
              logo: {
                '@type': 'ImageObject',
                url: logoImage,
              },
            },
            datePublished: '2024-01-15',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://spatialforce.co.zw/Artificial-Intelligence',
            },
          })}
        </script>

        <link
          rel="canonical"
          href="https://spatialforce.co.zw/Artificial-Intelligence"
        />
      </Helmet>

      <main>
        {/* HERO */}
        <section className="ai-hero">
          <div className="ai-hero-inner">
            <div className="ai-hero-text">
              <span className="ai-pill">
                <FontAwesomeIcon icon={faBrain} />
                <span>AI-Powered Geospatial Intelligence</span>
              </span>
              <h1>Spatial AI for Zimbabwe and Developing Economies</h1>
              <p>
                We combine satellite imagery, machine learning and local expertise to
                turn raw geospatial data into decision-ready intelligence for cities,
                farmers and policymakers.
              </p>
              <div className="ai-hero-actions">
                <Link to="/bookings" className="ai-btn-primary">
                  Book a consultation
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </Link>
                <span className="ai-hero-caption">
                  From Bulawayo to Harare – AI for real development problems.
                </span>
              </div>
            </div>

            <div className="ai-hero-visual">
              <div className="ai-hero-card">
                <img
                  src="/images/AI-gis.jpg"
                  alt="AI and GIS map visualization for Zimbabwe"
                  className="ai-hero-image"
                  loading="lazy"
                />
                <div className="ai-hero-overlay">
                  <div className="ai-hero-tag">
                    <FontAwesomeIcon icon={faMapMarkedAlt} />
                    <span>Zimbabwe Spatial Layers</span>
                  </div>
                  <div className="ai-hero-metrics">
                    <div>
                      <span className="ai-metric-label">Urban growth</span>
                      <span className="ai-metric-value">+32%</span>
                    </div>
                    <div>
                      <span className="ai-metric-label">Water risk</span>
                      <span className="ai-metric-value">High</span>
                    </div>
                    <div>
                      <span className="ai-metric-label">AI coverage</span>
                      <span className="ai-metric-value">Nationwide</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY AI IN GIS */}
        <section className="ai-section ai-why">
          <header className="ai-section-header">
            <h2>
              <FontAwesomeIcon icon={faLightbulb} />
              Why AI matters in GIS
            </h2>
            <p>
              Traditional GIS shows what is happening. AI-powered GIS goes further –
              predicting where, when and why change will happen, especially in
              resource-constrained contexts like Zimbabwe.
            </p>
          </header>

          <div className="ai-grid ai-grid-3">
            <div className="ai-card">
              <div className="ai-card-icon">
                <FontAwesomeIcon icon={faMapMarkedAlt} />
              </div>
              <h3>From static maps to living systems</h3>
              <p>
                Move from one-off maps to continuously updated, learning systems that
                react to new imagery, sensor data and field reports.
              </p>
            </div>

            <div className="ai-card">
              <div className="ai-card-icon">
                <FontAwesomeIcon icon={faSatellite} />
              </div>
              <h3>Automated feature extraction</h3>
              <p>
                Detect buildings, farms, water bodies and informal settlements from
                satellite and drone imagery with AI, at national scale.
              </p>
            </div>

            <div className="ai-card">
              <div className="ai-card-icon">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <h3>Predictive spatial models</h3>
              <p>
                Forecast flood risk, crop performance, urban growth or service
                pressure using historical trends and machine learning.
              </p>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="ai-section ai-use-cases">
          <header className="ai-section-header">
            <h2>
              <FontAwesomeIcon icon={faChartLine} />
              Real AI-GIS use cases in Zimbabwe
            </h2>
            <p>
              Practical applications where AI and GIS together create immediate value
              for agencies, councils and communities.
            </p>
          </header>

          <div className="ai-grid ai-grid-4">
            <div className="ai-card">
              <h3>Agriculture & Food Security</h3>
              <ul>
                <li>Crop health monitoring from satellite & drone imagery</li>
                <li>Yield prediction by ward and season</li>
                <li>Early warning for drought-affected areas</li>
              </ul>
            </div>

            <div className="ai-card">
              <h3>Urban Planning & Informal Settlements</h3>
              <ul>
                <li>Growth hotspots in Harare and Bulawayo</li>
                <li>AI-based building footprint extraction</li>
                <li>Service access analysis (water, schools, clinics)</li>
              </ul>
            </div>

            <div className="ai-card">
              <h3>Water & Environment</h3>
              <ul>
                <li>Surface water detection and change monitoring</li>
                <li>Wetland encroachment mapping</li>
                <li>Deforestation and land degradation hotspots</li>
              </ul>
            </div>

            <div className="ai-card">
              <h3>Disaster Risk & Climate</h3>
              <ul>
                <li>Flood risk modelling for riverine communities</li>
                <li>Storm impact footprints from imagery</li>
                <li>AI-assisted evacuation and access planning</li>
              </ul>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="ai-section ai-how">
          <header className="ai-section-header">
            <h2>
              <FontAwesomeIcon icon={faCloud} />
              How our AI-GIS pipeline works
            </h2>
            <p>
              A clear, auditable workflow from raw data to policy-ready insights.
            </p>
          </header>

          <div className="ai-steps">
            <div className="ai-step">
              <span className="ai-step-number">01</span>
              <h3>Data ingestion</h3>
              <p>
                Sentinel-2, Landsat, Sentinel-5P, drone imagery, census data and
                local surveys are combined into a single spatial data stack.
              </p>
            </div>
            <div className="ai-step">
              <span className="ai-step-number">02</span>
              <h3>AI processing</h3>
              <p>
                Models detect patterns, classify land cover and estimate indicators
                such as vegetation health, built-up areas or pollution.
              </p>
            </div>
            <div className="ai-step">
              <span className="ai-step-number">03</span>
              <h3>Scenario modelling</h3>
              <p>
                We simulate different futures – for example, how urban expansion
                impacts farmland or how drought affects ward-level yields.
              </p>
            </div>
            <div className="ai-step">
              <span className="ai-step-number">04</span>
              <h3>Delivery & dashboards</h3>
              <p>
                Results are delivered as web maps, dashboards, reports and APIs that
                your team can use directly in planning and operations.
              </p>
            </div>
          </div>
        </section>

        {/* DEVELOPING ECONOMIES / ZIM FOCUS */}
        <section className="ai-section ai-developing">
          <header className="ai-section-header">
            <h2>
              <FontAwesomeIcon icon={faSeedling} />
              AI-GIS in developing economies
            </h2>
            <p>
              Zimbabwe faces connectivity limits, budget constraints and skills gaps –
              but AI-GIS can still work when it is designed for this reality.
            </p>
          </header>

          <div className="ai-two-column">
            <div className="ai-column">
              <h3>Where AI brings the biggest impact</h3>
              <div className="ai-timeline">
                <div className="ai-timeline-item">
                  <div className="ai-timeline-icon">
                    <FontAwesomeIcon icon={faTint} />
                  </div>
                  <div>
                    <h4>Water stress in Matabeleland</h4>
                    <p>
                      Use AI models to track changing dam levels, rainfall patterns
                      and groundwater potential, supporting early drought response.
                    </p>
                  </div>
                </div>

                <div className="ai-timeline-item">
                  <div className="ai-timeline-icon">
                    <FontAwesomeIcon icon={faCity} />
                  </div>
                  <div>
                    <h4>Urban expansion around major cities</h4>
                    <p>
                      Detect informal growth corridors before services are overwhelmed,
                      and guide infrastructure investment into high-impact areas.
                    </p>
                  </div>
                </div>

                <div className="ai-timeline-item">
                  <div className="ai-timeline-icon">
                    <FontAwesomeIcon icon={faTree} />
                  </div>
                  <div>
                    <h4>Conservation & tourism landscapes</h4>
                    <p>
                      Monitor forest loss, encroachment and wildlife corridors around
                      key protected areas and tourism zones.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ai-column">
              <h3>Designed for Zimbabwe’s constraints</h3>
              <div className="ai-grid ai-grid-1">
                <div className="ai-card-row">
                  <div className="ai-card-row-icon">
                    <FontAwesomeIcon icon={faSignal} />
                  </div>
                  <div>
                    <h4>Limited connectivity</h4>
                    <p>
                      Offline-first tools that can run on local machines and sync
                      when internet is available, instead of demanding constant
                      cloud access.
                    </p>
                  </div>
                </div>

                <div className="ai-card-row">
                  <div className="ai-card-row-icon">
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </div>
                  <div>
                    <h4>Skills gap</h4>
                    <p>
                      Hands-on training with universities and local authorities so
                      Zimbabwean teams can own and extend the models.
                    </p>
                  </div>
                </div>

                <div className="ai-card-row">
                  <div className="ai-card-row-icon">
                    <FontAwesomeIcon icon={faDollarSign} />
                  </div>
                  <div>
                    <h4>Budget constraints</h4>
                    <p>
                      Open-source frameworks and modest hardware requirements keep
                      projects financially realistic for councils and ministries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROADMAP */}
        <section className="ai-section ai-roadmap">
          <header className="ai-section-header">
            <h2>The future of AI-GIS in Zimbabwe</h2>
            <p>
              A phased approach from pilots to fully integrated, AI-driven spatial
              planning.
            </p>
          </header>

          <div className="ai-grid ai-grid-3">
            <div className="ai-card">
              <div className="ai-badge">2024–2025</div>
              <h3>Foundation phase</h3>
              <ul>
                <li>Baseline mapping for priority cities and districts</li>
                <li>First AI pilots for agriculture and flood risk</li>
                <li>Setting national standards for spatial AI data</li>
              </ul>
              <div className="ai-card-footer">
                <FontAwesomeIcon icon={faInfinity} />
                <span>Build core data & models</span>
              </div>
            </div>

            <div className="ai-card">
              <div className="ai-badge">2026–2027</div>
              <h3>Integration phase</h3>
              <ul>
                <li>AI dashboards integrated into planning workflows</li>
                <li>Shared data hubs for ministries and local authorities</li>
                <li>Standardised reporting for SDG tracking</li>
              </ul>
              <div className="ai-card-footer">
                <FontAwesomeIcon icon={faNetworkWired} />
                <span>Connect systems & agencies</span>
              </div>
            </div>

            <div className="ai-card">
              <div className="ai-badge">2028+</div>
              <h3>Sustainability phase</h3>
              <ul>
                <li>AI-driven climate resilience planning</li>
                <li>Energy, transport and land-use digital twins</li>
                <li>Local teams fully maintaining AI-GIS systems</li>
              </ul>
              <div className="ai-card-footer">
                <FontAwesomeIcon icon={faLeaf} />
                <span>Long-term, locally led systems</span>
              </div>
            </div>
          </div>
        </section>

        {/* QUOTE */}
        <section className="ai-section ai-quote">
          <div className="ai-quote-card">
            <FontAwesomeIcon icon={faQuoteLeft} className="ai-quote-icon" />
            <p>
              AI in GIS is not about replacing local knowledge – it’s about giving
              Zimbabwean planners, farmers and communities better tools to see what’s
              coming and act early.
            </p>
            <div className="ai-quote-author">
              <div className="ai-avatar" />
              <div>
                <strong>Kudzanai Chakavarika</strong>
                <span>Director, SpatialForce</span>
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING / CONTACT */}
        <section className="ai-section ai-closing">
          <div className="ai-closing-inner">
            <div className="ai-closing-main">
              <div className="ai-closing-icon">
                <FontAwesomeIcon icon={faHandshake} />
              </div>
              <div>
                <h2>Ready to build your AI-GIS roadmap?</h2>
                <p>
                  Whether you&apos;re a municipality, ministry, NGO or private
                  organisation, SpatialForce can help you design and implement AI-GIS
                  solutions that fit Zimbabwe&apos;s context.
                </p>
                <div className="ai-closing-actions">
                  <Link to="/bookings" className="ai-btn-primary">
                    Bookings
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="ai-contact">
              <div className="ai-contact-item">
                <FontAwesomeIcon icon={faEnvelope} />
                <a href="mailto:gis@spatialforce.co.zw">gis@spatialforce.co.zw</a>
              </div>
              <div className="ai-contact-item">
                <FontAwesomeIcon icon={faPhone} />
                <a href="tel:+263717428085">+263 717 428 085</a>
              </div>
              <div className="ai-contact-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>17 Longhurst | Northlynne | Bulawayo</span>
              </div>
            </div>

            <div className="ai-closing-footer">
              <div className="ai-footer-brand">
                <div className="ai-footer-logo">SF</div>
                <div>
                  <strong>SpatialForce</strong>
                  <span>AI-Powered Geospatial Solutions</span>
                </div>
              </div>
              <div className="ai-footer-links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
               
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
    
  );
};

export default AIGIS;
