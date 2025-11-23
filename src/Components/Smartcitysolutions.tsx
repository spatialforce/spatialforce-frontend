import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './SmartCitySolutions.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandshake,
  faLock,
  faGlobeAfrica,
  faSyncAlt,
  faCity,
  faTree,
  faHome,
  faArrowRight,
  faEnvelope,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';

const SmartCitySolutions: React.FC = () => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'SpatialForce GIS Solutions',
    image: 'https://spatialforce.co.zw/logo.png',
    description:
      'Professional GIS services for urban planning in Bulawayo, Harare and across Zimbabwe',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bulawayo',
      addressRegion: 'Matabeleland',
      addressCountry: 'ZW',
    },
  };

  const Opendata = '/images/Open-data.svg';
  const GIS = '/images/GIS.svg';
  const AI = '/images/AI.svg';

  return (
    <div className="sc-page">
      <Helmet>
        <title>
          GIS Urban Planning Bulawayo | Climate Change Mapping Zimbabwe | SpatialForce
        </title>
        <meta
          name="description"
          content="Professional GIS services in Bulawayo specializing in climate change analysis, health facility mapping and urban planning for Magwegwe, Njube and surrounding areas."
        />
        <meta
          name="keywords"
          content="GIS Bulawayo, Urban Planning Zimbabwe, Climate Change Mapping, Magwegwe Njube analysis, Bulawayo City Council projects, SpatialForce Zimbabwe"
        />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <link rel="preload" href="../assets/bulawayo.png" as="image" />
      </Helmet>

      <main className="sc-main">
        {/* HERO */}
        <section className="sc-hero">
          <div className="sc-hero-inner">
            <div className="sc-hero-bg-pattern" />
            <div className="sc-hero-content">
              <span className="sc-pill">
                <span className="sc-pill-dot" />
                Smart Urban GIS · Zimbabwe
              </span>
              <h1>
                Next-Generation Urban Management
                <span className="sc-hero-subtitle">
                  Developing Smart GIS Strategies for Zimbabwean Cities
                </span>
              </h1>
              <p className="sc-hero-lead">
                Advanced spatial analysis for sustainable city development from climate risk
                mapping in to infrastructure optimisation.
              </p>
              <div className="sc-hero-actions">
                <Link to="/bookings" className="sc-btn-primary">
                  Book strategy session
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
                <p className="sc-hero-caption">
                  Supporting local authorities, universities and development partners with
                  decision-ready GIS insights.
                </p>
              </div>
            </div>
            <div className="sc-hero-panel">
              <div className="sc-hero-card">
                <h3>Urban GIS Snapshot</h3>
                <ul>
                  <li>
                    <span className="sc-metric-label">Climate study coverage</span>
                    <span className="sc-metric-value">Bulawayo metro</span>
                  </li>
                  <li>
                    <span className="sc-metric-label">Health facilities mapped</span>
                    <span className="sc-metric-value">50+ locations</span>
                  </li>
                  <li>
                    <span className="sc-metric-label">Focus corridors</span>
                    <span className="sc-metric-value">Magwegwe · Njube · Luveve</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CORE SERVICES */}
        <section className="sc-section sc-core">
          <header className="sc-section-header">
            <h2>Core Urban Planning Services</h2>
            <p>
              We combine GIS, climate science and local knowledge to help municipalities plan
              infrastructure, manage growth and improve service delivery.
            </p>
          </header>

          <div className="sc-two-column">
            <article className="sc-card sc-card-text">
              <h3>Infrastructure Mapping & Analysis</h3>
              <p>
                Our comprehensive spatial analysis services empower municipalities to visualize,
                assess and optimize critical infrastructure components. By leveraging advanced GIS
                technologies and data analysis we facilitate efficient urban planning and enhance
                service delivery across various sectors, ensuring that cities can meet the evolving
                needs of their populations:
              </p>
              <ul>
                <li>
                  <strong>Water Distribution Networks:</strong> Mapping flow patterns, pressure
                  zones and service areas to locate leaks and underperforming segments, guiding
                  targeted maintenance and upgrades.
                </li>
                <li>
                  <strong>Transportation Systems:</strong> Mapping road networks, transit routes and
                  pedestrian pathways to understand congestion and design sustainable mobility
                  solutions.
                </li>
                <li>
                  <strong>Public Facility Locations:</strong> Locating schools, healthcare centres
                  and recreational areas using demographics and accessibility analysis to promote
                  equity.
                </li>
                <li>
                  <strong>Emergency Service Coverage:</strong> Analysing fire, health and police
                  response times to position resources for faster, more effective incident response.
                </li>
              </ul>
            </article>

            <article className="sc-card sc-card-text">
              <h3>Land Use Planning & Zoning</h3>
              <p>
                We deliver data-driven insights that support land use planning and zoning decisions,
                aligning development with community needs, sustainability goals and regulations:
              </p>
              <ul>
                <li>
                  <strong>Urban Expansion Management:</strong> Analysing growth patterns and land
                  suitability to define strategic expansion areas and limit sprawl.
                </li>
                <li>
                  <strong>Informal Settlement Analysis:</strong> Mapping settlement patterns and
                  socio-economic conditions to guide upgrading and service provision.
                </li>
                <li>
                  <strong>Green Space Allocation:</strong> Prioritising parks and natural areas in
                  dense neighbourhoods to support health, ecology and recreation.
                </li>
                <li>
                  <strong>Commercial/Residential Zoning:</strong> Balancing mixed-use development,
                  mobility and neighbourhood character through zoning strategies.
                </li>
              </ul>
            </article>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="sc-section sc-projects">
          <header className="sc-section-header">
            <h2>Recent Projects & Case Studies</h2>
          </header>

          <div className="sc-grid sc-grid-2">
            <article className="sc-card sc-project-card">
              <h3>Localized Climate Change Study in Bulawayo (2024)</h3>
              <p>
                In 2024, we were awarded a microgrant from Bloomberg Philanthropies in collaboration
                with Bulawayo City Council to conduct a localized climate change study focused on the
                city of Bulawayo. The project assessed carbon emissions, specifically nitrogen dioxide
                (NO₂), carbon monoxide (CO) and sulphur dioxide (SO₂) across neighbourhoods.
              </p>
              <p>
                Mapping revealed elevated SO₂ levels in Magwegwe, Mpopoma, Luveve and Njube,
                associated with a sewer river traversing these communities. This highlighted both
                environmental degradation and health risks.
              </p>
              <p>
                Household surveys in affected areas showed heavy reliance on fossil fuels, underscoring
                the need for cleaner energy options. The work informs targeted interventions and
                climate-resilient planning.
              </p>
              <p>
                We thank NUST, Bulawayo City Council and Bloomberg Philanthropies for their support.
                For more details on results and outcomes, please{' '}
                <Link to="/contact">contact us</Link>.
              </p>
              <div className="sc-project-partners">
                <h4>Partner Links</h4>
                <div className="sc-partner-links">
                  <a href="http://www.nust.ac.zw" target="_blank" rel="noopener noreferrer">
                    National University of Science and Technology (NUST)
                  </a>
                  <a href="https://www.citybyo.co.zw/" target="_blank" rel="noopener noreferrer">
                    Bulawayo City Council (BCC)
                  </a>
                  <a href="https://www.bloomberg.org" target="_blank" rel="noopener noreferrer">
                    Bloomberg Philanthropies
                  </a>
                </div>
              </div>
            </article>

            <article className="sc-card sc-project-card">
              <h3>Mapping Bulawayo Health Facilities</h3>
              <p>
                We developed an interactive web map to visualise health facilities across Bulawayo,
                enabling residents to locate nearby services and get directions from their current
                location.
              </p>
              <p>
                The map displays clinics, hospitals and specialised centres, improving awareness of
                available care. Users can navigate intuitively and choose facilities based on
                proximity and service type.
              </p>
              <p>
                This initiative strengthens access to healthcare and supports planning for future
                facility investments in underserved wards.
              </p>
            </article>
          </div>
        </section>

        {/* METHODOLOGY */}
        <section className="sc-section sc-methodology">
          <header className="sc-section-header">
            <h2>Technical Methodology</h2>
          </header>

          <div className="sc-grid sc-grid-3">
            <article className="sc-card sc-card-text">
              <h3>Data Collection</h3>
              <p>
                We blend field surveys, satellite imagery and open data to build precise basemaps and
                decision layers:
              </p>
              <ul>
                <li>
                  <strong>Field Surveys:</strong> Ground-truthing land use, infrastructure and
                  environmental conditions, while engaging communities for local insights.
                </li>
                <li>
                  <strong>Satellite Imagery:</strong> Tracking land use change, vegetation cover and
                  urban expansion over time.
                </li>
                <li>
                  <strong>Open Data Sources:</strong> Integrating government datasets, demographic
                  statistics and environmental reports to add context.
                </li>
                <li>
                  <strong>Data Integration:</strong> Aligning all sources into coherent basemaps ready
                  for analysis and planning.
                </li>
              </ul>
            </article>

            <article className="sc-card sc-card-text">
              <h3>Spatial Analysis</h3>
              <p>We apply advanced GIS techniques to drive evidence-based decisions:</p>
              <ul>
                <li>
                  <strong>Network Analysis:</strong> Optimising routes and service delivery for
                  transport and utilities.
                </li>
                <li>
                  <strong>Density Mapping:</strong> Visualising populations, resources and land use
                  hotspots.
                </li>
                <li>
                  <strong>3D Modelling:</strong> Representing urban form and proposed developments in
                  realistic 3D.
                </li>
                <li>
                  <strong>Spatial Interpolation & Geostatistics:</strong> Estimating and analysing
                  environmental indicators across space.
                </li>
              </ul>
            </article>

            <article className="sc-card sc-card-text">
              <h3>Implementation Support</h3>
              <p>We ensure insights move from reports into real change on the ground:</p>
              <ul>
                <li>
                  <strong>Practical Recommendations:</strong> Actionable strategies aligned with local
                  budgets and capacity.
                </li>
                <li>
                  <strong>Interactive Web Maps:</strong> Easy-to-use tools for planners and decision
                  makers.
                </li>
                <li>
                  <strong>Training & Workshops:</strong> Building in-house GIS skills within
                  municipalities.
                </li>
                <li>
                  <strong>Ongoing Support & M&E:</strong> Technical assistance plus monitoring
                  frameworks to track impact.
                </li>
              </ul>
            </article>
          </div>
        </section>

        {/* GIS APPLICATIONS CARDS */}
        <section className="sc-section sc-applications">
          <header className="sc-section-header">
            <h2>GIS in Action: Smart City Innovations</h2>
            <p>
              A snapshot of how spatial intelligence powers modern African cities – from IoT-enabled
              monitoring to digital twins.
            </p>
          </header>

          <p className="sc-section-subtitle">
            GIS is one of the most powerful tools in town and urban planning. It helps cities respond
            to climate, mobility and service delivery challenges while improving quality of life.
          </p>

          <div className="sc-grid sc-grid-3 sc-app-grid">
            {/* Urban IoT */}
            <article className="sc-card sc-app-card">
              <div className="sc-app-header">
                <span className="sc-emoji">🗺️⚡</span>
                <img
                  src="https://images.unsplash.com/photo-1575285272212-d52e915d01c7?fm=jpg&q=60&w=1600"
                  alt="Smart city dashboard"
                  className="sc-app-image"
                  loading="lazy"
                />
              </div>
              <h3>
                Urban IoT Integration <span className="sc-emoji">🌐📡</span>
              </h3>
              <ul>
                <li>
                  <strong>Real-time Traffic Monitoring:</strong> GPS sensors feeding GIS dashboards to
                  optimise routes and reduce congestion.
                </li>
                <li>
                  <strong>Smart Street Lighting:</strong> Adaptive lighting based on pedestrian and
                  vehicle activity.
                </li>
                <li>
                  <strong>Waste Route Optimisation:</strong> Monitoring bin levels and optimising
                  collection routes.
                </li>
                <li>
                  <strong>Flood Prediction Systems:</strong> Integrating rainfall and terrain data to
                  predict urban flooding.
                </li>
              </ul>
            </article>

            {/* Sustainable City Planning */}
            <article className="sc-card sc-app-card">
              <div className="sc-app-header">
                <span className="sc-emoji">🏙️🌳</span>
                <img
                  src="https://images.unsplash.com/photo-1570200020951-e21a58c2ef87?fm=jpg&q=60&w=1600"
                  alt="Green city planning"
                  className="sc-app-image"
                  loading="lazy"
                />
              </div>
              <h3>
                Sustainable City Planning <span className="sc-emoji">♻️🌱</span>
              </h3>
              <ul>
                <li>
                  <strong>Carbon Footprint Mapping:</strong> Visualising emissions across wards and
                  suburbs.
                </li>
                <li>
                  <strong>3D Solar Potential Modelling:</strong> Assessing rooftop solar opportunities.
                </li>
                <li>
                  <strong>Bike Lane Network Design:</strong> Planning safe, connected cycling routes.
                </li>
                <li>
                  <strong>Urban Green Space Analysis:</strong> Targeting new parks where they are
                  needed most.
                </li>
              </ul>
            </article>

            {/* Emergency Response */}
            <article className="sc-card sc-app-card">
              <div className="sc-app-header">
                <span className="sc-emoji">🏥🚑</span>
                <img
                  src="https://images.unsplash.com/photo-1689091271342-b4082fc8345e?fm=jpg&q=60&w=1600"
                  alt="Emergency response system"
                  className="sc-app-image"
                  loading="lazy"
                />
              </div>
              <h3>
                Smart Emergency Response <span className="sc-emoji">🚨⏱️</span>
              </h3>
              <ul>
                <li>
                  <strong>Hospital Accessibility Mapping:</strong> Identifying travel times to key
                  facilities.
                </li>
                <li>
                  <strong>Fire Risk Zoning:</strong> Combining vegetation, housing and climate data.
                </li>
                <li>
                  <strong>Evacuation Planning:</strong> Designing routes and safe zones for disasters.
                </li>
                <li>
                  <strong>Real-time Routing:</strong> Guiding responders using live traffic data.
                </li>
              </ul>
            </article>

            {/* Digital Twin */}
            <article className="sc-card sc-app-card">
              <div className="sc-app-header">
                <span className="sc-emoji">🏗️📈</span>
                <img
                  src="https://images.unsplash.com/photo-1617105990241-454f3d104824?fm=jpg&q=60&w=1600"
                  alt="Urban development"
                  className="sc-app-image"
                  loading="lazy"
                />
              </div>
              <h3>
                Digital Twin Cities <span className="sc-emoji">🖥️🌇</span>
              </h3>
              <ul>
                <li>
                  <strong>Infrastructure Lifecycle Management:</strong> Tracking assets from
                  construction to maintenance.
                </li>
                <li>
                  <strong>5G Network Planning:</strong> Optimising coverage and capacity.
                </li>
                <li>
                  <strong>Water System Simulation:</strong> Modelling water networks for reliability.
                </li>
                <li>
                  <strong>Underground Utility Mapping:</strong> Preventing service disruptions.
                </li>
              </ul>
            </article>

            {/* Citizen Engagement */}
            <article className="sc-card sc-app-card">
              <div className="sc-app-header">
                <span className="sc-emoji">🗳️📱</span>
                <img
                  src="https://images.unsplash.com/photo-1553724625-6f84f9074bb4?fm=jpg&q=60&w=1600"
                  alt="Citizen engagement"
                  className="sc-app-image"
                  loading="lazy"
                />
              </div>
              <h3>
                Citizen Engagement <span className="sc-emoji">👥💬</span>
              </h3>
              <ul>
                <li>
                  <strong>Participatory Planning:</strong> Platforms for residents to co-design
                  projects.
                </li>
                <li>
                  <strong>Crowdsourced Reporting:</strong> Mapping issues such as blocked drains or
                  broken streetlights.
                </li>
                <li>
                  <strong>Feedback Dashboards:</strong> Visualising community input for decision
                  makers.
                </li>
                <li>
                  <strong>Community Resource Maps:</strong> Highlighting local assets and services.
                </li>
              </ul>
            </article>

            {/* Smart Utilities */}
            <article className="sc-card sc-app-card">
              <div className="sc-app-header">
                <span className="sc-emoji">💧⚡</span>
                <img
                  src="https://images.unsplash.com/photo-1630770147528-3c38bc9e05a6?fm=jpg&q=60&w=1600"
                  alt="Utility management"
                  className="sc-app-image"
                  loading="lazy"
                />
              </div>
              <h3>
                Smart Utilities <span className="sc-emoji">🔧📊</span>
              </h3>
              <ul>
                <li>
                  <strong>Water Network Monitoring:</strong> Tracking pressure and losses in
                  distribution systems.
                </li>
                <li>
                  <strong>Energy Grid Optimisation:</strong> Improving reliability and efficiency.
                </li>
                <li>
                  <strong>Leak Detection:</strong> Spatial tools for spotting and prioritising leaks.
                </li>
                <li>
                  <strong>Renewable Energy Planning:</strong> Siting solar and wind assets.
                </li>
              </ul>
            </article>
          </div>

          <div className="sc-tech-badge">
            <div className="sc-tech-pill">
              <img
                src={GIS}
                className="sc-tech-icon"
                alt="GIS Technology"
                width={24}
                height={24}
                loading="lazy"
              />
              <span>GIS Research</span>
            </div>
            <div className="sc-tech-pill">
              <img
                src={AI}
                className="sc-tech-icon"
                alt="AI Analytics"
                width={24}
                height={24}
                loading="lazy"
              />
              <span>AI Analytics</span>
            </div>
            <div className="sc-tech-pill">
              <img
                src={Opendata}
                className="sc-tech-icon"
                alt="Open Data"
                width={24}
                height={24}
                loading="lazy"
              />
              <span>Open Data</span>
            </div>
          </div>
        </section>

        {/* SEO / CONTENT BLOCK */}
        <section className="sc-section sc-gis-content">
          <div className="sc-content-inner">
            <h2>GIS-Driven Urban Planning: Building Zimbabwe&apos;s Future Cities</h2>

            <div className="sc-grid sc-grid-2">
              <article className="sc-card sc-card-text">
                <h3>The Synergy of Spatial Analysis & City Development</h3>
                <p>
                  Urban planning forms the backbone of sustainable city growth – particularly crucial
                  for Zimbabwe where <strong>urban populations are growing at 4.3% annually</strong>{' '}
                  (SpatialForce 2023). When integrated with GIS, planning becomes a precision tool for
                  managing Bulawayo&apos;s infrastructure needs, Harare&apos;s expansion challenges
                  and national climate adaptation strategies.
                </p>
                <p>
                  Our <strong>GIS solutions in Zimbabwe</strong> combine satellite imagery, IoT
                  sensor data and machine learning to create dynamic models of urban ecosystems – from
                  analysing traffic in Mbare to optimising water distribution in drought-prone
                  Matabeleland.
                </p>
              </article>

              <article className="sc-card sc-card-text">
                <h3>How GIS Revolutionizes Urban Management</h3>
                <p>The SpatialForce methodology leverages geospatial technology in three phases:</p>
                <ol className="sc-process-list">
                  <li>
                    <strong>Data Fusion:</strong> Integrating municipal records, OpenStreetMap and
                    drone surveys to map Bulawayo townships and Harare&apos;s CBD.
                  </li>
                  <li>
                    <strong>Spatial Intelligence:</strong> Using heatmaps for crime prevention in
                    Highfield and network analysis for Harare public transport.
                  </li>
                  <li>
                    <strong>Scenario Modelling:</strong> Simulating flood impacts on Beitbridge
                    infrastructure and renewable energy potential in Hwange.
                  </li>
                </ol>
              </article>
            </div>

            <article className="sc-card sc-card-text sc-card-wide">
              <h3>Transforming Zimbabwe&apos;s Urban Landscape</h3>
              <p>
                For cities like Gweru and Mutare, our <strong>GIS urban planning services</strong>{' '}
                support:
              </p>
              <ul className="sc-impact-list">
                <li>
                  <strong>Climate Resilience:</strong> Mapping Mazowe River flood zones to protect
                  over 50,000 residents.
                </li>
                <li>
                  <strong>Economic Growth:</strong> Identifying optimal industrial hubs along the
                  Harare–Beitbridge corridor.
                </li>
                <li>
                  <strong>Social Equity:</strong> Prioritising clinic locations in underserved areas
                  of Epworth via accessibility analysis.
                </li>
              </ul>
              <p>
                The <strong>Zimbabwe National Spatial Development Strategy 2023–2030</strong> places
                GIS at the heart of SDG 11 (Sustainable Cities). Our collaborations with Bulawayo
                City Council show this in practice – slum upgrading projects in Magwegwe reduced
                cholera outbreaks by 60% through improved water mapping.
              </p>
              <div className="sc-seo-extra">
                <p>
                  As <strong>Zimbabwe&apos;s premier GIS consultants</strong>, SpatialForce
                  specialises in <strong>smart city solutions for African urban challenges</strong>.
                  Our expertise in <strong>Bulawayo urban planning</strong> and{' '}
                  <strong>Harare infrastructure mapping</strong> helps municipalities:
                </p>
                <ul className="sc-seo-list">
                  <li>Cut service delivery costs by up to 45% via route optimisation</li>
                  <li>Attract investment with interactive land parcel portals</li>
                  <li>Respond to climate change using carbon footprint visualisations</li>
                </ul>
                <p>
                  Partner with us to implement <strong>World Bank-aligned urban GIS strategies</strong>{' '}
                  tailored to Zimbabwe – from Victoria Falls tourism infrastructure to Chitungwiza
                  informal settlement upgrades.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* PARTNERSHIP / TRUST */}
        <section className="sc-section sc-partnership">
          <header className="sc-section-header">
            <h2>
              <FontAwesomeIcon icon={faHandshake} /> Trusted Partners in Smart Urban Development
            </h2>
          </header>

          <div className="sc-grid sc-grid-3 sc-commitment-grid">
            <article className="sc-card sc-commitment-card">
              <FontAwesomeIcon icon={faLock} className="sc-commitment-icon" />
              <h3>Data Security First</h3>
              <p>
                Compliant protocols for spatial data handling ensure sensitive municipal datasets
                remain protected throughout our collaboration.
              </p>
            </article>

            <article className="sc-card sc-commitment-card">
              <FontAwesomeIcon icon={faGlobeAfrica} className="sc-commitment-icon" />
              <h3>Nationwide Implementation</h3>
              <p>
                From Bulawayo township regeneration to Harare metro planning, we deliver customised
                GIS solutions across Zimbabwe&apos;s urban landscape.
              </p>
            </article>

            <article className="sc-card sc-commitment-card">
              <FontAwesomeIcon icon={faSyncAlt} className="sc-commitment-icon" />
              <h3>Continuous Support</h3>
              <p>
                Partnerships that go beyond delivery – system audits, updates and dedicated account
                management for municipal teams.
              </p>
            </article>
          </div>

          <div className="sc-expertise-row">
            <div className="sc-expertise-item">
              <FontAwesomeIcon icon={faCity} className="sc-expertise-icon" />
              <h4>Urban Infrastructure</h4>
              <p>Water systems · Transport networks · Energy grids</p>
            </div>
            <div className="sc-expertise-item">
              <FontAwesomeIcon icon={faTree} className="sc-expertise-icon" />
              <h4>Environmental Planning</h4>
              <p>Green spaces · Pollution control · Climate resilience</p>
            </div>
            <div className="sc-expertise-item">
              <FontAwesomeIcon icon={faHome} className="sc-expertise-icon" />
              <h4>Community Development</h4>
              <p>Housing projects · Public facilities · Informal settlements</p>
            </div>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="sc-section sc-closing">
          <div className="sc-closing-inner">
            <div className="sc-closing-main">
              <h2>
                <span className="sc-gradient-text">
                  Pioneering Africa&apos;s Smart City Revolution
                </span>
                <br />
                From Bulawayo to Harare – Built on Spatial Intelligence
              </h2>

              <div className="sc-value-columns">
                <article className="sc-card sc-value-card">
                  <FontAwesomeIcon icon={faCity} className="sc-value-icon" />
                  <h3>Urban Innovation Hub</h3>
                  <p>Empowering communities with practical GIS tools for better planning.</p>
                  <ul className="sc-achievement-list">
                    <li>Collaborated with local governments to enhance infrastructure</li>
                    <li>Facilitated workshops on sustainable urban development</li>
                    <li>Led community mapping projects to surface local priorities</li>
                  </ul>
                </article>

                <article className="sc-card sc-value-card">
                  <FontAwesomeIcon icon={faTree} className="sc-value-icon" />
                  <h3>Green Urban Solutions</h3>
                  <p>Promoting climate-aware and environmentally friendly urban growth.</p>
                  <ul className="sc-achievement-list">
                    <li>Urban reforestation and green space planning initiatives</li>
                    <li>Waste reduction and recycling strategies</li>
                    <li>Renewable energy integration in city development</li>
                  </ul>
                </article>
              </div>

              <div className="sc-cta-strip">
                <div className="sc-cta-text">
                  <h4>Collaborate with Zimbabwe&apos;s Urban Innovation Experts</h4>
                  <p className="sc-cta-subtext">
                    <FontAwesomeIcon icon={faArrowRight} className="sc-pulse-icon" />
                    Offering end-to-end smart city solutions, including:
                  </p>
                  <div className="sc-usp-grid">
                    <span className="sc-usp-item">AI-Powered Traffic Analysis</span>
                    <span className="sc-usp-item">Community Development Initiatives</span>
                    <span className="sc-usp-item">Emergency Mapping Solutions</span>
                    <span className="sc-usp-item">Cultural Heritage Awareness</span>
                  </div>
                </div>
                <div className="sc-contact-channel">
                  <p>Contact us on:</p>
                  <a href="tel:+263779135076" className="sc-contact-link">
                    <FontAwesomeIcon icon={faPhone} /> +263 779 135 5076
                  </a>
                  <a href="mailto:gis@spatialforce.co.zw" className="sc-contact-link">
                    <FontAwesomeIcon icon={faEnvelope} /> gis@spatialforce.co.zw
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NATIONAL PRESENCE */}
        <section className="sc-section sc-presence">
          <div className="sc-presence-inner">
            <h5 className="sc-presence-heading">
              <FontAwesomeIcon icon={faGlobeAfrica} className="sc-globe-icon" />
              Leaving no place behind
            </h5>
            <div className="sc-city-network">
              <div className="sc-region-group">
                <h6>Matabeleland Leadership</h6>
                <p>Bulawayo · Victoria Falls · Hwange · Beitbridge</p>
              </div>
              <div className="sc-region-group">
                <h6>Mashonaland Innovations</h6>
                <p>Harare · Chitungwiza · Marondera · Bindura</p>
              </div>
              <div className="sc-region-group">
                <h6>Manicaland Progress</h6>
                <p>Mutare · Chipinge · Nyanga · Rusape</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="sc-footer">
        <div className="sc-footer-mission">
          <p>© {new Date().getFullYear()} SpatialForce GIS Solutions</p>
          <p>Driving insights Implementation Through Spatial Innovation</p>
        </div>
        <div className="sc-footer-legal">
          <Link to="/privacy" className="sc-legal-link">
            Data Protection Policy
          </Link>
          <span className="sc-divider">|</span>
          <Link to="/terms" className="sc-legal-link">
            Service Agreements
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default SmartCitySolutions;
