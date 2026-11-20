import React, { useState, useEffect } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { isSoundMuted, toggleSoundMute, onSoundMuteChange, playSound } from '../utils/sound';
import './SoundToggle.css';

export const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState(isSoundMuted());

  useEffect(() => {
    return onSoundMuteChange(setMuted);
  }, []);

  const handleMuteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = toggleSoundMute();
    if (!newMuted) {
      playSound('aboutBloom');
    }
  };

  return (
    <div className="sound-toggle-group">
      {/* Audio Mute/Unmute Icon */}
      <button
        type="button"
        className={`sound-nav-icon-btn ${muted ? 'muted' : 'active'}`}
        onClick={handleMuteClick}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <FiVolumeX size={21} /> : <FiVolume2 size={21} />}
      </button>
    </div>
  );
};

export default SoundToggle;
