import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.08,
  baseRotation = 3,
  blurStrength = 8,
  containerClassName = '',
  textClassName = '',
  scrollStart = 'top bottom-=15%',
  scrollEnd = 'bottom center+=10%'
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
    const wordElements = el.querySelectorAll('.word');
    if (!wordElements.length) return;

    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      // Container subtle tilt alignment
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: scrollStart,
            end: scrollEnd,
            scrub: 1
          }
        }
      );

      // Word-by-word reveal (Bi-directional scrub: forward and reverse)
      gsap.fromTo(
        wordElements,
        {
          opacity: baseOpacity,
          filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
          y: 24,
          willChange: 'opacity, filter, transform'
        },
        {
          ease: 'power2.out',
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          stagger: 0.06,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: scrollStart,
            end: scrollEnd,
            scrub: 1
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, scrollStart, scrollEnd, blurStrength]);

  return (
    <div ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </div>
  );
};

export default ScrollReveal;
