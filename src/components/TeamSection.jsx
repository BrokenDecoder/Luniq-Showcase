import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ScrollFloat from './ScrollFloat';
import './TeamSection.css';

export default function TeamSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
    mass: 0.5
  });

  const textScale = useTransform(smoothProgress, [0.1, 0.45, 0.65, 0.95], [0.88, 1, 1, 0.9]);
  const textOpacity = useTransform(smoothProgress, [0.1, 0.4, 0.65, 0.95], [0, 1, 1, 0]);
  const textBlur = useTransform(smoothProgress, [0.1, 0.4, 0.65, 0.95], [14, 0, 0, 14]);
  const textFilter = useTransform(textBlur, (v) => `blur(${v}px)`);

  return (
    <section ref={sectionRef} className="section team-section" id="team">
      <motion.div
        className="team-text-stage"
        style={{
          scale: textScale,
          opacity: textOpacity,
          filter: textFilter
        }}
      >
        <span className="section-tag" style={{ marginBottom: '20px' }}>04 / The Team</span>
        <ScrollFloat
          animationDuration={1.2}
          ease="back.out(2)"
          scrollStart="top bottom-=15%"
          scrollEnd="bottom center+=10%"
          stagger={0.04}
          textClassName="team-hero-title"
        >
          Meet The Team
        </ScrollFloat>
      </motion.div>
    </section>
  );
}
