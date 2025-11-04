import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCommentDots } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import './Contact.css';
import Footer from './Footer';
import ContactSchema from './ContactSchema';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Spatial Force | GIS & Geospatial Solutions Zimbabwe</title>
        <meta 
          name="description" 
          content="Contact Spatial Force- founded by GIS expert Kudzanai Chakavarika for
           geospatial solutions, GIS mapping and expert support. You can reach out via email, phone or live chat." 
        />
        <link rel="canonical" href="https://spatialforce.co.zw/contact" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://spatialforce.co.zw/contact" />
        <meta property="og:title" content="Contact Spatial Force | GIS & Geospatial Solutions Zimbabwe" />
        <meta property="og:description" content="Contact Spatial Force for geospatial solutions and expert
         support. Reach out via email, phone or live chat." />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Spatial Force | GIS & Geospatial Solutions Zimbabwe" />
        <meta name="twitter:description" content="Contact Spatial Force for geospatial solutions and expert support." />
      </Helmet>
      
      <ContactSchema />
      <div className="contact-container">
      {/* Header */}
      <header className="contact-header">
        <h1>Get in Touch</h1>
        <p>We're here to help! Reach out to us for inquiries, support or collaborations.</p>
      </header>

      {/* Main Content */}
      <main className="contact-content">
        {/* Call-to-Action Section */}
        <section className="cta-section">
          <h2>How Can We Help You?</h2>
          <p>
    Whether you have a question about our comprehensive range of services,
     need technical support for a specific issue or want to discuss a project in detail
      we're just a message away. We are dedicated  to assist you with any inquiries you may have.
       Feel free to reach out to us via email, phone or live chat. We value your
        communication and are eager to provide the support you need to ensure your success.
