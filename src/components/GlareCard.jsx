import React, { useRef } from 'react';
import './GlareCard.css';

export default function GlareCard({
  children,
  className = '',
  style = {},
  radius = 16,
  ...rest
}) {
  const cardRef = useRef(null);

  const handlePointerMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    // Angle of cursor relative to card center for directional border shine
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);

    el.style.setProperty('--glare-x', `${pctX.toFixed(1)}%`);
    el.style.setProperty('--glare-y', `${pctY.toFixed(1)}%`);
    el.style.setProperty('--glare-angle', `${(angle + 90).toFixed(1)}deg`);
    el.style.setProperty('--glare-opacity', '1');
  };

  const handlePointerLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--glare-opacity', '0');
  };

  return (
    <div
      ref={cardRef}
      className={`glare-card ${className}`}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      style={{
        borderRadius: `${radius}px`,
        ...style
      }}
      {...rest}
    >
      {/* Directional Specular Border Glint */}
      <div className="glare-card__rim" aria-hidden="true" />
      {/* Radial Surface Sheen */}
      <div className="glare-card__surface" aria-hidden="true" />
      {/* Main Card Content */}
      <div className="glare-card__content">
        {children}
      </div>
    </div>
  );
}
