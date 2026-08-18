import React, { useState, useEffect, useRef } from 'react';
import { GitFork as Github, MessageCircle } from 'lucide-react';
import OptionWheel from '../OptionWheel';
import { LINKS } from '../data/content';

const NAV_ITEMS = [
  'Home',
  'Features',
  'Preview',
  'Details',
  'Download',
  'Community'
];

const TARGET_MAP = {
  home: 'top',
  features: 'features',
  preview: 'showcase',
  details: 'details',
  download: 'download',
  community: 'community'
};

export default function SidebarNav() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const handleNavChange = (idx, label) => {
    setSelectedIndex(idx);
    const key = label.toLowerCase();
    const targetId = TARGET_MAP[key];
    if (targetId) {
      isUserScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      
      const el = document.getElementById(targetId) || document.querySelector(`.${targetId}-section`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 1000);
    }
  };

  // Sync active item based on scroll position
  useEffect(() => {
    const sectionIds = ['top', 'features', 'showcase', 'download', 'community'];
    const onScroll = () => {
      if (isUserScrollingRef.current) return;
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          const itemIndex = NAV_ITEMS.findIndex(
            item => TARGET_MAP[item.toLowerCase()] === id
          );
          if (itemIndex !== -1 && itemIndex !== selectedIndex) {
            setSelectedIndex(itemIndex);
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [selectedIndex]);

  return (
    <aside className="sidebar-nav-container" aria-label="Main Navigation">
      <div className="sidebar-nav-inner glass-panel">
        <a className="sidebar-brand" href="#top" aria-label="Luniq home">
          <img className="sidebar-brand-mark" src="/luniq-logo.png" alt="Luniq Logo" />
          <span className="sidebar-brand-text">Luniq</span>
        </a>

        <div className="sidebar-wheel-wrapper">
          <OptionWheel
            items={NAV_ITEMS}
            defaultSelected={selectedIndex}
            onChange={handleNavChange}
            side="left"
            fontSize={1.15}
            spacing={1.75}
            curve={0.7}
            tilt={4.5}
            blur={1.2}
            fade={0.35}
            minOpacity={0.15}
            smoothing={180}
            inset={20}
            textColor="#8e9bb0"
            activeColor="#ffffff"
            draggable
          />
        </div>

        <div className="sidebar-footer">
          <span className="sidebar-version">v1.0.6</span>
          <div className="sidebar-socials">
            <a
              className="sidebar-icon-link"
              href={LINKS.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Repository"
            >
              <Github size={16} />
            </a>
            <a
              className="sidebar-icon-link"
              href={LINKS.discord}
              target="_blank"
              rel="noreferrer"
              aria-label="Discord Server"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
