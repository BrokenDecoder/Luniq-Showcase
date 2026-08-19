import React from 'react';
import MoltenMetal from '../MoltenMetal';

export default function Background() {
  return (
    <div className="ambient-background" aria-hidden="true">
      {/* Dynamic MoltenMetal WebGL Canvas Matching Theme */}
      <div className="molten-bg-wrapper">
        <MoltenMetal
          color1="#0d111a"
          color2="#eb5a37"
          color3="#ffffff"
          speed={0.28}
          scale={3.6}
          detail={4}
          glow={2.0}
          coreSize={0.12}
          swirl={1.1}
          fold={-0.25}
          blackPoint={0.01}
          brightness={1.4}
          colorMode="molten"
          grain={true}
          grainIntensity={0.04}
          mouseInteraction={true}
          mouseStrength={0.3}
          opacity={0.85}
        />
      </div>

      {/* Subtle Grid Matrix Overlay */}
      <div className="bg-grid-overlay" />

      {/* Vignette Frame */}
      <div className="bg-vignette" />
    </div>
  );
}
