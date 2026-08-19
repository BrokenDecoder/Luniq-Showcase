import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { GitFork as Github, MessageSquare as Discord, Terminal, Cpu, Palette, Globe, Mail, ExternalLink, Sparkles } from 'lucide-react';
import ScrollFloat from './ScrollFloat';
import GlareCard from './GlareCard';
import SpecularButton from './SpecularButton';
import './TeamSection.css';

const MEMBERS = [
  {
    id: '01',
    roleTag: '01 / CORE DEVELOPER',
    alias: 'saraansx /',
    mainName: 'Saraans .',
    role: 'Core Developer',
    works: [
      'Full-stack desktop features & Luniq Music core modules',
      'Core performance tuning & cross-platform driver compatibility',
      'Community-driven extension workflows and ecosystem toolchains'
    ],
    socialsOther: [
      { label: 'iCloud Mail', href: 'mailto:saraans.bali@icloud.com', icon: Mail },
      { label: 'India', href: '#', icon: Globe }
    ],
    name: 'Saraans .',
    bio: '18 . yo coder fixing one bug, creating two. Core contributor to Luniq Music.',
    avatar: 'https://github.com/saraansx.png',
    icon: Terminal,
    layout: 'text-left', // Text on Left, Card on Right
    socials: { github: 'https://github.com/saraansx', discord: 'https://discord.gg/TardrVJT9N' }
  },
  {
    id: '02',
    roleTag: '02 / LEAD ARCHITECT',
    alias: 'xAshu /',
    mainName: 'BrokenDecoder',
    role: 'Lead Architect',
    works: [
      'Core low-latency audio streaming engine & WebGL shader ecosystem',
      'Luniq Music theme architecture & MoltenMetal fluid reactive background',
      '120 FPS critically-damped spring physics for tactile desktop interactions'
    ],
    socialsOther: [
      { label: 'X / Twitter', href: 'https://x.com', icon: Globe },
      { label: 'Portfolio', href: 'https://github.com/BrokenDecoder', icon: ExternalLink },
      { label: 'Contact', href: 'mailto:contact@luniq.app', icon: Mail }
    ],
    name: 'BrokenDecoder',
    bio: 'Pioneering ultra-low latency audio engines, fluid reactive shaders, and Luniq Music architecture.',
    avatar: 'https://github.com/BrokenDecoder.png',
    icon: Cpu,
    layout: 'card-left', // Card on Left, Text on Right
    socials: { github: 'https://github.com/BrokenDecoder', discord: 'https://discord.gg/TardrVJT9N' }
  },
  {
    id: '03',
    roleTag: '03 / MOTION & DESIGN',
    alias: 'Core Contributor /',
    mainName: 'Team Member 03',
    role: 'Design Systems Lead',
    works: [
      '120 FPS kinetic UI shaders and fluid glassmorphism design tokens',
      'Micro-interaction physics and tactile feedback architecture',
      'Multi-theme customizer engines and typography design systems'
    ],
    socialsOther: [
      { label: 'Dribbble / X', href: '#', icon: Globe },
      { label: 'Portfolio', href: '#', icon: ExternalLink }
    ],
    name: 'Team Member 03',
    bio: 'Crafting tactile interactions, responsive physics, and state-of-the-art visual design systems.',
    icon: Palette,
    layout: 'text-left', // Text on Left, Card on Right
    socials: { github: '#', discord: '#' }
  }
];

export default function TeamSection() {
  const headlinePageRef = useRef(null);

  return (
    <div className="team-wrapper" id="team">
      {/* 1. Full-Screen Centered Headline Page: "Meet The Team" */}
      <section ref={headlinePageRef} className="section team-headline-page">
        <div className="team-headline-stage">
          <span className="section-tag" style={{ marginBottom: '24px' }}>04 / The Team</span>
          <ScrollFloat
            animationDuration={1.2}
            ease="back.out(2)"
            scrollStart="top 85%"
            scrollEnd="center 45%"
            stagger={0.035}
            textClassName="team-hero-title"
          >
            Meet The Team
          </ScrollFloat>
        </div>
      </section>

      {/* 2. Three Full-Page Alternating Member Spotlights */}
      {MEMBERS.map((member, index) => (
        <MemberFullPage key={member.id} member={member} index={index} />
      ))}
    </div>
  );
}

