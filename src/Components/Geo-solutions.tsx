import React, { useMemo, useState } from "react";
import "./Geo-solutions.css";

type FAQ = { q: string; a: string };

const faqs: FAQ[] = [
  {
    q: "What is GIS?",
    a: "GIS is a way of attaching information to locations on a map. It helps you see patterns, plan activities and explain decisions using visuals instead of long tables."
  },
  {
    q: "What is Remote Sensing?",
    a: "Remote Sensing uses satellites and drones to capture images of the Earth. From those images we can observe vegetation, surfaces and general change without being on site."
  },
  {
    q: "Do I need powerful hardware?",
    a: "No. Many useful maps can run in a normal browser. The focus is on light pages that work on standard laptops and common smartphones."
  },
  {
    q: "Can you work with our existing data?",
    a: "Yes. Spreadsheets, shape files or simple lists can often be cleaned and placed on a map so that everyone sees the same information."
  },
  {
    q: "Do you offer training?",
    a: "Yes. Training is practical and short. The goal is for your team to feel comfortable opening maps, checking layers and exporting small reports."
  }
];

const steps = [
  {
    title: "Explore ideas",
    text: "We talk briefly about the kind of questions you want to answer with maps or satellite images and list a few simple options."
  },
  {
    title: "Sketch a layout",
    text: "We outline what a small map or page could show and identify the information that would be most useful to highlight."
  },
  {
    title: "Build a first version",
    text: "We prepare a light working page so you can see how the information looks when it is organised around location."
  },
  {
    title: "Improve and extend",
    text: "Once the basic flow is comfortable we can add more layers, small charts or new views while keeping everything easy to use."
  }
];

const GeoSolutions: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <main className="gs3-page" role="main">
      {/* SEO helpers, visually hidden */}
      <section className="gs3-seo" aria-hidden="true">
        <link
          rel="canonical"
          href="https://www.spatialforce.co.zw/geo-solutions"
        />
        <meta
          name="description"
          content="Geo solutions from Spatial Force: clear GIS and Remote Sensing support, web maps and simple dashboards to understand location-based information."
        />
        <meta
          name="keywords"
          content="geo solutions, GIS, Remote Sensing, web maps, dashboards, spatial analysis, Spatial Force"
        />
        <meta name="author" content="Spatial Force" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#23574d" />
      </section>

      {/* HERO */}
      <header className="gs3-hero">
        <div className="gs3-hero-inner">
          <div className="gs3-hero-copy">
            <p className="gs3-pill">Spatial Force · Geo solutions</p>
            <h1 className="gs3-hero-title">
              Geo solutions explained in clear language.
            </h1>
            <p className="gs3-hero-lede">
            Our mission is to tackle complex challenges with the power of spatial data.
            We offer a complete range of support services to make this possible.
            Since no two problems are the same, we do not offer one-size-fits-all answers.
            Instead, we carefully design each solution to fit the complexity and details of your situation
            </p>

          <ul class="gs3-hero-points">
    <li>Solve location puzzles with intuitive maps that simplify complexity</li>
    <li>Pinpoint critical insights with dashboards designed for quick decisions</li>
    <li>Navigate projects confidently with guided, ongoing analytical support</li>
    <li>Address your exact situation with custom-built spatial solutions</li>
