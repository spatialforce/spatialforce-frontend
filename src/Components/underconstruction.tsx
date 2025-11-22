import React from 'react';
import { Link } from 'react-router-dom';
import './UnderConstruction.css';

interface UnderConstructionProps {
  sectionLabel?: string; // e.g. "Services", "Resources", "Industries"
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({ sectionLabel }) => {
  const label = sectionLabel || 'This section';

  return (
    <main className="sf-uc">
      <section className="sf-uc__card" aria-labelledby="under-construction-heading">
        {/* SVG Illustration */}
        <div className="sf-uc__illustration" aria-hidden="true">
          <svg
            viewBox="0 0 400 260"
            className="sf-uc__svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground line */}
            <line
              x1="20"
              y1="210"
              x2="380"
              y2="210"
              className="sf-uc__ground"
            />

            {/* Crane tower */}
            <rect
              x="60"
              y="70"
              width="16"
              height="140"
              className="sf-uc__crane-tower"
            />
            <line
              x1="68"
              y1="70"
              x2="220"
              y2="70"
              className="sf-uc__crane-arm"
            />
            {/* Crane support diagonal */}
            <line
              x1="68"
              y1="100"
              x2="150"
              y2="70"
              className="sf-uc__crane-arm"
            />

            {/* Crane hook line */}
            <line
              x1="190"
              y1="70"
              x2="190"
              y2="130"
              className="sf-uc__hook-line"
            />
            {/* Crane hook block */}
            <rect
              x="182"
              y="130"
              width="16"
              height="22"
              rx="3"
              className="sf-uc__hook-block"
            />

            {/* Suspended panel */}
            <rect
              x="160"
              y="155"
              width="60"
              height="28"
              rx="4"
              className="sf-uc__panel"
            />
            <text
              x="190"
              y="173"
              textAnchor="middle"
              className="sf-uc__panel-text"
            >
              WIP
            </text>

            {/* Excavator body */}
            <rect
              x="240"
              y="150"
              width="80"
              height="42"
              rx="8"
              className="sf-uc__excavator-body"
            />
            {/* Excavator cab */}
            <rect
              x="250"
              y="135"
              width="32"
              height="28"
              rx="6"
              className="sf-uc__excavator-cab"
            />
            {/* Window */}
            <rect
              x="254"
              y="140"
              width="20"
              height="16"
              rx="3"
              className="sf-uc__excavator-window"
            />

            {/* Excavator arm group (animated) */}
            <g className="sf-uc__arm">
              <line
                x1="310"
                y1="150"
                x2="340"
                y2="120"
                className="sf-uc__arm-main"
              />
              <line
                x1="340"
                y1="120"
                x2="360"
                y2="130"
                className="sf-uc__arm-second"
              />
              <polygon
                points="360,130 368,138 352,142"
                className="sf-uc__bucket"
              />
            </g>

            {/* Tracks */}
            <rect
              x="238"
              y="190"
              width="86"
              height="14"
              rx="7"
              className="sf-uc__track"
            />
            <circle cx="252" cy="197" r="6" className="sf-uc__wheel" />
            <circle cx="272" cy="197" r="6" className="sf-uc__wheel" />
            <circle cx="292" cy="197" r="6" className="sf-uc__wheel" />
            <circle cx="312" cy="197" r="6" className="sf-uc__wheel" />

            {/* Warning cones */}
            <g className="sf-uc__cone sf-uc__cone--left">
              <polygon points="110,190 100,210 120,210" />
              <rect x="100" y="210" width="20" height="5" rx="2" />
            </g>
            <g className="sf-uc__cone sf-uc__cone--right">
              <polygon points="200,188 190,210 210,210" />
              <rect x="190" y="210" width="20" height="5" rx="2" />
            </g>

            {/* Rotating gear 1 */}
            <g className="sf-uc__gear sf-uc__gear--left">
              <circle cx="110" cy="130" r="14" />
              <line x1="110" y1="116" x2="110" y2="144" />
              <line x1="96" y1="130" x2="124" y2="130" />
              <line x1="100" y1="120" x2="120" y2="140" />
              <line x1="100" y1="140" x2="120" y2="120" />
            </g>

            {/* Rotating gear 2 */}
            <g className="sf-uc__gear sf-uc__gear--right">
              <circle cx="145" cy="110" r="10" />
              <line x1="145" y1="100" x2="145" y2="120" />
              <line x1="135" y1="110" x2="155" y2="110" />
            </g>
          </svg>
        </div>

        {/* Text content */}
        <div className="sf-uc__text">
          <h1 id="under-construction-heading" className="sf-uc__title">
            {label} is under construction
          </h1>
          <p className="sf-uc__lead">
            Stay tuned – we&apos;re crafting something useful for you here. This space
            will soon host curated geospatial content, tools and examples from SpatialForce.
          </p>
          <p className="sf-uc__note">
            In the meantime, you can explore our live geo-solutions, read about our work,
            or reach out if you have a project in mind.
          </p>

          <div className="sf-uc__actions">
            <Link to="/" className="sf-uc__btn sf-uc__btn--primary">
              Back to Home
            </Link>
            <Link to="/contact" className="sf-uc__btn sf-uc__btn--ghost">
              Contact SpatialForce
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default UnderConstruction;
