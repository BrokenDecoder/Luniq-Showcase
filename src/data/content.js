import {
  AlignLeft, ShieldCheck, Palette, SlidersHorizontal,
  Download, Code2, Gauge, Moon, Monitor
} from 'lucide-react';

export const LINKS = {
  github: 'https://github.com/saraansx/Luniq-Music',
  releases: 'https://github.com/saraansx/Luniq-Music/releases',
  discord: 'https://discord.gg/TardrVJT9N',
};

export const ease = [0.23, 1, 0.32, 1];

export const features = [
  {
    icon: AlignLeft,
    label: 'Lyrics',
    title: 'Lyrics, in sync.',
    copy: 'Time-synced lyrics pulled from multiple providers and lined up beside the music — so you never lose the words.',
  },
  {
    icon: ShieldCheck,
    label: 'Ad-free',
    title: 'No ads. Ever.',
    copy: "A quiet, distraction-free player that leans on Spotify's metadata. Nothing sits between you and the song.",
  },
  {
    icon: Palette,
    label: 'Themes',
    title: 'Make it yours.',
    copy: 'Accent colors, themes, and appearance settings. Shape every detail until the player actually feels like yours.',
  },
  {
    icon: SlidersHorizontal,
    label: 'Controls',
    title: 'Built for listening.',
    copy: 'An equalizer, playback speed, sleep timer, and a queue that stays out of the way when you just want to listen.',
  },
];

export const details = [
  { icon: Download, title: 'Downloads', copy: 'Keep the tracks you love close by.' },
  { icon: Code2, title: 'Open source', copy: 'GPL-3.0. Read it, fork it, make it better.' },
  { icon: Gauge, title: 'Lightweight', copy: 'Fast to open. Light on your machine.' },
  { icon: Moon, title: 'Easy on the eyes', copy: 'A dark, glassy interface made for late nights.' },
];

export const platforms = [
  { icon: Monitor, name: 'Windows', note: '.exe installer', ext: '.exe' },
  { icon: Monitor, name: 'macOS', note: 'Apple silicon & Intel', ext: '.dmg' },
  { icon: Monitor, name: 'Linux', note: 'AppImage & tar.gz', ext: '.AppImage' },
];

export const reviews = [
  {
    author: 'Elena Rostova',
    handle: '@elena_dsp',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    initials: 'ER',
    platform: 'macOS Sonoma',
    tag: 'Audio Engineer',
    quote: 'The cleanest player I have ever had on my workstation. No bloated UI, instantaneous launch, and synced lyrics are immaculate.',
    rating: 5,
    highlight: 'Instantaneous & lightweight'
  },
  {
    author: 'Marcus Vance',
    handle: '@marcus_v',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    initials: 'MV',
    platform: 'Arch Linux',
    tag: 'OSS Contributor',
    quote: 'Finally an open-source Spotify client that respects system resources. The dark glassmorphic design looks stunning with my desktop setup.',
    rating: 5,
    highlight: 'Respects system resources'
  },
  {
    author: 'Aria Chen',
    handle: '@aria_beats',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    initials: 'AC',
    platform: 'Windows 11',
    tag: 'Music Producer',
    quote: 'The equalizer precision and zero-ad stream makes this my daily driver for long mastering sessions. It just gets out of the way.',
    rating: 5,
    highlight: 'Zero distractions'
  },
  {
    author: 'Devon Thorne',
    handle: '@devon_t',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    initials: 'DT',
    platform: 'Fedora 40',
    tag: 'Audiophile',
    quote: 'Luniq replaced the official client permanently on day one. The custom accent themes and fluid animations are on another level.',
    rating: 5,
    highlight: 'Next-gen aesthetics'
  }
];
