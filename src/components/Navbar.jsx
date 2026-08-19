import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GitFork as Github, Menu, X } from 'lucide-react';
import SpecularButton from './SpecularButton';
import { LINKS, ease } from '../data/content';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="navbar">
        <a className="brand" href="#top" aria-label="Luniq home">
          <img className="brand-mark" src="/luniq-logo.png" alt="Luniq Logo" />
          <span>Luniq</span>
        </a>
        <nav className="desktop-nav">
          <a href="#features">Features</a>
          <a href="#showcase">Preview</a>
          <a href="#download">Download</a>
          <a href="#community">Community</a>
        </nav>
        <div className="nav-actions">
          <span className="version-pill">v1.0.6</span>
          <SpecularButton
            href={LINKS.github}
            target="_blank"
            rel="noreferrer"
            variant="quiet"
            size="sm"
            radius={12}
            baseColor="#606775"
          >
            <Github size={14} /> <span>GitHub</span>
          </SpecularButton>
          <button
            className="icon-button menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease }}
          >
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#showcase" onClick={closeMenu}>Preview</a>
            <a href="#download" onClick={closeMenu}>Download</a>
            <a href="#community" onClick={closeMenu}>Community</a>
            <a href={LINKS.github} target="_blank" rel="noreferrer" onClick={closeMenu}>GitHub</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
