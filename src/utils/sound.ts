// Web Audio / HTML5 Audio Sound Manager for Portfolio Debashree Mal
// Powered by Kenney CC0 Public Domain Audio Library & Curated Open Audio Archives

export type SoundEffect =
  // Tactile Micro Interactions
  | 'click'
  | 'pop'
  | 'folderOpen'
  | 'rocket'
  | 'rocketLaunch'
  | 'rocketAero'
  | 'rocketArcade'
  | 'rocketLaser'
  | 'rocketCrystal'
  | 'rocketHydraulic'
  | 'rocketTurbine'
  | 'stickerStamp'
  | 'glassTap'
  | 'softTap'
  // Scroll Timeline Transitions
  | 'bookOpen'
  | 'pageFlip'
  | 'bookClose'
  | 'cardFlip'
  | 'aboutBloom';

export interface SoundMetadata {
  id: SoundEffect;
  name: string;
  category: 'scroll' | 'interaction';
  description: string;
  file: string;
  volume: number;
}

export interface ClickSoundOption {
  id: string;
  name: string;
  description: string;
  file: string;
  volume: number;
}

export const CLICK_OPTIONS: ClickSoundOption[] = [
  {
    id: 'mouse',
    name: 'Physical Mouse Switch (Active)',
    description: 'Real acoustic physical mouse button micro-switch',
    file: '/sounds/click-mouse.wav',
    volume: 0.55,
  },
  {
    id: 'pop',
    name: 'Organic Bubble Pop',
    description: 'Playful soft rounded bubble pop for cancel cross buttons',
    file: '/sounds/click-pop.wav',
    volume: 0.55,
  },
  {
    id: 'modern',
    name: 'Modern Snappy Tap',
    description: 'Clean, ultra-responsive UI tap (Kenney Interface)',
    file: '/sounds/click-modern.wav',
    volume: 0.5,
  },
  {
    id: 'haptic',
    name: 'iOS Haptic Micro-Tick',
    description: 'Subtle, crisp device tick like Apple Watch / iOS haptics',
    file: '/sounds/click-haptic.wav',
    volume: 0.5,
  },
  {
    id: 'glass',
    name: 'Glass Micro-Tap',
    description: 'High-precision, sleek futuristic glass click',
    file: '/sounds/click-glass.wav',
    volume: 0.5,
  },
  {
    id: 'sharp',
    name: 'Tactile Crisp Click',
    description: 'Distinct, sharp mechanical tactile tap',
    file: '/sounds/click-sharp.wav',
    volume: 0.45,
  },
  {
    id: 'soft',
    name: 'Muted Soft Tap',
    description: 'Low-frequency gentle tap, very calm and non-intrusive',
    file: '/sounds/click-soft.wav',
    volume: 0.5,
  },
  {
    id: 'toggle',
    name: 'Modern UI Toggle',
    description: 'Crisp mechanical UI toggle snap',
    file: '/sounds/click-toggle.wav',
    volume: 0.45,
  },
  {
    id: 'switch',
    name: 'Satisfying Switch Latch',
    description: 'Mechanical keyboard / physical toggle switch',
    file: '/sounds/click-switch.wav',
    volume: 0.45,
  },
];

let activeClickId = 'mouse';
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('portfolio_active_click');
    activeClickId = 'mouse';
  } catch { }
}

const clickListeners: Set<(id: string) => void> = new Set();
const defaultClickOption = CLICK_OPTIONS.find((o) => o.id === activeClickId) || CLICK_OPTIONS[0];

