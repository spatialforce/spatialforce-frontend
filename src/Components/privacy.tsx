import { useEffect } from 'react';
import './privacy.css';
import { Link } from 'react-router-dom';
import React from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | Spatial Force - Geospatial Solutions';
  }, []);

  return (
    <div className="vercel-style-container">
      <div className="legal-header">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: 12-06-2024</p>
        <div className="compliance-banner">
          <span className="compliance-badge gdpr">GDPR Compliant</span>
          <span className="compliance-badge ccpa">CCPA Ready</span>
          <span className="compliance-badge iso">ISO 27001 Certified</span>
        </div>
      </div>

      <div className="policy-content">
        <nav className="toc">
          <h2>Table of Contents</h2>
          <ul>
            <li><a href="#introduction">1. Introduction</a></li>
            <li><a href="#data-collection">2. What We Collect</a></li>
            <li><a href="#data-use">3. How We Use Information</a></li>
            <li><a href="#data-sharing">4. Who We Share With</a></li>
            <li><a href="#security">5. Data Protection</a></li>
            <li><a href="#your-rights">6. Your Choices</a></li>
            <li><a href="#data-retention">7. Data Retention</a></li>
            <li><a href="#children">8. Children's Privacy</a></li>
            <li><a href="#third-parties">9. Third Parties</a></li>
            <li><a href="#cookies">10. Cookies</a></li>
            <li><a href="#breaches">11. Breach Alerts</a></li>
            <li><a href="#complaints">12. Complaints</a></li>
            <li><a href="#zimbabwe-law">13. Zimbabwe Laws</a></li>
            <li><a href="#changes">14. Updates</a></li>
            <li><a href="#contact">15. Contact</a></li>
          </ul>
        </nav>

        <div className="policy-sections">
          {/* Section 1 */}
          <section id="introduction">
    <h2>1. Introduction</h2>
    <p className="policy-paragraph">
        Welcome to Spatial Force ("we" or "us"). We offer advanced mapping and location analysis tools through our website (spatialforce.co.zw), mobile applications, and partner services. This policy outlines how we collect, use, and protect your personal information when you engage with our services.
    </p>
    <p className="policy-paragraph">
        By using our services, you consent to the collection and use of your data as described in this policy. If you do not agree with our practices, we kindly ask that you discontinue using our services immediately.
    </p>
</section>

          {/* Section 2 */}
          <section id="data-collection">
    <h2>2. What We Collect</h2>
    <p className="policy-paragraph">
        We collect information that you provide to us directly including:
        <br/>- <strong>Name, Email and Phone Number:</strong> Required during the sign-up process to create and manage your account.
        <br/>- <strong>Project Preferences and Map Data:</strong> Information you upload to customize your experience and enhance our mapping services.
        <br/>- <strong>Payment Details:</strong> Securely processed by our payment partners to facilitate transactions without storing sensitive information.
    </p>
    <p className="policy-paragraph">
        We also automatically collect certain information, such as:
        <br/>- <strong>Device Information:</strong> Details about the device you use, including type, browser and IP address for troubleshooting and analytics.
        <br/>- <strong>Location Data:</strong> Collected if you enable GPS features, allowing us to provide location-based services.
        <br/>- <strong>Usage Patterns:</strong> Data on pages visited and features used to help us understand user behavior and improve our services.
    </p>
</section>

          {/* Section 3 */}
          <section id="data-use">
    <h2>3. How We Use Information</h2>
    <p className="policy-paragraph">
        Your data is invaluable in helping us deliver and enhance our services. Specifically, we use your information to:
        <br/>- <strong>Provide Mapping Services and Analysis Tools:</strong> Utilize your data to deliver accurate mapping features and insightful analysis tools tailored to your needs.
        <br/>- <strong>Keep Your Account Secure:</strong> Monitor account activity and implement security measures to protect your information from unauthorized access.
        <br/>- <strong>Improve Our Services:</strong> Analyze usage patterns to refine and enhance our offerings ensuring a better user experience.
        <br/>- <strong>Send Important Service Updates:</strong> Communicate critical updates and notifications regarding our services to keep you informed.
    </p>
    <p className="policy-paragraph">
        We are committed to your privacy: we never sell your data. Additionally, we only use location data to provide the mapping features you specifically request.
    </p>
</section>
          {/* Section 4 */}
          <section id="data-sharing">
    <h2>4. Who We Share With</h2>
    <p className="policy-paragraph">
        We are committed to protecting your privacy and only share your data with trusted entities for specific purposes:
        <br/>- <strong>Payment Processors:</strong> We collaborate with secure payment processors such as Ecocash and Stripe to facilitate transactions safely.
        <br/>- <strong>Cloud Storage Providers:</strong> Your data may be stored with reputable cloud providers like AWS, ensuring reliability and security.
        <br/>- <strong>Mapping Partners:</strong> We partner with mapping services like Google Maps to enhance location-based features within our platform.
        <br/>- <strong>Legal Compliance:</strong> We may share information when required by Zimbabwean law to comply with legal obligations.
    </p>
</section>

          {/* Section 5 */}
          <section id="security">
    <h2>5. Data Protection</h2>
    <p className="policy-paragraph">
        We are committed to safeguarding your information through robust security measures, including:
        <br/>- <strong>Strong Encryption:</strong> We utilize advanced encryption protocols to protect your data during transmission and storage.
        <br/>- <strong>Regular Security Checks:</strong> Our systems undergo frequent security assessments to identify and address potential vulnerabilities.
        <br/>- <strong>Limited Staff Access:</strong> Access to sensitive data is restricted to authorized personnel only, ensuring that your information is handled securely.
        <br/>- <strong>Two-Factor Authentication:</strong> We offer two-factor authentication to add an extra layer of security to your account, requiring a second form of verification.
    </p>
</section>

          {/* Section 6 */}
          <section id="your-rights">
    <h2>6. Your Choices</h2>
    <p className="policy-paragraph">
        As a valued user, you have several choices regarding your personal information. You can:
        <br/>- <strong>View/Update Account Information:</strong> Access and modify your account details to ensure they are accurate and up-to-date.
        <br/>- <strong>Request Data Deletion:</strong> Initiate a request to permanently delete your personal data from our systems at any time.
        <br/>- <strong>Download Your Data:</strong> Obtain a copy of your personal data for your records or for use elsewhere.
        <br/>- <strong>Opt-Out of Marketing Emails:</strong> Choose to unsubscribe from promotional communications to limit the information you receive.
        <br/>- <strong>Disable Location Tracking:</strong> Manage your location settings to prevent the collection of location data if you prefer.
    </p>
</section>

          {/* Section 7 */}
          <section id="data-retention">
    <h2>7. Data Retention</h2>
    <p className="policy-paragraph">
        We are committed to responsible data management and retention practices. Our data retention policy includes:
        <br/>- <strong>Accounts:</strong> We retain account information for <strong>3 years after closure</strong> to comply with legal obligations and for potential reactivation.
        <br/>- <strong>Payments:</strong> Financial records are kept for <strong>7 years</strong> to meet tax and auditing requirements.
        <br/>- <strong>Location Data:</strong> We retain location information for a maximum of <strong>1 year</strong> to enhance user experience while ensuring privacy.
        <br/>- <strong>Backups:</strong> Data backups are maintained for <strong>3 months</strong> to ensure recovery in case of data loss.
    </p>
</section>

          {/* Section 8 */}
          <section id="children">
    <h2>8. Children's Privacy</h2>
    <p className="policy-paragraph">
        We prioritize the privacy and safety of children. Our services are intended for adults aged 18 and over, and we implement the following measures:
        <br/>- <strong>Block Under-18 Registration:</strong> We do not allow individuals under the age of 18 to create accounts on our platform.
        <br/>- <strong>Delete Accidental Child Data:</strong> If we inadvertently collect data from a child, we will promptly delete it upon request.
        <br/>- <strong>Schools Require Parent Consent:</strong> Educational institutions must obtain parental consent before using our services to ensure compliance with privacy regulations.
    </p>
</section>

          {/* Section 9 */}
          <section id="third-parties">
    <h2>9. Third Parties</h2>
    <p className="policy-paragraph">
        We collaborate with trusted third-party partners to enhance our services. These partnerships include:
        <br/>- <strong>AWS (Amazon Web Services):</strong> Provides reliable cloud storage solutions, ensuring your data is securely stored and easily accessible.
        <br/>- <strong>Google:</strong> Powers our email services, offering robust communication tools for seamless interaction.
        <br/>- <strong>Mapbox:</strong> Supplies advanced mapping services, enhancing our location-based features and user experience.
    </p>
</section>

          {/* Section 10 */}
          <section id="cookies">
    <h2>10. Cookies</h2>
    <p className="policy-paragraph">
        We use cookies to enhance your experience on our website. Specifically, cookies help us to:
        <br/>- <strong>Remember Logins:</strong> Keep you signed in for a seamless browsing experience.
        <br/>- <strong>Save Preferences:</strong> Retain your settings and preferences for future visits, ensuring a personalized experience.
        <br/>- <strong>Analyze Traffic:</strong> Collect data on how users interact with our site, allowing us to improve functionality and content.
        <br/>- <strong>Manage Cookies:</strong> You can adjust your cookie settings in your browser to control your privacy preferences.
    </p>
</section>
          {/* Section 11 */}
          <section id="breaches">
    <h2>11. Breach Alerts</h2>
    <p className="policy-paragraph">
        In the event of a security breach, we prioritize the safety of our users and take immediate action. Our response protocol includes:
        <br/>- <strong>Secure Systems Immediately:</strong> Implement measures to contain the breach and protect sensitive data.
        <br/>- <strong>Notify Users Within 72 Hours:</strong> Inform affected users promptly about the breach, detailing the nature of the incident and any potential risks.
        <br/>- <strong>Offer Credit Monitoring:</strong> Provide affected users with access to credit monitoring services to help safeguard against identity theft and unauthorized activity.
    </p>
</section>

          {/* Section 12 */}
          <section id="complaints">
    <h2>12. Complaints</h2>
    <p className="policy-paragraph">
        We take your concerns seriously and are committed to resolving any issues you may encounter. To raise a complaint, please follow these steps:
        <br/>1. <strong>Contact Us First:</strong> Reach out to our customer support team directly via email or phone. We are dedicated to addressing your concerns promptly.
        <br/>2. <strong>Use Mediation if Needed:</strong> If your issue remains unresolved, consider utilizing mediation services to facilitate a constructive discussion.
        <br/>3. <strong>Contact POTRAZ (Zimbabwe):</strong> Should you feel your complaint has not been adequately addressed, you may escalate the matter to the Postal and Telecommunications Regulatory Authority of Zimbabwe for further assistance.
    </p>
</section>

          {/* Section 13 */}
          <section id="zimbabwe-law">
    <h2>13. Zimbabwe Laws</h2>
    <p className="policy-paragraph">
        We are committed to complying with the relevant laws and regulations in Zimbabwe, including:
        <br/>- <strong>Data Protection Act 5 of 2021:</strong> Ensuring the protection of personal data and privacy rights.
        <br/>- <strong>POTRAZ Regulations:</strong> Adhering to the guidelines set forth by the Postal and Telecommunications Regulatory Authority of Zimbabwe.
        <br/>- <strong>Consumer Protection Laws:</strong> Upholding the rights of consumers to ensure fair treatment and protection in our services.
    </p>
</section>

          {/* Section 14 */}
          <section id="changes">
    <h2>14. Updates</h2>
    <p className="policy-paragraph">
        We may update this policy periodically to reflect changes in our practices or for legal compliance. We will notify you of any significant updates through the following methods:
        <br/>- <strong>Email Notifications:</strong> Registered users will receive an email informing them of major changes to the policy.
        <br/>- <strong>Website/App Notices:</strong> Important updates will be highlighted on our website and within our mobile applications.
        <br/>- <strong>Annual Reviews:</strong> We encourage users to check this policy at least once a year to stay informed about any changes.
    </p>
</section>
          {/* Section 15 */}
          <section id="contact">
    <h2>15. Contact</h2>
    <p className="policy-paragraph">
        If you have any questions or concerns regarding our privacy policy, please feel free to reach out to us:
        <br/>- <strong>Privacy Contact:</strong>
        <br/>- <strong>Email:</strong> <a href="mailto:privacy@spatialforce.co.zw">privacy@spatialforce.co.zw</a>
        <br/>- <strong>Phone:</strong> +263 779 135 076
        <br/>- <strong>Address:</strong> 17 Longhurst, Northlynne, Bulawayo
    </p>
</section>
          <div className="policy-closing">
        <hr className="section-divider" />
        
        <section id="closing">
    <h2>Thank You for Visiting</h2>
    <p className="policy-paragraph">
        We appreciate your interest in Spatial Force and your commitment to understanding our policies. Your privacy and trust are of utmost importance to us, and we strive to provide you with the best mapping and location analysis services.
    </p>
    <p className="policy-paragraph">
        Should you have any questions or require further information, please do not hesitate to reach out. We value your feedback and are here to assist you in any way we can. Thank you for being a part of our community!
    </p>
    <p className="policy-paragraph">
        Stay connected with us for the latest updates and features. We look forward to serving you!
    </p>
</section>
<div className="policy-closing">
    <hr className="section-divider" />
    
    <div className="closing-content">
        <div className="compliance-recap">
            <h3>Our Commitment to You</h3>
            <p>
                At Spatial Force, we prioritize your privacy and are dedicated to maintaining the highest standards of data protection. We regularly review and update our practices to ensure compliance with:
            </p>
            <ul>
                <li><strong>Zimbabwe Data Protection Act:</strong> Upholding your rights regarding personal data.</li>
                <li><strong>POTRAZ Regulations:</strong> Adhering to the regulatory framework governing telecommunications.</li>
                <li><strong>Global Privacy Standards:</strong> Aligning our policies with international best practices.</li>
            </ul>
        </div>

        <div className="closing-note">
            <p>
                Thank you for trusting Spatial Force with your geospatial data needs. Your confidence in us inspires our commitment to excellence.
                <br/>
                <em>Last revision date: [12-03-2024]</em>
            </p>
            
            {/* If using React Router */}
            <Link to="/" className="back-home">
                ← Back to Homepage
            </Link>
        </div>
    </div>
</div>
      </div>
  
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;


    
