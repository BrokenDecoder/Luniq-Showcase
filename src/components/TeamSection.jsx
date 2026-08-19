import React, { useRef } from 'react';
import ScrollFloat from './ScrollFloat';
import './TeamSection.css';

export default function TeamSection() {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="section team-section" id="team">
      <div className="team-text-stage">
        <span className="section-tag" style={{ marginBottom: '24px' }}>04 / The Team</span>
        <ScrollFloat
          animationDuration={1.2}
          ease="back.out(2)"
          scrollStart="top 85%"
          scrollEnd="center 45%"
          stagger={0.035}
          textClassName="team-hero-title"
        >
          Meet The Team
        </ScrollFloat>
      </div>
    </section>
  );
}
