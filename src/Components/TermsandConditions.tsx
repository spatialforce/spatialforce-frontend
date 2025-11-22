import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./TermsAndConditions.css";

const TermsAndConditions: React.FC = () => {
  useEffect(() => {
    document.title = "Terms and Conditions | Spatial Force";
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="legal-container">
      <div className="legal-shell">
        {/* Header */}
        <header className="legal-header">
          <div className="legal-branding">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <h1>Terms and Conditions</h1>
          </div>
          <p className="effective-date">Effective: 12 March 2024</p>
        </header>

        {/* Layout: sidebar + content */}
        <div className="legal-content-container">
          {/* Sidebar */}
          <nav className="toc-sidebar" aria-label="Table of contents">
            <h2>On this page</h2>
            <ul>
              <li>
                <a href="#acceptance">1. Acceptance of Terms</a>
              </li>
              <li>
                <a href="#services">2. Services Overview</a>
              </li>
              <li>
                <a href="#obligations">3. User Obligations</a>
              </li>
              <li>
                <a href="#intellectual-property">4. Intellectual Property</a>
              </li>
              <li>
                <a href="#payments">5. Payments &amp; Fees</a>
              </li>
              <li>
                <a href="#termination">6. Termination</a>
              </li>
              <li>
                <a href="#disclaimer">7. Disclaimers</a>
              </li>
              <li>
                <a href="#governance">8. Governing Law</a>
              </li>
              <li>
                <a href="#changes">9. Changes to Terms</a>
              </li>
              <li>
                <a href="#contact">10. Contact Us</a>
              </li>
            </ul>
          </nav>

          {/* Main content */}
          <main className="legal-main-content">
            {/* 1. Acceptance */}
            <section id="acceptance" className="legal-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using Spatial Force&apos;s website, platforms, or
                geospatial services, you agree to be bound by these Terms and
                Conditions. If you do not agree with any part of these terms,
                you should discontinue use of our services.
              </p>
              <div className="key-point">
                <h3>Key points</h3>
                <ul>
                  <li>
                    <strong>Binding agreement:</strong> These terms form a
                    binding agreement between you and Spatial Force.
                  </li>
                  <li>
                    <strong>Applies to all services:</strong> The terms apply to
                    website visitors, clients, and any users of our geospatial
                    solutions.
                  </li>
                  <li>
                    <strong>Updates:</strong> We may update these terms from
                    time to time. Continued use of our services means you accept
                    the updated version.
                  </li>
                </ul>
              </div>
            </section>

            {/* 2. Services Overview */}
            <section id="services" className="legal-section">
              <h2>2. Services Overview</h2>
              <p>
                Spatial Force provides professional geospatial and GIS solutions
                designed to support decision-making in government, private
                sector, research, and development projects.
              </p>

              <div className="service-categories">
                <div className="category-block">
                  <h3>Core Services</h3>
                  <ul>
                    <li>
                      <strong>Geospatial analysis:</strong> Spatial modelling,
                      suitability analysis, and thematic assessments.
                    </li>
                    <li>
                      <strong>GIS integration:</strong> Designing and integrating
                      GIS workflows into existing systems.
                    </li>
                    <li>
                      <strong>Data visualisation:</strong> Maps, dashboards, and
                      visual products that communicate complex data clearly.
                    </li>
                  </ul>
                </div>

                <div className="category-block">
                  <h3>Specialised Solutions</h3>
                  <ul>
                    <li>
                      <strong>Environmental monitoring:</strong> Land cover
                      change, habitat mapping, and resource tracking.
                    </li>
                    <li>
                      <strong>Risk &amp; resilience:</strong> Hazard mapping,
                      exposure analysis, and early-warning support.
                    </li>
                    <li>
                      <strong>Resource management:</strong> Spatial planning for
                      agriculture, water, and natural resources.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="notice-box">
                <h4>Service availability</h4>
                <p>
                  Service availability and scope may vary depending on project
                  requirements, data access, and technical constraints. Please
                  contact us for project-specific details.
                </p>
              </div>
            </section>

            {/* 3. User Obligations */}
            <section id="obligations" className="legal-section">
              <h2>3. User Obligations</h2>
              <p>
                When using Spatial Force&apos;s services or platforms, you agree to
                act responsibly and lawfully.
              </p>

              <div className="obligations-grid">
                <div className="obligation-card">
                  <h3>Account security</h3>
                  <p>
                    You are responsible for any credentials, accounts, or
                    access tokens issued to you. Inform us immediately if you
                    suspect unauthorised access.
                  </p>
                </div>

                <div className="obligation-card">
                  <h3>Lawful use</h3>
                  <p>
                    You agree not to use our services for any unlawful,
                    fraudulent, or harmful activity, or in any way that could
                    damage our systems or reputation.
                  </p>
                </div>

                <div className="obligation-card">
                  <h3>Data responsibility</h3>
                  <p>
                    You are responsible for ensuring that any data you provide
                    to us is accurate, lawful, and does not infringe the rights
                    of third parties.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Intellectual Property */}
            <section id="intellectual-property" className="legal-section">
              <h2>4. Intellectual Property</h2>
              <p>
                All content, designs, maps, graphics, software, and documentation
                provided by Spatial Force are protected by intellectual property
                laws and remain the property of Spatial Force or its licensors.
              </p>
              <p>
                We grant you a limited, non-exclusive, non-transferable licence
                to use our deliverables for the purposes agreed in your project
                or contract. You may not reproduce, sell, or redistribute our
                materials beyond the agreed scope without written permission.
              </p>
              <p>
                If you believe your intellectual property rights have been
                infringed by content associated with Spatial Force, please
                contact us so we can review and respond.
              </p>
            </section>

            {/* 5. Payments & Fees */}
            <section id="payments" className="legal-section">
              <h2>5. Payments &amp; Fees</h2>

              <div className="grid-layout">
                <div className="info-card">
                  <h3>Payment obligations</h3>
                  <ul>
                    <li>
                      Unless stated otherwise, all fees are quoted in USD.
                    </li>
                    <li>
                      Invoices are payable within the period specified in your
                      agreement or invoice (e.g., 7, 14, or 30 days).
                    </li>
                    <li>
                      Late payments may attract interest or lead to suspension
                      of services until the account is regularised.
                    </li>
                  </ul>
                </div>

                <div className="info-card">
                  <h3>Payment methods</h3>
                  <ul>
                    <li>Bank transfers and local RTGS transfers (where available).</li>
                    <li>Mobile money channels where supported.</li>
                    <li>Other methods by prior arrangement.</li>
                  </ul>
                </div>

                <div className="info-card warning">
                  <h3>Refunds</h3>
                  <ul>
                    <li>
                      Because our work is largely service-based and customised,
                      fees are generally non-refundable once work has begun.
                    </li>
                    <li>
                      Any credits or adjustments will be handled on a
                      case-by-case basis and must be agreed in writing.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="notice-box">
                <h4>Taxes</h4>
                <p>
                  Where applicable, clients are responsible for any local taxes,
                  withholding taxes, or duties arising from payments to Spatial
                  Force, unless otherwise agreed.
                </p>
              </div>
            </section>

            {/* 6. Termination */}
            <section id="termination" className="legal-section">
              <h2>6. Termination</h2>

              <div className="termination-grid">
                <div className="term-card">
                  <h3>By Spatial Force</h3>
                  <ul>
                    <li>
                      We may suspend or terminate services if there is a
                      material breach of these terms.
                    </li>
                    <li>
                      Persistent non-payment may result in suspension or
                      termination of access to deliverables or platforms.
                    </li>
                    <li>
                      We may suspend access where we detect misuse, fraud, or
                      security risks.
                    </li>
                  </ul>
                </div>

                <div className="term-card">
                  <h3>By the user / client</h3>
                  <ul>
                    <li>
                      You may request termination of services by giving written
                      notice according to your agreement.
                    </li>
                    <li>
                      Any outstanding fees remain payable for work already
                      completed or committed.
                    </li>
                    <li>
                      We can assist with reasonable data export before access is
                      removed, where applicable.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="liability-cap">
                <h4>Post-termination</h4>
                <p>
                  After termination, your access to internal tools, platforms,
                  or hosted content may be removed. We may retain project
                  records and anonymised data for legal, audit, or historical
                  purposes.
                </p>
              </div>
            </section>

            {/* 7. Disclaimers */}
            <section id="disclaimer" className="legal-section">
              <h2>7. Disclaimers</h2>

              <p>
                Spatial Force&apos;s services are provided on an{" "}
                <strong>&quot;as is&quot;</strong> and{" "}
                <strong>&quot;as available&quot;</strong> basis. While we take
                care with our analysis and mapping, geospatial outputs are
                dependent on input data, models, and assumptions.
              </p>

              <div className="disclaimer-grid">
                <div className="disclaimer-block">
                  <h3>Accuracy &amp; completeness</h3>
                  <p>
                    We do not warrant that maps, models, or analysis will be
                    free from all errors or suitable for every decision. Users
                    should apply professional judgement and verify results where
                    necessary.
                  </p>
                </div>

                <div className="disclaimer-block">
                  <h3>Availability</h3>
                  <p>
                    Access to online tools or resources may be interrupted for
                    maintenance, upgrades, or technical issues beyond our
                    control.
                  </p>
                </div>

                <div className="disclaimer-block">
                  <h3>Third-party data</h3>
                  <p>
                    Where we rely on third-party datasets, APIs, or services, we
                    are not responsible for their accuracy, availability, or
                    licensing terms.
                  </p>
                </div>
              </div>

              <div className="liability-cap">
                <h4>Limitation of liability</h4>
                <p>
                  To the maximum extent permitted by law, Spatial Force&apos;s
                  total liability for any claim arising out of or related to our
                  services will not exceed the total fees paid by you to Spatial
                  Force in the six (6) months before the claim arose.
                </p>
              </div>
            </section>

            {/* 8. Governing Law */}
            <section id="governance" className="legal-section">
              <h2>8. Governing Law</h2>

              <div className="jurisdiction-details">
                <div className="law-block">
                  <h3>Jurisdiction</h3>
                  <ul>
                    <li>
                      These Terms are governed by the laws of Zimbabwe, without
                      regard to conflict-of-law principles.
                    </li>
                    <li>
                      Any disputes will primarily fall under the jurisdiction of
                      the courts of Zimbabwe.
                    </li>
                  </ul>
                </div>

                <div className="dispute-resolution">
                  <h3>Dispute resolution</h3>
                  <ol>
                    <li>
                      Parties are encouraged to engage in good-faith discussions
                      to resolve disputes informally first.
                    </li>
                    <li>
                      Where appropriate, mediation or arbitration may be used
                      before litigation.
                    </li>
                    <li>
                      Litigation remains a last resort where other avenues do
                      not resolve the issue.
                    </li>
                  </ol>
                </div>
              </div>

              <div className="severability">
                <h4>Severability</h4>
                <p>
                  If any provision of these Terms is found to be invalid or
                  unenforceable, the remaining provisions will continue in full
                  force and effect.
                </p>
              </div>
            </section>

            {/* 9. Changes to Terms */}
            <section id="changes" className="legal-section">
              <h2>9. Changes to Terms</h2>

              <div className="update-process">
                <div className="update-timeline">
                  <h3>How we update</h3>
                  <ul>
                    <li>
                      We may revise these Terms from time to time to reflect
                      changes in services, law, or operating practices.
                    </li>
                    <li>
                      For material changes, we will aim to provide reasonable
                      notice, for example via the website or email.
                    </li>
                  </ul>
                </div>

                <div className="user-acknowledgment">
                  <h3>Your responsibility</h3>
                  <p>
                    By continuing to use our services after updated Terms come
                    into effect, you agree to be bound by the revised version.
                    If you have concerns, you are encouraged to contact us for
                    clarification.
                  </p>
                </div>
              </div>

              <div className="version-control">
                <h4>Previous versions</h4>
                <p>
                  Previous versions of these Terms may be available on request.
                  You can email us at{" "}
                  <a href="mailto:gis@spatialforce.co.zw">
                    gis@spatialforce.co.zw
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* 10. Contact Us */}
            <section id="contact" className="legal-section">
              <h2>10. Contact Us</h2>

              <div className="contact-methods">
                <div className="contact-block">
                  <h3>Legal &amp; general enquiries</h3>
                  <p>
                    Email:{" "}
                    <a href="mailto:gis@spatialforce.co.zw">
                      gis@spatialforce.co.zw
                    </a>
                  </p>
                  <p>Phone: +263 717 428 085</p>
                </div>

                <div className="contact-block">
                  <h3>Postal address</h3>
                  <p>
                    Spatial Force
                    <br />
                    17 Longhurst
                    <br />
                    Northlynne, Bulawayo
                    <br />
                    Zimbabwe
                  </p>
                </div>
              </div>
            </section>

            {/* Footer inside page */}
            <div className="legal-footer">
              <p>
                © {new Date().getFullYear()} Spatial Force. All rights
                reserved.
              </p>
              <p>
                View our{" "}
                <Link to="/privacy">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </main>
        </div>
      </div>

      {/* Back to top button */}
      <button
        type="button"
        className="back-to-top"
        onClick={handleBackToTop}
        aria-label="Back to top"
      >
        <span>↑</span> Back to top
      </button>
    </div>
  );
};

export default TermsAndConditions;