</p>
          <div className="cta-buttons">
            <a href="mailto:info@spatialforce.com" className="cta-button" aria-label="Email Us">
              <FaEnvelope className="cta-icon" aria-hidden="true" />
              Email Us
            </a>
            <a href="tel:+263717428085" className="cta-button" aria-label="Call Us">
              <FaPhone className="cta-icon" aria-hidden="true" />
              Call Us
            </a>
            <button className="cta-button" onClick={() => alert('Live chat is coming soon!')} aria-label="Live Chat">
              <FaCommentDots className="cta-icon" aria-hidden="true" />
              Live Chat
            </button>
          </div>
        </section>

        {/* Contact Information */}
        <section className="contact-info-section">
          <h2>Our Contact Details</h2>
          <div className="contact-info">
            <div className="info-item">
              <FaEnvelope className="info-icon" aria-label="Email Icon" />
              <p>Email: <a href="mailto:info@spatialforce.com">info@spatialforce.co.zw</a></p>
            </div>
            <div className="info-item">
              <FaPhone className="info-icon" aria-label="Phone Icon" />
              <p>Phone: <a href="tel:+263717428085">+263 71 742 8085</a></p>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" aria-label="Address Icon" />
              <p>Address: 17 Longhurst, Northlynne, Bulawayo, Zimbabwe</p>
            </div>
          </div>

          {/* Social Media Links */}
        </section>

        {/* Map Integration */}
        <section className="map-section">
          <h2>Our Location</h2>
          <div className="map-container">
            <iframe
              title="Spatial Force Location"
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.123456789012!2d28.596844!3d-20.094090!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDA1JzM4LjciUyAyOMKwMzUnNDkuNiJF!5e0!3m2!1sen!2szw!4v1622549405337!5m2!1sen!2szw`}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="additional-content">
          <h2>Why Choose Us?</h2>
          <div className="content-grid">
            <div className="content-card">
              <h3>Expert Team</h3>
              <p>We are professionals with years of experience in geospatial solutions. 
                Get your project done the professional way</p>
            </div>
            <div className="content-card">
              <h3>Cutting-Edge Technology</h3>
              <p>We use the latest tools and technologies to deliver top-notch services.</p>
            </div>
            <div className="content-card">
              <h3>Customer-Centric Approach</h3>
              <p>Your satisfaction is our priority. We tailor our services to meet your unique needs.</p>
            </div>
          </div>
        </section>

        {/* Our Process Section */}
        <section className="process-section">
          <h2>Our Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <h3>1. Consultation</h3>
              <p>We start by understanding your needs and goals through a detailed consultation.</p>
            </div>
            <div className="process-step">
              <h3>2. Planning</h3>
              <p>Our team creates a customized plan to address your specific requirements.</p>
            </div>
            <div className="process-step">
              <h3>3. Execution</h3>
              <p>We implement the plan using the latest tools and technologies.</p>
            </div>
            <div className="process-step">
              <h3>4. Delivery</h3>
              <p>We deliver the final product and provide ongoing support as needed.</p>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="case-studies-section">
          <h2>Case Studies</h2>
          <div className="case-studies-grid">
          <div className="case-study">
    <h3> A Showcase of Development Skills</h3>
    <p>This website was developed as a demonstration of web development capabilities serving as tangible evidence
       of expertise in both frontend and backend development.</p>
    <p>Crafted using limited resources this website highlights dedication and creativity in web development.
       Continuous enhancements are planned with exciting new features coming soon to further 
       showcase these skills. Thank you for the trust and support in this project as it evolves</p>
</div>
            <div className="case-study">
    <h3>Land Use and Land Cover Mapping for Gazetted Forests</h3>
    <p>In collaboration with the Forestry Commission we produced detailed land use and
       land cover (LULC) maps for gazetted forests in Matebeland North, Zimbabwe. This project aimed
        to enhance forest management and conservation efforts by providing accurate data on land utilization.
         <br />
        <p>Explore our case study here <br />
   <a href="/gis-forest-resources-zimbabwe" className="forest-link">
      How We Mapped Gazetted Forests in Matebeleland North
   </a>.
</p>
        </p>
        
</div>
            <div className="case-study">
    <h3>Bulawayo Health Facilities Web Map</h3>
    <p>Our team created an interactive web map
       that provides comprehensive information on health facilities in Bulawayo.
        This tool helps residents locate nearby clinics and hospitals view services offered and access
         important health information, enhancing community awareness and access to healthcare resources.
         See webmap here... <br />
         <a href="/Bulawayo-webmap-showcase" className="forest-link">
         Bulawayo Health Facilities Webmap
          
          </a>
         </p>
        
</div>
          </div>
        </section>
        <section className="about-founder">
            <h2>Founder</h2>
            <p>

 Kudzanai Chakavarika - the founder of Spatial Force is a passionate GIS professional
 dedicated to bringing cutting-edge geospatial solutions to Zimbabwe and beyond.
  With years of experience in the field, Kudzanai has built Spatial Force into a leading provider of
   location intelligence services. Besides being a GIS analyst he is also a GIS developer and the 
   driving force behind this entire website from its backend to frontend. He promises more features
   will be integrated into this website soon such as web maps and other location services.

</p>


            <p>
              When you contact Spatial Force you're engaging with  
              Kudzanai Chakavarika  directluto deliver exceptional service and innovative solutions.
               Don't hesitate to contact and get the best experience.
            </p>
          </section>

        {/* Free Consultation Section */}
        <section className="consultation-section">
          <h2>Get a Free Consultation</h2>
          <p>
            Not sure where to start? Let us help! Schedule a
             free consultation with us to discuss your project needs and explore how we can assist you.
          </p>
          <div className="consultation-buttons">
            <a href="mailto:no-reply@spatialforce.co.zw" className="cta-button" aria-label="Email for Consultation">
              <FaEnvelope className="cta-icon" aria-hidden="true" />
              Email for Consultation
            </a>
            <a href="tel:+263717428085" className="cta-button" aria-label="Call for Consultation">
              <FaPhone className="cta-icon" aria-hidden="true" />
              Call for Consultation
            </a>
          </div>
        </section>
      </main>
     
    </div>
    <Footer/>
    </>
  );
};

export default Contact;