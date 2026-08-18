import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * useJellyScroll:
 * 1. Initializes Lenis continuous smooth velocity scroll.
 * 2. Translates real-time scroll velocity into elastic jelly squish, skew, and volume-preserving wobble.
 * 3. Applies a 10% magnetic snap when the user pauses scrolling.
 */
export default function useJellyScroll() {
  const lenisRef = useRef(null);
  const snapTimeoutRef = useRef(null);
  const isSnappingRef = useRef(false);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false
    });

    lenisRef.current = lenis;

    // Expose lenis to window for navigation links
    window.__lenis = lenis;

    // 2. Velocity-to-Jelly Physics Loop
    let currentSkew = 0;
    let currentScaleY = 1;
    let currentScaleX = 1;

    let rafId;
    function updateJelly(time) {
      lenis.raf(time);

      const velocity = lenis.velocity || 0;

      // Target jelly squish parameters from velocity
      const targetSkew = Math.max(-4.5, Math.min(4.5, velocity * 0.065));
      const targetScaleY = Math.max(0.93, 1 - Math.min(0.07, Math.abs(velocity) * 0.0028));
      const targetScaleX = Math.min(1.035, 1 + Math.min(0.035, Math.abs(velocity) * 0.0014));

      // Spring lerp for soft elastic recovery and wobble
      currentSkew += (targetSkew - currentSkew) * 0.15;
      currentScaleY += (targetScaleY - currentScaleY) * 0.15;
      currentScaleX += (targetScaleX - currentScaleX) * 0.15;

      // Apply jelly variables to the root container
      document.documentElement.style.setProperty('--jelly-skew', `${currentSkew.toFixed(3)}deg`);
      document.documentElement.style.setProperty('--jelly-scale-y', currentScaleY.toFixed(4));
      document.documentElement.style.setProperty('--jelly-scale-x', currentScaleX.toFixed(4));

      rafId = requestAnimationFrame(updateJelly);
    }

    rafId = requestAnimationFrame(updateJelly);

    // 3. 10% Magnetic Snapping on Scroll Pause
    const getSections = () => {
      const sectionIds = ['top', 'showcase', 'showcase-stage', 'features', 'features-cards', 'details', 'download', 'community', 'reviews'];
      return sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);
    };

    const handleScroll = (e) => {
      if (isSnappingRef.current) return;

      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }

      // Check for snap after 180ms of scroll inactivity
      snapTimeoutRef.current = setTimeout(() => {
        snapTo10PercentSection(e.direction || (e.velocity > 0 ? 1 : -1));
      }, 180);
    };

    const snapTo10PercentSection = (dir) => {
      if (isSnappingRef.current) return;

      const sections = getSections();
      const viewportHeight = window.innerHeight;
      let targetSection = null;

      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        const rect = sec.getBoundingClientRect();

        if (dir >= 0) {
          // Scrolling down: section has entered at least 10% from bottom (top <= 90% of screen)
          if (rect.top > 20 && rect.top <= viewportHeight * 0.9) {
            targetSection = sec;
            break;
          }
        } else {
          // Scrolling up: section bottom is at least 10% into view (bottom >= 10% of screen)
          if (rect.bottom >= viewportHeight * 0.1 && rect.bottom < viewportHeight - 20) {
            targetSection = sec;
            break;
          }
        }
      }

      if (targetSection) {
        isSnappingRef.current = true;
        lenis.scrollTo(targetSection, {
          duration: 1.1,
          easing: (t) => 1 - Math.pow(1 - t, 4),
          onComplete: () => {
            isSnappingRef.current = false;
          }
        });
      }
    };

    lenis.on('scroll', handleScroll);

    return () => {
      cancelAnimationFrame(rafId);
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
}
