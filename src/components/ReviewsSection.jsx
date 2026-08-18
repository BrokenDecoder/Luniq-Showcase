import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { reviews } from '../data/content';

// Unique randomized ingress trajectories and minimizing vectors for each review card
const TRAJECTORIES = [
  { startX: -95, startY: -65, startRot: -4.5, endX: 20, endY: 40, endRot: 2.5 },
  { startX: 105, startY: 75, startRot: 4.0, endX: -20, endY: -40, endRot: -2.0 },
  { startX: 90, startY: -70, startRot: -3.5, endX: 15, endY: 35, endRot: 2.0 },
  { startX: -100, startY: 80, startRot: 5.0, endX: 0, endY: -30, endRot: -1.5 }
];

export default function ReviewsSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.6
  });

  return (
    <section ref={containerRef} className="reviews-scroll-track" id="reviews">
      <div className="reviews-sticky-stage">
        {/* Ambient atmospheric aura (clean landing aesthetic) */}
        <div className="reviews-glow" aria-hidden="true" />

        <div className="reviews-stage-center">
          {reviews.map((review, index) => (
            <ReviewCard
              key={review.handle}
              review={review}
              index={index}
              total={reviews.length}
              progress={smoothProgress}
            />
          ))}
        </div>

        {/* Scroll Progress Indicators */}
        <div className="reviews-indicators" aria-hidden="true">
          {reviews.map((_, i) => (
            <IndicatorDot
              key={i}
              index={i}
              total={reviews.length}
              progress={smoothProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review, index, total, progress }) {
  const traj = TRAJECTORIES[index % TRAJECTORIES.length];

  // Compute normalized interval for this card in the scroll progression
  const cardStart = index / total;
  const cardPeak = (index + 0.5) / total;
  const cardEnd = (index + 1) / total;

  const leadIn = Math.max(0, cardStart - 0.1);
  const leadOut = Math.min(1, cardEnd + 0.1);

  // Arrive from unique randomized angle, lock in center, minimize/suck down on exit
  const x = useTransform(
    progress,
    [leadIn, cardStart, cardPeak, cardEnd, leadOut],
    [traj.startX, 0, 0, 0, traj.endX]
  );

  const y = useTransform(
    progress,
    [leadIn, cardStart, cardPeak, cardEnd, leadOut],
    [traj.startY, 0, 0, 0, traj.endY]
  );

  const rotate = useTransform(
    progress,
    [leadIn, cardStart, cardPeak, cardEnd, leadOut],
    [traj.startRot, 0, 0, 0, traj.endRot]
  );

  // Ingress zooms in from 0.76, locks at 1.0, minimize shrinks down to 0.68 into depth
  const scale = useTransform(
    progress,
    [leadIn, cardStart, cardPeak, cardEnd, leadOut],
    [0.76, 1, 1, 1, 0.68]
  );

  const opacity = useTransform(
    progress,
    [Math.max(0, cardStart - 0.08), cardStart, cardPeak, cardEnd, Math.min(1, cardEnd + 0.08)],
    [0, 1, 1, 1, 0]
  );

  const blurVal = useTransform(
    progress,
    [leadIn, cardStart, cardPeak, cardEnd, leadOut],
    [16, 0, 0, 0, 16]
  );

  const filter = useTransform(blurVal, v => `blur(${v}px)`);
  const pointerEvents = useTransform(opacity, v => (v > 0.5 ? 'auto' : 'none'));

  return (
    <motion.div
      className="review-card glass-panel"
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        filter,
        pointerEvents
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <div className="review-top">
        <div className="review-user">
          <img
            src={review.avatar}
            alt={review.author}
            className="review-avatar"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="review-user-info">
            <strong>{review.author}</strong>
            <span>{review.handle} · {review.tag}</span>
          </div>
        </div>

        <div className="review-badge-wrap">
          <span className="review-platform-badge">{review.platform}</span>
        </div>
      </div>

      <div className="review-quote-wrap">
        <Quote size={24} className="review-quote-icon" aria-hidden="true" />
        <p className="review-quote">&ldquo;{review.quote}&rdquo;</p>
      </div>

      <div className="review-bottom">
        <div className="review-stars">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} size={14} fill="#eb5a37" color="#eb5a37" />
          ))}
        </div>
        <span className="review-highlight">{review.highlight}</span>
      </div>
    </motion.div>
  );
}

function IndicatorDot({ index, total, progress }) {
  const start = index / total;
  const end = (index + 1) / total;

  const activeOpacity = useTransform(progress, [start, (start + end) / 2, end], [0.3, 1, 0.3]);
  const activeWidth = useTransform(progress, [start, (start + end) / 2, end], [8, 28, 8]);
  const activeBg = useTransform(
    progress,
    [start, (start + end) / 2, end],
    ['rgba(255,255,255,0.2)', '#eb5a37', 'rgba(255,255,255,0.2)']
  );

  return (
    <motion.div
      className="review-indicator-dash"
      style={{
        opacity: activeOpacity,
        width: activeWidth,
        backgroundColor: activeBg
      }}
    />
  );
}
