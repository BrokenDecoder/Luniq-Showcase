import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useSpring } from 'framer-motion';

import Background from './components/Background';
import ScrollWheelNav from './components/ScrollWheelNav';
import Hero from './components/Hero';
import ShowcaseSection from './components/ShowcaseSection';
import FeaturesSection from './components/FeaturesSection';
import DetailsSection from './components/DetailsSection';
import DownloadSection from './components/DownloadSection';
import CommunitySection from './components/CommunitySection';
import ScrollVideoSection from './components/ScrollVideoSection';

import useJellyScroll from './hooks/useJellyScroll';

import './styles.css';

function App() {
  useJellyScroll();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <div className="app-shell">
      <Background />
      <motion.div className="scroll-progress" style={{ scaleX }} />

      <ScrollWheelNav />

      <main>
        <Hero scrollYProgress={scrollYProgress} />
        <ShowcaseSection />
        <FeaturesSection />
        <DetailsSection />
        <DownloadSection />
        <CommunitySection />
        <ScrollVideoSection />
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
