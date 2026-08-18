import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { GitFork as Github, Heart } from 'lucide-react';
import { LINKS } from '../data/content';

export default function CommunitySection() {
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

  // Enters from the LEFT with fade-in, docks in center, and exits to the RIGHT with fade-out
  const cardX = useTransform(
    smoothProgress,
    [0.08, 0.42, 0.62, 0.95],
    [-130, 0, 0, 130]
  );

  const cardScale = useTransform(
    smoothProgress,
    [0.08, 0.42, 0.62, 0.95],
    [0.91, 1, 1, 0.93]
  );

  const cardOpacity = useTransform(
    smoothProgress,
    [0.08, 0.38, 0.65, 0.95],
    [0, 1, 1, 0]
  );

  const blurVal = useTransform(
    smoothProgress,
    [0.08, 0.38, 0.65, 0.95],
    [14, 0, 0, 14]
  );

  const cardFilter = useTransform(blurVal, v => `blur(${v}px)`);

  return (
    <section ref={sectionRef} className="section community-section" id="community">
      <motion.div
        className="community-card glass-panel"
        style={{
          x: cardX,
          scale: cardScale,
          opacity: cardOpacity,
          filter: cardFilter
        }}
      >
        <div className="community-lead">
          <span className="section-tag">The community</span>
          <h2>Good music<br /><span>travels.</span></h2>
          <p>Luniq is open source and made in the open. Come help shape a nicer way to listen.</p>
          <div className="community-actions">
            <a className="button button-primary" href={LINKS.discord} target="_blank" rel="noreferrer">
              <Heart size={15} /> Join the Discord
            </a>
            <a className="button button-quiet" href={LINKS.github} target="_blank" rel="noreferrer">
              <Github size={15} /> Star on GitHub
            </a>
          </div>
        </div>
        <div className="community-stats">
          <div><strong>Open</strong><span>source, always</span></div>
          <div><strong>GPL-3.0</strong><span>free to fork</span></div>
          <div><strong>v1.0.6</strong><span>and counting</span></div>
        </div>
      </motion.div>
    </section>
  );
}
