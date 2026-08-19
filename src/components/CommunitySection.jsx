import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { GitFork as Github, Heart } from 'lucide-react';
import SpecularButton from './SpecularButton';
import { LINKS } from '../data/content';

export default function CommunitySection() {
  const sectionRef = useRef(null);
  const cardDOMRef = useRef(null);

  // Smooth Elastic Spring Physics State
  const physicsRef = useRef({
    // Mouse target (normalized -1 to +1)
    targetX: 0,
    targetY: 0,
    smoothX: 0,
    smoothY: 0,
    // Spring position & velocity
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

  // Continuous Entrance from Download (0.1 -> 0.38) and Seamless Exit into Experience (0.68 -> 0.98)
  const cardY = useTransform(
    smoothProgress,
    [0.1, 0.38, 0.68, 0.98],
    [-50, 0, 0, -90]
  );

  const cardScale = useTransform(
    smoothProgress,
    [0.1, 0.38, 0.68, 0.98],
    [0.92, 1, 1, 0.94]
  );

  const cardOpacity = useTransform(
    smoothProgress,
    [0.1, 0.35, 0.7, 0.98],
    [0, 1, 1, 0]
  );

  const blurVal = useTransform(
    smoothProgress,
    [0.1, 0.35, 0.7, 0.98],
    [10, 0, 0, 14]
  );

  const cardFilter = useTransform(blurVal, v => `blur(${v}px)`);

  // 120 FPS Direct GPU Elastic Simulation Loop
  useEffect(() => {
    let animId;

    const stiffness = 0.045; // Smooth, fluid spring tension
    const damping = 0.78;   // High-end critically damped response (no jitter)
    const maxPull = 26;     // Max pixel elastic displacement
    const maxTilt = 5.5;    // Max subtle 3D perspective angle

    const updateLoop = () => {
      const p = physicsRef.current;
      const el = cardDOMRef.current;

      // 1. Exponential Smoothing on Cursor Position (Butter-smooth filter)
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

      // 4. Subtle elastic stretch along the pull direction
      const stretchX = 1 + (Math.abs(p.x) / maxPull) * 0.018 - (Math.abs(p.y) / maxPull) * 0.008;
      const stretchY = 1 + (Math.abs(p.y) / maxPull) * 0.018 - (Math.abs(p.x) / maxPull) * 0.008;

      // 5. Direct GPU transform mutation (0 React re-renders = 0 jiggle / 120 FPS smooth)
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
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to +0.5
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
    <section ref={sectionRef} className="section community-section" id="community">
      <motion.div
        style={{
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
          className="community-card glass-panel"
          onMouseMove={handlePointerMove}
          onMouseEnter={handlePointerEnter}
          onMouseLeave={handlePointerLeave}
        >
          <div className="community-lead">
            <span className="section-tag">The community</span>
            <h2>Good music<br /><span>travels.</span></h2>
            <p>Luniq is open source and made in the open. Come help shape a nicer way to listen.</p>
            <div className="community-actions">
              <SpecularButton
                href={LINKS.discord}
                target="_blank"
                rel="noreferrer"
                variant="primary"
                size="md"
                radius={16}
              >
                <Heart size={15} /> Join the Discord
              </SpecularButton>
              <SpecularButton
                href={LINKS.github}
                target="_blank"
                rel="noreferrer"
                variant="quiet"
                size="md"
                radius={16}
                baseColor="#606775"
              >
                <Github size={15} /> Star on GitHub
              </SpecularButton>
            </div>
          </div>
          <div className="community-stats">
            <div><strong>Open</strong><span>source, always</span></div>
            <div><strong>GPL-3.0</strong><span>free to fork</span></div>
            <div><strong>v1.0.6</strong><span>and counting</span></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