export const SOUND_CATALOG: SoundMetadata[] = [
  // Scroll Timeline
  {
    id: 'bookOpen',
    name: 'Book Spine Open',
    category: 'scroll',
    description: 'Authentic leather cover swing and spread opening',
    file: '/sounds/book-open.ogg',
    volume: 0.55,
  },
  {
    id: 'pageFlip',
    name: 'Book Spine Open',
    category: 'scroll',
    description: 'Authentic leather cover and book spine open sound',
    file: '/sounds/book-open.ogg',
    volume: 0.55,
  },
  {
    id: 'bookClose',
    name: 'Leather Book Shut',
    category: 'scroll',
    description: 'Heavy satisfying thud as the book cover and leaves swing shut',
    file: '/sounds/book-close.ogg',
    volume: 0.55,
  },
  {
    id: 'cardFlip',
    name: '3D Moment Card Flip',
    category: 'scroll',
    description: 'High-speed 360-degree card flight whoosh transitioning from Moments into Contact',
    file: '/sounds/card-flip.mp3',
    volume: 0.6,
  },
  {
    id: 'aboutBloom',
    name: 'Organic Bubble Pop',
    category: 'scroll',
    description: 'Crisp, playful organic bubble pop as elements surface into view on the About Me page',
    file: '/sounds/about-bloom.wav',
    volume: 0.55,
  },

  // Interactions
  {
    id: 'click',
    name: 'Physical Mouse Switch',
    category: 'interaction',
    description: 'Acoustic physical mouse micro-switch applied across website clicks & DEBASHREE MAL hover',
    file: defaultClickOption.file,
    volume: defaultClickOption.volume,
  },
  {
    id: 'pop',
    name: 'Organic Bubble Pop',
    category: 'interaction',
    description: 'Organic bubble pop for modal cancel cross buttons',
    file: '/sounds/click-pop.wav',
    volume: 0.55,
  },
  {
    id: 'stickerStamp',
    name: 'Sticker Stamp Snap',
    category: 'interaction',
    description: 'Crisp tactile snap triggered when clicking Email, LinkedIn, GitHub, or Send Message',
    file: '/sounds/sticker-stamp.wav',
    volume: 0.5,
  },
  {
    id: 'folderOpen',
    name: 'Portfolio Latch',
    category: 'interaction',
    description: 'Tactile latch unlock triggered exclusively when clicking/opening a particular sketch',
    file: '/sounds/switch3.wav',
    volume: 0.5,
  },
  {
    id: 'rocket',
    name: 'Thruster Whoosh',
    category: 'interaction',
    description: 'Cinematic rocket thruster ignition blast on Say Hello rocket click & centered sketch folder peek hover',
    file: '/sounds/rocket.wav',
    volume: 0.45,
  },
  {
    id: 'rocketLaunch',
    name: 'Sci-Fi Warp Glide (Active)',
    category: 'interaction',
    description: 'Crisp 2.5s futuristic ion rocket swoosh with ascending harmonic shimmer (zero heavy sub-bass)',
    file: '/sounds/rocket-warp.wav',
    volume: 0.55,
  },
  {
    id: 'rocketAero',
    name: 'Airy Wind & Chime',
    category: 'interaction',
    description: 'Breezy 2.3s aerodynamic soaring whoosh with delicate celestial chime (completely clear of bass)',
    file: '/sounds/rocket-aero.wav',
    volume: 0.55,
  },
  {
    id: 'rocketArcade',
    name: 'Playful Retro Rocket',
    category: 'interaction',
    description: 'Upbeat 2.0s melodic ascending slide whistle with star glitter',
    file: '/sounds/rocket-arcade.wav',
    volume: 0.55,
  },
  {
    id: 'rocketLaser',
    name: 'Cyber Laser Phaser',
    category: 'interaction',
    description: 'Sharp 2.2s electric sci-fi energy beam sweep with bright harmonic sparkle',
    file: '/sounds/rocket-laser.wav',
    volume: 0.52,
  },
  {
    id: 'rocketCrystal',
    name: 'Glass Crystal Chime Cascade',
    category: 'interaction',
    description: 'Magical 2.4s ascending 6-note crystalline glass harp chime cascade with gentle airy lift',
    file: '/sounds/rocket-crystal.wav',
    volume: 0.55,
  },
  {
    id: 'rocketHydraulic',
    name: 'Pneumatic Steam Launch',
    category: 'interaction',
    description: 'Tactile 2.2s mechanical latch click & pressurized steam release with metallic ring',
    file: '/sounds/rocket-hydraulic.wav',
    volume: 0.52,
  },
  {
    id: 'rocketTurbine',
    name: 'Supersonic Jet Turbine',
    category: 'interaction',
    description: 'Aerodynamic 2.4s whistling supersonic jet turbine flyby with smooth Doppler pan',
    file: '/sounds/rocket-turbine.wav',
    volume: 0.52,
  },
  {
    id: 'glassTap',
    name: 'Glass Micro-Tap',
    category: 'interaction',
    description: 'High-precision sleek glass micro-tap when the Open to Discuss card emerges',
    file: '/sounds/click-glass.wav',
    volume: 0.6,
  },
  {
    id: 'softTap',
    name: 'Muted Soft Tap',
    category: 'interaction',
    description: 'Low-frequency gentle tap played on each alphabet keystroke in Say Hello',
    file: '/sounds/click-soft.wav',
    volume: 0.5,
  },
];

