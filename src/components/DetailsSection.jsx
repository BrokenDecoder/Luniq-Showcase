import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import BlurText from '../BlurText';
import GlareCard from './GlareCard';
import { details } from '../data/content';

export default function DetailsSection() {
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

  // Entrance from Features (0.0 -> 0.42) and smooth dissolved exit toward Download (0.62 -> 0.95)
  const containerY = useTransform(
    smoothProgress,
    [0.05, 0.4, 0.62, 0.95],
    [100, 0, 0, -80]
  );

  const containerScale = useTransform(
    smoothProgress,
    [0.05, 0.4, 0.62, 0.95],
    [0.91, 1, 1, 0.93]
  );

  const containerOpacity = useTransform(
    smoothProgress,
    [0.05, 0.35, 0.65, 0.95],
    [0, 1, 1, 0]
  );

  const blurVal = useTransform(
    smoothProgress,
    [0.05, 0.35, 0.65, 0.95],
    [14, 0, 0, 14]
  );

  const containerFilter = useTransform(blurVal, v => `blur(${v}px)`);

  return (
    <section ref={sectionRef} className="section details-section" id="details">
      {/* Full Page Content: Continuous Scroll-Linked Genie Ingress & Egress */}
      <motion.div
        className="details-container"
        style={{
          y: containerY,
          scale: containerScale,
          opacity: containerOpacity,
          filter: containerFilter
        }}
      >
        <div className="section-header centered">
          <span className="section-tag">02 / The details</span>
          <h2 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <BlurText
              text="Small things,"
              animateBy="words"
              direction="top"
              delay={100}
              stepDuration={0.32}
              threshold={0.15}
            />
            <BlurText
              text="done right."
              animateBy="words"
              direction="bottom"
              delay={100}
              stepDuration={0.32}
              threshold={0.15}
              style={{ color: 'var(--accent)' }}
            />
          </h2>
          <p>Every corner, transition, and pixel engineered for seamless focus.</p>
        </div>

        <div className="details-grid">
          {details.map(({ icon: Icon, title, copy }, i) => (
            <motion.div
              key={title}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <GlareCard className="detail-item glass-panel" radius={16}>
                <span className="detail-icon"><Icon size={20} strokeWidth={1.8} /></span>
                <div className="detail-meta">
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </div>
              </GlareCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
