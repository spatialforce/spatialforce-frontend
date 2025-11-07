import React, { useEffect, useState } from "react";
import "./GlobalLoader.css";

type GlobalLoaderProps = {
  hint?: string;                 // small helper text under the title
  showSkeleton?: boolean;        // toggle skeleton UI
  fullscreen?: boolean;          // use as full-page overlay or inline
  timeoutMs?: number;            // after this, show a gentle “taking longer” note
  onCancel?: () => void;         // optional cancel/back action
};

const GlobalLoader: React.FC<GlobalLoaderProps> = ({
  hint = "Fetching geospatial intelligence…",
  showSkeleton = true,
  fullscreen = true,
  timeoutMs = 12000,
  onCancel,
}) => {
  const [isTakingLong, setIsTakingLong] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsTakingLong(true), timeoutMs);
    return () => clearTimeout(t);
  }, [timeoutMs]);

  return (
    <div
      className={`geo-loader ${fullscreen ? "geo-loader--fullscreen" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <div className="geo-loader__core">
        {/* Animated Globe */}
        <div className="geo-loader__orb">
          <svg
            className="geo-loader__globe"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            {/* Sphere */}
            <circle cx="60" cy="60" r="42" className="globe__sphere" />
            {/* Lat/Lon rings */}
            <g className="globe__rings">
              <ellipse cx="60" cy="60" rx="42" ry="18" className="globe__ring" />
              <ellipse
                cx="60"
                cy="60"
                rx="42"
                ry="18"
                className="globe__ring globe__ring--tilt1"
              />
              <ellipse
                cx="60"
                cy="60"
                rx="42"
                ry="18"
                className="globe__ring globe__ring--tilt2"
              />
              <circle cx="60" cy="60" r="42" className="globe__meridian" />
              <circle cx="60" cy="60" r="32" className="globe__meridian" />
              <circle cx="60" cy="60" r="22" className="globe__meridian" />
            </g>
          </svg>

          {/* Orbiting markers */}
          <div className="geo-loader__dot geo-loader__dot--a" aria-hidden="true" />
          <div className="geo-loader__dot geo-loader__dot--b" aria-hidden="true" />
          <div className="geo-loader__dot geo-loader__dot--c" aria-hidden="true" />
        </div>

        {/* Title + hint */}
        <div className="geo-loader__text">
          <h2 className="geo-loader__title">Spatial Force</h2>
          <p className="geo-loader__hint">{hint}</p>

          {isTakingLong && (
            <p className="geo-loader__note">
              This is taking longer than usual—your network may be slow.
              {onCancel && (
                <>
                  {" "}
                  <button className="geo-loader__link" onClick={onCancel}>
                    Cancel
                  </button>
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Optional skeletons (great for page/chunk Suspense fallbacks) */}
      {showSkeleton && (
        <div className="geo-loader__skeleton" aria-hidden="true">
          <div className="sk sk--xl" />
          <div className="sk sk--md" />
          <div className="sk-row">
            <div className="sk sk--card" />
            <div className="sk sk--card" />
            <div className="sk sk--card" />
          </div>
          <div className="sk sk--lg" />
        </div>
      )}
    </div>
  );
};

export default GlobalLoader;
