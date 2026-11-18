import React, { useState, useEffect } from 'react';
import {
  SOUND_CATALOG,
  CLICK_OPTIONS,
  playSound,
  playCustomAudio,
  getActiveClickId,
  setActiveClickId,
  onClickSoundChange,
  isSoundMuted,
  toggleSoundMute,
  onSoundMuteChange,
  type SoundEffect,
} from '../utils/sound';
import './SoundBoardModal.css';

interface SoundBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundBoardModal: React.FC<SoundBoardModalProps> = ({ isOpen, onClose }) => {
  const [activePlaying, setActivePlaying] = useState<string | null>(null);
  const [muted, setMuted] = useState(isSoundMuted());
  const [activeClick, setActiveClick] = useState(getActiveClickId());
  const [selectedCategory, setSelectedCategory] = useState<'clicks' | 'all' | 'scroll' | 'interaction'>('clicks');

  useEffect(() => {
    const unsubMute = onSoundMuteChange(setMuted);
    const unsubClick = onClickSoundChange(setActiveClick);
    return () => {
      unsubMute();
      unsubClick();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePlaySoundEffect = (id: SoundEffect) => {
    setActivePlaying(id);
    playSound(id);
    setTimeout(() => {
      setActivePlaying((prev) => (prev === id ? null : prev));
    }, 1000);
  };

  const handlePlayClickOption = (opt: typeof CLICK_OPTIONS[0]) => {
    setActivePlaying(opt.id);
    playCustomAudio(opt.file, opt.volume);
    setTimeout(() => {
      setActivePlaying((prev) => (prev === opt.id ? null : prev));
    }, 700);
  };

  const handleSelectClick = (id: string, file: string, vol: number) => {
    setActiveClickId(id);
    setActivePlaying(id);
    playCustomAudio(file, vol);
    setTimeout(() => {
      setActivePlaying((prev) => (prev === id ? null : prev));
    }, 700);
  };

  const filteredSounds = SOUND_CATALOG.filter((item) =>
    selectedCategory === 'all' ? true : item.category === selectedCategory
  );

  return (
    <div className="sfx-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="sfx-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sfx-modal-header">
          <div className="sfx-header-left">
            <div className="sfx-title-row">
              <span className="sfx-pill">AUDIO LAB</span>
              <h2 className="sfx-title">Sound Effects Library</h2>
            </div>
            <p className="sfx-subtitle">
              Listen to and choose your preferred click sound effect, or preview any scroll & interaction animation.
            </p>
          </div>

          <div className="sfx-header-right">
            <button
              type="button"
              className={`sfx-mute-btn ${muted ? 'muted' : 'unmuted'}`}
              onClick={toggleSoundMute}
              title={muted ? 'Click to Unmute' : 'Click to Mute'}
            >
              {muted ? 'MUTED' : 'AUDIO ON'}
            </button>
            <button
              type="button"
              className="sfx-close-btn"
              onClick={() => {
                playSound('pop');
                onClose();
              }}
              aria-label="Close Sound Board"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="sfx-tabs-bar">
          <button
            type="button"
            className={`sfx-tab ${selectedCategory === 'clicks' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('clicks')}
          >
            🎯 Click Options (9)
          </button>
          <button
            type="button"
            className={`sfx-tab ${selectedCategory === 'scroll' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('scroll')}
          >
            🎬 Cinematic Scroll (6)
          </button>
          <button
            type="button"
            className={`sfx-tab ${selectedCategory === 'interaction' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('interaction')}
          >
            ⚡ Tactile UI (7)
          </button>
          <button
            type="button"
            className={`sfx-tab ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Effects
          </button>
        </div>

        {/* CLICK CHOOSER VIEW */}
        {selectedCategory === 'clicks' ? (
          <div className="sfx-cards-grid">
            {CLICK_OPTIONS.map((opt) => {
              const isSelected = activeClick === opt.id;
              const isPlaying = activePlaying === opt.id;
              return (
                <div
                  key={opt.id}
                  className={`sfx-card click-card ${isSelected ? 'selected' : ''} ${isPlaying ? 'playing' : ''}`}
                  onClick={() => handlePlayClickOption(opt)}
                >
                  <div className="sfx-card-top">
                    <span className={`sfx-cat-badge ${isSelected ? 'badge-active' : 'cat-click'}`}>
                      {isSelected ? '✓ ACTIVE CLICK' : 'OPTION'}
                    </span>
                    <span className="sfx-file-ext">WAV</span>
                  </div>

                  <div className="sfx-card-info">
                    <h3 className="sfx-card-name">{opt.name}</h3>
                    <p className="sfx-card-desc">{opt.description}</p>
                  </div>

                  <div className="sfx-card-footer">
                    <button
                      type="button"
                      className="sfx-play-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayClickOption(opt);
                      }}
                      aria-label={`Play ${opt.name}`}
                    >
                      {isPlaying ? (
                        <span className="sfx-wave-bars">
                          <span className="bar bar-1" />
                          <span className="bar bar-2" />
                          <span className="bar bar-3" />
                        </span>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                      <span className="sfx-play-text">{isPlaying ? 'Playing...' : 'Test'}</span>
                    </button>

                    <button
                      type="button"
                      className={`sfx-select-btn ${isSelected ? 'is-active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectClick(opt.id, opt.file, opt.volume);
                      }}
                    >
                      {isSelected ? 'Selected' : 'Use This'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* STANDARD SOUND EFFECTS GRID */
          <div className="sfx-cards-grid">
            {filteredSounds.map((s) => {
              const isPlaying = activePlaying === s.id;
              return (
                <div
                  key={s.id}
                  className={`sfx-card ${isPlaying ? 'playing' : ''}`}
                  onClick={() => handlePlaySoundEffect(s.id)}
                >
                  <div className="sfx-card-top">
                    <span className={`sfx-cat-badge cat-${s.category}`}>
                      {s.category === 'scroll' ? 'SCROLL' : 'UI'}
                    </span>
                    <span className="sfx-file-ext">{s.file.split('.').pop()?.toUpperCase()}</span>
                  </div>

                  <div className="sfx-card-info">
                    <h3 className="sfx-card-name">{s.name}</h3>
                    <p className="sfx-card-desc">{s.description}</p>
                  </div>

                  <div className="sfx-card-footer">
                    <button
                      type="button"
                      className="sfx-play-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySoundEffect(s.id);
                      }}
                      aria-label={`Play ${s.name}`}
                    >
                      {isPlaying ? (
                        <span className="sfx-wave-bars">
                          <span className="bar bar-1" />
                          <span className="bar bar-2" />
                          <span className="bar bar-3" />
                        </span>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                      <span className="sfx-play-text">{isPlaying ? 'Playing...' : 'Test Sound'}</span>
                    </button>

                    <span className="sfx-filename">{s.file.split('/').pop()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoundBoardModal;
