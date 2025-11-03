import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  FiAward, FiDatabase, FiLayers, FiMap, FiGlobe, 
  FiSearch, FiLayout, FiCheckCircle, FiPackage,
  FiCode, FiCpu, FiMapPin, FiNavigation
} from 'react-icons/fi';
import heroImage from '../assets/hero.png';
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import hero3 from '../assets/hero3.png';
import hero4 from '../assets/hero4.png';
import hero5 from '../assets/hero5.png';
import hero6 from '../assets/hero6.png';
import hero7 from '../assets/hero7.png';
import hero8 from '../assets/hero8.png';
import showcaseImage from '../assets/showcase.png';
import Footer from './Footer'

import './Home.css';

const Home = () => {
  const heroImages = [
    heroImage,
    hero1,
    hero2,
    hero3,
    hero4,
    hero5,
    hero6,
    hero7,
    hero8
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const ecosystemRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const slideDuration = 30000;


  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, []);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Restart the slideshow when tab becomes visible
        startSlideshow();
      } else {
        // Pause the slideshow when tab is hidden
        if (slideIntervalRef.current) {
          clearInterval(slideIntervalRef.current);
          slideIntervalRef.current = null;
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Start the slideshow with consistent timing
  const startSlideshow = () => {
    // Clear any existing interval
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
      slideIntervalRef.current = null;
    }
    
    // Set new interval
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroImages.length);
    }, slideDuration);
  };

  // Initialize slideshow
  useEffect(() => {
    startSlideshow();
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
        slideIntervalRef.current = null;
      }
    };
  }, [heroImages.length]);



 
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ecosystemRef.current) {
      observer.observe(ecosystemRef.current);
    }

    return () => {
      if (ecosystemRef.current) {
        observer.unobserve(ecosystemRef.current);
      }
    };
  }, []);

  return (
    <div className="spatial-home">
       {/* SEO Meta Tags */}
       <Helmet>
        <title>Spatial Force | Geospatial Intelligence & GIS Solutions</title>
        <meta name="description" content="Professional geospatial services including custom map design, spatial analysis, and GIS application development. Transform location data into decisions." />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content="Spatial Force | Geospatial Intelligence Solutions" />
        <meta property="og:description" content="Award-winning geospatial services for businesses and organizations. Specialists in location intelligence and data visualization." />
        <meta property="og:image" content={heroImages[0]} />
        <meta property="og:url" content="https://spatialforce.co.zw" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Spatial Force | Geospatial Intelligence Solutions" />
        <meta name="twitter:description" content="Professional GIS services for spatial analysis and custom mapping solutions." />
        <meta name="twitter:image" content={heroImages[0]} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Spatial Force",
            "description": "Geospatial intelligence and GIS solutions provider",
            "url": "https://spatialforce.co.zw",
            "logo": "https://spatialforce.co.zw/logo.png",
            "sameAs": [
              "https://linkedin.com/company/spatialforce",
              "https://twitter.com/spatialforce"
            ]
          })}
        </script>
      </Helmet>
      <section className="spatial-hero-container">
  {/* Background slideshow */}
  <div className="spatial-hero-slideshow">
    {heroImages.map((img, index) => (
      <img
        key={index}
        src={img}
        alt={`Hero ${index + 1}`}
        className={`spatial-hero-image ${index === currentSlide ? 'active' : ''}`}
        loading="eager"
      />
    ))}
  </div>
  
  {/* Dark overlay */}
  <div className="spatial-hero-overlay"></div>
  
  {/* Content */}
  <div className="spatial-hero-content">
    <h1 className="spatial-hero-title">
      <span className="highlight">Geospatial Intelligence</span> <span className='highlight'> That</span><br /><span className='highlight'>  Transforms </span>
    <span className="text-gradient">Locations</span> <span className='highlight'>Into</span> <br/> 
      <span className="highlight">Decisions</span>
    </h1>
    <p className="spatial-hero-subtitle">
      We craft elegant geospatial solutions that reveal hidden patterns, 
      optimize operations and empower data-driven decisions.
    </p>
    <div className="spatial-hero-actions">
      <Link to="/menu" className="spatial-btn primary">
        Explore Solutions
      </Link>
      <Link to="/fire-tracker" className="spatial-btn primary">
        Fire tracker
      </Link>
    </div>
  </div>
</section>

      {/* Why Choose Us Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="spatialforce-section-title">Why Organizations Choose Us</h2>
          <p className="section-subtitle">
            We combine technical excellence with design sensibility to deliver maps that inform and inspire.
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase Section */}
      <section className="spatialforce-showcase-section">
        <div className="spatialforce-showcase-content">
          <div className="spatialforce-showcase-text">
            <h2>Beautiful Maps, Powerful Insights</h2>
            <p>
              Our approach blends aesthetic design with rigorous spatial analysis to create 
              maps that are as informative as they are beautiful. We focus on clarity and 
              usability to ensure your data tells its story effectively.
            </p>
          </div>
          <div className="spatialforce-showcase-image">
          <img
  src={showcaseImage}
  alt="Interactive GIS map showing land use patterns with color-coded zoning districts"
  loading="lazy"
  width="800"
  height="450"
