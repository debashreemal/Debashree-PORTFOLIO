// Web Audio / HTML5 Audio Sound Manager for Portfolio Debashree Mal

export type SoundEffect = 'click' | 'pageFlip' | 'rocket' | 'folderOpen' | 'sparkle';

interface SoundConfig {
  src: string;
  volume: number;
}

const SOUND_CONFIG: Record<SoundEffect, SoundConfig> = {
  click: { src: '/sounds/click.wav', volume: 0.35 },
  pageFlip: { src: '/sounds/page-flip.wav', volume: 0.55 },
  rocket: { src: '/sounds/rocket.wav', volume: 0.45 },
  folderOpen: { src: '/sounds/folder-open.wav', volume: 0.45 },
  sparkle: { src: '/sounds/sparkle.wav', volume: 0.4 },
};

// In-memory audio pool for fast, zero-latency polyphonic playback
const audioPool: Record<SoundEffect, HTMLAudioElement[]> = {
  click: [],
  pageFlip: [],
  rocket: [],
  folderOpen: [],
  sparkle: [],
};

const POOL_SIZE = 4;
let isAudioUnlocked = false;
let muted = false;

// Check localStorage for persisted mute preference
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('portfolio_audio_muted');
    if (saved !== null) {
      muted = saved === 'true';
    }
  } catch { }
}

const muteListeners: Set<(isMuted: boolean) => void> = new Set();

function initPool() {
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

// Unlock audio on first user interaction (browser autoplay policy)
function unlockAudio() {
  if (isAudioUnlocked) return;
  isAudioUnlocked = true;
  (Object.keys(audioPool) as SoundEffect[]).forEach((key) => {
    const item = audioPool[key]?.[0];
    if (item) {
      item.load();
    }
  });
  window.removeEventListener('pointerdown', unlockAudio, { capture: true });
  window.removeEventListener('keydown', unlockAudio, { capture: true });
}

if (typeof window !== 'undefined') {
  initPool();
  window.addEventListener('pointerdown', unlockAudio, { once: true, capture: true });
  window.addEventListener('keydown', unlockAudio, { once: true, capture: true });
}

export function playSound(name: SoundEffect) {
  if (muted || typeof window === 'undefined') return;
  try {
    const pool = audioPool[name];
    if (!pool || pool.length === 0) return;

    // Find an available audio instance that is paused or ended
    let audio = pool.find((a) => a.paused || a.ended);
    if (!audio) {
      // If all are currently playing, reuse the first one
      audio = pool[0];
    }

    const config = SOUND_CONFIG[name];
    audio.volume = config.volume;
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy or interrupt caught silently
      });
    }
  } catch { }
}

export function isSoundMuted(): boolean {
  return muted;
}

export function toggleSoundMute(): boolean {
  muted = !muted;
  try {
    localStorage.setItem('portfolio_audio_muted', String(muted));
  } catch { }
  muteListeners.forEach((listener) => listener(muted));
  return muted;
}

export function setSoundMuted(val: boolean) {
  muted = val;
  try {
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
