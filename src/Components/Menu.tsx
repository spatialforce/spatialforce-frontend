import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTree, faTractor, faWater, faMapMarkedAlt,
  faChartLine, faSeedling, faCloud, faMountain,faExclamationTriangle,faCity,faBus
} from '@fortawesome/free-solid-svg-icons';
import './Menu.css'; // Import CSS
import Climatechange from '../assets/climatechange.png';
import Service from './Services'; // Import Service component
import FAQ from './FAQ'; // Import FAQ component
import Testimonial from './ReviewSystem'; // Import Testimonial component
import AnimatedTicker from './Icon-animation'; // Import AnimatedTicker component
import Footer from './Footer'; // Import Footer component
import ReviewSystem from './ReviewSystem';
import MenuSchema from './MenuSchema'
import { Helmet } from 'react-helmet-async';

function Menu() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentSlide, setCurrentSlide] = useState(0); // Track current slide
  const navigate = useNavigate();
  const researchRefs = {
    climate: useRef(null),
    urban: useRef(null),
    land: useRef(null),
    transport: useRef(null),
    risk: useRef(null)
  };

  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  const handleResearchScroll = (ref) => {
    researchRefs[ref].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Slideshow data with unique information for each slide
  const slides = [
    {
      image: 'https://images.unsplash.com/flagged/photo-1574848487348-533aaf72833e?auto=format&fit=crop&w=1350&q=80',
      title: 'Satellite Imagery Analysis',
      description: 'Harness the power of satellite data for environmental monitoring.',
      content: [
        'Our satellite imagery analysis tools provide real-time insights into environmental changes.',
        'With advanced algorithms, we detect deforestation, monitor wildlife habitats, and predict natural disasters.',
      ],
    },
    {
      image: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=1350&q=80',
      title: 'Geospatial Data Processing',
      description: 'Transform raw data into actionable insights with advanced GIS tools.',
      content: [
        'Our geospatial data processing solutions integrate machine learning and AI for predictive analytics.',
        'From urban planning to agriculture, we deliver precise and scalable solutions.',
      ],
    },
    {
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1350&q=80',
      title: 'GIS Software Training',
      description: 'Learn to use industry-standard GIS tools like ArcGIS and QGIS.',
      content: [
        'We offer comprehensive training programs for GIS software, tailored to beginners and advanced users.',
        'Master spatial analysis, map production, and data visualization techniques.',
      ],
    },
    {
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1350&q=80',
      title: 'Web Development Services',
      description: 'From static websites to complex web applications.',
      content: [
        'We build responsive and user-friendly websites using modern technologies like React, Node.js, and Django.',
        'Our services include SEO optimization, free hosting for 2 months, and ongoing maintenance.',
      ],
    },
  ];

  // Handle next slide
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Handle previous slide
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 30000); // Change slide every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [slides.length]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Structured data for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Spatial Force",
    "url": "https://spatialforce.co.zw",
    "logo": "https://spatialforce.co.zw/logo.png",
    "description": "Spatial Force provides cutting-edge geospatial solutions for environmental monitoring, urban planning, and agricultural optimization.",
    "sameAs": [
      "https://linkedin.com/company/spatial-force",
      "https://twitter.com/spatialforce"
    ]
  };

  return (
    <>
    <MenuSchema />
    <div className="geospatial-portal">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Spatial Force - Geospatial Intelligence & Solutions</title>
        <meta
          name="description"
          content="Spatial Force offers advanced geospatial solutions including satellite imagery analysis, GIS data processing and climate resilience planning. Explore our services today."
        />
        <meta
          name="keywords"
          content="geospatial intelligence, GIS solutions, satellite imagery, climate resilience, urban planning, agricultural optimization"
        />
        <meta property="og:title" content="Spatial Force - Geospatial Intelligence & Solutions" />
        <meta
          property="og:description"
          content="Spatial Force offers advanced geospatial solutions including satellite imagery analysis, GIS data processing and climate resilience planning."
        />
        <meta property="og:image" content="https://spatialforce.co.zw/assets/consultant-profile.jpg" />
        <meta property="og:url" content="https://spatialforce.co.zw" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Spatial Force - Geospatial Intelligence & Solutions" />
        <meta
          name="twitter:description"
          content="Spatial Force offers advanced geospatial solutions including satellite imagery analysis, GIS data processing and climate resilience planning."
        />
        <meta name="twitter:image" content="https://spatialforce.co.zw/assets/consultant-profile.jpg" />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="css-slideshow">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`css-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div
                className="hero-slide-image"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="slide-info">
                <h1>{slide.title}</h1>
                <p className="slide-description">{slide.description}</p>
                <div className="slide-content">
                  {slide.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Next and Previous Arrows */}
          <button className="slideshow-arrow prev-arrow" onClick={handlePrevSlide}>
            &#10094; {/* Unicode for left arrow */}
          </button>
          <button className="slideshow-arrow next-arrow" onClick={handleNextSlide}>
            &#10095; {/* Unicode for right arrow */}
          </button>
        </div>
        <div className="hero-overlay" />
      </section>

      {/* Introduction Section */}
      <section className="introduction-section">
        <div className="section-content">
          <h2>Transforming Industries Through Spatial Intelligence</h2>
          <p className="intro-text">
            Leveraging cutting-edge GIS technologies we empower organizations to solve complex spatial challenges.
            Our solutions integrate real time data streams and advanced analytics to drive
            sustainability across environmental, agricultural and urban ecosystems.
          </p>
        </div>
      </section>

      {/* Core Services */}
      <section className="core-services">
        <div className="section-header">
          <h2>Our Core Services</h2>
          <p className="section-subtitle">
            Comprehensive geospatial solutions for modern challenges
          </p>
        </div>
        <div className="services-grid">
          {[
            { icon: faMapMarkedAlt, title: '3D Terrain Mapping', 
              text: 'High-resolution topographic modeling with LiDAR integration' },
            { icon: faChartLine, title: 'Predictive Analytics', 
              text: 'AI-driven spatial forecasting and trend analysis' },
            { icon: faCloud, title: 'Remote Sensing', 
              text: 'Multi-spectral satellite imagery processing and analysis' }
          ].map((service, i) => (
            <div key={i} className="service-card">
              <FontAwesomeIcon icon={service.icon} className="service-icon" />
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GIS Applications */}
      <section className="gis-applications">
        <div className="section-header">
          <h2>GIS in Action</h2>
          <p className="section-subtitle">
            Industry-specific solutions driving measurable results
          </p>
        </div>

        <div className="applications-container">
          {/* Environmental Conservation */}
          <div className="application-card">
            <div className="card-content">
              <div className="card-text">
                <FontAwesomeIcon icon={faTree} className="sector-icon" />
                <h3>Ecosystem Management</h3>
                <div className="sector-content">
                  <p>Advanced habitat monitoring systems combining:</p>
                  <ul className="sector-features">
                    <li>Satellite-based deforestation alerts</li>
                    <li>Wildlife corridor modeling</li>
                    <li>Carbon sequestration analysis</li>
                    <li>Climate resilience planning</li>
                  </ul>
                  <p>Our solutions have helped protect over 1M acres of critical habitats globally.</p>
                </div>
                <button className="inquire-button" onClick={() => navigate('/contact/environment')}>
                  Environmental Solutions
                </button>
              </div>
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1566884239546-e58a8806cb5c" 
                     alt="Environmental monitoring" />
              </div>
            </div>
          </div>

          {/* Agricultural Optimization */}
          <div className="application-card reversed">
            <div className="card-content">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1557234195-bd9f290f0e4d" 
                     alt="Precision agriculture" />
              </div>
              <div className="card-text">
                <FontAwesomeIcon icon={faTractor} className="sector-icon" />
                <h3>Smart Agriculture</h3>
                <div className="sector-content">
                  <p>Increasing yields through spatial intelligence:</p>
                  <ul className="sector-features">
                    <li>Crop health NDVI analysis</li>
                    <li>Automated irrigation planning</li>
                    <li>Yield prediction models</li>
                    <li>Supply chain optimization</li>
                  </ul>
                  <p>Clients report average 22% increase in productivity using our systems.</p>
                </div>
                <button className="inquire-button" onClick={() => navigate('/contact/agriculture')}>
                  AgriTech Solutions
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="application-card">
            <div className="card-content">
              <div className="card-text">
                <FontAwesomeIcon icon={faMountain} className="sector-icon" />
                <h3>Resource Management</h3>
                <div className="sector-content">
                  <p>Sustainable resource utilization solutions:</p>
                  <ul className="sector-features">
                    <li>Mineral deposit mapping</li>
                    <li>Water resource modeling</li>
                    <li>Renewable energy siting</li>
                    <li>Conservation planning</li>
                  </ul>
                  <p>Optimized resource allocation for 150+ organizations worldwide.</p>
                </div>
                <button className="inquire-button" onClick={() => navigate('/contact/resources')}>
                  Resource Planning
                </button>
              </div>
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1557242836-b5ab8bb0ebb4" 
                     alt="Resource management" />
              </div>
            </div>
          </div>
          <div className="other-research-container">
  <div className="section-header">
    <h2>Expand Your Research Capabilities</h2>
    <p className="section-subtitle">
      Cutting-edge GIS applications across multiple domains
    </p>
  </div>
  <div className="other-research">
    {['Risk', 'Urban', 'Land', 'Transport', 'Climate'].map((field, i) => (
      <button key={i} className="other-services-button"
              onClick={() => handleResearchScroll(field.toLowerCase())}>
        {field} Management
      </button>
    ))}
  </div>
</div>
       
{/* Research Sections */}
{[
  { 
    id: 'risk', 
    title: 'Risk Assessment and Mitigation', 
    icon: faExclamationTriangle,
    content: [
      `Our GIS-based risk management solutions enable the identification and mitigation of risks 
      across various sectors. 
      By integrating geospatial data with predictive analytics, we provide comprehensive
       risk assessments for natural disasters, 
      infrastructure vulnerabilities and socio-economic challenges.`,
      `Using real-time data feeds and historical datasets we create dynamic risk 
      models that support proactive decision-making 
      and resource allocation for disaster preparedness and response.`
    ],
    capabilities: [
      `Real-time hazard mapping for earthquakes, floods and wildfires using satellite imagery`,
      `Infrastructure vulnerability assessments with 3D geospatial modeling`,
      `Socio-economic risk analysis for urban and rural planning using spatial data`
    ]
  },
  { 
    id: 'urban', 
    title: 'Urban Development and Smart Cities', 
    icon: faCity,
    content: [
      `Our GIS solutions for urban management optimize city planning and development
       by analyzing spatial data on population density, 
      land use, and infrastructure. We provide actionable insights for creating sustainable and efficient urban environments.`,
      `By integrating IoT and geospatial data we develop smart city frameworks that enable real-time monitoring
       of traffic, energy usage 
      and public services, improving urban living conditions.`
    ],
    capabilities: [
      `Land use optimization tools for sustainable urban growth using GIS mapping`,
      `Smart traffic management systems with real-time GIS integration`,
      `Energy efficiency mapping for urban infrastructure using spatial analytics`
    ]
  },
  { 
    id: 'land', 
    title: 'Land Use and Resource Management', 
    icon: faTree,
    content: [
      `Our GIS-based land management solutions optimize land use and resource allocation by analyzing soil quality, vegetation, 
      and water resources. We provide actionable insights for agricultural, forestry and conservation planning.`,
      `Using satellite imagery and ground-based sensors we monitor land degradation, deforestation
       and resource utilization, 
      enabling sustainable land management practices.`
    ],
    capabilities: [
      `Precision agriculture tools with soil and crop health monitoring using GIS`,
      `Deforestation tracking and reforestation planning systems with satellite data`,
      `Water resource management frameworks for sustainable usage using geospatial analysis`
    ]
  },
  { 
    id: 'transport', 
    title: 'Transportation Network Optimization', 
    icon: faBus,
    content: [
      `Our GIS solutions for transport management optimize transportation networks and improve mobility by analyzing traffic patterns, 
      road conditions and public transit routes.
       We provide data-driven recommendations for efficient transportation systems.`,
      `By integrating real-time GPS data with geospatial analytics we enhance route planning, reduce congestion
       and improve logistics 
      for both urban and rural areas.`
    ],
    capabilities: [
      `Traffic flow optimization using real-time GIS data and predictive analytics`,
      `Public transit route planning and accessibility analysis using spatial data`,
      `Logistics and supply chain optimization tools with geospatial insights`
    ]
  },
  { 
    id: 'climate', 
    title: 'Climate Resilience Planning', 
    icon: faCloud,
    content: [
      `Our climate resilience solutions leverage cutting-edge GIS technology to analyze and predict environmental changes. 
      By integrating multi-source satellite data with machine learning algorithms,
       we provide actionable insights for 
      sustainable climate adaptation. Our systems process real-time meteorological 
      data alongside historical patterns to 
      create dynamic risk assessment models.`,
      `Advanced carbon tracking platforms combine remote sensing data with IoT sensor networks,
       offering comprehensive 
      emission monitoring solutions for industrial applications. This integrated
       approach enables precise environmental 
      impact assessments and data-driven sustainability strategies.`
    ],
    capabilities: [
      `Advanced flood prediction systems using real-time satellite data integration`,
      `Microclimate analysis solutions with 10m resolution mapping precision`,
      `Coastal erosion monitoring frameworks with predictive modeling`
    ]
  }
].map((section, i) => (
  <section key={i} className="research-section" ref={researchRefs[section.id]}>
    <div className="section-header">
      <FontAwesomeIcon icon={section.icon} className="sector-icon" />
      <h2>{section.title}</h2>
    </div>
    <div className="section-content">
      <div className="research-content">
        {section.content.map((paragraph, pIdx) => (
          <p key={pIdx} className="research-text">
            {paragraph}
          </p>
        ))}
        <div className="research-achievements">
          <h3>Core Capabilities</h3>
          <ul className="achievements-list">
            {section.capabilities.map((capability, aIdx) => (
              <li key={aIdx} className="achievement-item">
                {capability}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
))}

        {/* Service Commitment */}
        <div className="service-explore">
          <div className="section-header">
            <h2>Our Technical Approach</h2>
          </div>
          <div className="service-commitment">
            <p className="commitment-text">
              We employ a modern geospatial stack combining the latest satellite imagery analysis
               with cloud-based processing 
              power. Our solutions leverage machine learning algorithms trained on multi-temporal 
              satellite data to deliver 
              accurate environmental monitoring and predictive modeling. By integrating open-source 
              GIS tools with proprietary 
              analytics engines we maintain flexibility while ensuring cutting-edge performance.
            </p>
            <p className="commitment-text">
              Our team specializes in fusing IoT sensor 
              data with earth observation datasets, creating dynamic monitoring 
              systems that adapt to changing environmental conditions. We prioritize scalable 
              solutions built on modular 
              architectures allowing seamless integration of new data sources as technology evolves.
               Through strategic 
              partnerships with satellite data providers and cloud platform developers we ensure access to 
              the most current 
              geospatial resources while optimizing operational efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* Climate Action Project Section */}
      <section className="climate-project">
        <div className="section-header">
          <h2>Youth Climate Action Initiative</h2>
          <p className="section-subtitle">Supported by Bloomberg Philanthropies & Bulawayo City Council</p>
        </div>
        <div className="project-content">
          <div className="project-text">
            <p className="project-description">
              We extend our heartfelt gratitude to Bloomberg Philanthropies and the
               Bulawayo City Council for their 
              generous support through the Youth Climate Change Action Fund. 
              This 5-month initiative empowered local 
              youth to develop and implement innovative green solutions for urban sustainability challenges.
            </p>
            <p className="project-outcomes">
              Through intensive research and community engagement participants created actionable plans for:
            </p>
            <ul className="project-features">
              <li>Urban tree canopy expansion programs</li>
              <li>Waste-to-energy conversion systems</li>
              <li>Smart water management solutions</li>
              <li>Community green space development</li>
            </ul>
          </div>
          <div className="project-image">
            <img 
              src={Climatechange} 
              alt="Community tree planting initiative"
            />
          </div>
        </div>
      </section>

      {/* GIS Technology Ecosystem */}
      <section className="tech-integration">
        <div className="section-header">
          <h2>GIS Technology Ecosystem</h2>
          <p className="section-subtitle">Where Innovation Meets Implementation</p>
        </div>
        
        <div className="tech-grid">
          {/* First Tech Card - GIS Platforms */}
          <div className="tech-card">
            <h3>GIS Platforms</h3>
            <p>
              Harness the power of industry-leading GIS platforms to unlock the full
               potential of your spatial data. 
              From enterprise solutions to open-source tools
               we provide the right platform for your needs.
            </p>
            <ul>
              <li>ArcGIS Enterprise - for large-scale deployments</li>
              <li>QGIS for cost-effective - open-source solutions</li>
              <li>Google Earth Engine for cloud - based geospatial analysis</li>
              <li>Mapbox for custom - interactive web maps</li>
            </ul>
          </div>

          {/* Second Tech Card - Development */}
          <div className="tech-card">
            <h3>Development</h3>
            <p>
              Build custom geospatial applications tailored to your unique requirements. 
              Our development team specializes in creating scalable user-friendly solutions.
            </p>
            <ul>
              <li>Python scripting for automation and analysis</li>
              <li>Web mapping APIs for interactive dashboards</li>
              <li>Mobile GIS apps for field data collection</li>
              <li>API integrations for seamless data flow</li>
            </ul>
          </div>

          {/* Third Tech Card - Training */}
          <div className="tech-card">
            <h3>Training</h3>
            <p>
              Empower your team with hands-on training programs designed to enhance their GIS skills. 
              From beginners to advanced users we offer courses for all levels.
            </p>
            <ul>
              <li>Open-source GIS workshops (QGIS, PostGIS)</li>
              <li>Cloud-based spatial analytics training</li>
              <li>Drone data processing and analysis</li>
              <li>Customized training for your organization</li>
            </ul>
          </div>

          {/* Fourth Card + Image Row */}
          <div className="tech-row-2">
            {/* Fourth Tech Card - Emerging Tech */}
            <div className="tech-card">
           
              <h3>Emerging Tech</h3>
              <p>
                Stay ahead of the curve with cutting-edge technologies that redefine spatial analysis. 
                We integrate the latest innovations to deliver future-ready solutions.
              </p>
              <ul>
                <li>AI/ML for predictive spatial modeling</li>
                <li>3D city modeling for urban planning</li>
                <li>IoT integration for real-time monitoring</li>
                <li>Blockchain for secure spatial data management</li>
              </ul>
            </div>

            {/* Image Card */}
            <div className="tech-image-card">
              <img 
                src="https://images.unsplash.com/photo-1589403992174-da57ba171563?" 
                alt="GIS Technology in Action" 
              />
              <div className="tech-image-content">
                <h3>Building Smarter Communities</h3>
                <p>
                  Combining satellite data and community insights to create 
                  climate-resilient urban ecosystems. Together we can build a greenersmarter future.
                </p>
                <div className="emojis">
                  <span>🌍</span>
                  <span>📊</span>
                  <span>🤖</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      </section>

      {/* Services Section */}
      <div className="services-section">
        <Service />
      </div>

      {/* FAQ Section */}
      <FAQ />

      {/* Testimonial Section */}
      <ReviewSystem />

      {/* Animated Ticker Section */}
      <AnimatedTicker />

      {/* Footer Section */}
      <Footer />
    </div>
    </>
  );
}

export default Menu;