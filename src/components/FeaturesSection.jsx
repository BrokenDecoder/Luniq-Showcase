import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import SplitText from '../SplitText';
import GlareCard from './GlareCard';
import { features } from '../data/content';

export default function FeaturesSection() {
  const textPageRef = useRef(null);
  const gridPageRef = useRef(null);

  // 1. Text Page Scroll Progression
  const { scrollYProgress: textProgress } = useScroll({
    target: textPageRef,
    offset: ['start end', 'center center']
  });

  const smoothTextProgress = useSpring(textProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.6
  });

  const headerX = useTransform(smoothTextProgress, [0, 1], [-90, 0]);
  const headerScale = useTransform(smoothTextProgress, [0, 1], [0.93, 1]);
  const headerOpacity = useTransform(smoothTextProgress, [0.05, 0.85], [0, 1]);
  const headerBlur = useTransform(smoothTextProgress, [0, 0.9], [12, 0]);
  const headerFilter = useTransform(headerBlur, v => `blur(${v}px)`);

  // 2. Cards Grid Page Scroll Progression
  const { scrollYProgress: gridProgress } = useScroll({
    target: gridPageRef,
    offset: ['start end', 'center center']
  });

  const smoothGridProgress = useSpring(gridProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.6
  });

  return (
    <>
      {/* Page 1: Dedicated Full 100vh Features Headline Page */}
      <section ref={textPageRef} className="section features-text-page" id="features">
        <motion.div
          className="features-text-container"
          style={{
            x: headerX,
            scale: headerScale,
            opacity: headerOpacity,
            filter: headerFilter
          }}
        >
          <span className="section-tag">01 / What&apos;s inside</span>
          <h2 className="features-main-heading">
            <span className="features-heading-line">
              <SplitText
                text="Everything you need."
                tag="span"
                splitType="chars"
                delay={22}
                duration={0.7}
                ease="power3.out"
                from={{ opacity: 0, y: 38, rotateX: -50 }}
                to={{ opacity: 1, y: 0, rotateX: 0 }}
                threshold={0.15}
              />
            </span>
            <br />
            <span className="features-heading-line">
              <SplitText
                text="Nothing you don't."
                tag="span"
                splitType="chars"
                delay={22}
                duration={0.7}
                ease="power3.out"
                from={{ opacity: 0, y: 38, rotateX: -50 }}
                to={{ opacity: 1, y: 0, rotateX: 0 }}
                threshold={0.15}
                style={{ color: 'var(--accent)' }}
              />
            </span>
          </h2>
          <p className="features-text-desc">
            A thin, considered layer between you and the listening experience you always wanted.
          </p>
        </motion.div>
      </section>

      {/* Page 2: Dedicated Full 100vh 4-Card Feature Grid */}
      <section ref={gridPageRef} className="section features-grid-page" id="features-cards">
        <div className="features-grid-container">
          <div className="features-grid-spacious">
            {features.map(({ icon: Icon, label, title, copy }, i) => (
              <FeatureCard
                key={label}
                icon={Icon}
                label={label}
                title={title}
                copy={copy}
                index={i}
                parentProgress={smoothGridProgress}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon: Icon, label, title, copy, index, parentProgress }) {
  const start = 0.05 + index * 0.08;
  const end = Math.min(1, 0.75 + index * 0.08);

  const cardX = useTransform(parentProgress, [start, end], [-100 - index * 20, 0]);
  const cardY = useTransform(parentProgress, [start, end], [30, 0]);
  const cardScale = useTransform(parentProgress, [start, end], [0.9, 1]);
  const cardOpacity = useTransform(parentProgress, [start, end], [0, 1]);
  const cardBlurVal = useTransform(parentProgress, [start, end], [12, 0]);
  const cardFilter = useTransform(cardBlurVal, v => `blur(${v}px)`);

  return (
    <motion.div
      style={{
        x: cardX,
        y: cardY,
        scale: cardScale,
        opacity: cardOpacity,
        filter: cardFilter
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <GlareCard className="feature-card premium-card spacious-card" radius={16}>
        <div className="feature-top">
          <span className="feature-icon"><Icon size={22} strokeWidth={1.8} /></span>
          <span className="feature-label">{label}</span>
        </div>
        <h3>{title}</h3>
        <p>{copy}</p>
      </GlareCard>
    </motion.div>
  );
}
