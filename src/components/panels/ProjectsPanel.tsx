// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import type { PanelProps, Project } from '../../types';
import CircularGallery, { CircularGalleryItem } from './CircularGallery';
import CardSwap, { Card } from './CardSwap';
const TechLogos: Record<string, string> = {
  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
  'Supabase': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
  'Groq': 'https://www.google.com/s2/favicons?sz=128&domain=groq.com',
  'GroqAI': 'https://www.google.com/s2/favicons?sz=128&domain=groq.com',
  'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg',
  'Vercel': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg',
  'Vite': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg',
  'Twilio': 'https://www.vectorlogo.zone/logos/twilio/twilio-icon.svg',
  'Leaflet': 'https://www.vectorlogo.zone/logos/leafletjs/leafletjs-icon.svg',
  'Hindsight': 'https://www.google.com/s2/favicons?sz=128&domain=usehindsight.com',
  'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  'Android': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/android/android-original.svg',
};

const getLogo = (name: string) => {
  const url = TechLogos[name];
  if (!url) return <span style={{fontSize: '11px', color: '#cbd5e1', fontWeight: 600}}>{name}</span>;
  const needInvert = name === 'Next.js' || name === 'Vercel';
  return <img src={url} alt={name} style={{ width: 24, height: 24, objectFit: 'contain', filter: needInvert ? 'invert(1)' : 'none' }} />;
};

const PROJECTS: Project[] = [
  {
    name: 'PLUTO',
    icon: '',
    tag: 'Live · Production',
    color: '#a855f7',
    desc: 'More than event discovery — a complete student growth ecosystem. Campus opportunities, auto-built portfolios, and cross-college collaboration. All in one platform.',
    stack: ['React', 'Next.js', 'Node.js', 'Supabase', 'Groq', 'Firebase', 'Vercel'],
    link: 'https://plutoooo.vercel.app',
    year: '2026',
    images: [
      '/Pluto/screenshot-1.png',
      '/Pluto/screenshot-2.png',
      '/Pluto/screenshot-3.png',
      '/Pluto/screenshot-4.png',
      '/Pluto/screenshot-5.png'
    ]
  },
  {
    name: 'ZWIGGY',
    icon: '',
    tag: 'App',
    color: '#f59e0b',
    desc: 'Looks like a food app. Works like a safety net. AI detects distress and auto-alerts trusted contacts. A 3-tap + PIN 5678 activates emergency support — silently, always ready.',
    stack: ['React', 'Vite', 'Twilio', 'Leaflet'],
    link: 'https://zwiggy-app.vercel.app/',
    year: '2026',
    images: [
      '/Zwiggy/screenshot-1.png',
      '/Zwiggy/screenshot-2.png',
      '/Zwiggy/screenshot-3.png'
    ]
  },
  {
    name: 'FLOWMIND',
    icon: '',
    tag: 'Hackathon',
    color: '#00c8ff',
    desc: 'FlowMind is an AI project manager that learns your team and predicts failures before they happen.',
    stack: ['React', 'Hindsight', 'GroqAI', 'Supabase'],
    link: 'https://flowwithmind.vercel.app',
    year: '2026',
    images: [
      '/Flowmind/flowmind1.png',
      '/Flowmind/flowmind2.jpeg',
      '/Flowmind/flowmind3.jpeg',
      '/Flowmind/flowmind4.jpeg'
    ]
  }
];

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function ProjectsPanel({ onClose }: PanelProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Watermark removed
  }, []);

  return (
    <div className="panel panel-open panel-projects" ref={containerRef}>
      <div className="panel-traffic" style={{ position: 'relative', zIndex: 10 }}>
        <div className="traffic-dot traffic-red" onClick={onClose} />
        <div className="traffic-dot traffic-yellow" />
        <div className="traffic-dot traffic-green" />
      </div>
      <h2 style={{ fontFamily: "'JetBrains Mono', sans-serif", fontSize: '17px', fontWeight: 600, color: '#ffffff', letterSpacing: '0.2em', padding: '16px 24px 0 24px', margin: 0, opacity: 0.9 }}>PROJECTS I'VE BUILT</h2>
      <div style={{ flex: 1, overflow: 'hidden', height: 'calc(100% - 80px)', position: 'relative' }}>
        <CircularGallery
          bend={3}
          scrollSpeed={1.5}
          scrollEase={0.05}
          onActiveIndexChange={setActiveIndex}
        >
          {PROJECTS.map((p, i) => (
            <CircularGalleryItem key={p.name}>
                <div
                  className="project-card"
                  style={{
                    border: 'none',
                    background: 'rgba(24, 24, 24, 0.95)',
                    borderRadius: '24px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    color: '#ffffff',
                    position: 'relative',
                    zIndex: 1,
                    overflow: 'hidden'
                  }}
                >
                <div style={{ flex: 3.5, paddingLeft: '1.5rem', paddingRight: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="project-card-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="project-card-title" style={{ color: '#ffffff', fontSize: '20px' }}>{p.name}</span>
                    {p.year && <span style={{ color: '#64748b', fontFamily: "'JetBrains Mono', sans-serif", fontSize: '12px', fontWeight: 500 }}>{p.year}</span>}
                  </div>
                  <p className="project-card-desc" style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.5' }}>{p.desc}</p>
                  <div className="project-card-stack" style={{ fontSize: '13px', display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '4px' }}>
                    {p.stack.map(s => (
                      <span key={s} title={s} style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {getLogo(s)}
                      </span>
                    ))}
                  </div>
                  {p.link && (
                    <a
                      className="project-card-link"
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        color: '#ffffff', 
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        transition: 'background 0.2s ease, opacity 0.2s ease',
                        alignSelf: 'flex-start',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: 600,
                        marginTop: '12px',
                        borderRadius: '8px'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Preview ↗
                    </a>
                  )}
                </div>
                <div style={{ 
                  flex: 6.5, 
                  position: 'relative', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '0.5rem',
                  opacity: i === activeIndex ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                  pointerEvents: i === activeIndex ? 'auto' : 'none'
                }}>
                  <div style={{ width: '100%', height: '100%', position: 'relative', transform: 'translateY(-45px)' }}>
                    <CardSwap
                      cardDistance={0}
                      verticalDistance={20}
                      delay={1700}
                      pauseOnHover={false}
                      paused={i !== activeIndex}
                      skewAmount={0}
                      width="100%"
                      height="100%"
                    >
                      {p.images ? (
                        p.images.map((imgUrl, imgIdx) => (
                          <Card key={imgUrl} style={{ background: 'transparent', overflow: 'hidden', border: 'none' }}>
                            <img loading="lazy" decoding="async" src={imgUrl} alt={`${p.name} screenshot ${imgIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain', willChange: 'transform', transform: 'translateZ(0)' }} />
                          </Card>
                        ))
                      ) : (
                        <>
                          <Card style={{ background: 'transparent' }}>
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                              Screenshot 1
                            </div>
                          </Card>
                          <Card style={{ background: `linear-gradient(135deg, #000, rgba(148, 163, 184, 0.5))` }}>
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                              Screenshot 2
                            </div>
                          </Card>
                          <Card style={{ background: `linear-gradient(135deg, #94a3b8, #000)` }}>
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                              Screenshot 3
                            </div>
                          </Card>
                        </>
                      )}
                    </CardSwap>
                  </div>
                </div>
              </div>
            </CircularGalleryItem>
          ))}
        </CircularGallery>
      </div>
    </div>
  );
}
