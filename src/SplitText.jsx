import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
  text = '',
  className = '',
  delay = 35,
  duration = 0.75,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 36, rotateX: -40 },
  to = { opacity: 1, y: 0, rotateX: 0 },
  threshold = 0.15,
  textAlign = 'left',
  tag = 'div',
  style = {}
}) => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  // Pre-split content into characters or words with preservation of spaces
  const elements = useMemo(() => {
    if (!text) return null;

    if (splitType === 'words') {
      return text.split(/(\s+)/).map((part, index) => {
        if (!part) return null;
        if (/^\s+$/.test(part)) {
          return <span key={`space-${index}`} className="split-space">&nbsp;</span>;
        }
        return (
          <span key={`word-${index}`} className="split-word" style={{ display: 'inline-block', overflow: 'hidden' }}>
            <span className="split-target" style={{ display: 'inline-block' }}>
              {part}
            </span>
          </span>
        );
      });
    }

    // Default: splitType === 'chars'
    return text.split('').map((char, index) => {
      if (char === ' ') {
        return <span key={`space-${index}`} className="split-space">&nbsp;</span>;
      }
      return (
        <span key={`char-${index}`} className="split-char" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <span className="split-target" style={{ display: 'inline-block', willChange: 'transform, opacity' }}>
            {char}
          </span>
        </span>
      );
    });
  }, [text, splitType]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const targets = el.querySelectorAll('.split-target');
    if (!targets.length) return;

    // Reset initial state
    gsap.set(targets, from);

    // Timeline with bidirectional ScrollTrigger
    const tl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: el,
        start: `top ${(1 - threshold) * 100}%`,
        end: 'bottom 10%',
        toggleActions: 'play reverse play reverse'
      }
    });

    tl.fromTo(
      targets,
      from,
      {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        force3D: true
      }
    );

    timelineRef.current = tl;

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.killTweensOf(targets);
    };
  }, [text, delay, duration, ease, splitType, threshold, JSON.stringify(from), JSON.stringify(to)]);

  const Tag = tag;

  return (
    <Tag
      ref={containerRef}
      className={`split-text-root ${className}`.trim()}
      style={{
        textAlign,
        display: 'inline-block',
        perspective: 800,
        ...style
      }}
    >
      {elements}
    </Tag>
  );
};

export default SplitText;
