import React from 'react';
import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export default function PlayerMock() {
  const cards = [
    { grad: 'linear-gradient(135deg, #1a2740, #0077f9)', title: 'Late Night Drive', sub: 'Playlist' },
    { grad: 'linear-gradient(135deg, #2a1f3d, #6f42c1)', title: 'Deep Focus', sub: 'Made for you' },
    { grad: 'linear-gradient(135deg, #123024, #1ed760)', title: 'Fresh Finds', sub: 'Weekly mix' },
    { grad: 'linear-gradient(135deg, #3a1f2a, #ff6b6b)', title: 'On Repeat', sub: 'Your top tracks' },
  ];

  return (
    <div className="player-mock glass-panel">
      <div className="mock-topbar">
        <span className="mock-brand">
          <img src="/luniq-logo.png" alt="" />
          Luniq Music
        </span>
        <span className="mock-dots"><i /><i /><i /></span>
      </div>
      <div className="mock-body">
        <aside className="mock-sidebar">
          <img className="mock-side-logo" src="/luniq-logo.png" alt="" />
          <span className="mock-nav-item active" />
          <span className="mock-nav-item" />
          <span className="mock-nav-item" />
          <span className="mock-side-fill" />
          <span className="mock-nav-item small" />
        </aside>
        <div className="mock-content">
          <div className="mock-greeting">Good evening</div>
          <div className="mock-grid">
            {cards.map((c) => (
              <div className="mock-card" key={c.title}>
                <span className="mock-art" style={{ background: c.grad }}>
                  <span className="mock-play"><Play size={13} fill="currentColor" /></span>
                </span>
                <div className="mock-card-meta">
                  <strong>{c.title}</strong>
                  <span>{c.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mock-player">
        <span className="mock-now-art" />
        <div className="mock-now-info">
          <strong>Midnight Radio</strong>
          <span>Studio Sessions</span>
        </div>
        <div className="mock-controls">
          <button className="mock-ctrl-btn" aria-label="Previous track"><SkipBack size={15} /></button>
          <button className="mock-pp" aria-label="Play / Pause"><Pause size={15} fill="currentColor" /></button>
          <button className="mock-ctrl-btn" aria-label="Next track"><SkipForward size={15} /></button>
        </div>
        <div className="mock-progress"><span /></div>
        <Volume2 size={15} className="mock-vol" />
      </div>
    </div>
  );
}