/>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="section-header">
          <h2 className="spatialforce-section-title">Specialized Services</h2>
          <p className="section-subtitle">
            Custom geospatial solutions tailored to your unique challenges and objectives.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                {service.icon}
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, i) => (
                  <li key={i} className="service-feature">
                    <span className="feature-marker">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Ecosystem Section */}
      <section className={`ecosystem-section ${inView ? 'in-view' : ''}`} ref={ecosystemRef}>
        <div className="section-header">
          <h2 className="spatialforce-section-title">Geospatial Technology Ecosystem</h2>
          <p className="section-subtitle">
            Integrated tools and platforms we leverage to deliver cutting-edge solutions
          </p>
        </div>
        
        <div className="ecosystem-container">
          <div className="ecosystem-visual">
            <div className="core-platform">
              <div className="core-icon">
                <FiGlobe />
              </div>
            </div>
            
            {technologies.map((tech, index) => (
  <div 
    key={index} 
    className="tech-node"
    style={{
      '--i': index,
      '--total': technologies.length,
      animationDelay: `${index * 0.1}s`
    }}
  >
    <div className="tech-icon">{tech.icon}</div>
    <div className="tech-tooltip">
      <h4>{tech.name}</h4>
      <p>{tech.category}</p>
    </div>
  </div>
))}
            
            <div className="connecting-lines"></div>
          </div>
          
          <div className="ecosystem-description">
            <p>
              This ecosystem represents the integrated suite of technologies we master to deliver comprehensive geospatial solutions. 
              Each node represents a specialized tool or platform that connects to form powerful workflows.
            </p>
            <div className="tech-categories">
              {categories.map((category, index) => (
                <div key={index} className="category">
                  <div className="category-color" style={{backgroundColor: category.color}}></div>
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
       
      </section>
      <section className="conclusion-section">
      <div className="conclusion-content">
        <div className={`text-container ${isExpanded ? 'expanded' : ''}`}>
          <p className="conclusion-text">
            In a world where location intelligence is transforming industries, the right geospatial partner 
            makes all the difference. With a unique blend of technical precision and creative problem-solving, 
            I transform complex spatial data into clear, actionable insights that drive strategic decisions. 
            Every project benefits from meticulous attention to detail and a commitment to delivering not just 
            maps, but meaningful spatial narratives that tell your story.
          </p>
          <p className="conclusion-text">
            Ready to unlock the power of your location data? Let's collaborate to build geospatial solutions 
            that give you a competitive edge. Whether you need a one-time analysis or an enterprise-wide spatial 
            platform, I bring the expertise and passion needed to elevate your spatial strategy. The journey from 
            raw data to strategic advantage begins with a conversation—reach out today to discuss how we can 
            transform your challenges into opportunities.
          </p>
        </div>
        
        <button 
          className="toggle-button" 
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Read less' : 'Read full message'}
          <span className={`arrow ${isExpanded ? 'up' : 'down'}`}></span>
        </button>
      </div>
    </section>
<Footer/>
    </div>
    
  );
};

const features = [
  {
    icon: <FiAward />,
    title: "Award-Winning Quality",
    description: "Recognized for excellence in cartographic design and spatial analysis."
  },
  {
    icon: <FiDatabase />,
    title: "Data Integrity",
    description: "Rigorous validation processes ensure accuracy you can trust."
  },
  {
    icon: <FiLayers />,
    title: "Multi-Layered Insights",
    description: "Uncover hidden patterns with our sophisticated analysis techniques."
  },
];

const services = [
  {
    icon: <FiMap />,
    title: "Custom Map Design",
    description: "Bespoke cartographic solutions that communicate complex data with clarity and aesthetic appeal.",
    features: [
      "Thematic mapping for specialized data",
      "Interactive web maps",
      "Print-ready cartography",
      "3D terrain visualization"
    ]
  },
  {
    icon: <FiGlobe />,
    title: "Spatial Analysis",
    description: "Advanced geospatial analysis to uncover patterns, relationships, and insights in your location data.",
    features: [
      "Location intelligence",
      "Network analysis",
      "Spatial statistics",
      "Geoprocessing workflows"
    ]
  },
  {
    icon: <FiDatabase />,
    title: "GIS Application Development",
    description: "Interactive web and mobile applications that leverage the power of geographic information systems.",
    features: [
      "Web GIS platforms",
      "Location-based services",
      "Spatial dashboards",
      "Custom geoprocessing tools"
    ]
  }
];

const technologies = [
  { 
    name: "ArcGIS Pro", 
    category: "Desktop GIS", 
    icon: <FiMap />,
    position: { x: 20, y: 20 }
  },
  { 
    name: "QGIS", 
    category: "Desktop GIS", 
    icon: <FiLayers />,
    position: { x: 80, y: 20 }
  },
  { 
    name: "PostGIS", 
    category: "Spatial Database", 
    icon: <FiDatabase />,
    position: { x: 30, y: 70 }
  },
  { 
    name: "GeoServer", 
    category: "Web Services", 
    icon: <FiGlobe />,
    position: { x: 70, y: 70 }
  },
  { 
    name: "JavaScript", 
    category: "Development", 
    icon: <FiCode />,
    position: { x: 15, y: 45 }
  },
  { 
    name: "Python", 
    category: "Automation", 
    icon: <FiCpu />,
    position: { x: 85, y: 45 }
  },
  { 
    name: "Leaflet", 
    category: "Web Mapping", 
    icon: <FiMapPin />,
    position: { x: 45, y: 15 }
  },
  { 
    name: "OpenLayers", 
    category: "Web Mapping", 
    icon: <FiNavigation />,
    position: { x: 55, y: 85 }
  }
];

const categories = [
  { name: "Desktop GIS", color: "#2a7f7b" },
  { name: "Spatial Database", color: "#f8b400" },
  { name: "Web Services", color: "#3da8a3" },
  { name: "Development", color: "#1a2e2a" },
  { name: "Web Mapping", color: "#6a4b93" },
  { name: "Automation", color: "#e94f37" }
];

export default Home;