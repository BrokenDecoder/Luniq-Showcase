import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import FoldText from '../FoldText';
import ShowcaseCarousel from './ShowcaseCarousel';

export default function ShowcaseSection() {
  const textPageRef = useRef(null);
  const stagePageRef = useRef(null);

  // 1. Text Page Scroll Animation
  const { scrollYProgress: textProgress } = useScroll({
    target: textPageRef,
    offset: ['start end', 'center center']
  });

  const smoothTextProgress = useSpring(textProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.6
  });

  const textY = useTransform(smoothTextProgress, [0, 1], [60, 0]);
  const textScale = useTransform(smoothTextProgress, [0, 1], [0.92, 1]);
  const textOpacity = useTransform(smoothTextProgress, [0.1, 0.85], [0, 1]);
  const textBlur = useTransform(smoothTextProgress, [0, 0.9], [12, 0]);
  const textFilter = useTransform(textBlur, v => `blur(${v}px)`);

  // 2. Carousel Stage Page Scroll Animation (Scale-in with reverse support)
  const { scrollYProgress: stageProgress } = useScroll({
    target: stagePageRef,
    offset: ['start end', 'center center']
  });

  const smoothStageProgress = useSpring(stageProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.6
  });

  const carouselScale = useTransform(smoothStageProgress, [0.0, 1], [0.72, 1]);
  const carouselY = useTransform(smoothStageProgress, [0.0, 1], [100, 0]);
  const carouselOpacity = useTransform(smoothStageProgress, [0.05, 0.85], [0, 1]);
  const carouselBlur = useTransform(smoothStageProgress, [0.05, 0.85], [14, 0]);
  const carouselFilter = useTransform(carouselBlur, v => `blur(${v}px)`);

  const trustOpacity = useTransform(smoothStageProgress, [0.5, 0.95], [0, 1]);

  return (
    <>
      {/* Page 1: Dedicated Full 100vh Overview Text Page */}
      <section ref={textPageRef} className="section showcase-text-page" id="showcase">
        <motion.div
          className="showcase-text-container"
          style={{
            y: textY,
            scale: textScale,
            opacity: textOpacity,
            filter: textFilter
          }}
        >
          <span className="section-tag">Interface</span>
          <h2 className="showcase-fold-heading">
            <FoldText
              text="Crafted for clarity."
              splitBy="char"
              hinge="top"
              trigger="scroll"
              duration={0.65}
              stagger={0.028}
              ease="power3.out"
              perspective={700}
              creaseShading={0.55}
              fontSize="clamp(3rem, 6.5vw, 5.5rem)"
              fontWeight={800}
              color="#ffffff"
            />
            <br />
            <FoldText
              text="Nothing in the way."
              splitBy="char"
              hinge="bottom"
              trigger="scroll"
              duration={0.65}
              stagger={0.028}
              ease="power3.out"
              perspective={700}
              creaseShading={0.55}
              fontSize="clamp(3rem, 6.5vw, 5.5rem)"
              fontWeight={800}
              color="#eb5a37"
            />
          </h2>
          <p className="showcase-text-desc">
            A refined player that keeps the spotlight strictly on your sound.
          </p>
        </motion.div>
      </section>

      {/* Page 2: Dedicated Full 100vh 3D Carousel Showcase Stage */}
      <section ref={stagePageRef} className="section showcase-stage-page" id="showcase-stage">
        <motion.div
          className="showcase-stage-container"
          style={{
            scale: carouselScale,
            y: carouselY,
            opacity: carouselOpacity,
            filter: carouselFilter
          }}
        >
          <div className="hero-showcase">
            <ShowcaseCarousel />
          </div>

          <motion.div className="trust" style={{ opacity: trustOpacity }}>
            <span className="trust-rule" />
            <p>Built by Saraans and a community that cares about craft</p>
            <span className="trust-rule" />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