function MemberFullPage({ member, index }) {
  const pageRef = useRef(null);
  const Icon = member.icon;
  const isTextLeft = member.layout === 'text-left';

  // Smooth scroll progression for this individual 100vh page
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ['start end', 'end start']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.6
  });

  // Inward horizontal slide and fade for Text container
  const textX = useTransform(
    smoothProgress,
    [0.1, 0.42, 0.65, 0.95],
    isTextLeft ? [-80, 0, 0, -40] : [80, 0, 0, 40]
  );
  const textOpacity = useTransform(smoothProgress, [0.1, 0.38, 0.68, 0.95], [0, 1, 1, 0]);
  const textBlur = useTransform(smoothProgress, [0.1, 0.38, 0.68, 0.95], [12, 0, 0, 12]);
  const textFilter = useTransform(textBlur, (v) => `blur(${v}px)`);

  // Inward horizontal slide and fade for Card container
  const cardX = useTransform(
    smoothProgress,
    [0.1, 0.42, 0.65, 0.95],
    isTextLeft ? [80, 0, 0, 40] : [-80, 0, 0, -40]
  );
  const cardOpacity = useTransform(smoothProgress, [0.1, 0.38, 0.68, 0.95], [0, 1, 1, 0]);
  const cardScale = useTransform(smoothProgress, [0.1, 0.42, 0.65, 0.95], [0.92, 1, 1, 0.94]);
  const cardBlur = useTransform(smoothProgress, [0.1, 0.38, 0.68, 0.95], [12, 0, 0, 12]);
  const cardFilter = useTransform(cardBlur, (v) => `blur(${v}px)`);

  return (
    <section ref={pageRef} className="section team-member-page" id={`team-member-${member.id}`}>
      <div className={`team-member-container ${isTextLeft ? 'layout-text-left' : 'layout-card-left'}`}>
        
        {/* Text Block */}
        <motion.div
          className="team-member-text-col"
          style={{
            x: textX,
            opacity: textOpacity,
            filter: textFilter
          }}
        >
          <span className="section-tag" style={{ marginBottom: '14px' }}>{member.roleTag}</span>
          
          {/* Subdued alias above prominent main name */}
          <div className="member-name-heading-group">
            {member.alias && <span className="member-alias-sub">{member.alias}</span>}
            <h2 className="member-main-name">{member.mainName}</h2>
          </div>

          {/* Works & Contributions in Clean Structured Text */}
          <div className="member-works-block">
            <span className="member-works-label">Works &amp; Architecture</span>
            <ul className="member-works-list">
              {member.works.map((item, idx) => (
                <li key={idx} className="member-works-item">
                  <span className="works-bullet" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials Other Than GitHub/Discord */}
          <div className="member-other-socials">
            <span className="member-socials-label">Connect</span>
            <div className="member-socials-links">
              {member.socialsOther.map((soc, idx) => {
                const SocIcon = soc.icon;
                return (
                  <a
                    key={idx}
                    href={soc.href}
                    target="_blank"
                    rel="noreferrer"
                    className="member-social-pill"
                  >
                    <SocIcon size={14} />
                    <span>{soc.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Card Block */}
        <motion.div
          className="team-member-card-col"
          style={{
            x: cardX,
            scale: cardScale,
            opacity: cardOpacity,
            filter: cardFilter
          }}
        >
          <GlareCard className="member-spotlight-card glass-panel" radius={20}>
            <div className="spotlight-card-header">
              <div className="spotlight-avatar-placeholder">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="spotlight-avatar-img"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <Icon size={28} strokeWidth={1.8} />
                )}
              </div>
              <span className="spotlight-role-pill">{member.role}</span>
            </div>

            <div className="spotlight-card-body">
              <h3 className="spotlight-member-name">{member.name}</h3>
              <span className="spotlight-member-role">{member.roleTag}</span>
              <p className="spotlight-member-bio">{member.bio}</p>
            </div>

            <div className="spotlight-card-footer">
              <SpecularButton
                href={member.socials.github}
                target="_blank"
                rel="noreferrer"
                variant="quiet"
                size="sm"
                radius={12}
              >
                <Github size={13} /> GitHub
              </SpecularButton>
              <SpecularButton
                href={member.socials.discord}
                target="_blank"
                rel="noreferrer"
                variant="quiet"
                size="sm"
                radius={12}
              >
                <Discord size={13} /> Discord
              </SpecularButton>
            </div>
          </GlareCard>
        </motion.div>

      </div>
    </section>
  );
}