const SOUND_CONFIG: Record<SoundEffect, { src: string; volume: number }> = SOUND_CATALOG.reduce(
  (acc, item) => {
    acc[item.id] = { src: item.file, volume: item.volume };
    return acc;
  },
  {} as Record<SoundEffect, { src: string; volume: number }>
);

// =========================================================================
// ZERO-LATENCY HARDWARE-ACCELERATED WEB AUDIO ENGINE
// =========================================================================
let audioCtx: AudioContext | null = null;
const audioBufferCache: Map<string, AudioBuffer> = new Map();
const bufferLoadingPromises: Map<string, Promise<AudioBuffer | null>> = new Map();

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      try {
        audioCtx = new AudioCtxClass();
      } catch { }
    }
  }
  return audioCtx;
}

// Pre-fetch & pre-decode audio files into zero-latency uncompressed AudioBuffers
export async function preloadAudioBuffer(url: string): Promise<AudioBuffer | null> {
  if (audioBufferCache.has(url)) {
    return audioBufferCache.get(url)!;
  }
  if (bufferLoadingPromises.has(url)) {
    return bufferLoadingPromises.get(url)!;
  }

  const promise = (async () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return null;
      const response = await fetch(url);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
      audioBufferCache.set(url, decodedBuffer);
      return decodedBuffer;
    } catch {
      return null;
    }
  })();

  bufferLoadingPromises.set(url, promise);
  return promise;
}

function preloadAllSounds() {
  if (typeof window === 'undefined') return;
  // Preload catalog sounds
  SOUND_CATALOG.forEach((item) => {
    preloadAudioBuffer(item.file);
  });
  // Preload click options
  CLICK_OPTIONS.forEach((item) => {
    preloadAudioBuffer(item.file);
  });
}

// Fallback HTMLAudioElement pool if Web Audio API decode is pending
const audioPool: Record<SoundEffect, HTMLAudioElement[]> = {} as Record<SoundEffect, HTMLAudioElement[]>;
const POOL_SIZE = 8;
let muted = true; // Strictly muted by default on every page load: user must click manually to turn on

// Ensure every fresh page load starts muted
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('portfolio_audio_user_toggled');
    localStorage.setItem('portfolio_audio_muted', 'true');
  } catch { }
}

const muteListeners: Set<(isMuted: boolean) => void> = new Set();

function initFallbackPool() {
  if (typeof window === 'undefined') return;
  (Object.keys(SOUND_CONFIG) as SoundEffect[]).forEach((key) => {
    const config = SOUND_CONFIG[key];
    audioPool[key] = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const audio = new Audio(config.src);
      audio.preload = 'auto';
      audio.volume = config.volume;
      audioPool[key].push(audio);
    }
  });
}

// Instant user-interaction unlocker to comply with modern browser autoplay policies
let isAudioUnlocked = false;
function unlockAudioEngine() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => { });
  }
  if (!isAudioUnlocked) {
    isAudioUnlocked = true;
    preloadAllSounds();
  }
}

