import { useState, useEffect, useCallback, useRef } from 'react';
import MenuBar from './components/MenuBar';
import Robot from './components/Robot';
import Dock from './components/Dock';

import AboutPanel from './components/panels/AboutPanel';
import ProjectsPanel from './components/panels/ProjectsPanel';
import SkillsPanel from './components/panels/SkillsPanel';
import TerminalPanel from './components/panels/TerminalPanel';
import ResumePanel from './components/panels/ResumePanel';
import ContactPanel from './components/panels/ContactPanel';
import type { PanelType } from './types';

export default function App() {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [sequenceComplete, setSequenceComplete] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  const togglePanel = (panel: PanelType) => {
    setActivePanel(prev => prev === panel ? null : panel);
  };

  const closePanel = () => setActivePanel(null);

  // Escape key closes active panel
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePanel(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Hardware-accelerated cursor glow tracking
  useEffect(() => {
    let ticking = false;
    const onMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (glowRef.current) {
            glowRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const handleRobotReady = useCallback(() => {
    setSequenceComplete(true);
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" />

      {/* Ambient glow orbs removed for pure black background */}


      <MenuBar visible={sequenceComplete} />
      <Robot onReady={handleRobotReady} />

      {/* Panels — only the active one renders */}
      {activePanel === 'about' &&
        <AboutPanel onClose={closePanel} />}
      {activePanel === 'projects' &&
        <ProjectsPanel onClose={closePanel} />}
      {activePanel === 'skills' &&
        <SkillsPanel onClose={closePanel} />}
      {activePanel === 'terminal' &&
        <TerminalPanel onClose={closePanel} />}
      {activePanel === 'resume' &&
        <ResumePanel onClose={closePanel} />}
      {activePanel === 'contact' &&
        <ContactPanel onClose={closePanel} />}

      {/* Backdrop overlay — click to close */}
      {activePanel && (
        <div
          className="backdrop"
          onClick={closePanel}
        />
      )}

      <Dock
        activePanel={activePanel}
        onIconClick={togglePanel}
        visible={sequenceComplete}
      />

    </>
  );
}
