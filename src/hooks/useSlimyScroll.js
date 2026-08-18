import { useEffect, useRef } from 'react';

/**
 * SlimyScrollManager:
 * Provides fluid, natural scrolling with a 10% magnetic auto-snap
 * powered by a custom smooth cubic/quartic deceleration curve.
 */
export default function useSlimyScroll() {
  const isSnappingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const rafIdRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const scrollDirectionRef = useRef('down');

  useEffect(() => {
    // List of magnetic full-page section targets
    const getSections = () => {
      const sectionIds = ['top', 'showcase', 'features', 'details', 'download', 'community', 'reviews'];
      return sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);
    };

    // Smooth slimy glide animation using RAF
    const smoothGlideTo = (targetY, duration = 900) => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      const startY = window.scrollY;
      const distance = targetY - startY;

      // If already at or very close to target, skip
      if (Math.abs(distance) < 5) {
        isSnappingRef.current = false;
        return;
      }

      isSnappingRef.current = true;
      const startTime = performance.now();

      // Quartic ease-out for a rich, elastic, slimy deceleration
      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const animateScroll = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeVal = easeOutQuart(progress);

        window.scrollTo(0, startY + distance * easeVal);

        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(animateScroll);
        } else {
          window.scrollTo(0, targetY);
          setTimeout(() => {
            isSnappingRef.current = false;
          }, 60);
        }
      };

      rafIdRef.current = requestAnimationFrame(animateScroll);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollDirectionRef.current = currentScrollY > lastScrollYRef.current ? 'down' : 'up';
      lastScrollYRef.current = currentScrollY;

      if (isSnappingRef.current) return;

      // Clear previous timer while user is actively scrolling
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Detect when user stops scrolling / leaves input (160ms pause)
      scrollTimeoutRef.current = setTimeout(() => {
        snapToClosestSection();
      }, 160);
    };

    const snapToClosestSection = () => {
      if (isSnappingRef.current) return;

      const sections = getSections();
      const viewportHeight = window.innerHeight;
      const direction = scrollDirectionRef.current;

      let targetSection = null;

      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        const rect = sec.getBoundingClientRect();

        // 10% Threshold Check:
        if (direction === 'down') {
          // If scrolling down: section top is within 90% of viewport height (>= 10% has entered)
          if (rect.top > 0 && rect.top <= viewportHeight * 0.9) {
            targetSection = sec;
            break;
          }
        } else {
          // If scrolling up: section bottom has entered >= 10% into view
          if (rect.bottom >= viewportHeight * 0.1 && rect.bottom < viewportHeight) {
            targetSection = sec;
            break;
          }
        }
      }

      if (targetSection) {
        const targetOffsetTop = targetSection.getBoundingClientRect().top + window.scrollY;
        smoothGlideTo(targetOffsetTop, 950);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);
}
