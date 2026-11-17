import React, { useState, useEffect } from 'react';
import { isSoundMuted, toggleSoundMute, onSoundMuteChange, playSound } from '../utils/sound';
import './SoundToggle.css';

export const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState(isSoundMuted());

  useEffect(() => {
    return onSoundMuteChange(setMuted);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = toggleSoundMute();
    if (!newMuted) {
      playSound('click');
    }
  };

  return (
    <button
      type="button"
      className={`sound-toggle-btn ${muted ? 'muted' : 'active'}`}
      onClick={handleClick}
      aria-label={muted ? 'Unmute Sound' : 'Mute Sound'}
      title={muted ? 'Enable sound effects' : 'Mute sound effects'}
    >
      <span className="sound-toggle-icon">
        {muted ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </span>
      <span className="sound-toggle-label">{muted ? 'MUTED' : 'AUDIO'}</span>
    </button>
  );
};

export default SoundToggle;
