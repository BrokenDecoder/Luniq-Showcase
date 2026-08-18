import React, { useRef, useState, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import WarpText from '../WarpText';

export default function Hero() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const [warpParams, setWarpParams] = useState({
    warpStrength: 0.02,
    warpScale: 1.5,
    speed: 0.35,
    refraction: 0.005,
    pointerStrength: 0.35
  });

  useEffect(() => {
    return scrollYProgress.on('change', (p) => {
      // p goes from 0 to 1 as user scrolls through the hero track
      // At rest (p=0): crisp, solid, elegant headline
      // As scrolling (p>0): animation morphs and bends dynamically with the scroll!
      const intensity = Math.min(1, Math.max(0, p * 1.4));
      setWarpParams({
        warpStrength: 0.02 + intensity * 0.22,
        warpScale: 1.5 + intensity * 1.6,
        speed: 0.35 + intensity * 0.55,
        refraction: 0.005 + intensity * 0.04,
        pointerStrength: 0.35 + intensity * 0.25
      });
    });
  }, [scrollYProgress]);

  return (
    <section ref={containerRef} className="hero-scroll-track" id="top">
      <div className="hero-sticky-stage">
        <div className="hero-glow" aria-hidden="true" />

        <div className="hero-stage-center">
          <WarpText
            text="Luniq Music"
            color="#ffffff"
            warpStrength={warpParams.warpStrength}
            warpScale={warpParams.warpScale}
            speed={warpParams.speed}
            pointerInfluence={0.45}
            pointerStrength={warpParams.pointerStrength}
            refraction={warpParams.refraction}
            ripple={true}
            fontSize="clamp(4rem, 12vw, 10rem)"
            fontWeight={800}
            fontFamily="Syne, sans-serif"
            letterSpacing="-0.04em"
            style={{ width: '100%', height: '360px' }}
          />
        </div>
      </div>
    </section>
  );
}
