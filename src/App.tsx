import React, { useEffect, useRef, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import debashreePhoto from './assets/debashree.png';
import FlyingButton from './components/FlyingButton';

// Lazy-load heavy 3D WebGL canvas to keep initial page load instantaneous
const HeroRobot = lazy(() => import('./components/canvas/HeroRobot'));

// Mathematical easing helpers from v10
function cl(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
function sg(p: number, a: number, b: number) {
  return cl((p - a) / (b - a));
}
function eo(u: number) {
  return 1 - Math.pow(1 - u, 3);
}
function io(u: number) {
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
}
function eb(u: number) {
  const c = 1.70158;
  const d = c + 1;
  return 1 + d * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2);
}
function clp(x: number, a: number) {
  return Math.max(-a, Math.min(a, x));
}

const W5_DATA = [
  { title: 'Axion Hackathon', sub: '1ST PLACE', desc: 'FlowMind, an AI project manager, took first place.', icon: 'ti-trophy' },
  { title: 'NHAI Hackathon 7.0', sub: 'OFFLINE FACE SDK', desc: 'NHAIFaceID, built with Piyush Yenorkar.', icon: 'ti-scan' },
  { title: "HackHazards '26", sub: 'FLOWMIND', desc: 'FlowMind at the centre of the build.', icon: 'ti-flame' },
  { title: 'Smart India Hackathon', sub: 'SIH 2026', desc: 'Airfare Price Index for MoSPI.', icon: 'ti-award' },
  { title: 'Paytm Build for India', sub: 'AI TEAMMATES', desc: 'Sulajh AI: autonomous AI teammates.', icon: 'ti-rocket' },
];

const W_ROTS = [-3, 5, -6, 4, -5];
const W_CC = [
  ['#EFEAE0', '#111'],
  ['#EE3B1F', '#111'],
  ['#1b1b1f', '#EFEAE0'],
  ['#EFEAE0', '#111'],
  ['#EE3B1F', '#111'],
];

const MOMENTS_ITEMS = [
  {
    id: 1,
    title: 'Axion Hackathon',
    category: '1ST PLACE',
    tag: 'AI Project Manager',
    desc: 'FlowMind took 1st place among 120+ teams, recognized for automated workflow intelligence.',
    date: '2025',
    color: '#EE3B1F',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'NHAI Hackathon 7.0',
    category: 'OFFLINE FACE SDK',
    tag: 'Computer Vision',
    desc: 'Engineered NHAIFaceID with offline edge facial recognition for highway toll inspection.',
    date: '2025',
    color: '#EFEAE0',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'HackHazards 2026',
    category: 'FLOWMIND',
    tag: 'Autonomous AI',
    desc: 'Live multi-agent execution framework with zero-latency task routing and dependency graphs.',
    date: '2026',
    color: '#EE3B1F',
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Smart India Hackathon',
    category: 'SIH 2026',
    tag: 'MoSPI Ministry',
    desc: 'Developed national Airfare Price Index forecasting algorithm using real-time flight telemetry.',
    date: '2026',
    color: '#EFEAE0',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Paytm Build for India',
    category: 'AI TEAMMATES',
    tag: 'Sulajh AI',
    desc: 'Autonomous AI team member simulation built for India-scale merchant onboarding.',
    date: '2025',
    color: '#EE3B1F',
    img: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'Mumbai CE Cohort',
    category: 'CLASS OF 2028',
    tag: 'Computer Engineering',
    desc: 'Campus community lead, organizing hackathons, open-source sprints, and peer build nights.',
    date: '2025',
    color: '#EFEAE0',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 7,
    title: 'AI for Bharat',
    category: 'PRODUCT INITIATIVE',
    tag: 'Vernacular LLMs',
    desc: 'Building localized AI tools tailored for non-metro Indian merchants and students.',
    date: '2026',
    color: '#EE3B1F',
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 8,
    title: 'Edge SDK Architecture',
    category: 'SYSTEM DESIGN',
    tag: 'WebAssembly / C++',
    desc: 'Lightweight on-device model serving with under 28MB memory footprint.',
    date: '2025',
    color: '#EFEAE0',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 9,
    title: 'Late Night Hack Lab',
    category: 'DEV NIGHTS',
    tag: 'Team Sprint',
    desc: '36 hours of non-stop caffeinated coding, rapid prototyping, and pitch iteration.',
    date: '2025',
    color: '#EE3B1F',
    img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 10,
    title: 'Final Pitch Stage',
    category: 'PRESENTATION',
    tag: 'Grand Finale',
    desc: 'Pitching live to industry jury, tech founders, and venture partners at national summits.',
    date: '2026',
    color: '#EFEAE0',
    img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 11,
    title: 'FlowMind Architecture',
    category: 'AGENTIC PIPELINES',
    tag: 'LangGraph & Python',
    desc: 'Hierarchical multi-agent delegation system with deterministic state validation.',
    date: '2025',
    color: '#EE3B1F',
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 12,
    title: 'Zwiggy Prototype',
    category: 'SOLO BUILD',
    tag: 'React & FastAPI',
    desc: 'Dynamic food delivery logistics simulation with microsecond delivery dispatching.',
    date: '2025',
    color: '#EFEAE0',
    img: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 13,
    title: 'PLUTO Automation',
    category: 'TOOLING',
    tag: 'Developer CLI',
    desc: 'CLI-based cloud container orchestrator with instant zero-downtime deployment pipelines.',
    date: '2026',
    color: '#EE3B1F',
    img: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 14,
    title: 'Debashree Mal',
    category: 'FOUNDER & BUILDER',
    tag: 'Vision 2026+',
    desc: 'Continuing to build resilient, accessible AI systems for the next billion users in India.',
    date: '2026',
    color: '#EFEAE0',
    img: debashreePhoto,
  },
];

const MILESTONES = [0, 0.22, 0.40, 0.66, 1.0];
const THRESHOLDS = [0, 0.16, 0.32, 0.54, 0.84];
const SECTIONS = ['HOME', 'ABOUT', 'WINS', 'MOMENTS', 'CONTACT'];

export const App: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);

  // Active 3D Pop-out Card in Moments (1st click pops out, 2nd click docks back)
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const activeCardRef = useRef<number | null>(null);
  activeCardRef.current = activeCard;

  // Panel Refs
  const p0Ref = useRef<HTMLElement>(null);
  const p1Ref = useRef<HTMLElement>(null);
  const p2Ref = useRef<HTMLElement>(null);
  const p4Ref = useRef<HTMLElement>(null);
  const p5Ref = useRef<HTMLElement>(null);

  // Contact Refs (Last Screen)
  const cSheetRef = useRef<HTMLDivElement>(null);
  const cTitleRef = useRef<HTMLDivElement>(null);
  const cSubTextRef = useRef<HTMLSpanElement>(null);
  const cSayHelloRef = useRef<HTMLDivElement>(null);
  const cTopBtnRef = useRef<HTMLButtonElement>(null);

  // Moments-to-Contact Hero Coin-to-Sticker Refs
  const coinCardRef = useRef<HTMLDivElement>(null);
  const coinFlipperRef = useRef<HTMLDivElement>(null);

  // Hero Refs
  const hLeftRef = useRef<HTMLSpanElement>(null);
  const hRightRef = useRef<HTMLSpanElement>(null);
  const hRobotRef = useRef<HTMLDivElement>(null);

  // About Refs
  const sheetRef = useRef<HTMLDivElement>(null);
  const aLRef = useRef<HTMLDivElement>(null);
  const aRRef = useRef<HTMLDivElement>(null);
  const aBarRef = useRef<HTMLDivElement>(null);
  const aCircRef = useRef<HTMLDivElement>(null);
  const morphCircRef = useRef<HTMLDivElement>(null);
  const aPhRef = useRef<HTMLDivElement>(null);
  const tg1Ref = useRef<HTMLDivElement>(null);
  const tg2Ref = useRef<HTMLDivElement>(null);
  const aRevealsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const pillsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Wins Refs
  const wLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const wStackRef = useRef<HTMLDivElement>(null);
  const wInfoRef = useRef<HTMLDivElement>(null);
  const wBarRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Moments Refs
  const domewRef = useRef<HTMLDivElement>(null);
  const domeRef = useRef<HTMLDivElement>(null);
  const tileInnersRef = useRef<(HTMLDivElement | null)[]>([]);
  const domeState = useRef({ ry: 0, rx: 0, vy: 0, vx: 0, drag: null as { x: number; y: number } | null });
  const mtlRef = useRef<HTMLDivElement>(null);

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

  const K = useMemo(() => {
    const scale = Math.min(windowWidth / 1440, windowHeight / 900);
    return Math.max(0.85, Math.min(1.2, scale));
  }, [windowWidth, windowHeight]);

  const domeConfig = useMemo(() => {
    const k = K;
    const tileWidth = Math.round(124 * k);
    const tileHeight = Math.round(176 * k);
    const cols = 28;
    // Radius calculated so horizontal pitch gives clean, elegant ~24px gap
    const R = Math.round((cols * (tileWidth + 24)) / (2 * Math.PI));
    return {
      perspective: Math.round(750 * k),
      R,
      cols,
      tileWidth,
      tileHeight,
      marginLeft: Math.round(-tileWidth / 2),
      marginTop: Math.round(-tileHeight / 2),
      fontSize: Math.max(8, Math.round(10 * k)),
      borderRadius: Math.max(8, Math.round(12 * k)),
    };
  }, [K]);

  // Active section indicator state
  const [cur, setCur] = useState(0);
  const curSectionRef = useRef(0);

  // Wins active card state
  const [wCard, setWCard] = useState(0);
  const lastActRef = useRef(0);

  // Continuous progress physics refs from v10
  const tgtRef = useRef(0);
  const curProgressRef = useRef(0);
  const prevProgressRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // 3D Canvas dynamic pause state (stops WebGL loop when outside Hero to save 100% GPU)
  const [heroActive, setHeroActive] = useState(true);
  const heroActiveRef = useRef(true);

  // Mouse & tilt smoothing
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseSmoothRef = useRef({ x: 0, y: 0 });

  // Smooth Navigation to section milestone
  const goTo = useCallback((n: number) => {
    const targetIdx = Math.max(0, Math.min(4, n));
    tgtRef.current = MILESTONES[targetIdx];
  }, []);

  // Window resize & mouse tilt
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
      if (sheetRef.current) {
        sheetRef.current.style.clipPath = 'none';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseTargetRef.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouseTargetRef.current.y = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Continuous scroll progress wheel handler (velvety smooth, unhurried, no artificial snapping)
    const handleWheel = (e: WheelEvent) => {
      const d = e.deltaY * (e.deltaMode === 1 ? 32 : 1);
      if ((d > 0 && tgtRef.current >= 1) || (d < 0 && tgtRef.current <= 0)) return;
      e.preventDefault();

      tgtRef.current = cl(tgtRef.current + d * 0.00085);
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const next = MILESTONES.find((a) => a > tgtRef.current + 0.01);
        if (next !== undefined) tgtRef.current = next;
        e.preventDefault();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const prev = [...MILESTONES].reverse().find((a) => a < tgtRef.current - 0.01);
        if (prev !== undefined) tgtRef.current = prev;
        e.preventDefault();
      }
    };

    // Drag to scroll on stage (excluding clickable items)
    let dragStart: { y: number; t: number } | null = null;
    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest('.nav, .dots, .hero-robot-wrap, .domew, .contact-footer-bar, button, a')) {
        return;
      }
      dragStart = { y: e.clientY, t: tgtRef.current };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (dragStart) {
        tgtRef.current = cl(dragStart.t - (e.clientY - dragStart.y) * 0.0008);
      }
    };

    const handlePointerUp = () => {
      dragStart = null;
    };

    // Touch swipe for mobile devices
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;
      touchStartY = touchY;
      if (Math.abs(diff) < 2) return;

      tgtRef.current = cl(tgtRef.current + diff * 0.0007);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Dome pointer drag listener for Moments panoramic navigation
  useEffect(() => {
    const dw = domewRef.current;
    if (!dw) return;

    const onPointerDown = (e: PointerEvent) => {
      domeState.current.drag = { x: e.clientX, y: e.clientY };
      dw.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!domeState.current.drag) return;
      domeState.current.vy = (e.clientX - domeState.current.drag.x) * 0.25;
      domeState.current.vx = -(e.clientY - domeState.current.drag.y) * 0.15;
      domeState.current.ry += domeState.current.vy;
      domeState.current.rx = Math.max(-30, Math.min(30, domeState.current.rx + domeState.current.vx));
      domeState.current.drag = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      domeState.current.drag = null;
      dw.style.cursor = 'grab';
    };

    dw.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      dw.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  // Main RAF Scroll Animation Loop from v10
  useEffect(() => {
    let animId: number;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      // Exponential progress damping (snappy, velvety, responsive)
      curProgressRef.current += (tgtRef.current - curProgressRef.current) * (1 - Math.exp(-dt * 11.5));
      const p = curProgressRef.current;

      // Dynamic velocity calculation & skew
      const vel = ((curProgressRef.current - prevProgressRef.current) / Math.max(dt, 0.001)) * 0.016;
      prevProgressRef.current = curProgressRef.current;
      const sk = clp(vel * 420, 5);

      // Mouse smoothing (immediate responsive tracking)
      mouseSmoothRef.current.x += (mouseTargetRef.current.x - mouseSmoothRef.current.x) * (1 - Math.exp(-dt * 10));
      mouseSmoothRef.current.y += (mouseTargetRef.current.y - mouseSmoothRef.current.y) * (1 - Math.exp(-dt * 10));
      const mx = mouseSmoothRef.current.x;
      const my = mouseSmoothRef.current.y;
      const tt = now / 1000;

      // 1. Active Section Index calculation
      let idx = 0;
      for (let m = 0; m < 5; m++) {
        if (p >= THRESHOLDS[m]) idx = m;
      }
      if (idx !== curSectionRef.current) {
        curSectionRef.current = idx;
        setCur(idx);
      }
      if (stageRef.current) {
        stageRef.current.dataset.dk = (p > 0.07 && p < 0.31) || p > 0.86 ? '1' : '0';
      }

      // =========================================================
      // PANEL 0: HERO (p < 0.22)
      // =========================================================
      const heroVisible = p < 0.22;
      if (heroVisible !== heroActiveRef.current) {
        heroActiveRef.current = heroVisible;
        setHeroActive(heroVisible);
      }
      if (p0Ref.current) {
        p0Ref.current.style.display = heroVisible ? 'block' : 'none';
        if (heroVisible) {
          const hs = sg(p, 0, 0.16);

          // Name parallax exit with velocity skew
          if (hLeftRef.current) {
            hLeftRef.current.style.transform = `translate3d(${-140 * hs}px, ${-160 * hs - p * 50}px, 0) rotate(${-4 * hs}deg) skewX(${-sk}deg)`;
            hLeftRef.current.style.opacity = `${1 - cl(hs * 1.5)}`;
          }
          if (hRightRef.current) {
            hRightRef.current.style.transform = `translate3d(${140 * hs}px, ${-160 * hs - p * 50}px, 0) rotate(${4 * hs}deg) skewX(${-sk}deg)`;
            hRightRef.current.style.opacity = `${1 - cl(hs * 1.5)}`;
          }

          // 3D Robot model smooth sink straight down below screen (zero scaling, original length preserved)
          if (hRobotRef.current) {
            const robotSink = io(sg(p, 0.01, 0.16));
            hRobotRef.current.style.transform = `translate3d(0, ${robotSink * 115}vh, 0)`;
            hRobotRef.current.style.opacity = `${1 - cl(robotSink * 1.5)}`;
          }
        }
      }

      // =========================================================
      // PANEL 1: ABOUT (0.04 < p < 0.28) - Smooth Vertical Translation
      // =========================================================
      const aboutVisible = p > 0.04 && p < 0.28;
      if (p1Ref.current) {
        p1Ref.current.style.display = aboutVisible ? 'block' : 'none';
        if (aboutVisible) {
          const ab = io(sg(p, 0.05, 0.15));
          const ax = io(sg(p, 0.21, 0.27));
          // Clean upward glide completely clearing viewport
          p1Ref.current.style.transform = `translateY(${100 * (1 - ab) - 110 * ax}%)`;
          p1Ref.current.style.transformOrigin = 'center top';

          const exitFade = 1 - ax * 1.5;

          // Cascading reveals for typography lines
          const rvStarts = [0.105, 0.115, 0.14, 0.15, 0.16, 0.17];
          const rvEnds = [0.155, 0.165, 0.185, 0.195, 0.20, 0.205];
          aRevealsRef.current.forEach((el, i) => {
            if (el) {
              const u = io(sg(p, rvStarts[i] || 0.12, rvEnds[i] || 0.18));
              el.style.transform = `translateY(${112 * (1 - u)}%)`;
            }
          });

          // Red underline bar scale
          if (aBarRef.current) {
            aBarRef.current.style.transform = `scaleX(${eo(sg(p, 0.14, 0.185)) * cl(exitFade)})`;
          }

          // Left text group parallax & dynamic skew
          if (aLRef.current) {
            aLRef.current.style.transform = `translateY(${-(p - 0.2) * 300 - ax * 120}px) skewY(${sk * 0.5 - ax * 3}deg)`;
            aLRef.current.style.opacity = `${cl(exitFade)}`;
          }

          // Right photo group parallax
          if (aRRef.current) {
            aRRef.current.style.transform = `translateY(${(p - 0.2) * 160}px)`;
          }

          // Red circle in About
          if (aCircRef.current) {
            if (p >= 0.20) {
              aCircRef.current.style.opacity = '0';
            } else {
              const circScale = Math.max(0, eb(sg(p, 0.1, 0.175)));
              aCircRef.current.style.transform = `translateY(${(p - 0.2) * 120}px) scale(${circScale})`;
              aCircRef.current.style.opacity = '1';
            }
          }

          // Photo cutout slides down gently with perspective depth
          if (aPhRef.current) {
            const phOff = (1 - eo(sg(p, 0.12, 0.195))) * 320 - (p - 0.2) * 220;
            aPhRef.current.style.transform = `translateY(${phOff + ax * 100}px) scale(${1 - ax * 0.1})`;
            aPhRef.current.style.opacity = `${cl(1 - ax * 1.5)}`;
          }

          // Floating tags elastic entrance and exit fling
          if (tg1Ref.current) {
            const u1 = sg(p, 0.165, 0.2);
            tg1Ref.current.style.transform = `rotate(${-8 + 25 * (1 - eo(u1)) - ax * 15}deg) scale(${1 + 1.6 * (1 - eb(u1)) - ax * 0.3}) translateY(${-ax * 120}px)`;
            tg1Ref.current.style.opacity = `${cl(u1 * 5) * cl(exitFade)}`;
          }
          if (tg2Ref.current) {
            tg2Ref.current.style.transform = `translateX(${(1 - eo(sg(p, 0.175, 0.215))) * 300 + ax * 180}px) rotate(${6 + ax * 12}deg)`;
            tg2Ref.current.style.opacity = `${cl(exitFade)}`;
          }

          // Pill badges: pill 0 ("1ST / AXION HACKATHON") smart morph trajectory towards Wins Card 1!
          pillsRef.current.forEach((pl, k) => {
            if (pl) {
              if (k === 0 && ax > 0.02) {
                pl.style.transform = `translate3d(${ax * 160}px, ${-ax * 80}px, ${ax * 40}px) scale(${1 + ax * 0.15}) rotate(${ax * 6}deg)`;
                pl.style.boxShadow = `0 10px 28px rgba(238, 59, 31, ${ax * 0.55})`;
                pl.style.opacity = `${cl(1 - (ax - 0.65) / 0.35)}`;
              } else {
                pl.style.transform = `scale(${Math.max(0, eb(sg(p, 0.18 + k * 0.01, 0.205 + k * 0.01))) * cl(exitFade)})`;
                pl.style.opacity = `${cl(exitFade)}`;
              }
            }
          });
        }
      }

      // =========================================================
      // ABOUT-TO-WINS: ORANGE CIRCLE -> "WINS" TITLE MORPH
      // =========================================================
      const morphActive = p >= 0.20 && p <= 0.33;
      if (morphCircRef.current) {
        morphCircRef.current.style.display = morphActive ? 'block' : 'none';
        if (morphActive) {
          const vw = window.innerWidth;
          const vh = window.innerHeight;

          // 1. About Circle Start Position (behind portrait)
          const circSize = Math.max(260, Math.min(480, vw * 0.32));
          const aboutRight = Math.max(40, Math.min(130, vw * 0.08));
          const aboutTop = Math.max(80, Math.min(190, vh * 0.16));
          const startX = vw - aboutRight - circSize;
          const startY = aboutTop;

          // 2. Wins Title Target Position
          const winsLeft = Math.max(24, Math.min(68, vw * 0.055));
          const winsTop = Math.max(40, Math.min(80, vh * 0.08));
          const winsFontSize = Math.max(68, Math.min(140, vw * 0.095));
          const winsW = winsFontSize * 2.3;
          const winsH = winsFontSize * 0.95;
          const targetX = winsLeft;
          const targetY = winsTop;

          // Normalized flight progress: 0 at p=0.20, 1 at p=0.28
          const tFlight = Math.min(1, Math.max(0, (p - 0.20) / 0.08));
          const flightEase = io(tFlight);

          // Downward dipping arc across the viewport
          const curX = startX + (targetX - startX) * flightEase;
          const arcY = Math.sin(tFlight * Math.PI) * Math.min(140, vh * 0.18);
          const curY = startY + (targetY - startY) * flightEase + arcY;

          // Morphing from circle into horizontal word bounding capsule
          const curW = circSize + (winsW - circSize) * flightEase;
          const curH = circSize + (winsH - circSize) * flightEase;
          const rEase = io(Math.min(1, Math.max(0, (tFlight - 0.65) / 0.35)));
          const curR = 50 * (1 - rEase);

          // As letters emerge, morph circle background dissolves into the letter glyphs
          const dissolve = io(Math.min(1, Math.max(0, (p - 0.26) / 0.04)));
          const morphBgOpacity = 1 - dissolve * 0.98;

          morphCircRef.current.style.width = `${curW.toFixed(1)}px`;
          morphCircRef.current.style.height = `${curH.toFixed(1)}px`;
          morphCircRef.current.style.borderRadius = `${curR.toFixed(1)}%`;
          morphCircRef.current.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0)`;
          morphCircRef.current.style.opacity = `${morphBgOpacity}`;
        }
      }

      // =========================================================
      // PANEL 2: WINS (0.22 < p < 0.53) - Clean, Distinct, No Overlap
      // =========================================================
      const winsVisible = p > 0.22 && p < 0.53;
      if (p2Ref.current) {
        p2Ref.current.style.display = winsVisible ? 'block' : 'none';
        if (winsVisible) {
          // WINS title letters: bloom outward directly from the center of the arriving morph circle!
          const exitWins = sg(p, 0.47, 0.52);
          const letterBloom = io(Math.min(1, Math.max(0, (p - 0.26) / 0.04)));
          const letterVectors = [-54, -18, 18, 54]; // Spread outward horizontally from circle center
          wLettersRef.current.forEach((s, i) => {
            if (s) {
              if (p < 0.26) {
                s.style.opacity = '0';
                s.style.transform = `scale(0.2)`;
              } else if (p <= 0.31) {
                // Smooth liquid expansion out of the circle
                const offX = (letterVectors[i] || 0) * (1 - letterBloom);
                const sc = 0.45 + 0.55 * letterBloom;
                s.style.transform = `translateX(${offX.toFixed(1)}px) scale(${sc.toFixed(3)})`;
                s.style.opacity = `${letterBloom}`;
              } else {
                // Fully formed stationary title in Wins
                s.style.transform = `translateY(${-80 * exitWins}px) skewX(${-sk * 1.1}deg)`;
                s.style.opacity = `${1 - exitWins}`;
              }
            }
          });

          // Stack container entry on perspective arc and smooth cinematic recession into horizon
          const stackIn = io(sg(p, 0.25, 0.36));
          const ex = io(sg(p, 0.46, 0.52));
          if (wStackRef.current) {
            wStackRef.current.style.transform = `translate3d(0, ${360 * (1 - stackIn) - (p - 0.40) * 70 + 140 * ex}px, ${-320 * ex}px) rotateX(${15 * (1 - stackIn) + 12 * ex}deg) scale(${(0.9 + 0.1 * stackIn) * (1 - 0.22 * ex)})`;
            wStackRef.current.style.opacity = `${stackIn * (1 - ex)}`;
          }

          // Info block parallax and fade
          if (wInfoRef.current) {
            wInfoRef.current.style.transform = `translateY(${-(p - 0.40) * 60 + 50 * (1 - stackIn)}px) skewY(${sk * 0.5}deg)`;
            wInfoRef.current.style.opacity = `${sg(p, 0.28, 0.34) * (1 - ex)}`;
          }

          // Scroll-driven card peeling progress (generous span from 0.33 to 0.46)
          const wp = sg(p, 0.33, 0.46) * 4;
          const act = Math.max(0, Math.min(4, Math.round(wp)));
          if (act !== lastActRef.current) {
            lastActRef.current = act;
            setWCard(act);
          }

          // Fill red progress bar
          if (wBarRef.current) {
            wBarRef.current.style.width = `${(wp / 4) * 100}%`;
          }

          // Buttery 3D Card Stacking physics (hardware-accelerated, zero raster filter lag)
          cardRefs.current.forEach((c, i) => {
            if (!c) return;
            const r = i - wp;
            let x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sc = 1, op = 1, dim = 0;
            let zi = 50 - i;

            if (r < 0) {
              // Active card being dealt / peeled away smoothly
              const q = cl(-r);
              const e = io(q);
              x = -240 * e;
              y = -220 * e + 50 * e * e;
              z = 70 * e * (1 - e); // lifts forward before sailing away
              rx = -16 * e;
              ry = 22 * e;
              rz = W_ROTS[i] - 12 * e;
              sc = 1 - 0.06 * e;
              op = 1 - Math.pow(e, 2.2);
              dim = 0;
              zi = 60 + (4 - i); // Keeps peeling card in front of the resting deck
            } else {
              // Cards resting in deck stack behind in strict sequential order
              const d = Math.min(r, 4);
              x = d * 22;
              y = -d * 14;
              z = -d * 38;
              sc = 1 - 0.045 * d;
              rz = W_ROTS[i] * (0.35 + 0.65 * cl(d));
              dim = 0.12 * Math.min(d, 3);
              op = d > 3.4 ? cl((4 - d) / 0.6) : 1;
              zi = 50 - i; // Card 0 has 50, Card 1 has 49, Card 2 has 48, Card 3 has 47, Card 4 has 46

              // Top card interactive elevation & subtle cursor tilt
              if (r < 1) {
                const frontFactor = 1 - r;
                ry += mx * 9 * frontFactor;
                rx += -my * 7 * frontFactor;
                y += -8 * frontFactor;
              }
            }

            rz += sk * 0.5;
            c.style.zIndex = `${zi}`;
            c.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`;
            c.style.opacity = `${Math.max(0, op - dim * 0.22) * (1 - ex)}`;
            c.style.visibility = op < 0.02 || r > 4.2 || ex >= 0.99 ? 'hidden' : 'visible';
          });
        }
      }

      // =========================================================
      // PANEL 3: MOMENTS (0.53 < p < 0.85) - Inside Globe & Clean Zoom Fly-Through
      // =========================================================
      const momentsVisible = p > 0.53 && p < 0.85;
      if (p4Ref.current) {
        p4Ref.current.style.display = momentsVisible ? 'block' : 'none';
        if (momentsVisible) {
          // Entrance begins cleanly AFTER Wins has exited completely
          const momIn = io(sg(p, 0.54, 0.62));
          // Clean forward zoom into blank space (starts at 0.73, fully clears by 0.83)
          const momFly = io(sg(p, 0.73, 0.83));
          p4Ref.current.style.opacity = `${momIn * (1 - momFly)}`;
          p4Ref.current.style.filter = 'none'; // Zero blur! Crystal sharp zoom

            // Close active pop-out card if scrolling towards transition
            if (p > 0.73 && activeCardRef.current !== null) {
              setActiveCard(null);
            }

            // 3D Panoramic Fly-in & Clean Forward Zoom: Inside-the-Globe View
            const en = io(sg(p, 0.54, 0.64));
            const sr = sg(p, 0.58, 0.74);

            // Resting zoom keeps cards large and immersive; transition flies forward into blank space
            const baseZoom = 480 * K;
            const transitionZoom = momFly * 850 * K;
            const dz = -160 * (1 - en) + baseZoom + transitionZoom;

            if (!domeState.current.drag && activeCardRef.current === null) {
              domeState.current.ry += domeState.current.vy * 0.94;
              domeState.current.vy *= 0.94;
            }

            // Panoramic 360 rotation around inside cyclorama
            const ry = -tt * 0.7 + sr * 50 + mx * 8 + domeState.current.ry;
            const rx = 0 + 4 * io(sr) - my * 5 + domeState.current.rx;

            // Entire inside 3D cyclorama rotates as a single hardware-accelerated 4x4 matrix
            if (domeRef.current) {
              domeRef.current.style.transform = `translateZ(${dz}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            }

            // MOMENTS heading: fades in cleanly, exits cleanly before transition
            if (mtlRef.current) {
              const mo2 = sg(p, 0.55, 0.62) * (1 - io(sg(p, 0.71, 0.78)));
              mtlRef.current.style.opacity = `${mo2}`;
              mtlRef.current.style.transform = `translateX(${-(p - 0.66) * 45}px) skewY(${sk * 0.3}deg) scale(1)`;
            }
          }
        }

        // =========================================================
        // PANEL 4: CONTACT (LAST SCREEN - Emerges from Blank Space with Choreographed Movement)
        // =========================================================
        const contactVisible = p > 0.84;
        if (p5Ref.current) {
          p5Ref.current.style.display = contactVisible ? 'block' : 'none';
          if (contactVisible) {
            // Contact emerges smoothly AFTER the globe has passed into blank space
            const contactIn = io(sg(p, 0.86, 0.98));
            p5Ref.current.style.opacity = `${contactIn}`;

            // Top Title smoothly descends and settles with scale
            if (cTitleRef.current) {
              cTitleRef.current.style.transform = `translate3d(0, ${(1 - contactIn) * -50}px, 0) scale(${0.92 + 0.08 * contactIn})`;
              cTitleRef.current.style.opacity = `${contactIn}`;
            }

            // Subtitle staggers in smoothly
            if (cSubTextRef.current) {
              const subIn = io(sg(p, 0.89, 0.99));
              cSubTextRef.current.style.transform = `translate3d(0, ${(1 - subIn) * 20}px, 0)`;
              cSubTextRef.current.style.opacity = `${subIn}`;
            }

            // Say Hello Rocket Button container glides in smoothly
            if (cSayHelloRef.current) {
              const bIn = io(sg(p, 0.88, 0.98));
              cSayHelloRef.current.style.transform = `translate3d(0, ${(1 - bIn) * 35}px, 0)`;
              cSayHelloRef.current.style.opacity = `${bIn}`;
            }

            // Cream contact sheet glides up with luxury paper elevation
            if (cSheetRef.current) {
              cSheetRef.current.style.transform = `translateY(${100 * (1 - contactIn)}%)`;
            }

            // Back to top floating pill
            if (cTopBtnRef.current) {
              const tpIn = sg(p, 0.92, 0.99);
              cTopBtnRef.current.style.opacity = `${tpIn}`;
              cTopBtnRef.current.style.pointerEvents = tpIn > 0.5 ? 'auto' : 'none';
            }
          }
        }

        // =========================================================
        // MOMENTS-TO-CONTACT HERO COIN-TO-STICKER TRANSITION
        // =========================================================
        // 1. The exact zoomed card slot in the dome becomes blank
        const heroTileIdx = 56;
        const heroTileInner = tileInnersRef.current[heroTileIdx];
        if (heroTileInner) {
          if (p >= 0.73) {
            heroTileInner.style.opacity = '0';
            heroTileInner.parentElement?.classList.add('dt-empty-slot');
          } else {
            heroTileInner.style.opacity = '1';
            heroTileInner.parentElement?.classList.remove('dt-empty-slot');
          }
        }

        // 2. Detached Hero Card: comes out from that exact spot, flips smoothly once in mid-air,
        // and places as a sticker below "LET'S CONNECT"
        const coinVisible = p > 0.73 && p <= 1.0;
        if (coinCardRef.current) {
          coinCardRef.current.style.display = coinVisible ? 'block' : 'none';
          if (coinVisible) {
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            // Card dimensions (responsive sticker size)
            const cardW = Math.max(136, Math.min(176, vw * 0.135));
            const cardH = cardW * 1.40;

            // Start Position: exactly where the card was zoomed in the center
            const startX = vw * 0.5 - cardW * 0.5;
            const startY = vh * 0.5 - cardH * 0.5;

            // Destination Position: Left side directly below "LET'S CONNECT"
            const destX = Math.max(24, Math.min(72, vw * 0.055));
            const titleTop = Math.max(50, Math.min(90, vh * 0.10));
            const titleH = Math.max(80, Math.min(150, vw * 0.115));
            const destY = titleTop + titleH + 18;

            // Normalized progress: 0 at p=0.74, 1 at p=0.90
            const rawT = Math.min(1, Math.max(0, (p - 0.74) / 0.16));

            // Entrance / lift-off from the dome socket
            const liftOff = Math.min(1, Math.max(0, (p - 0.73) / 0.02));

            // Smooth coordinated flight path
            const flightEase = io(rawT);
            const curX = startX + (destX - startX) * flightEase;

            // Gentle, elegant arc (lifts out and glides down smoothly)
            const arcY = Math.sin(rawT * Math.PI) * -32;
            const curY = startY + (destY - startY) * flightEase + arcY;

            // Gentle scale: starts at socket size (0.88), expands to 1.12 in flight, settles to 1.0
            const curScale = 0.88 + Math.sin(rawT * Math.PI) * 0.24 + 0.12 * rawT;

            // Clean, controlled single 360-deg flip (NO chaotic multi-spin or wobble)
            // 0 deg (front) -> 180 deg (collector back) -> 360 deg (front settles into sticker)
            const spinDeg = io(rawT) * 360;

            // Subtle tactile sticker tilt on landing: settles smoothly into -4.2 deg
            const stickerTilt = -4.2 * io(Math.min(1, Math.max(0, (rawT - 0.70) / 0.30)));

            // State attributes
            const isStuck = rawT >= 0.95;
            coinCardRef.current.dataset.stuck = isStuck ? 'true' : 'false';
            coinCardRef.current.style.pointerEvents = isStuck ? 'auto' : 'none';
            coinCardRef.current.style.opacity = `${liftOff}`;
            coinCardRef.current.style.width = `${cardW}px`;
            coinCardRef.current.style.height = `${cardH}px`;
            coinCardRef.current.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) scale(${curScale.toFixed(3)}) rotate(${stickerTilt.toFixed(2)}deg)`;

            if (coinFlipperRef.current) {
              coinFlipperRef.current.style.transform = `rotateY(${spinDeg.toFixed(1)}deg)`;
            }
          }
        }

        animId = requestAnimationFrame(frame);
      };

      animId = requestAnimationFrame(frame);
      return () => cancelAnimationFrame(animId);
    }, []);

  // Toggle card inspection: 1st click pops card out in 3D, 2nd click docks it back!
  const handleCardClick = useCallback((idx: number) => {
    setActiveCard((prev) => (prev === idx ? null : idx));
  }, []);

  // Pre-generate 3D Globe Gallery (Inside view: 4 rows with guaranteed ~30px vertical gap, concave curvature)
  const domeTiles = useMemo(() => {
    // 4 tiers chosen with consistent 18.2 deg separation for clean ~34px vertical gaps across rows
    const lats = [-27.3, -9.1, 9.1, 27.3];
    const cols = domeConfig.cols;
    const R = domeConfig.R;
    const tiles: React.ReactNode[] = [];
    let idx = 0;

    lats.forEach((la, r) => {
      for (let i = 0; i < cols; i++) {
        const currentIdx = idx++;
        // Aligned in the exact same sequence across rows (no offset)
        const lo = (i * 360) / cols;
        const item = MOMENTS_ITEMS[(i + r * 4) % MOMENTS_ITEMS.length];
        const isSelected = activeCard === currentIdx;

        tiles.push(
          <div
            key={currentIdx}
            className="dt"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick(currentIdx);
            }}
            style={{
              width: `${domeConfig.tileWidth}px`,
              height: `${domeConfig.tileHeight}px`,
              marginLeft: `${domeConfig.marginLeft}px`,
              marginTop: `${domeConfig.marginTop}px`,
              transform: isSelected
                ? `rotateY(${lo}deg) rotateX(${la}deg) translateZ(${-R + 260}px) scale(1.35)`
                : `rotateY(${lo}deg) rotateX(${la}deg) translateZ(${-R}px)`,
              cursor: 'pointer',
              zIndex: isSelected ? 70 : 1,
              transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), z-index 0.2s',
            }}
          >
            <div
              ref={(el) => {
                tileInnersRef.current[currentIdx] = el;
              }}
              className="di portrait-card-3d"
              style={{
                ['--i' as any]: currentIdx,
                borderRadius: `${domeConfig.borderRadius}px`,
                background: isSelected ? '#1c1c24' : '#131317',
                border: isSelected
                  ? '2px solid rgba(255, 255, 255, 0.95)'
                  : '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: isSelected
                  ? '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 255, 255, 0.2)'
                  : '0 12px 28px rgba(0, 0, 0, 0.65)',
              }}
            >
              {/* Portrait Image with smooth zoom on hover */}
              <div className="portrait-img-box">
                <img
                  src={item.img}
                  alt={item.title}
                  className="portrait-img"
                  loading="lazy"
                />
                <div className="portrait-vignette" />
              </div>

              {/* Top Category Badge */}
              <div className="portrait-card-top">
                <span className="portrait-badge">
                  <span className="portrait-badge-dot" style={{ background: item.color }} />
                  {item.category}
                </span>
                <span className="portrait-card-idx">
                  #{('0' + ((currentIdx % 14) + 1)).slice(-2)}
                </span>
              </div>

              {/* Bottom Content Info */}
              <div className="portrait-card-bottom">
                <span className="portrait-card-tag">{item.tag}</span>
                <h4 className="portrait-card-title">{item.title}</h4>
                <div className="portrait-card-meta">
                  <span>{item.date} • 3D VIEW</span>
                  <i className="ti ti-arrow-up-right" style={{ opacity: 0.8 }} />
                </div>
              </div>
            </div>
          </div>
        );
      }
    });

    return tiles;
  }, [domeConfig, activeCard, handleCardClick]);

  return (
    <div
      className="stage"
      id="st"
      ref={stageRef}
      tabIndex={0}
    >
      {/* Top Navbar */}
      <nav className="nav">
        <div className="nav-links" style={{ marginLeft: 'auto' }}>
          {SECTIONS.map((sec, i) => (
            <span
              key={sec}
              className={`l ${cur === i ? 'on' : ''}`}
              onClick={() => goTo(i)}
            >
              {sec}
            </span>
          ))}
        </div>
      </nav>

      {/* Side Indicator Dots */}
      <div className="dots" id="dots">
        {MILESTONES.map((_, i) => (
          <i
            key={i}
            className={cur === i ? 'on' : ''}
            onClick={() => goTo(i)}
            title={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* =========================================================
          Panel 0: HERO
          ========================================================= */}
      <section ref={p0Ref} className="pn p0" style={{ zIndex: 1 }}>
        {/* Split Name: DEBASHREE on Left, MAL on Right in exact #EFEAE0 (Recessed BEHIND Robot, Z-Index: 2) */}
        <div className="hero-split-name">
          <span ref={hLeftRef} className="hero-name-left l">DEBASHREE</span>
          <span ref={hRightRef} className="hero-name-right l">MAL</span>
        </div>

        {/* 3D Robot Model centered, in front of text (Z-Index: 10) */}
        <div ref={hRobotRef} className="hero-robot-wrap">
          <Suspense fallback={null}>
            <HeroRobot isVisible={heroActive} />
          </Suspense>
        </div>
      </section>

      {/* =========================================================
          Panel 1: ABOUT (FULL SCREEN)
          ========================================================= */}
      <section ref={p1Ref} className="pn p1" style={{ zIndex: 2, display: 'none' }}>
        <div className="sheet" id="sheet" ref={sheetRef} />

        <div ref={aLRef} className="grp">
          <div className="rv" style={{ left: 'clamp(24px, 6vw, 84px)', top: 'clamp(60px, 11vh, 120px)', height: 'clamp(60px, 10vw, 130px)' }}>
            <span
              ref={(el) => { aRevealsRef.current[0] = el; }}
              style={{ font: '400 clamp(68px, 10vw, 140px)/.9 var(--an)', color: '#111' }}
            >
              ABOUT
            </span>
          </div>
          <div className="rv" style={{ left: 'clamp(24px, 6vw, 84px)', top: 'calc(clamp(60px, 11vh, 120px) + clamp(55px, 8.8vw, 125px))', height: 'clamp(60px, 10vw, 130px)' }}>
            <span
              ref={(el) => { aRevealsRef.current[1] = el; }}
              style={{ font: '400 clamp(68px, 10vw, 140px)/.9 var(--an)', color: '#111' }}
            >
              ME
            </span>
          </div>

          <div
            ref={aBarRef}
            style={{
              position: 'absolute',
              left: 'clamp(24px, 6vw, 84px)',
              top: 'calc(clamp(60px, 11vh, 120px) + clamp(120px, 18vw, 255px))',
              width: 'clamp(60px, 8vw, 100px)',
              height: 'clamp(6px, 0.8vh, 10px)',
              background: 'var(--rd)',
              transformOrigin: 'left',
            }}
          />

          <div
            className="rv"
            style={{
              left: 'clamp(24px, 6vw, 84px)',
              top: 'calc(clamp(60px, 11vh, 120px) + clamp(138px, 20vw, 285px))',
              height: 'clamp(20px, 3vh, 32px)',
            }}
          >
            <span
              ref={(el) => { aRevealsRef.current[2] = el; }}
              style={{ font: '500 clamp(11px, 1.2vw, 16px) var(--mo)', letterSpacing: '.12em', color: '#111' }}
            >
              FULL-STACK DEVELOPER / AI BUILDER
            </span>
          </div>

          <div
            className="rv"
            style={{
              left: 'clamp(24px, 6vw, 84px)',
              top: 'calc(clamp(60px, 11vh, 120px) + clamp(168px, 23vw, 325px))',
              height: 'clamp(20px, 3vh, 32px)',
              width: 'min(520px, 50vw)',
            }}
          >
            <span
              ref={(el) => { aRevealsRef.current[3] = el; }}
              style={{ fontSize: 'clamp(12px, 1.3vw, 18px)', color: '#333' }}
            >
              CE undergrad from Mumbai (class of 2028).
            </span>
          </div>
          <div
            className="rv"
            style={{
              left: 'clamp(24px, 6vw, 84px)',
              top: 'calc(clamp(60px, 11vh, 120px) + clamp(192px, 26vw, 360px))',
              height: 'clamp(20px, 3vh, 32px)',
              width: 'min(520px, 50vw)',
            }}
          >
            <span
              ref={(el) => { aRevealsRef.current[4] = el; }}
              style={{ fontSize: 'clamp(12px, 1.3vw, 18px)', color: '#333' }}
            >
              I build AI products for India's underserved
            </span>
          </div>
          <div
            className="rv"
            style={{
              left: 'clamp(24px, 6vw, 84px)',
              top: 'calc(clamp(60px, 11vh, 120px) + clamp(216px, 29vw, 395px))',
              height: 'clamp(20px, 3vh, 32px)',
              width: 'min(520px, 50vw)',
            }}
          >
            <span
              ref={(el) => { aRevealsRef.current[5] = el; }}
              style={{ fontSize: 'clamp(12px, 1.3vw, 18px)', color: '#333' }}
            >
              markets, from hackathon builds to live apps.
            </span>
          </div>

          {/* Pill Badges */}
          <div
            ref={(el) => { pillsRef.current[0] = el; }}
            className="pill"
            style={{
              left: 'clamp(24px, 6vw, 84px)',
              bottom: 'clamp(40px, 8vh, 80px)',
            }}
          >
            1ST / AXION HACKATHON
          </div>
          <div
            ref={(el) => { pillsRef.current[1] = el; }}
            className="pill"
            style={{
              left: 'calc(clamp(24px, 6vw, 84px) + clamp(170px, 18vw, 240px))',
              bottom: 'clamp(40px, 8vh, 80px)',
            }}
          >
            5+ PROJECTS
          </div>
          <div
            ref={(el) => { pillsRef.current[2] = el; }}
            className="pill"
            style={{
              left: 'calc(clamp(24px, 6vw, 84px) + clamp(280px, 28vw, 370px))',
              bottom: 'clamp(40px, 8vh, 80px)',
            }}
          >
            MUMBAI
          </div>
        </div>

        <div ref={aRRef} className="grp">
          {/* Red circle */}
          <div ref={aCircRef} className="circ" />

          {/* Arch cutout */}
          <div ref={aPhRef} className="ph1">
            <img
              src={debashreePhoto}
              alt="Debashree Mal"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 10%',
                filter: 'drop-shadow(0 10px 22px rgba(0, 0, 0, 0.2)) contrast(1.04) brightness(1.02)',
              }}
            />
          </div>

          <div
            ref={tg1Ref}
            className="tag"
            style={{
              right: 'clamp(180px, 24vw, 360px)',
              top: 'clamp(70px, 16vh, 160px)',
              background: 'rgba(18, 18, 22, 0.78)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              color: 'var(--cr)',
            }}
          >
            CE '28
          </div>
          <div
            ref={tg2Ref}
            className="tag"
            style={{
              right: 'clamp(30px, 6vw, 80px)',
              top: 'clamp(220px, 48vh, 440px)',
              background: 'rgba(239, 234, 224, 0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: '#111',
              border: '1px solid rgba(0, 0, 0, 0.15)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            }}
          >
            AI FOR BHARAT
          </div>
        </div>
      </section>

      {/* =========================================================
          Panel 2: WINS (3D CARD STACK - FROM v9 & v10)
          ========================================================= */}
      <section ref={p2Ref} className="pn p2" style={{ zIndex: 3, display: 'none' }}>
        <div className="wt">
          {'WINS'.split('').map((char, i) => (
            <span
              key={i}
              ref={(el) => { wLettersRef.current[i] = el; }}
              className="l"
            >
              {char}
            </span>
          ))}
        </div>

        {/* Left Info Block */}
        <div ref={wInfoRef} className="w-info">
          <div className="wn key-swap" key={`wn-${wCard}`}>{W5_DATA[wCard].title}</div>
          <div className="ws key-swap" key={`ws-${wCard}`}>{W5_DATA[wCard].sub}</div>
          <div className="wd key-swap" key={`wd-${wCard}`}>{W5_DATA[wCard].desc}</div>

          {/* Minimal Card Nav Controls */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '22px' }}>
            <button
              type="button"
              onClick={() => {
                if (wCard > 0) {
                  tgtRef.current = Math.max(0.34, tgtRef.current - 0.04);
                } else {
                  goTo(1);
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: wCard === 0 ? 'rgba(255, 255, 255, 0.25)' : '#EFEAE0',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '6px 14px',
                borderRadius: '999px',
                cursor: wCard === 0 ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--mo)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                boxShadow: 'none',
                transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
              }}
            >
              PREV
            </button>
            <button
              type="button"
              onClick={() => {
                if (wCard < 4) {
                  tgtRef.current = Math.min(0.50, tgtRef.current + 0.04);
                } else {
                  goTo(3);
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#EFEAE0',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '6px 16px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontFamily: 'var(--mo)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                boxShadow: 'none',
                transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
              }}
            >
              {wCard < 4 ? 'NEXT CARD →' : 'EXPLORE MOMENTS →'}
            </button>
          </div>
        </div>

        {/* 3D Peeling Stack */}
        <div ref={wStackRef} className="w-stack">
          {W5_DATA.map((w, i) => {
            const k = W_CC[i];
            const isDark = k[0] === '#1b1b1f';
            return (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="wc"
                onClick={() => {
                  tgtRef.current = 0.34 + (i / 4) * (0.50 - 0.34);
                }}
                style={{
                  background: isDark
                    ? '#1b1b1f'
                    : k[0] === '#EE3B1F'
                      ? '#EE3B1F'
                      : '#EFEAE0',
                  color: k[1],
                  border: isDark
                    ? '1px solid rgba(255, 255, 255, 0.16)'
                    : '1px solid rgba(0, 0, 0, 0.12)',
                  boxShadow: '0 20px 48px rgba(0, 0, 0, 0.65)',
                }}
              >
                <i className="tp" />
                <div className="im">
                  <i className={`ti ${w.icon}`} />
                </div>
                <div className="cn">{w.title}</div>
                <div className="cs">{w.sub}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          Panel 3: MOMENTS (REACT BITS CIRCULAR CAROUSEL)
          ========================================================= */}
      <section ref={p4Ref} className="pn p4" style={{ zIndex: 4, display: 'none' }}>
        <div
          className="domew"
          id="domew"
          ref={domewRef}
          style={{ perspective: `${domeConfig.perspective}px` }}
        >
          <div className="dome" id="dome" ref={domeRef}>
            {domeTiles}
          </div>
        </div>
        <div className="vg2" />
        <div
          ref={mtlRef}
          style={{
            position: 'absolute',
            left: 'clamp(24px, 5.5vw, 72px)',
            top: 'clamp(50px, 10vh, 100px)',
            font: '400 clamp(48px, 6.5vw, 92px)/.9 var(--an)',
            color: 'var(--cr)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          MOMENTS
        </div>

        {/* 3D Pop-Out Expanded Card (1st click pops out, 2nd click docks back to place) */}
        {activeCard !== null && (
          <div
            className="moments-modal-backdrop"
            onClick={() => setActiveCard(null)}
          >
            <div
              className="moments-modal-card-3d"
              onClick={(e) => {
                e.stopPropagation();
                setActiveCard(null); // 2nd click on the card returns it back to its place!
              }}
              style={{
                background: MOMENTS_ITEMS[activeCard % MOMENTS_ITEMS.length].color,
                color: MOMENTS_ITEMS[activeCard % MOMENTS_ITEMS.length].color === '#171719' ? '#EFEAE0' : '#111',
                border: MOMENTS_ITEMS[activeCard % MOMENTS_ITEMS.length].color === '#171719' ? '1px solid rgba(255, 255, 255, 0.2)' : '2px solid #111',
              }}
            >
              {/* Card Header */}
              <div className="mm-card-head">
                <span className="mm-badge">
                  {MOMENTS_ITEMS[activeCard % MOMENTS_ITEMS.length].category}
                </span>
                <span className="mm-num">
                  #{('0' + ((activeCard % MOMENTS_ITEMS.length) + 1)).slice(-2)}
                </span>
              </div>

              {/* Card Center Visual: High-res Portrait Photograph */}
              <div className="mm-card-img-wrap">
                <img
                  src={MOMENTS_ITEMS[activeCard % MOMENTS_ITEMS.length].img}
                  alt={MOMENTS_ITEMS[activeCard % MOMENTS_ITEMS.length].title}
                  className="mm-card-img"
                />
              </div>

              {/* Card Body */}
              <div className="mm-card-body">
                <div className="mm-tag">{MOMENTS_ITEMS[activeCard % MOMENTS_ITEMS.length].tag}</div>
                <h3 className="mm-title">{MOMENTS_ITEMS[activeCard % MOMENTS_ITEMS.length].title}</h3>
                <p className="mm-desc">{MOMENTS_ITEMS[activeCard % MOMENTS_ITEMS.length].desc}</p>
              </div>

              {/* Card Footer */}
              <div className="mm-card-foot">
                <span className="mm-year">{MOMENTS_ITEMS[activeCard % MOMENTS_ITEMS.length].date} • MUMBAI</span>
                <button
                  className="mm-close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCard(null);
                  }}
                >
                  CLICK TO DOCK ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================
          Panel 4: CONTACT (LAST SCREEN - STARTS AS MOMENTS REACHES MIDDLE)
          ========================================================= */}
      <section ref={p5Ref} className="pn p5" style={{ zIndex: 5, display: 'none' }}>
        {/* Ambient Top Tagline / Title */}
        <div
          ref={cTitleRef}
          style={{
            position: 'absolute',
            top: 'clamp(50px, 10vh, 90px)',
            left: 'clamp(24px, 5.5vw, 72px)',
            right: 'clamp(24px, 5.5vw, 72px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--bn, "Bebas Neue", "Anton", sans-serif)',
                fontSize: 'clamp(54px, 8.5vw, 120px)',
                lineHeight: 0.9,
                color: '#EFEAE0',
                letterSpacing: '0.02em',
                display: 'block',
                textTransform: 'uppercase',
              }}
            >
              LET'S CONNECT
            </span>
            <span
              ref={cSubTextRef}
              style={{
                fontFamily: 'var(--mo)',
                fontSize: 'clamp(11px, 1.1vw, 14px)',
                color: 'var(--rd)',
                letterSpacing: '0.14em',
                display: 'block',
                marginTop: '8px',
              }}
            >
              MUMBAI, INDIA • OPEN FOR AI &amp; FULL-STACK COLLABORATIONS
            </span>
          </div>
        </div>

        {/* SAY HELLO Flying Rocket Button - Wide seamless canvas so smoke expands freely, button placed on right */}
        <div
          ref={cSayHelloRef}
          style={{
            position: 'absolute',
            right: 'clamp(8px, 2.5vw, 36px)',
            bottom: 'calc(clamp(260px, 42vh, 440px) + 6px)',
            width: 'clamp(440px, 54vw, 760px)',
            height: 'clamp(280px, 36vh, 420px)',
            zIndex: 15,
            opacity: 0,
            pointerEvents: 'auto',
          }}
        >
          <FlyingButton
            theme="dark"
            size="medium"
            altitude={210}
            hoverTime={2.4}
            jets={2}
            thrusters
            trigger="click"
            carryCursor
            smoke={1.2}
            turbulence={1.2}
            wobble={1}
            ramp={false}
            buttonAlign="right"
            thrustColor="#EE3B1F"
            smokeColor="#EFEAE0"
            buttonColor="#18181b"
            textColor="#EFEAE0"
            onClick={() => {
              window.location.href = 'mailto:debashreee87@gmail.com';
            }}
          >
            SAY HELLO ↗
          </FlyingButton>
        </div>

        {/* Cream Ripped Bottom Sheet */}
        <div ref={cSheetRef} className="contact-bottom-sheet">
          <div className="contact-services-tag">
            <span>FULL-STACK</span>
            <em>|</em>
            <span>AI &amp; AGENTS</span>
            <em>|</em>
            <span>SYSTEM DESIGN</span>
            <em>|</em>
            <span>OFFLINE FACE SDK</span>
            <em>|</em>
            <span>HACKATHON WINNER</span>
          </div>

          <div className="contact-footer-bar">
            {/* Left: Direct Mail Link Button */}
            <a
              href="mailto:debashreee87@gmail.com"
              className="contact-me-btn"
              title="Send direct email"
            >
              SAY HELLO ↗
            </a>

            {/* Center: Email Address */}
            <a
              href="mailto:debashreee87@gmail.com"
              className="contact-email-link"
              title="Copy or send email"
            >
              debashreee87@gmail.com
            </a>

            {/* Right: Social Circle Buttons */}
            <div className="contact-social-wrap">
              <div className="social-icons-row">
                <a
                  href="https://www.linkedin.com/in/debashree-mal-118837269/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-circle-btn"
                  title="LinkedIn Profile"
                >
                  <i className="ti ti-brand-linkedin" />
                </a>
                <a
                  href="https://github.com/debashree-08"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-circle-btn"
                  title="GitHub Profile"
                >
                  <i className="ti ti-brand-github" />
                </a>
                <a
                  href="mailto:debashreee87@gmail.com"
                  className="social-circle-btn"
                  title="Send Email"
                >
                  <i className="ti ti-mail" />
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-circle-btn"
                  title="Download Resume"
                >
                  <i className="ti ti-download" />
                </a>
              </div>
              <span className="contact-handle">@debashree_mal • CE '28</span>
            </div>
          </div>
        </div>

        {/* Back to Top Floating Pill Button */}
        <button
          ref={cTopBtnRef}
          onClick={() => goTo(0)}
          className="back-to-top-pill"
          title="Return to top"
          style={{
            position: 'absolute',
            right: 'clamp(16px, 3.5vw, 40px)',
            bottom: 'clamp(14px, 2.2vh, 26px)',
            zIndex: 30,
            opacity: 0,
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease, transform 0.2s ease, background 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#141417',
            color: '#EFEAE0',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '999px',
            padding: '9px 20px',
            fontFamily: 'var(--mo)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
          }}
        >
          <i className="ti ti-arrow-up" style={{ fontSize: '13px', color: 'var(--rd)' }} />
          <span>TOP</span>
        </button>
      </section>

      {/* Morphing Orange Circle -> WINS Title */}
      <div
        ref={morphCircRef}
        className="morph-circle"
        style={{ display: 'none' }}
      />

      {/* Hero Flying Coin-to-Sticker Card (Transitions from Moments Zoom -> Contact Sticker) */}
      <div
        ref={coinCardRef}
        className="coin-sticker-wrap"
        onClick={() => {
          if (coinCardRef.current?.dataset.stuck === 'true') {
            goTo(3); // Jump back to moments on click
          }
        }}
        title="Featured Moment • Click to explore archive"
        style={{ display: 'none' }}
      >
        <div ref={coinFlipperRef} className="coin-flipper">
          {/* FRONT FACE: The Moment Card */}
          <div className="coin-face coin-front">
            <div className="coin-card-header">
              <span className="coin-badge">● 1ST PLACE</span>
              <span className="coin-number">#01</span>
            </div>
            <div className="coin-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80&auto=format&fit=crop"
                alt="Axion Hackathon"
                className="coin-img"
              />
              <div className="coin-sticker-tape">STICKER</div>
            </div>
            <div className="coin-card-body">
              <div className="coin-tag">AI PROJECT MANAGER</div>
              <div className="coin-title">Axion Hackathon</div>
            </div>
            <div className="coin-card-footer">
              <span className="coin-year">2025 • 3D ARCHIVE</span>
              <i className="ti ti-arrow-up-right" style={{ color: 'var(--rd)', fontSize: '11px' }} />
            </div>
            <div className="coin-sheen" />
          </div>

          {/* BACK FACE: Collector's Reverse Obsidian Coin */}
          <div className="coin-face coin-back">
            <div className="coin-back-inner">
              <div className="coin-back-ring">
                <span className="coin-back-monogram">DM</span>
              </div>
              <span className="coin-back-label">VERIFIED ARCHIVE</span>
              <span className="coin-back-sub">DEBASHREE MAL • 2025</span>
              <span className="coin-back-stamp">★ COLLECTED ★</span>
            </div>
            <div className="coin-sheen" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
