import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollVideoSection.css';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;
const FRAME_PATH = (index) => `/frames/frame-${String(index + 1).padStart(3, '0')}.webp`;

export default function ScrollVideoSection() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // 1. Entry scroll progression as the section scrolls into view from Community
  const { scrollYProgress: entryProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start']
  });

  const smoothEntryProgress = useSpring(entryProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.5
  });

  // Stage smoothly materializes as community card completes its exit
  const stageOpacity = useTransform(smoothEntryProgress, [0.15, 0.95], [0, 1]);
  const stageY = useTransform(smoothEntryProgress, [0.15, 1], [60, 0]);
  const stageBlur = useTransform(smoothEntryProgress, [0.15, 0.9], [12, 0]);
  const stageFilter = useTransform(stageBlur, (v) => `blur(${v}px)`);

  // 2. Main Framer motion scroll progression for scrubbing frames 0 -> 240
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3
  });

  // Render a specific frame onto the transparent canvas
  const renderFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
    const img = imagesRef.current[clampedIndex];

    if (!img || !img.complete || img.naturalWidth === 0) {
      // If exact frame not ready yet, draw closest available frame
      for (let offset = 1; offset < 15; offset++) {
        const prev = imagesRef.current[clampedIndex - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          drawScaledImage(ctx, canvas, prev, clampedIndex - offset);
          break;
        }
        const next = imagesRef.current[clampedIndex + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          drawScaledImage(ctx, canvas, next, clampedIndex + offset);
          break;
        }
      }
      return;
    }

    drawScaledImage(ctx, canvas, img, clampedIndex);
    currentFrameRef.current = clampedIndex;
  }, []);

  const drawScaledImage = (ctx, canvas, img, frameIndex) => {
    const w = canvas.width;
    const h = canvas.height;

    // Clear with 100% true transparent background
    ctx.clearRect(0, 0, w, h);

    // Compute aspect ratios
    const imgAspect = img.naturalWidth / img.naturalHeight || (1920 / 1080);
    const canvasAspect = w / h;

    let drawW, drawH, drawX, drawY;

    if (canvasAspect > imgAspect) {
      drawH = h;
      drawW = h * imgAspect;
      drawX = (w - drawW) / 2;
      drawY = 0;
    } else {
      drawW = w;
      drawH = w / imgAspect;
      drawX = 0;
      drawY = (h - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // When L locks in (frame >= 195), smoothly animate "uniq" on the right to complete "Luniq"
    if (frameIndex >= 195) {
      // Progress from 0 to 1 between frame 195 and 218
      const revealProgress = Math.min(1, Math.max(0, (frameIndex - 195) / 23));
      const scaleFactor = drawW / 1920;

      // Coordinate mapping from 1920x1080 (moved up by ~14px to align baseline perfectly with L base):
      const fontSize = 236 * scaleFactor;
      const textX = drawX + (744 + (1 - revealProgress) * 35) * scaleFactor;
      const textY = drawY + 617 * scaleFactor;

      ctx.save();
      ctx.globalAlpha = Math.min(1, Math.max(0, revealProgress * 1.1));

      // Font styling matching Luniq branding (Syne luxury geometric display)
      ctx.font = `800 ${fontSize}px "Syne", "Space Grotesk", "Outfit", sans-serif`;
      ctx.textBaseline = 'alphabetic';

      // Metallic sheen gradient matching the L emblem
      const grad = ctx.createLinearGradient(0, drawY + 384 * scaleFactor, 0, drawY + 617 * scaleFactor);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#e2e8f0');
      grad.addColorStop(1, '#94a3b8');

      ctx.fillStyle = grad;
      ctx.fillText('uniq', textX, textY);
      ctx.restore();
    }
  };

  // Resize canvas according to container dimensions and devicePixelRatio
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  // Ensure font is ready and redraw
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        renderFrame(currentFrameRef.current);
      });
    }
  }, [renderFrame]);

  // Preload frame images progressively
  useEffect(() => {
    let isCancelled = false;
    imagesRef.current = new Array(TOTAL_FRAMES);

    let count = 0;

    // Load initial 25 critical frames first for instant responsiveness
    const preloadBatch = (start, end) => {
      const promises = [];
      for (let i = start; i < end && i < TOTAL_FRAMES; i++) {
        promises.push(
          new Promise((resolve) => {
            const img = new Image();
            img.src = FRAME_PATH(i);
            img.onload = () => {
              if (isCancelled) return resolve();
              imagesRef.current[i] = img;
              count++;
              setLoadedCount(count);
              if (i === 0) {
                renderFrame(0);
              }
              resolve();
            };
            img.onerror = () => resolve();
          })
        );
      }
      return Promise.all(promises);
    };

    const loadAll = async () => {
      // Fast initial chunk
      await preloadBatch(0, 25);
      setIsReady(true);
      renderFrame(0);

      // Subsequent chunks in parallel batches of 32
      for (let i = 25; i < TOTAL_FRAMES; i += 32) {
        if (isCancelled) break;
        await preloadBatch(i, i + 32);
      }
    };

    loadAll();
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      isCancelled = true;
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, renderFrame]);

  // Hook smooth scroll progress directly to canvas frame updates
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(latest * (TOTAL_FRAMES - 1))));
      renderFrame(targetFrame);
    });

    return () => unsubscribe();
  }, [smoothProgress, renderFrame]);

  return (
    <section ref={containerRef} className="scroll-video-track" id="experience">
      <motion.div
        className="scroll-video-sticky"
        style={{
          opacity: stageOpacity,
          y: stageY,
          filter: stageFilter
        }}
      >
        <canvas ref={canvasRef} className="scroll-video-canvas" />
      </motion.div>
    </section>
  );
}
