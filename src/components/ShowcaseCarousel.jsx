import React from 'react';
import DepthCarousel from '../DepthCarousel';

export default function ShowcaseCarousel() {
  const slides = [
    { image: '/carousel/1.png', alt: 'Luniq Music Player - Interface 1' },
    { image: '/carousel/2.png', alt: 'Luniq Music Player - Interface 2' },
    { image: '/carousel/3.png', alt: 'Luniq Music Player - Interface 3' },
    { image: '/carousel/4.png', alt: 'Luniq Music Player - Interface 4' },
    { image: '/carousel/5.png', alt: 'Luniq Music Player - Interface 5' }
  ];

  return (
    <div className="showcase-carousel-wrapper" style={{ width: '100%', height: '680px', position: 'relative' }}>
      <DepthCarousel
        items={slides}
        cardWidth={1200}
        cardHeight={646}
        radius={0}
        depth={240}
        spread={140}
        tilt={18}
        tiltDirection="right"
        perspective={1700}
        visibleCards={3}
        falloff={0.25}
        blur={5}
        autoplay={true}
        autoplayDelay={4000}
        loop={true}
        showControls={false}
        showIndicators={false}
      />
    </div>
  );
}
