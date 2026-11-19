import React, { useState, useEffect } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { isSoundMuted, toggleSoundMute, onSoundMuteChange, playSound } from '../utils/sound';
import SoundBoardModal from './SoundBoardModal';
import './SoundToggle.css';

export const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState(isSoundMuted());
  const [showBoard, setShowBoard] = useState(false);

  useEffect(() => {
    return onSoundMuteChange(setMuted);
  }, []);

  const handleMuteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = toggleSoundMute();
    if (!newMuted) {
      playSound('click');
    }
  };

  const handleBoardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    setShowBoard(true);
  };

  return (
    <>
      <div className="sound-toggle-group">
        {/* Audio Mute/Unmute Icon */}
        <button
          type="button"
          className={`sound-nav-icon-btn ${muted ? 'muted' : 'active'}`}
          onClick={handleMuteClick}
          aria-label={muted ? 'Unmute Sound' : 'Mute Sound'}
          title={muted ? 'Unmute sound effects (Click to enable audio)' : 'Mute sound effects'}
        >
          {muted ? <FiVolumeX size={21} /> : <FiVolume2 size={21} />}
        </button>

        {/* Sound Effects Preview / Board Icon */}
        <button
          type="button"
          className="sound-nav-icon-btn"
          onClick={handleBoardClick}
          title="Open Sound Effects Library"
          aria-label="Sound Effects Library"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </button>
      </div>

      <SoundBoardModal isOpen={showBoard} onClose={() => setShowBoard(false)} />
    </>
  );
};

export default SoundToggle;
