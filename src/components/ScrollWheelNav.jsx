import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import OptionWheel from '../OptionWheel';

const NAV_ITEMS = [
  'Showcase',
  'Features',
  'Details',
  'Download',
  'Community',
  'Experience'
];

const TARGET_IDS = [
  'showcase',
  'features',
  'details',
  'download',
  'community',
  'experience'
];

export default function ScrollWheelNav() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isScrollingToRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Visibility: Active from Showcase through the Experience section
  useEffect(() => {
    const checkVisibility = () => {
      const showcaseEl = document.getElementById('showcase');
      const footerEl = document.querySelector('.footer');

      if (showcaseEl) {
        const showcaseRect = showcaseEl.getBoundingClientRect();
        const pastHero = showcaseRect.top <= window.innerHeight * 0.45;

        let inFooter = false;
        if (footerEl) {
          const footerRect = footerEl.getBoundingClientRect();
          inFooter = footerRect.top <= window.innerHeight * 0.7;
        }

        setIsVisible(pastHero && !inFooter);
      }
    };

    window.addEventListener('scroll', checkVisibility, { passive: true });
    checkVisibility();
    return () => window.removeEventListener('scroll', checkVisibility);
  }, []);

  // Mouse hover tracking: only reveal when mouse goes to the left side
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Activated when mouse is within the left 180px of viewport
      setIsHovered(e.clientX <= 180);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update selected index as the user reads/scrolls through sections
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingToRef.current) return;
      const scrollPos = window.scrollY + window.innerHeight * 0.35;

      for (let i = TARGET_IDS.length - 1; i >= 0; i--) {
        const id = TARGET_IDS[i];
        const el = document.getElementById(id) || document.querySelector(`.${id}-section`);
        if (el && el.offsetTop <= scrollPos) {
          if (i !== selectedIndex) {
            setSelectedIndex(i);
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedIndex]);

  // ONLY by clicking on that section name does page scroll activate
  const handleItemClick = (idx) => {
    setSelectedIndex(idx);
    const targetId = TARGET_IDS[idx];
    if (!targetId) return;

    isScrollingToRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    const el = document.getElementById(targetId) || document.querySelector(`.${targetId}-section`);
    if (el) {
      if (window.__lenis) {
        window.__lenis.scrollTo(el, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingToRef.current = false;
    }, 1000);
  };

  const shouldShow = isVisible && isHovered;

  return (
    <>
      {/* Left Edge Hover Detection Zone */}
      {isVisible && (
        <div
          className={`scroll-wheel-hover-zone ${isHovered ? 'active' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          aria-hidden="true"
        >
          <div className="scroll-wheel-edge-indicator" />
        </div>
      )}

      {/* Slide-out Left Navigation Wheel */}
      <motion.aside
        className="scroll-wheel-dock"
        aria-label="Section Navigation"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, x: -160, scale: 0.9, filter: 'blur(12px)' }}
        animate={{
          opacity: shouldShow ? 1 : 0,
          x: shouldShow ? 0 : -160,
          scale: shouldShow ? 1 : 0.9,
          filter: shouldShow ? 'blur(0px)' : 'blur(12px)',
          pointerEvents: shouldShow ? 'auto' : 'none'
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 24, mass: 0.8 }}
      >
        <div className="scroll-wheel-container">
          <OptionWheel
            items={NAV_ITEMS}
            selected={selectedIndex}
            onItemClick={handleItemClick}
            side="left"
            fontSize={2.8}
            spacing={1.55}
            curve={1.2}
            tilt={7.5}
            blur={1.8}
            fade={0.35}
            minOpacity={0.06}
            smoothing={180}
            inset={20}
            textColor="#7e8da4"
            activeColor="#ffffff"
            draggable={false}
            enableWheel={false}
          />
        </div>
      </motion.aside>
    </>
  );
}