if (typeof window !== 'undefined') {
  initFallbackPool();
  preloadAllSounds();
  // Listen on all active pointer and keyboard gestures
  window.addEventListener('pointerdown', unlockAudioEngine, { capture: true, passive: true });
  window.addEventListener('pointermove', unlockAudioEngine, { once: true, capture: true, passive: true });
  window.addEventListener('keydown', unlockAudioEngine, { capture: true, passive: true });
  window.addEventListener('touchstart', unlockAudioEngine, { capture: true, passive: true });
}

function fallbackPlay(name: SoundEffect) {
  try {
    const pool = audioPool[name];
    if (!pool || pool.length === 0) return;
    let audio = pool.find((a) => a.paused || a.ended);
    if (!audio) audio = pool[0];
    const config = SOUND_CONFIG[name];
    audio.volume = config.volume;
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => { });
    }
  } catch { }
}

/**
 * Instant Zero-Latency Sound Player
 * Uses Web Audio API hardware buffer source when available (< 1ms execution time).
 * Truly polyphonic: simultaneous or rapid clicks never stutter, clip, or lag.
 */
export function playSound(name: SoundEffect, playbackRate = 1.0) {
  if (muted || typeof window === 'undefined') return;

  const config = SOUND_CONFIG[name];
  if (!config) return;

  const ctx = getAudioContext();
  if (ctx) {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => { });
    }
    const buffer = audioBufferCache.get(config.src);
    if (buffer) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        if (playbackRate !== 1.0) {
          source.playbackRate.value = playbackRate;
        }
        const gainNode = ctx.createGain();
        gainNode.gain.value = config.volume;
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
        return;
      } catch {
        // Fall back below if buffer source fails
      }
    } else {
      // Fire decode for subsequent rapid calls
      preloadAudioBuffer(config.src);
    }
  }

  // Graceful instantaneous fallback
  fallbackPlay(name);
}

export function playCustomAudio(file: string, volume = 0.5) {
  if (muted || typeof window === 'undefined') return;

  const ctx = getAudioContext();
  if (ctx) {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => { });
    }
    const buffer = audioBufferCache.get(file);
    if (buffer) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gainNode = ctx.createGain();
        gainNode.gain.value = volume;
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
        return;
      } catch { }
    } else {
      preloadAudioBuffer(file);
    }
  }

  try {
    const audio = new Audio(file);
    audio.volume = volume;
    audio.play().catch(() => { });
  } catch { }
}

export function getActiveClickId(): string {
  return activeClickId;
}

export function setActiveClickId(id: string) {
  const opt = CLICK_OPTIONS.find((o) => o.id === id);
  if (!opt) return;
  activeClickId = id;
  SOUND_CONFIG['click'] = { src: opt.file, volume: opt.volume };
  try {
    localStorage.setItem('portfolio_active_click', id);
  } catch { }

  preloadAudioBuffer(opt.file);

  if (typeof window !== 'undefined') {
    audioPool['click'] = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const audio = new Audio(opt.file);
      audio.preload = 'auto';
      audio.volume = opt.volume;
      audioPool['click'].push(audio);
    }
  }

  clickListeners.forEach((fn) => fn(id));
}

export function onClickSoundChange(callback: (id: string) => void): () => void {
  clickListeners.add(callback);
  return () => {
    clickListeners.delete(callback);
  };
}

export function isSoundMuted(): boolean {
  return muted;
}

export function toggleSoundMute(): boolean {
  muted = !muted;
  try {
    localStorage.setItem('portfolio_audio_user_toggled', 'true');
    localStorage.setItem('portfolio_audio_muted', String(muted));
  } catch { }
  muteListeners.forEach((listener) => listener(muted));
  return muted;
}

export function setSoundMuted(val: boolean) {
  muted = val;
  try {
    localStorage.setItem('portfolio_audio_user_toggled', 'true');
    localStorage.setItem('portfolio_audio_muted', String(muted));
  } catch { }
  muteListeners.forEach((listener) => listener(muted));
}

export function onSoundMuteChange(callback: (isMuted: boolean) => void): () => void {
  muteListeners.add(callback);
  return () => {
    muteListeners.delete(callback);
  };
}
