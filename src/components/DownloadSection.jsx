import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { LINKS, platforms } from '../data/content';

export default function DownloadSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.6
  });

  // Atmospheric Turbulent Blackout Fade & Caustic Spread
  const bgOpacity = useTransform(smoothProgress, [0.08, 0.38, 0.62, 0.95], [0, 1, 1, 0]);
  const bgScale = useTransform(smoothProgress, [0.08, 0.38, 0.62, 0.95], [1.18, 1, 1, 1.18]);

  // Main Card: Enters from bottom, exits to the RIGHT towards Community with fade out
  const cardX = useTransform(smoothProgress, [0.08, 0.42, 0.62, 0.95], [0, 0, 0, 130]);
  const cardY = useTransform(smoothProgress, [0.08, 0.42, 0.62, 0.95], [90, 0, 0, -20]);
  const cardScale = useTransform(smoothProgress, [0.08, 0.42, 0.62, 0.95], [0.88, 1, 1, 0.93]);
  const cardOpacity = useTransform(smoothProgress, [0.08, 0.38, 0.65, 0.95], [0, 1, 1, 0]);
  const cardBlurVal = useTransform(smoothProgress, [0.08, 0.38, 0.65, 0.95], [16, 0, 0, 14]);
  const cardFilter = useTransform(cardBlurVal, v => `blur(${v}px)`);

  // Left & Right Column Subtle Internal Staggering
  const leftX = useTransform(smoothProgress, [0.12, 0.42], [-24, 0]);
  const rightX = useTransform(smoothProgress, [0.12, 0.42], [24, 0]);

  return (
    <section ref={sectionRef} className="section download-section" id="download">
      {/* Dynamic Turbulent Blackout Atmosphere with Ambient Caustic Vignette */}
      <motion.div
        className="download-turbulence-bg"
        style={{
          opacity: bgOpacity,
          scale: bgScale
        }}
        aria-hidden="true"
      >
        <div className="turbulence-dark-layer" />
        <div className="turbulence-ambient-vignette" />
        <div className="turbulence-glow-core" />
      </motion.div>

      {/* Main Download Card (Exits to the Right into Community) */}
      <motion.div
        className="download-inner glass-panel"
        style={{
          x: cardX,
          y: cardY,
          scale: cardScale,
          opacity: cardOpacity,
          filter: cardFilter
        }}
      >
        <motion.div className="download-copy" style={{ x: leftX }}>
          <span className="section-tag"><Sparkles size={13} style={{ display: 'inline', marginRight: 6 }} />03 / Get Luniq</span>
          <h2>Ready when<br /><span>you are.</span></h2>
          <p>Grab the latest build and make it yours in minutes.</p>
          <a className="button button-primary download-cta-btn" href={LINKS.releases} target="_blank" rel="noreferrer">
            <Download size={16} /> Latest release
          </a>
          <small>Version 1.0.6 · GPL-3.0 · Free &amp; Open Source</small>
        </motion.div>

        <motion.div className="platform-list" style={{ x: rightX }}>
          {platforms.map(({ icon: Icon, name, note }) => (
            <motion.a
              className="platform-row"
              href={LINKS.releases}
              target="_blank"
              rel="noreferrer"
              key={name}
              whileHover={{ x: 6, backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span className="platform-icon"><Icon size={18} /></span>
              <div className="platform-meta">
                <strong>{name}</strong>
                <span>{note}</span>
              </div>
              <ArrowRight size={16} className="platform-arrow" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
