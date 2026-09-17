import { useState, useEffect, useCallback } from 'react';
import Lenis from 'lenis';
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

  const togglePanel = (panel: PanelType) => {
    setActivePanel(prev => prev === panel ? null : panel);
  };

  const closePanel = () => setActivePanel(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Escape key closes active panel
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePanel(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Cursor glow tracking (sets CSS variables for body::before glow)
  useEffect(() => {
    let ticking = false;
    const onMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
          document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
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
