import React from 'react';
import { LINKS } from '../data/content';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <a className="brand" href="#top">
          <img className="brand-mark" src="/luniq-logo.png" alt="Luniq Logo" />
          <span>Luniq</span>
        </a>
        <p>your music, reimagined.</p>
        <nav>
          <a href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={LINKS.releases} target="_blank" rel="noreferrer">Releases</a>
          <a href={LINKS.discord} target="_blank" rel="noreferrer">Discord</a>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Luniq · Made by Saraans</span>
        <span>Not affiliated with Spotify</span>
      </div>
    </footer>
  );
}
