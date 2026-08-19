import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import SpecularButton from './SpecularButton';
import { LINKS, platforms } from '../data/content';

export default function DownloadSection() {
  const sectionRef = useRef(null);
  const cardDOMRef = useRef(null);

  // Smooth Elastic Spring Physics State
  const physicsRef = useRef({
    targetX: 0,
    targetY: 0,
    smoothX: 0,
    smoothY: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rotX: 0,
    rotY: 0,
    vRotX: 0,
    vRotY: 0,
    isHovered: false
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.6
  });

  // Main Card Scroll Animation (Enters from bottom, exits to the RIGHT towards Community with fade out)
  const cardX = useTransform(smoothProgress, [0.08, 0.42, 0.62, 0.95], [0, 0, 0, 130]);
  const cardY = useTransform(smoothProgress, [0.08, 0.42, 0.62, 0.95], [90, 0, 0, -20]);
  const cardScale = useTransform(smoothProgress, [0.08, 0.42, 0.62, 0.95], [0.88, 1, 1, 0.93]);
  const cardOpacity = useTransform(smoothProgress, [0.08, 0.38, 0.65, 0.95], [0, 1, 1, 0]);
  const cardBlurVal = useTransform(smoothProgress, [0.08, 0.38, 0.65, 0.95], [16, 0, 0, 14]);
  const cardFilter = useTransform(cardBlurVal, v => `blur(${v}px)`);

  // Left & Right Column Subtle Internal Staggering
  const leftX = useTransform(smoothProgress, [0.12, 0.42], [-24, 0]);
  const rightX = useTransform(smoothProgress, [0.12, 0.42], [24, 0]);

  // 120 FPS Direct GPU Elastic Simulation Loop
  useEffect(() => {
    let animId;

    const stiffness = 0.045;
    const damping = 0.78;
    const maxPull = 26;
    const maxTilt = 5.5;

    const updateLoop = () => {
      const p = physicsRef.current;
      const el = cardDOMRef.current;

      // 1. Exponential Smoothing on Cursor Position
      const targetX = p.isHovered ? p.targetX : 0;
      const targetY = p.isHovered ? p.targetY : 0;

      p.smoothX += (targetX - p.smoothX) * 0.12;
      p.smoothY += (targetY - p.smoothY) * 0.12;

      // 2. Elastic Spring Integration for Displacement
      const destX = p.smoothX * maxPull;
      const destY = p.smoothY * maxPull;

      const ax = (destX - p.x) * stiffness;
      const ay = (destY - p.y) * stiffness;

      p.vx = (p.vx + ax) * damping;
      p.vy = (p.vy + ay) * damping;

      p.x += p.vx;
      p.y += p.vy;

      // 3. Elastic Spring Integration for 3D Perspective Tilt
      const destRotX = -p.smoothY * maxTilt;
      const destRotY = p.smoothX * maxTilt;

      const aRotX = (destRotX - p.rotX) * stiffness;
      const aRotY = (destRotY - p.rotY) * stiffness;

      p.vRotX = (p.vRotX + aRotX) * damping;
      p.vRotY = (p.vRotY + aRotY) * damping;

      p.rotX += p.vRotX;
      p.rotY += p.vRotY;

      // 4. Elastic stretch along pull direction
      const stretchX = 1 + (Math.abs(p.x) / maxPull) * 0.018 - (Math.abs(p.y) / maxPull) * 0.008;
      const stretchY = 1 + (Math.abs(p.y) / maxPull) * 0.018 - (Math.abs(p.x) / maxPull) * 0.008;

      // 5. Direct GPU transform mutation
      if (el) {
        el.style.transform = `perspective(1400px) translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0px) rotateX(${p.rotX.toFixed(2)}deg) rotateY(${p.rotY.toFixed(2)}deg) scaleX(${stretchX.toFixed(4)}) scaleY(${stretchY.toFixed(4)})`;

        const glowX = (50 + p.smoothX * 35).toFixed(1);
        const glowY = (50 + p.smoothY * 35).toFixed(1);
        const shadowY = (16 + Math.abs(p.y) * 0.4).toFixed(1);
        const shadowBlur = (36 + Math.abs(p.x) * 0.5).toFixed(1);

        el.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.5), radial-gradient(circle at ${glowX}% ${glowY}%, rgba(235, 90, 55, 0.14), transparent 65%), inset 0 1px 0 rgba(255, 255, 255, 0.12)`;
      }

      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePointerMove = (e) => {
    if (!cardDOMRef.current) return;
    const rect = cardDOMRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    const p = physicsRef.current;
    p.targetX = Math.max(-1, Math.min(1, nx * 2));
    p.targetY = Math.max(-1, Math.min(1, ny * 2));
    p.isHovered = true;
  };

  const handlePointerEnter = () => {
    physicsRef.current.isHovered = true;
  };

  const handlePointerLeave = () => {
    const p = physicsRef.current;
    p.isHovered = false;
    p.targetX = 0;
    p.targetY = 0;
  };

  return (
    <section ref={sectionRef} className="section download-section" id="download">
      {/* Main Download Card Container (Scroll-Linked) */}
      <motion.div
        style={{
          x: cardX,
          y: cardY,
          scale: cardScale,
          opacity: cardOpacity,
          filter: cardFilter,
          width: '100%',
          maxWidth: 'var(--content-width)',
          margin: 'auto'
        }}
      >
        <div
          ref={cardDOMRef}
          className="download-inner glass-panel"
          onMouseMove={handlePointerMove}
          onMouseEnter={handlePointerEnter}
          onMouseLeave={handlePointerLeave}
        >
          <motion.div className="download-copy" style={{ x: leftX }}>
            <span className="section-tag"><Sparkles size={13} style={{ display: 'inline', marginRight: 6 }} />03 / Get Luniq</span>
            <h2>Ready when<br /><span>you are.</span></h2>
            <p>Grab the latest build and make it yours in minutes.</p>
            <div style={{ marginTop: '32px' }}>
              <SpecularButton
                href={LINKS.releases}
                target="_blank"
                rel="noreferrer"
                variant="primary"
                size="lg"
                radius={16}
                className="download-cta-btn"
              >
                <Download size={16} /> Latest release
              </SpecularButton>
            </div>
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
        </div>
      </motion.div>
    </section>
  );
}