</ul>

            <div className="gs3-hero-tags" aria-hidden="true">
              <span>GIS</span>
              <span>Remote Sensing</span>
              <span>Web mapping</span>
            </div>
          </div>

          {/* decorative geo-style panel, no navigation */}
          <aside className="gs3-hero-visual" aria-hidden="true">
            <div className="gs3-visual-card">
              <div className="gs3-visual-header">
                <span className="gs3-dot gs3-dot--green" />
                <span className="gs3-dot gs3-dot--amber" />
                <span className="gs3-dot gs3-dot--red" />
              </div>

              <div className="gs3-visual-map">
                <div className="gs3-visual-zone gs3-visual-zone--a" />
                <div className="gs3-visual-zone gs3-visual-zone--b" />
                <div className="gs3-visual-zone gs3-visual-zone--c" />
                <div className="gs3-visual-marker gs3-visual-marker--1" />
                <div className="gs3-visual-marker gs3-visual-marker--2" />
                <div className="gs3-visual-marker gs3-visual-marker--3" />
              </div>

              <div className="gs3-visual-body">
                <h3 className="gs3-visual-title">Mini geo view</h3>
                <ul className="gs3-visual-legend">
                  <li>
                    <span className="gs3-legend-swatch gs3-legend-swatch--a" />
                    Focus area on the map
                  </li>
                  <li>
                    <span className="gs3-legend-swatch gs3-legend-swatch--b" />
                    Supporting context around it
                  </li>
                  <li>
                    <span className="gs3-legend-swatch gs3-legend-swatch--c" />
                    Points that deserve a closer look
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </header>

      {/* WHAT WE OFFER */}
      <section className="gs3-section">
        <div className="gs3-container">
          <header className="gs3-section-head">
            <h2 className="gs3-h2">What geo solutions can include</h2>
            <p className="gs3-section-lede">
              The list below describes types of work we can support. Each item
              can stay small, or later be combined into a wider system when you
              are ready.
            </p>
          </header>

          <div className="gs3-grid gs3-grid--3">
            <article className="gs3-card">
              <h3 className="gs3-h3">Explainer maps</h3>
              <p className="gs3-p">
                Simple web maps that show locations, boundaries and key
                attributes with clear labels.
              </p>
              <ul className="gs3-list">
                <li>Turn lists into location-based views</li>
                <li>Use colour to show categories or status</li>
                <li>Capture screenshots for short briefs</li>
              </ul>
            </article>

            <article className="gs3-card">
              <h3 className="gs3-h3">Change-over-time views</h3>
              <p className="gs3-p">
                Layouts that help you see how an area has changed between dates
                or seasons.
              </p>
              <ul className="gs3-list">
                <li>Compare imagery from different dates</li>
                <li>Mark areas that appear to be changing fast</li>
                <li>Use this to focus field checks</li>
              </ul>
            </article>

            <article className="gs3-card">
              <h3 className="gs3-h3">Data preparation</h3>
              <p className="gs3-p">
                Organising scattered files so they are consistent and ready to
                use in maps or simple dashboards.
              </p>
              <ul className="gs3-list">
                <li>Clean up spreadsheets and coordinate fields</li>
                <li>Standardise names and categories</li>
                <li>Prepare light layers that load quickly</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* GEO VISUALS – image section, no navigation */}
      <section className="gs3-section gs3-section--alt">
        <div className="gs3-container">
          <header className="gs3-section-head">
            <h2 className="gs3-h2">Geo visuals at a glance</h2>
            <p className="gs3-section-lede">
             We craft any form of  geospatial data support and handling tools to make data interpretation easy for you.
            </p>
          </header>

          <div className="gs3-gallery">
            <figure className="gs3-thumb">
              <img
                src="/images/map.png"
                alt="Person working with a map on a laptop"
                loading="lazy"
              />
              <figcaption>
                A workspace where a single map view holds the key information
                needed for a quick check.
              </figcaption>
            </figure>

            <figure className="gs3-thumb">
              <img
                src="/images/satellite.png"
                alt="Satellite-style view of land and water"
                loading="lazy"
              />
              <figcaption>
                Satellite-style imagery used to understand land patterns without
                heavy interfaces.
              </figcaption>
            </figure>

            <figure className="gs3-thumb">
              <img
                src="/images/datadashboard.png"
                alt="Simple dashboard with charts on a screen"
                loading="lazy"
              />
              <figcaption>
                A light dashboard where charts and maps sit side by side without
                feeling crowded.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* SUPPORT AREAS */}
      <section className="gs3-section">
        <div className="gs3-container">
          <header className="gs3-section-head">
            <h2 className="gs3-h2">Ways we can support your team</h2>
            <p className="gs3-section-lede">
              Geo solutions work best when they match daily routines. The
              examples below show how maps and satellite data can sit quietly
              behind normal workflows.
            </p>
          </header>

          <div className="gs3-grid gs3-grid--2">
            <article className="gs3-panel">
              <h3 className="gs3-h3">Planning and review</h3>
              <p className="gs3-p">
                Use a simple map to see where activities are concentrated and
                where gaps might appear.
              </p>
              <ul className="gs3-list gs3-list--compact">
                <li>Outline areas that need regular attention</li>
                <li>Summarise key numbers by zone or ward</li>
                <li>Prepare quick slides for review meetings</li>
              </ul>
            </article>

            <article className="gs3-panel">
              <h3 className="gs3-h3">Reporting and communication</h3>
              <p className="gs3-p">
                Support reports with small, clear map snapshots that show
                progress visually.
              </p>
              <ul className="gs3-list gs3-list--compact">
                <li>Highlight changes between one period and the next</li>
                <li>Keep legends short and readable</li>
                <li>Use consistent colours across reports</li>
              </ul>
            </article>

            <article className="gs3-panel">
              <h3 className="gs3-h3">Field work support</h3>
              <p className="gs3-p">
                Use location to decide where to send limited teams and where to
                collect new data.
              </p>
              <ul className="gs3-list gs3-list--compact">
                <li>Mark priority spots for a given week</li>
                <li>Capture simple forms on a phone</li>
                <li>Sync later when network is available</li>
              </ul>
            </article>

            <article className="gs3-panel">
              <h3 className="gs3-h3">Light automation</h3>
              <p className="gs3-p">
                Where useful, set up automatic updates so repeated work does not
                need to be done by hand.
              </p>
              <ul className="gs3-list gs3-list--compact">
                <li>Refresh layers from trusted data sources</li>
                <li>Update basic indicators on a schedule</li>
                <li>Keep a short log of changes for reference</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="gs3-section">
        <div className="gs3-container">
          <header className="gs3-section-head">
            <h2 className="gs3-h2">How a small engagement might run</h2>
            <p className="gs3-section-lede">
             Our mission is to tackle complex challenges with the power of spatial data.
            We offer a complete range of support services to make this possible.
