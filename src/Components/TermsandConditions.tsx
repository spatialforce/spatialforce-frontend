import { useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  useEffect(() => {
    document.title = 'Terms and Conditions | Spatial Force';
  }, []);

  return (
    <div className="legal-container">
      <div className="legal-header">
        <div className="legal-branding">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="48"
            height="48"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          <h1>Terms and Conditions</h1>
        </div>
        <p className="effective-date">Effective: [12-03-2024]</p>
      </div>

      <div className="legal-content-container">
        <nav className="toc-sidebar">
          <h2>Table of Contents</h2>
          <ul>
            <li><a href="#acceptance">1. Acceptance of Terms</a></li>
            <li><a href="#services">2. Services Overview</a></li>
            <li><a href="#obligations">3. User Obligations</a></li>
            <li><a href="#intellectual-property">4. Intellectual Property</a></li>
            <li><a href="#payments">5. Payments & Fees</a></li>
            <li><a href="#termination">6. Termination</a></li>
            <li><a href="#disclaimer">7. Disclaimers</a></li>
            <li><a href="#governance">8. Governing Law</a></li>
            <li><a href="#changes">9. Changes to Terms</a></li>
            <li><a href="#contact">10. Contact Us</a></li>
          </ul>
        </nav>

        <main className="legal-main-content">
        <section id="acceptance" className="legal-section">
    <h2>1. Acceptance of Terms</h2>
    <p>
        By accessing or using Spatial Force's geospatial solutions, you acknowledge and agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you must immediately cease the use of our services to ensure compliance and understanding.
    </p>
    
    <div className="key-point">
        <h3>Key Provisions:</h3>
        <ul>
            <li><strong>Binding Agreement:</strong> This constitutes a legally binding agreement between you, the user, and Spatial Force.</li>
            <li><strong>Universal Applicability:</strong> These terms apply to all services provided by Spatial Force and to all users without exception.</li>
            <li><strong>Subject to Updates:</strong> Our terms may be updated periodically; we encourage you to review them regularly to stay informed.</li>
        </ul>
    </div>
</section>

<section id="services" className="legal-section">
    <h2>2. Services Overview</h2>
    <p>
        Spatial Force is dedicated to providing professional geospatial solutions that empower businesses and organizations. Our offerings include a wide range of services designed to meet diverse needs:
    </p>
    
    <div className="service-categories">
        <div className="category-block">
            <h3>Core Services</h3>
            <ul>
                <li><strong>Geospatial Analysis:</strong> In-depth analysis of spatial data to support informed decision-making.</li>
                <li><strong>GIS Integration:</strong> Seamless integration of Geographic Information Systems into your existing frameworks.</li>
                <li><strong>Data Visualization:</strong> Transforming complex data into engaging visual formats for better insights.</li>
            </ul>
        </div>
        
        <div className="category-block">
            <h3>Specialized Solutions</h3>
            <ul>
                <li><strong>Environmental Monitoring:</strong> Tools and techniques for tracking environmental changes and impacts.</li>
                <li><strong>Risk Assessment:</strong> Comprehensive evaluations to identify and mitigate potential risks.</li>
                <li><strong>Resource Management:</strong> Efficient strategies for managing natural and human resources effectively.</li>
            </ul>
        </div>
    </div>
    
    <p className="disclaimer-text">
        <em>Service availability may vary by region and technical requirements. Please contact us for specific availability in your area.</em>
    </p>
</section>

      <section>
    <h2>3. User Obligations</h2>
    <p>
        As a user of Spatial Force’s services, you have certain obligations to ensure a safe and compliant experience. These include:
    </p>
    <div className="obligations-grid">
        <div className="obligation-card">
            <h3>Account Security</h3>
            <p>
                You are responsible for maintaining the confidentiality of your account credentials. Please report any unauthorized access or suspicious activity immediately to protect your information.
            </p>
        </div>
        
        <div className="obligation-card">
            <h3>Legal Compliance</h3>
            <p>
                Utilize our services in accordance with all applicable laws and regulations. It is your responsibility to ensure that your actions are lawful and compliant.
            </p>
        </div>
        
        <div className="obligation-card">
            <h3>Content Standards</h3>
            <p>
                Ensure that all data and content you submit adheres to our content policies. This includes avoiding any harmful, misleading, or illegal materials.
            </p>
        </div>
    </div>
</section>
<section id="intellectual-property" className="legal-section">
    <h2>4. Intellectual Property</h2>
    <p>
        At Spatial Force, we take pride in our creative works! All content, trademarks, and intellectual property associated with our services—including <strong>innovative software</strong>, <strong>stunning designs</strong>, <strong>captivating graphics</strong>, and <strong>comprehensive documentation</strong>—are the exclusive treasures of Spatial Force and our valued licensors.
    </p>
    <p>
        As a user, you are granted a limited, <strong>non-exclusive</strong> and <strong>non-transferable license</strong> to access and explore our services for personal or business use. Please remember, any unauthorized use, reproduction, or distribution of our materials is <strong>strictly prohibited</strong> and may lead to serious legal consequences.
    </p>
    <p>
        If you feel that any content on our platform infringes upon your intellectual property rights, don’t hesitate to reach out! We’re here to address your concerns <strong>swiftly</strong> and <strong>effectively</strong>.
    </p>
</section>
        {/* Section 5 - Payments & Fees */}
<section id="payments" className="legal-section">
  <h2>5. Payments & Fees</h2>
  
  <div className="grid-layout">
    <div className="info-card">
      <h3>Payment Obligations</h3>
      <ul>
        <li><strong>All fees</strong> are quoted in USD unless otherwise specified. This ensures transparency and consistency in our pricing model, allowing users to plan their budgets effectively.</li>
        <li><strong>Recurring subscriptions</strong> will automatically renew at the end of each billing cycle unless canceled prior. This policy helps ensure uninterrupted access to our services and features.</li>
        <li><strong>Late payments</strong> incur a 1.5% monthly interest fee. Timely payments help maintain your account in good standing and avoid service interruptions.</li>
      </ul>
    </div>

    <div className="info-card">
      <h3>Payment Methods</h3>
      <ul>
        <li><strong>Credit/Debit Cards:</strong> We accept major cards including Visa and Mastercard, providing a secure and convenient payment option.</li>
        <li><strong>Bank Transfers:</strong> Users can make payments through SWIFT/IBAN transfers for larger transactions, ensuring security and reliability.</li>
        <li><strong>Mobile Money:</strong> We support payments via Ecocash and OneMoney, making it easier for users in regions where mobile payments are prevalent.</li>
      </ul>
    </div>

    <div className="info-card warning">
      <h3>Refund Policy</h3>
      <ul>
        <li><strong>Digital services</strong> are non-refundable to protect our resources and business model. This policy reflects the nature of digital products that cannot be "returned."</li>
        <li><strong>Partial credits</strong> may be issued for canceled subscriptions, depending on the usage period and terms agreed upon at the start of the subscription.</li>
        <li><strong>Disputes</strong> must be filed within 14 days of the transaction date. Prompt reporting allows us to address concerns effectively and uphold service quality.</li>
      </ul>
    </div>
  </div>

  <div className="notice-box">
    <h4>Tax Compliance</h4>
    <p><strong>All prices exclude</strong> applicable VAT and withholding taxes. As a user, you are responsible for understanding and complying with local tax regulations to avoid any legal complications.</p>
  </div>
</section>

{/* Section 6 - Termination */}
<section id="termination" className="legal-section">
  <h2>6. Termination</h2>
  
  <div className="termination-grid">
    <div className="term-card">
      <h3>By Spatial Force</h3>
      <ul>
        <li><strong>Material breach</strong> of terms, such as unauthorized use of services or violation of privacy policies, may result in immediate termination of access.</li>
        <li><strong>Non-payment</strong> exceeding 30 days will trigger account suspension and potential termination, as maintaining timely payments is crucial for service continuity.</li>
        <li><strong>Illegal or fraudulent activity</strong> detected will lead to immediate termination and possible legal action in accordance with local laws.</li>
      </ul>
    </div>

    <div className="term-card">
      <h3>By User</h3>
      <ul>
        <li><strong>30-day written notice</strong> is required for voluntary termination, allowing us to process your request and finalize any outstanding matters.</li>
        <li>All <strong>outstanding fees</strong> must be settled before termination, ensuring that both parties fulfill their obligations.</li>
        <li><strong>Data export</strong> facilitation will be provided upon request, allowing users to safely transfer their data before account deactivation.</li>
      </ul>
    </div>
  </div>

  <div className="data-retention">
    <h3>Post-Termination</h3>
    <ul>
      <li><strong>Account deactivation</strong> occurs within 24 hours of termination, preventing any further access to services.</li>
      <li><strong>Data will be archived</strong> for 90 days following termination, during which users can request data retrieval.</li>
      <li><strong>Final invoice</strong> can be issued upon request to ensure transparency in the final financial transactions.</li>
    </ul>
  </div>
</section>

{/* Section 7 - Disclaimers */}
<section id="disclaimer" className="legal-section">
  <h2>7. Disclaimers</h2>
  
  <div className="disclaimer-content">
    <p className="disclaimer-lead">
      Spatial Force services are provided <strong>"as is"</strong> without warranties of any kind, either express or implied, including but not limited to:
    </p>

    <div className="disclaimer-grid">
      <div className="disclaimer-block">
        <h3>Accuracy</h3>
        <p>We do not guarantee <strong>error-free data analysis</strong> or outputs; users assume all risks associated with reliance on our services.</p>
      </div>
      
      <div className="disclaimer-block">
        <h3>Availability</h3>
        <p>Our services may experience <strong>downtime</strong> for necessary maintenance and upgrades, which we will endeavor to schedule during off-peak hours.</p>
      </div>
      
      <div className="disclaimer-block">
        <h3>Third-Party</h3>
        <p>We accept no responsibility for external data sources or APIs that may impact your experience; users should verify third-party data independently.</p>
      </div>
    </div>

    <div className="liability-cap">
      <h4>Liability Limitation</h4>
      <p>
        Our maximum aggregate liability shall not exceed the <strong>total fees paid</strong> by you in the 6 months preceding any claim, ensuring a fair approach to accountability while limiting our exposure.
      </p>
    </div>
  </div>
</section>

{/* Section 8 - Governing Law */}
<section id="governance" className="legal-section">
  <h2>8. Governing Law</h2>
  
  <div className="jurisdiction-details">
    <div className="law-block">
      <h3>Primary Jurisdiction</h3>
      <ul>
        <li><strong>Zimbabwe Companies Act</strong> [Chapter 24:03] serves as the foundation for our legal framework, ensuring compliance with local regulations.</li>
        <li>All matters shall be interpreted under the <strong>Laws of Zimbabwe</strong>, providing a clear legal context for any disputes.</li>
        <li>Disputes will be handled within the <strong>Harare High Court jurisdiction</strong>, ensuring access to local legal resources.</li>
      </ul>
    </div>

    <div className="dispute-resolution">
      <h3>Dispute Process</h3>
      <ol>
        <li><strong>Mediation</strong> through ZIMAC will be the first step for conflict resolution, promoting amicable solutions.</li>
        <li><strong>Arbitration</strong> under ZACC Rules will follow if mediation fails, providing a structured approach to resolving disputes.</li>
        <li><strong>Litigation</strong> is reserved as the last resort for unresolved issues, ensuring that all other avenues are exhausted first.</li>
      </ol>
    </div>
  </div>

  <div className="severability">
    <h4>Severability Clause</h4>
    <p>
      If any provision is found invalid, the remaining terms remain <strong>fully effective</strong>, ensuring that the essence of the agreement is preserved.
    </p>
  </div>
</section>

{/* Section 9 - Changes to Terms */}
<section id="changes" className="legal-section">
  <h2>9. Changes to Terms</h2>
  
  <div className="update-process">
    <div className="update-timeline">
      <h3>Modification Process</h3>
      <ul>
        <li><strong>30-day notice</strong> will be provided for material changes to the terms, ensuring users have ample time to review.</li>
        <li><strong>Email notifications</strong> will be sent to all active users for transparency and accountability.</li>
        <li><strong>Website banner announcements</strong> will ensure visibility of updates, making it easier for users to stay informed.</li>
      </ul>
    </div>

    <div className="user-acknowledgment">
      <h3>Continued Use</h3>
      <p>
        By accessing our services after changes take effect, you accept the revised terms. We encourage users to review changes carefully.
        <br />
        If you wish to reject updates, please <a href="#contact">contact us</a> within 7 days to express your concerns.
      </p>
    </div>
  </div>

  <div className="version-control">
    <h4>Archive Access</h4>
    <p><strong>Previous versions</strong> of the terms are available upon request at <a href="mailto:legal@spatialforce.co.zw">legal@spatialforce.co.zw</a>, allowing users to review past agreements.</p>
  </div>
</section>

          <section id="contact" className="legal-section">
            <h2>10. Contact Us</h2>
            <div className="contact-methods">
              <div className="contact-block">
                <h3>Legal Inquiries</h3>
                <p>Email: <a href="mailto:legal@spatialforce.co.zw">legal@spatialforce.co.zw</a></p>
                <p>Phone: +263 717  428 085 </p>
              </div>
              
              <div className="contact-block">
                <h3>Location</h3>
                <p>17 Longhurst<br/>Northlynne,Bulawayo</p>
              </div>
            </div>
          </section>

          <div className="legal-footer">
            <p>© {new Date().getFullYear()} Spatial Force. All rights reserved.</p>
            <p>View our <Link to="/privacy">Privacy Policy</Link></p>
          </div>
        </main>
      </div>

      <button className="back-to-top" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
        Back to Top
      </button>
    </div>
  );
};

export default TermsAndConditions;