Since no two problems are the same, we do not offer one-size-fits-all answers.
Instead, we carefully design each solution to fit the complexity and details of your situation.
            </p>
          </header>

          <ol className="gs3-steps">
            {steps.map((s, i) => (
              <li key={i} className="gs3-step">
                <div className="gs3-step-number">{i + 1}</div>
                <div className="gs3-step-body">
                  <h3 className="gs3-h3">{s.title}</h3>
                  <p className="gs3-p">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="gs3-section gs3-section--alt">
        <div className="gs3-container">
          <header className="gs3-section-head">
            <h2 className="gs3-h2">Common questions</h2>
            <p className="gs3-section-lede">
              These answers are kept short on purpose. They are meant to give a
              sense of how the tools work without going too deep into technical
              language.
            </p>
          </header>

          <div className="gs3-faq">
            {faqs.map((f, i) => {
              const open = openFAQ === i;
              return (
                <div
                  key={i}
                  className={`gs3-faq-item ${open ? "is-open" : ""}`}
                >
                  <button
                    type="button"
                    className="gs3-faq-q"
                    aria-expanded={open}
                    onClick={() => setOpenFAQ(open ? null : i)}
                  >
                    <span>{f.q}</span>
                    <span className="gs3-faq-icon" aria-hidden="true">
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  <div className="gs3-faq-a">
                    <p className="gs3-p">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT – calm contact block */}
      <section className="gs3-section gs3-contact">
        <div className="gs3-container gs3-contact-inner">
          <div className="gs3-contact-text">
            <h2 className="gs3-h2">Talk to Spatial Force</h2>
            <p className="gs3-section-lede">
              If you would like to explore any of these ideas, you can send a
              short note with the type of work you have in mind. A few lines are
              enough to start the conversation.
            </p>
            <ul className="gs3-contact-list">
              <li>
                <strong>Email</strong>{" "}
                <a href="mailto:gis@spatialforce.co.zw">
                  gis@spatialforce.co.zw
                </a>
              </li>
              <li>
                <strong>Phone</strong>{" "}
                <a href="tel:+263779135076">+263 77 913 5076</a>
              </li>
            </ul>
          </div>

          <form
            className="gs3-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you. Your message has been noted.");
            }}
          >
            <div className="gs3-field">
              <label htmlFor="name">Your name</label>
              <input id="name" name="name" autoComplete="name" required />
            </div>
            <div className="gs3-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div className="gs3-field">
              <label htmlFor="topic">Focus area (optional)</label>
              <select id="topic" name="topic" defaultValue="General">
                <option>General</option>
                <option>Planning and review</option>
                <option>Reporting and communication</option>
                <option>Field work support</option>
                <option>Light automation</option>
              </select>
            </div>
            <div className="gs3-field">
              <label htmlFor="msg">Message</label>
              <textarea id="msg" name="message" rows={5} />
            </div>
            <div className="gs3-form-note">
            </div>
            <button className="gs3-submit" type="submit">
              Send message
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="gs3-footer">
        <div className="gs3-container gs3-footer-inner">
          <div className="gs3-footer-brand">Spatial Force · Geo solutions</div>
          <div className="gs3-footer-copy">
            © {year} Spatial Force.
          </div>
        </div>
      </footer>
    </main>
  );
};

export default GeoSolutions;
