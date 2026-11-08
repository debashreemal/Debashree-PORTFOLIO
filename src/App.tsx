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
function lp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const W5_DATA = [
  {
    title: 'Axion Hackathon',
    sub: '1ST PLACE',
    category: '1ST PLACE • 2025',
    tag: 'AI Project Manager',
    desc: 'FlowMind, an autonomous multi-agent project manager, outcompeted 120+ teams with end-to-end task graph routing.',
    icon: 'ti-trophy',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80&auto=format&fit=crop',
    metric: '120+ Teams',
    stack: ['LangGraph', 'Python', 'FastAPI'],
    quote: 'Recognized for automated workflow intelligence & deterministic task execution.',
    year: '2025',
  },
  {
    title: 'NHAI Hackathon 7.0',
    sub: 'OFFLINE FACE SDK',
    category: 'OFFLINE FACE SDK • 2025',
    tag: 'Computer Vision',
    desc: 'Engineered NHAIFaceID with Piyush Yenorkar — an offline edge facial recognition SDK for remote highway toll inspection.',
    icon: 'ti-scan',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    metric: '<18ms Latency',
    stack: ['WebAssembly', 'C++', 'OpenCV'],
    quote: 'Complete on-device biometrics running locally at edge toll booths with zero cloud reliance.',
    year: '2025',
  },
  {
    title: "HackHazards '26",
    sub: 'FLOWMIND',
    category: 'GRAND FINALE • 2026',
    tag: 'Autonomous AI',
    desc: 'FlowMind placed at the centre of build: a live multi-agent execution framework with zero-latency task routing.',
    icon: 'ti-flame',
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80&auto=format&fit=crop',
    metric: 'Swarm Engine',
    stack: ['LangGraph', 'Multi-Agent', 'Next.js'],
    quote: 'Self-orchestrating task dependency graphs with real-time exception recovery.',
    year: '2026',
  },
  {
    title: 'Smart India Hackathon',
    sub: 'SIH 2026',
    category: 'SIH 2026 FINALIST • 2026',
    tag: 'MoSPI Ministry',
    desc: 'Developed national Airfare Price Index forecasting algorithm using real-time flight telemetry for Ministry of Statistics.',
    icon: 'ti-award',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80&auto=format&fit=crop',
    metric: 'Ministry Finalist',
    stack: ['Telemetry', 'Python', 'MoSPI API'],
    quote: 'National-scale inflation monitoring model for domestic aviation ticket fares.',
    year: '2026',
  },
  {
    title: 'Paytm Build for India',
    sub: 'AI TEAMMATES',
    category: 'AI TEAMMATES • 2025',
    tag: 'Sulajh AI',
    desc: 'Sulajh AI: autonomous AI teammates simulating merchant onboarding workflows, automated KYC exception resolution.',
    icon: 'ti-rocket',
    img: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800&q=80&auto=format&fit=crop',
    metric: 'India Scale',
    stack: ['LLM Agents', 'FastAPI', 'FinTech SDK'],
    quote: 'Scaling merchant acquisition through interactive autonomous agent simulation.',
    year: '2025',
  },
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

const MILESTONES = [0, 0.24, 0.48, 0.74, 1.0];
const THRESHOLDS = [0, 0.12, 0.31, 0.65, 0.88];
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
  const aPhRef = useRef<HTMLDivElement>(null);
  const tg1Ref = useRef<HTMLDivElement>(null);
  const tg2Ref = useRef<HTMLDivElement>(null);
  const aRevealsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const pillsRef = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  // 3D Book Wins Refs
  const bookStageRef = useRef<HTMLDivElement>(null);
  const bookWrapRef = useRef<HTMLDivElement>(null);
  const bookBackRef = useRef<HTMLDivElement>(null);
  const bookSpineRef = useRef<HTMLDivElement>(null);
  const bookForeRef = useRef<HTMLDivElement>(null);
  const bookTopEdgeRef = useRef<HTMLDivElement>(null);
  const bookBotEdgeRef = useRef<HTMLDivElement>(null);
  const bookCoverRef = useRef<HTMLDivElement>(null);
  const bookFrontRef = useRef<HTMLDivElement>(null);
  const bookCoverTopRef = useRef<HTMLDivElement>(null);
  const bookCoverBottomRef = useRef<HTMLDivElement>(null);
  const bookTitleWrapRef = useRef<HTMLDivElement>(null);
  const bookLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bookShineRef = useRef<HTMLDivElement>(null);
  const bookLeafRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bookShadowRef = useRef<HTMLDivElement>(null);
  const bookCounterRef = useRef<HTMLSpanElement>(null);
  const bookControlsRef = useRef<HTMLDivElement>(null);
  const bookNextBtnRef = useRef<HTMLButtonElement>(null);
  const bookPrevBtnRef = useRef<HTMLButtonElement>(null);

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

  // 3D Book Page Turning Callbacks (exact, obstacle-free page targets)
  const turnNext = useCallback(() => {
    if (tgtRef.current < 0.44) {
      tgtRef.current = 0.48; // Open to Page 1
    } else if (tgtRef.current < 0.48) {
      tgtRef.current = 0.48;
    } else {
      const curTurn = sg(tgtRef.current, 0.48, 0.60) * 5;
      const curPage = Math.min(5, Math.floor(curTurn + 0.1));
      if (curPage < 4) {
        // Go to next page (1, 2, 3, 4)
        tgtRef.current = 0.48 + (curPage + 1) * (0.12 / 5);
      } else if (curPage === 4) {
        // At Page 5: CLOSE THE BOOK!
        tgtRef.current = 0.62;
      } else {
        // From closed book: GO TO MOMENTS!
        goTo(3);
      }
    }
  }, [goTo]);

  const turnPrev = useCallback(() => {
    if (tgtRef.current <= 0.425) {
      tgtRef.current = 0.38; // Return to closed 3D book cover
    } else if (tgtRef.current <= 0.485) {
      tgtRef.current = 0.42; // Return to 3D accordion fan state
    } else if (tgtRef.current >= 0.61) {
      // Re-open from closed book back to Page 5
      tgtRef.current = 0.48 + 4 * (0.12 / 5);
    } else {
      const curTurn = sg(tgtRef.current, 0.48, 0.60) * 5;
      const curPage = Math.min(5, Math.floor(curTurn + 0.1));
      if (curPage > 0) {
        tgtRef.current = 0.48 + (curPage - 1) * (0.12 / 5);
      } else {
        tgtRef.current = 0.42;
      }
    }
  }, []);

  const handleLeafClick = useCallback((idx: number) => {
    if (tgtRef.current < 0.48) {
      tgtRef.current = 0.48;
      return;
    }
    const curTurn = sg(tgtRef.current, 0.48, 0.60) * 5;
    const curPage = Math.min(5, Math.floor(curTurn + 0.1));
    if (idx < curPage) {
      tgtRef.current = 0.48 + idx * (0.12 / 5);
    } else if (idx === curPage && curPage < 4) {
      tgtRef.current = 0.48 + (curPage + 1) * (0.12 / 5);
    } else if (idx === 4 && curPage === 4) {
      // Clicking the last page closes the book!
      tgtRef.current = 0.62;
    } else if (idx > curPage) {
      tgtRef.current = 0.48 + idx * (0.12 / 5);
    }
  }, []);

  const handleCoverClick = useCallback(() => {
    if (tgtRef.current < 0.44) {
      tgtRef.current = 0.48;
    } else if (tgtRef.current >= 0.61) {
      tgtRef.current = 0.48;
    } else {
      tgtRef.current = 0.42;
    }
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

      tgtRef.current = cl(tgtRef.current + d * 0.00068);
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
        stageRef.current.dataset.dk = (p > 0.07 && p < 0.28) || p > 0.86 ? '1' : '0';
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
          const hs = sg(p, 0.005, 0.12);

          // Name parallax exit with velocity skew & dynamic spread
          if (hLeftRef.current) {
            hLeftRef.current.style.transform = `translate3d(${-240 * hs}px, ${-180 * hs - p * 60}px, 0) rotate(${-8 * hs}deg) skewX(${-sk}deg)`;
            hLeftRef.current.style.opacity = `${1 - cl(hs * 1.5)}`;
          }
          if (hRightRef.current) {
            hRightRef.current.style.transform = `translate3d(${240 * hs}px, ${-180 * hs - p * 60}px, 0) rotate(${8 * hs}deg) skewX(${-sk}deg)`;
            hRightRef.current.style.opacity = `${1 - cl(hs * 1.5)}`;
          }

          // 3D Robot model smooth sink straight down below screen (zero scaling, original length preserved)
          if (hRobotRef.current) {
            const robotSink = io(sg(p, 0.005, 0.12));
            hRobotRef.current.style.transform = `translate3d(0, ${robotSink * 115}vh, 0)`;
            hRobotRef.current.style.opacity = `${1 - cl(robotSink * 1.5)}`;
          }
        }
      }

      // Dimensions calculated exactly as in about-to-wins-final.html
      const vw = windowWidth;
      const vh = windowHeight;
      const bw = Math.min(330, vw * 0.7, vh * 0.48);
      const bh = bw * 1.36;
      const T = bw * 0.13;
      const isMobile = vw < 760;
      const D = isMobile ? Math.min(vw * 0.62, vh * 0.3) : Math.min(vw * 0.31, vh * 0.66);
      const cx0 = isMobile ? vw * 0.5 : vw * 0.76;
      const cy0 = isMobile ? vh * 0.7 : vh * 0.48;

      // Update CSS variables for book dimensions
      document.documentElement.style.setProperty('--w', `${bw}px`);
      document.documentElement.style.setProperty('--h', `${bh}px`);
      document.documentElement.style.setProperty('--t', `${T}px`);

      // =========================================================
      // PANEL 1: ABOUT ME (0.008 < p < 0.34)
      // Master Choreography:
      // 1. Cream sheet foundation arrives FIRST (p: 0.01 -> 0.085)
      //    establishing the pristine archival canvas with zero visual leaks.
      // 2. Orange circle appears SMALL, then smoothly blooms into
      //    BIG ORIGINAL size (p: 0.085 -> 0.155).
      // 3. Cutout portrait glides up into circle (p: 0.145 -> 0.205).
      // 4. Floating tags & pills pop into place (p: 0.185 -> 0.235).
      // =========================================================
      const aboutVisible = p > 0.008 && p < 0.34;
      if (p1Ref.current) {
        p1Ref.current.style.display = aboutVisible ? 'block' : 'none';
        p1Ref.current.style.zIndex = p > 0.28 ? '2' : '4';
        p1Ref.current.style.pointerEvents = (p > 0.16 && p < 0.26) ? 'auto' : 'none';

        if (aboutVisible) {
          // Keep p1Ref fixed at fullscreen so individual elements flow with independent physics
          p1Ref.current.style.transform = 'none';

          // -----------------------------------------------------
          // 1. CREAM SHEET FOUNDATION ARRIVES FIRST! (p: 0.01 -> 0.085)
          // Rises gracefully from below, fully covering dark hero before circle emerges
          // -----------------------------------------------------
          if (sheetRef.current) {
            const sheetIn = io(sg(p, 0.01, 0.085));
            if (p < 0.26) {
              sheetRef.current.style.transform = `translateY(${(100 * (1 - sheetIn)).toFixed(1)}%)`;
              sheetRef.current.style.opacity = '1';
            } else {
              sheetRef.current.style.transform = 'none';
              sheetRef.current.style.opacity = `${cl(1 - sg(p, 0.26, 0.29)).toFixed(3)}`;
            }
          }

          // Initial anchor placements of photo arch, red circle, and tags
          if (aCircRef.current) {
            aCircRef.current.style.width = `${D}px`;
            aCircRef.current.style.height = `${D}px`;
            aCircRef.current.style.left = `${cx0 - D / 2}px`;
            aCircRef.current.style.top = `${cy0 - D / 2}px`;
          }
          if (aPhRef.current) {
            const pw = D * 0.565;
            const phh = D * 0.92;
            aPhRef.current.style.width = `${pw}px`;
            aPhRef.current.style.height = `${phh}px`;
            aPhRef.current.style.left = `${cx0 + D * 0.044 - pw / 2}px`;
            aPhRef.current.style.top = `${cy0 - D * 0.334}px`;
          }
          if (tg1Ref.current) {
            tg1Ref.current.style.left = `${cx0 - D * 0.43}px`;
            tg1Ref.current.style.top = `${cy0 - D * 0.5}px`;
          }
          if (tg2Ref.current) {
            tg2Ref.current.style.left = `${cx0 + D * 0.26}px`;
            tg2Ref.current.style.top = `${cy0 - D * 0.03}px`;
          }

          // -----------------------------------------------------
          // 2. ORANGE CIRCLE: STARTS SMALL, THEN BLOOMS TO BIG ORIGINAL! (p: 0.085 -> 0.155)
          // Emerges strictly after cream sheet has arrived. Starts as a compact glowing seed,
          // then blossoms smoothly and organically into full original scale.
          // -----------------------------------------------------
          if (aCircRef.current) {
            if (p < 0.25) {
              if (p < 0.085) {
                aCircRef.current.style.opacity = '0';
                aCircRef.current.style.transform = 'translate3d(0, 140px, 0) scale(0)';
              } else {
                const uCirc = sg(p, 0.085, 0.155);
                // Starts small (scale ~0.10) and grows with smooth cubic progression to 1.0 (big original)
                const circGrowth = Math.pow(uCirc, 1.25);
                const circScale = lp(0.10, 1.0, circGrowth);
                const circLift = (1 - eo(uCirc)) * 120;
                aCircRef.current.style.transform = `translate3d(0, ${circLift.toFixed(1)}px, 0) scale(${circScale.toFixed(3)})`;
                aCircRef.current.style.opacity = `${cl(uCirc * 4.5).toFixed(3)}`;
              }
            } else {
              const uc = io(sg(p, 0.26, 0.32));
              const s = lp(1, 18 / Math.max(1, D), uc);
              const targetX = (vw / 2) - cx0;
              const targetY = (vh / 2) - cy0;
              const arcY = Math.sin(uc * Math.PI) * 60;
              aCircRef.current.style.transform = `translate3d(${(targetX * uc).toFixed(1)}px, ${(targetY * uc - arcY).toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
              aCircRef.current.style.opacity = `${cl(1 - sg(p, 0.315, 0.335)).toFixed(3)}`;
            }
          }

          // -----------------------------------------------------
          // 3. CUTOUT PORTRAIT: ENTERS AFTER CIRCLE IS BIG ORIGINAL! (p: 0.145 -> 0.205)
          // Glides up from below into the glowing circle with gentle tilt
          // -----------------------------------------------------
          if (aPhRef.current) {
            if (p < 0.25) {
              if (p < 0.145) {
                aPhRef.current.style.opacity = '0';
                aPhRef.current.style.transform = 'translate3d(0, 340px, 0) rotate(-4deg) scale(0.88)';
              } else {
                const uPh = sg(p, 0.145, 0.205);
                const phEase = eo(uPh);
                const phLift = (1 - phEase) * 340;
                const phRot = (1 - phEase) * -4;
                const phScale = lp(0.88, 1.0, phEase);
                aPhRef.current.style.transform = `translate3d(0, ${phLift.toFixed(1)}px, 0) rotate(${phRot.toFixed(2)}deg) scale(${phScale.toFixed(3)})`;
                aPhRef.current.style.opacity = `${cl(uPh * 3.5).toFixed(3)}`;
              }
            } else {
              const up = io(sg(p, 0.26, 0.30));
              aPhRef.current.style.transform = `translateY(${(vh * 0.7 * up).toFixed(1)}px) rotate(${(8 * up).toFixed(2)}deg)`;
              aPhRef.current.style.opacity = `${cl(1 - sg(p, 0.28, 0.30)).toFixed(3)}`;
            }
          }

          // -----------------------------------------------------
          // 4. FLOATING TAGS: POP INTO ORBIT AFTER CUTOUT IS DOCKED! (p: 0.185 -> 0.235)
          // -----------------------------------------------------
          if (tg1Ref.current) {
            if (p < 0.25) {
              if (p < 0.185) {
                tg1Ref.current.style.opacity = '0';
                tg1Ref.current.style.transform = 'scale(0)';
              } else {
                const u1 = sg(p, 0.185, 0.225);
                const tag1Scale = Math.max(0, eb(u1));
                const tag1Rot = -8 + (1 - eo(u1)) * 24;
                const tag1Lift = (1 - eo(u1)) * 40;
                tg1Ref.current.style.transform = `translate3d(0, ${tag1Lift.toFixed(1)}px, 0) rotate(${tag1Rot.toFixed(1)}deg) scale(${tag1Scale.toFixed(3)})`;
                tg1Ref.current.style.opacity = `${cl(u1 * 4).toFixed(3)}`;
              }
            } else {
              const ut = io(sg(p, 0.26, 0.295));
              tg1Ref.current.style.transform = `translate(${(-vw * 0.2 * ut).toFixed(1)}px, ${(-vh * 0.4 * ut).toFixed(1)}px) rotate(${(-8 - 40 * ut).toFixed(1)}deg)`;
              tg1Ref.current.style.opacity = `${cl(1 - sg(p, 0.275, 0.295)).toFixed(3)}`;
            }
          }

          if (tg2Ref.current) {
            if (p < 0.25) {
              if (p < 0.195) {
                tg2Ref.current.style.opacity = '0';
                tg2Ref.current.style.transform = 'scale(0)';
              } else {
                const u2 = sg(p, 0.195, 0.235);
                const tag2Scale = Math.max(0, eb(u2));
                const tag2Rot = 6 + (1 - eo(u2)) * -22;
                const tag2Slide = (1 - eo(u2)) * 80;
                tg2Ref.current.style.transform = `translate3d(${tag2Slide.toFixed(1)}px, 0, 0) rotate(${tag2Rot.toFixed(1)}deg) scale(${tag2Scale.toFixed(3)})`;
                tg2Ref.current.style.opacity = `${cl(u2 * 4).toFixed(3)}`;
              }
            } else {
              const ut = io(sg(p, 0.26, 0.295));
              tg2Ref.current.style.transform = `translate(${(vw * 0.3 * ut).toFixed(1)}px, ${(vh * 0.1 * ut).toFixed(1)}px) rotate(${(6 + 30 * ut).toFixed(1)}deg)`;
              tg2Ref.current.style.opacity = `${cl(1 - sg(p, 0.275, 0.295)).toFixed(3)}`;
            }
          }

          // Bottom Pills: Staggered ripple pop-in
          pillsRef.current.forEach((pl, k) => {
            if (pl) {
              if (p < 0.25) {
                if (p < 0.19) {
                  pl.style.opacity = '0';
                  pl.style.transform = 'scale(0)';
                } else {
                  const uPill = sg(p, 0.19 + k * 0.012, 0.23 + k * 0.012);
                  const pillScale = Math.max(0, eb(uPill));
                  const pillLift = (1 - eo(uPill)) * 25;
                  pl.style.transform = `translate3d(0, ${pillLift.toFixed(1)}px, 0) scale(${pillScale.toFixed(3)})`;
                  pl.style.opacity = `${cl(uPill * 4).toFixed(3)}`;
                }
              } else {
                pl.style.opacity = `${cl(1 - sg(p, 0.26, 0.285)).toFixed(3)}`;
              }
            }
          });

          // Scroll Hint fades out as transition begins
          if (hintRef.current) {
            if (p < 0.25) {
              const uHint = sg(p, 0.21, 0.245);
              hintRef.current.style.opacity = `${(uHint * (1 - sg(p, 0.26, 0.285))).toFixed(3)}`;
            } else {
              hintRef.current.style.opacity = `${cl(1 - sg(p, 0.26, 0.285)).toFixed(3)}`;
            }
          }

          // Cascading reveals & exit for typography lines on Left
          const textDeltas = [0, 0.014, 0.028, 0.042, 0.056, 0.07];
          aRevealsRef.current.forEach((el, i) => {
            if (!el) return;
            if (p < 0.25) {
              const starts = [0.085, 0.105, 0.125, 0.145, 0.16, 0.175];
              const ends = [0.155, 0.175, 0.195, 0.21, 0.225, 0.235];
              const u = io(sg(p, starts[i], ends[i]));
              el.style.transform = `translateY(${(115 * (1 - u)).toFixed(1)}%)`;
            } else {
              const d = textDeltas[i] || 0;
              const uExit = io(sg(p, 0.26 + d * 0.45, 0.295 + d * 0.45));
              el.style.transform = `translateY(${(118 * uExit).toFixed(1)}%)`;
            }
          });

          // Red underline bar
          if (aBarRef.current) {
            if (p < 0.25) {
              aBarRef.current.style.transform = `scaleX(${eo(sg(p, 0.13, 0.19)).toFixed(3)})`;
            } else {
              aBarRef.current.style.transform = `scaleX(${(1 - eo(sg(p, 0.26, 0.285))).toFixed(3)})`;
            }
          }

          // Left text group parallax & velocity skew
          if (aLRef.current) {
            const textParallax = -(p - 0.24) * 160;
            aLRef.current.style.transform = `translate3d(0, ${textParallax.toFixed(1)}px, 0) skewY(${(sk * 0.35).toFixed(2)}deg)`;
          }
        }
      }

      // =========================================================
      // PANEL 2: WINS (3D BOOK - EXACT MATCH TO about-to-wins-final.html)
      // (0.255 < p < 0.69)
      // =========================================================
      const winsVisible = p > 0.255 && p < 0.69;
      if (p2Ref.current) {
        p2Ref.current.style.display = winsVisible ? 'block' : 'none';
        p2Ref.current.style.zIndex = p > 0.28 ? '4' : '2';

        if (winsVisible) {
          // -----------------------------------------------------
          // Step 1: Cream About sheet folds into cover (full viewport -> book)
          // p: 0.265 -> 0.33
          // -----------------------------------------------------
          const u = io(sg(p, 0.265, 0.33));
          const sx = lp((vw / bw) * 1.04, 1, u);
          const sy = lp((vh / bh) * 1.04, 1, u);

          if (bookFrontRef.current) {
            bookFrontRef.current.style.transform = `scale(${sx.toFixed(4)}, ${sy.toFixed(4)}) translateZ(1px)`;
            bookFrontRef.current.style.borderRadius = `${3 * u}px ${12 * u}px ${12 * u}px ${3 * u}px`;
            const isBookOpen = p > 0.40 && p < 0.62;
            bookFrontRef.current.style.boxShadow = isBookOpen
              ? 'none'
              : `0 ${20 * u}px ${45 * u}px rgba(0, 0, 0, ${0.45 * u}), -2px 0 6px rgba(0, 0, 0, 0.2)`;
          }

          // -----------------------------------------------------
          // Step 2: WINS letters tumble out from the red dot
          // p: 0.32 -> 0.355
          // -----------------------------------------------------
          const metaOp = sg(p, 0.325, 0.36);
          if (bookCoverTopRef.current) bookCoverTopRef.current.style.opacity = `${metaOp}`;
          if (bookCoverBottomRef.current) bookCoverBottomRef.current.style.opacity = `${metaOp}`;

          bookLetterRefs.current.forEach((l, i) => {
            if (!l) return;
            const w = eo(sg(p, 0.32 + i * 0.007, 0.355 + i * 0.007));
            l.style.transform = `translateX(${(1.5 - i) * bw * 0.22 * (1 - w)}px) scale(${0.06 + 0.94 * w}) rotate(${(i % 2 ? 1 : -1) * 40 * (1 - w)}deg)`;
            l.style.opacity = `${cl(w * 3)}`;
          });

          // -----------------------------------------------------
          // Step 3: 3D Perspective Tilt, Pop & Ground Shadow
          // p: 0.35 -> 0.40
          // -----------------------------------------------------
          const r = io(sg(p, 0.35, 0.40));
          const pop = Math.sin(sg(p, 0.33, 0.39) * Math.PI) * 0.04;
          const fl = Math.sin(now / 900) * 7 * sg(p, 0.39, 0.44);

          // -----------------------------------------------------
          // Step 4: Specular Sheen sweep across cover
          // p: 0.37 -> 0.40
          // -----------------------------------------------------
          if (bookShineRef.current) {
            const uShine = sg(p, 0.37, 0.40);
            bookShineRef.current.style.opacity = `${Math.sin(uShine * Math.PI) * 0.85}`;
            bookShineRef.current.style.transform = `translateX(${lp(-60, 60, uShine)}%)`;
          }

          // -----------------------------------------------------
          // Step 5: 3D Accordion Fan Reveal (MATCHES 0315e51d.jpg!)
          // p: 0.40 -> 0.44
          // -----------------------------------------------------
          const tiltT = sg(p, 0.40, 0.44);
          const tiltEase = io(tiltT);

          // -----------------------------------------------------
          // Step 6: Transition from Fan to Centered Flat Spread (MATCHES 1a0dbb24.jpg!)
          // p: 0.44 -> 0.48 (Milestone 2: WINS Open Spread)
          // -----------------------------------------------------
          const spreadT = sg(p, 0.44, 0.48);
          const spreadEase = io(spreadT);

          // -----------------------------------------------------
          // Step 7: Interactive 5 Page Turns
          // p: 0.48 -> 0.60 (5 pages: Leaves 0, 1, 2, 3, 4)
          // -----------------------------------------------------
          const turnProgress = sg(p, 0.48, 0.60) * 5;

          // -----------------------------------------------------
          // Step 8: Book Closes After Last Page!
          // p: 0.60 -> 0.635 (Front cover & all pages swing shut)
          // -----------------------------------------------------
          const closeT = sg(p, 0.60, 0.635);
          const closeEase = io(closeT);

          // -----------------------------------------------------
          // Step 9: Smooth Circular Arc Zoom-Through Transition into Moments 3D Globe
          // p: 0.635 -> 0.685 (Closed book zooms in circular arc towards top-right and dissolves into black)
          // -----------------------------------------------------
          const zoomT = sg(p, 0.635, 0.685);
          const zoomEase = io(zoomT);

          // Dissolves cleanly as it hits the black background in the top-right
          const hitEdge = sg(zoomT, 0.55, 0.94);
          const wrapOpacity = 1 - hitEdge;

          // Fore-edge, top edge, and bottom edge:
          // Fully visible and 3D when the book is CLOSED (both before opening at p < 0.365 and after closing at p >= 0.60)
          // Smoothly hidden when the book is OPEN (during accordion fan and flat spread)
          const isClosedBefore = (1 - tiltEase) * (1 - spreadEase);
          const isClosedAfter = closeEase;
          const closedFactor = cl(isClosedBefore + isClosedAfter);
          const closedEdgeOp = cl(sg(p, 0.33, 0.365) * closedFactor * wrapOpacity);

          const closedEdges = [bookForeRef.current, bookTopEdgeRef.current, bookBotEdgeRef.current];
          closedEdges.forEach((el) => {
            if (el) {
              if (closedEdgeOp > 0.01) {
                el.style.display = 'block';
                el.style.opacity = `${closedEdgeOp.toFixed(3)}`;
              } else {
                el.style.display = 'none';
                el.style.opacity = '0';
              }
            }
          });

          // Real Back Cover remains present and solid behind pages throughout the 3D book experience!
          if (bookBackRef.current) {
            const backOp = sg(p, 0.33, 0.365) * wrapOpacity;
            bookBackRef.current.style.opacity = `${backOp.toFixed(3)}`;
            if (closedFactor > 0.4) {
              bookBackRef.current.style.boxShadow = '0 20px 45px rgba(0, 0, 0, 0.65), -4px 0 12px rgba(0, 0, 0, 0.35)';
            } else {
              bookBackRef.current.style.boxShadow = 'none';
            }
          }

          if (bookSpineRef.current) {
            // Spine is 100% visible when book is closed, smoothly tucks away when book is flat open
            const spineOp = cl(sg(p, 0.33, 0.365) * (closedFactor + (1 - closedFactor) * 0.3) * wrapOpacity);
            bookSpineRef.current.style.opacity = `${spineOp.toFixed(3)}`;
          }

          // Calculate Book Wrap coordinates & 3D orientation
          let targetWrapX = 0;
          if (spreadT > 0 && closeT === 0) {
            targetWrapX = (bw * 0.38) + (bw * 0.12) * spreadEase; // Centered flat open spread
          } else if (closeT > 0) {
            targetWrapX = (bw * 0.5) * (1 - closeEase);
          } else if (tiltT > 0) {
            targetWrapX = (bw * 0.38) * tiltEase; // Balanced center in 3D accordion fan
          }

          // Circular Arc Sweep towards Top-Right into the Black Background:
          // X sweeps towards the right (+X)
          const arcRadiusX = Math.max(bw * 1.35, vw * 0.46);
          const arcX = Math.sin(zoomEase * (Math.PI * 0.5)) * arcRadiusX;

          // Y sweeps in an upward crest towards the top-right (-Y in screen space)
          const arcRadiusY = Math.min(vh * 0.28, 220);
          const arcY = -Math.sin(zoomEase * Math.PI * 0.8) * arcRadiusY;

          const wrapX = targetWrapX + arcX;
          const wrapY = (fl * (1 - zoomEase)) + arcY;
          const wrapZ = zoomEase * 680;

          // 3D Angle: Keep the book authentically tilted towards the left (approx 20deg to 30deg)
          // so the spine, thickness, and cover are in full 3D perspective throughout the sweep, NOT flat!
          const baseRotX = (-14 * r * (1 - tiltEase)) +
                           (7 * tiltEase * (1 - spreadEase)) +
                           (3 * spreadEase * (1 - closeEase)) +
                           (-14 * r * closeEase) - my * (spreadEase > 0.5 && closeEase === 0 ? 3 : 5);

          const baseRotY = (-30 * r * (1 - tiltEase)) +
                           (-14 * tiltEase * (1 - spreadEase)) +
                           (-2 * spreadEase * (1 - closeEase)) +
                           (-28 * r * closeEase) + mx * (spreadEase > 0.5 && closeEase === 0 ? 5 : 8);

          // Maintain the 20deg - 30deg 3D tilt towards the left throughout the circular zoom
          const rotX = baseRotX - Math.sin(zoomEase * Math.PI * 0.5) * 8;
          const rotY = baseRotY + Math.sin(zoomEase * Math.PI * 0.5) * 5;
          // Dynamic bank (rotZ) into the circular turn:
          const rotZ = Math.sin(zoomEase * Math.PI * 0.65) * 16;

          // 3D scale expansion
          const baseScale = 1 + 0.1 * r + pop + 0.05 * tiltEase + 0.04 * spreadEase - 0.04 * closeEase;
          const wrapScale = baseScale + zoomEase * 1.55;

          if (bookWrapRef.current) {
            bookWrapRef.current.style.transform = `translate3d(${wrapX.toFixed(1)}px, ${wrapY.toFixed(1)}px, ${wrapZ.toFixed(1)}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${wrapScale.toFixed(3)})`;
            bookWrapRef.current.style.opacity = `${wrapOpacity.toFixed(3)}`;
          }

          // -----------------------------------------------------
          // Step 10: Cover rotation:
          // Closed (0deg) -> 3D Accordion Fan (-164deg: matches 0315e51d.jpg!) -> Flat Open (-174deg) -> Closes Shut (0deg)
          // -----------------------------------------------------
          let coverRotY = 0;
          if (tiltT > 0 && spreadT === 0) {
            coverRotY = -164 * tiltEase;
          } else if (spreadT > 0 && closeT === 0) {
            coverRotY = -164 - 10 * spreadEase;
          } else if (closeT > 0) {
            coverRotY = -174 * (1 - closeEase);
          }
          if (bookCoverRef.current) {
            bookCoverRef.current.style.transform = `translateZ(${(T / 2 * u).toFixed(1)}px) rotateY(${coverRotY.toFixed(1)}deg)`;
            bookCoverRef.current.style.zIndex = (spreadEase > 0.85 && closeEase === 0) ? '15' : '45';
          }

          // Dynamic Floor Shadow
          if (bookShadowRef.current) {
            const shadowLeft = (50 - 50 * (spreadEase * (1 - closeEase))) + (arcX / (vw || 1)) * 50;
            const shadowScaleX = (1 + 0.35 * tiltEase + 0.35 * spreadEase - 0.35 * closeEase) * (1 + zoomEase * 0.8);
            const shadowOpacity = (sg(p, 0.35, 0.40) * 0.8) * wrapOpacity;
            bookShadowRef.current.style.left = `${shadowLeft.toFixed(1)}%`;
            bookShadowRef.current.style.transform = `translateX(-50%) rotateX(85deg) scale(${shadowScaleX.toFixed(2)}, 1)`;
            bookShadowRef.current.style.opacity = `${shadowOpacity.toFixed(2)}`;
          }

          // -----------------------------------------------------
          // Step 11: 5 Leaves (Thick, Smooth, Zero-Blinking Turns & Complete Close)
          // -----------------------------------------------------
          const fanAngles = [-66, -48, -34, -20, -5];
          const leafSpacing = 2.4; // Real tactile paper thickness, eliminates GPU Z-fighting and blinking

          bookLeafRefs.current.forEach((leaf, i) => {
            if (!leaf) return;

            if (spreadEase < 1.0) {
              if (tiltT > 0 && spreadT === 0) {
                // ACCORDION FAN IN 3D PERSPECTIVE (MATCHES 0315e51d.jpg!)
                const ang = fanAngles[i] * tiltEase;
                leaf.style.transform = `translate3d(0, 0, ${(-i * leafSpacing).toFixed(1)}px) rotateY(${ang.toFixed(1)}deg)`;
              } else if (spreadT > 0) {
                // Fanning pages settle flat onto the right stack
                const ang = fanAngles[i] * (1 - spreadEase);
                leaf.style.transform = `translate3d(0, 0, ${(-i * leafSpacing).toFixed(1)}px) rotateY(${ang.toFixed(1)}deg)`;
              } else {
                // Closed flat inside book
                leaf.style.transform = `translate3d(0, 0, ${(-i * leafSpacing).toFixed(1)}px) rotateY(0deg)`;
              }
            } else if (closeT > 0) {
              // BOOK CLOSING PHASE! All 5 leaves swing shut inside the cover
              const closedRotY = -174 * (1 - closeEase);
              leaf.style.transform = `translate3d(0, 0, ${(-i * leafSpacing).toFixed(1)}px) rotateY(${closedRotY.toFixed(1)}deg)`;
            } else {
              // Active interactive page turns (smooth arc lift, zero collisions, zero blinking)
              if (turnProgress > i && turnProgress < i + 1) {
                // Leaf i is currently in flight!
                const tTurn = turnProgress - i;
                const easeTurn = 0.5 - 0.5 * Math.cos(tTurn * Math.PI);
                const leafRotY = -174 * easeTurn;
                const arcZ = Math.sin(tTurn * Math.PI) * 42;
                const leafLiftZ = (1 - easeTurn) * (-i * leafSpacing) + easeTurn * (10 + (4 - i) * leafSpacing) + arcZ;
                leaf.style.transform = `translate3d(0, 0, ${leafLiftZ.toFixed(1)}px) rotateY(${leafRotY.toFixed(1)}deg)`;
              } else if (turnProgress >= i + 1) {
                // Leaf i has flipped to the left stack
                leaf.style.transform = `translate3d(0, 0, ${(10 + (4 - i) * leafSpacing).toFixed(1)}px) rotateY(-174deg)`;
              } else {
                // Leaf i is resting flat on the right stack
                leaf.style.transform = `translate3d(0, 0, ${(-i * leafSpacing).toFixed(1)}px) rotateY(0deg)`;
              }
            }
          });

          // Minimalist Bottom Controls & Dynamic Direct DOM Updates (Zero React Re-renders!)
          if (bookControlsRef.current) {
            const ctrlOp = (tiltEase > 0 ? 1 : 0) * (1 - zoomT);
            bookControlsRef.current.style.opacity = `${ctrlOp.toFixed(2)}`;
            bookControlsRef.current.style.pointerEvents = ctrlOp > 0.5 ? 'auto' : 'none';
          }

          if (bookCounterRef.current) {
            if (p < 0.38) {
              bookCounterRef.current.textContent = 'COVER';
            } else if (spreadEase < 1.0) {
              bookCounterRef.current.textContent = '01 / 05';
            } else if (closeT > 0.4) {
              bookCounterRef.current.textContent = 'CLOSED';
            } else {
              const curP = Math.min(5, Math.floor(turnProgress) + 1);
              bookCounterRef.current.textContent = `0${curP} / 05`;
            }
          }

          if (bookNextBtnRef.current) {
            if (closeT > 0.3) {
              bookNextBtnRef.current.textContent = 'MOMENTS →';
            } else if (turnProgress >= 4) {
              bookNextBtnRef.current.textContent = 'CLOSE BOOK ›';
            } else {
              bookNextBtnRef.current.textContent = 'NEXT ›';
            }
          }

          if (bookPrevBtnRef.current) {
            bookPrevBtnRef.current.disabled = (p <= 0.39);
          }
        }
      }

      // =========================================================
      // PANEL 3: MOMENTS (0.648 < p < 0.88) - Inside Globe & Clean Zoom Fly-Through
      // =========================================================
      const momentsVisible = p > 0.648 && p < 0.88;
      if (p4Ref.current) {
        p4Ref.current.style.display = momentsVisible ? 'block' : 'none';
        p4Ref.current.style.zIndex = p < 0.685 ? '3' : '4';
        p4Ref.current.style.pointerEvents = p >= 0.685 ? 'auto' : 'none';
        if (momentsVisible) {
          // Entrance begins in sync as the closed book arcs towards top-right and hits the black background (0.652 -> 0.725)
          const momIn = io(sg(p, 0.652, 0.725));
          // Clean forward zoom into blank space (starts at 0.76, fully clears by 0.86)
          const momFly = io(sg(p, 0.76, 0.86));
          p4Ref.current.style.opacity = `${momIn * (1 - momFly)}`;
          p4Ref.current.style.filter = 'none'; // Zero blur! Crystal sharp zoom

          // Close active pop-out card if scrolling towards transition
          if (p > 0.73 && activeCardRef.current !== null) {
            setActiveCard(null);
          }

          // 3D Panoramic Fly-in & Clean Forward Zoom: Inside-the-Globe View
          const en = io(sg(p, 0.652, 0.725));
          const sr = sg(p, 0.66, 0.80);

          // Resting zoom keeps cards large and immersive; transition flies forward into blank space
          const baseZoom = 480 * K;
          const slotZoom = io(sg(p, 0.71, 0.78)) * 160 * K;
          const transitionZoom = momFly * 850 * K;
          // Globe swoops forward from depth (-520px) to full baseZoom, expanding outward from behind the arcing book
          const entranceZoom = (1 - en) * -520 * K;
          const dz = entranceZoom + baseZoom + slotZoom + transitionZoom;

          if (!domeState.current.drag && activeCardRef.current === null) {
            domeState.current.ry += domeState.current.vy * 0.94;
            domeState.current.vy *= 0.94;
          }

          // Dynamic spin synchronized with book's circular exit momentum
          const spinIn = (1 - en) * 38;
          const ry = -tt * 0.7 + sr * 50 + mx * 8 + domeState.current.ry + spinIn;
          const rx = 0 + 4 * io(sr) - my * 5 + domeState.current.rx;

          // Globe expands from compact scale (0.42) to full panoramic scale (1.0)
          const domeScale = lp(0.42, 1.0, en);

          // Entire inside 3D cyclorama rotates as a single hardware-accelerated 4x4 matrix
          if (domeRef.current) {
            domeRef.current.style.transform = `translateZ(${dz.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${domeScale.toFixed(3)})`;
          }

          // MOMENTS heading: fades in cleanly, exits cleanly before transition
          if (mtlRef.current) {
            const mo2 = sg(p, 0.675, 0.735) * (1 - io(sg(p, 0.75, 0.81)));
            mtlRef.current.style.opacity = `${mo2}`;
            mtlRef.current.style.transform = `translateX(${-(p - 0.74) * 45}px) skewY(${sk * 0.3}deg) scale(1)`;
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
      // 1. The exact card slot in the dome
      const heroTileIdx = 56;
      const heroTileInner = tileInnersRef.current[heroTileIdx];
      const slotEl = heroTileInner?.parentElement || heroTileInner;

      // Card comes out of its slot starting at p=0.72
      const coinVisible = p > 0.72 && p <= 1.0;
      if (heroTileInner) {
        if (p >= 0.72) {
          heroTileInner.style.opacity = '0';
          heroTileInner.parentElement?.classList.add('dt-empty-slot');
        } else {
          heroTileInner.style.opacity = '1';
          heroTileInner.parentElement?.classList.remove('dt-empty-slot');
        }
      }

      // 2. Detached Hero Card:
      // Sub-phase 1: Physically emerges and pulls forward OUT of that specific slot into screen center
      // Sub-phase 2: From center, flips smoothly 360 deg and places as a sticker below "LET'S CONNECT"
      if (coinCardRef.current) {
        coinCardRef.current.style.display = coinVisible ? 'block' : 'none';
        if (coinVisible) {
          const vw = window.innerWidth;
          const vh = window.innerHeight;

          // Card dimensions (responsive sticker size)
          const cardW = Math.max(136, Math.min(176, vw * 0.135));
          const cardH = cardW * 1.40;

          // Screen Center Destination for Sub-phase 1
          const startX = vw * 0.5 - cardW * 0.5;
          const startY = vh * 0.5 - cardH * 0.5;

          // Final Destination Position: Left side directly below "LET'S CONNECT"
          const destX = Math.max(24, Math.min(72, vw * 0.055));
          const titleTop = Math.max(50, Math.min(90, vh * 0.10));
          const titleH = Math.max(80, Math.min(150, vw * 0.115));
          const destY = titleTop + titleH + 18;

          // Live screen coordinates of that specific slot
          let slotX = vw * 0.38;
          let slotY = vh * 0.42;
          let slotW = cardW * 0.85;
          if (slotEl) {
            const rect = slotEl.getBoundingClientRect();
            if (rect.width > 20 && rect.height > 20) {
              slotX = rect.left;
              slotY = rect.top;
              slotW = rect.width;
            }
          }
          const slotScale = slotW / cardW;

          let curX: number;
          let curY: number;
          let curScale: number;
          let curTilt: number;
          let spinDeg = 0;
          let isStuck = false;

          if (p < 0.78) {
            // -----------------------------------------------------
            // SUB-PHASE 1 (NEW IN-BETWEEN ANIMATION):
            // The card comes OUT of that specific slot into center
            // p: 0.72 -> 0.78
            // Zooms in prominently to hero focus!
            // -----------------------------------------------------
            const popT = io(sg(p, 0.72, 0.78));
            curX = slotX + (startX - slotX) * popT;
            curY = slotY + (startY - slotY) * popT;
            // Zooms forward out of the slot to 1.25 hero scale
            const zoomTarget = 1.25;
            curScale = slotScale + (zoomTarget - slotScale) * popT + Math.sin(popT * Math.PI) * 0.12;
            curTilt = -5 * (1 - popT);
            spinDeg = 0;
            isStuck = false;
          } else {
            // -----------------------------------------------------
            // SUB-PHASE 2 (CURRENT ANIMATION CONTINUES EXACTLY):
            // Flies from center to Contact sticker position
            // p: 0.78 -> 0.95
            // -----------------------------------------------------
            const rawT = Math.min(1, Math.max(0, (p - 0.78) / 0.17));
            const flightEase = io(rawT);
            curX = startX + (destX - startX) * flightEase;
            const arcY = Math.sin(rawT * Math.PI) * -32;
            curY = startY + (destY - startY) * flightEase + arcY;
            // Smoothly transitions from the 1.25 zoom down to 1.0 sticker size
            curScale = 1.25 - 0.25 * flightEase + Math.sin(rawT * Math.PI) * 0.10;
            spinDeg = io(rawT) * 360;
            const stickerTilt = -4.2 * io(Math.min(1, Math.max(0, (rawT - 0.70) / 0.30)));
            curTilt = stickerTilt;
            isStuck = rawT >= 0.95;
          }

          // Rapid seamless fade-in at the exact slot location
          const liftOff = Math.min(1, Math.max(0, (p - 0.72) / 0.015));

          coinCardRef.current.dataset.stuck = isStuck ? 'true' : 'false';
          coinCardRef.current.style.pointerEvents = isStuck ? 'auto' : 'none';
          coinCardRef.current.style.opacity = `${liftOff.toFixed(3)}`;
          coinCardRef.current.style.width = `${cardW}px`;
          coinCardRef.current.style.height = `${cardH}px`;
          coinCardRef.current.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) scale(${curScale.toFixed(3)}) rotate(${curTilt.toFixed(2)}deg)`;

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
        const item = currentIdx === 56 ? MOMENTS_ITEMS[0] : MOMENTS_ITEMS[(i + r * 4) % MOMENTS_ITEMS.length];
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

              {/* Top-Left: Title & Subtitle */}
              <div className="portrait-card-header">
                <h4 className="portrait-card-title">{item.title}</h4>
                <span className="portrait-card-sub">{item.tag}</span>
              </div>

              {/* Bottom-Left: See more » */}
              <div className="portrait-card-footer">
                <span className="portrait-card-seemore">See more »</span>
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
      <section ref={p1Ref} className="pn p1" style={{ zIndex: 4, display: 'none' }}>
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

          <div
            ref={hintRef}
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '4vh',
              transform: 'translateX(-50%)',
              zIndex: 6,
              font: '500 11px var(--mo)',
              letterSpacing: '.24em',
              color: '#111',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            SCROLL ↓
          </div>
        </div>
      </section>

      {/* =========================================================
          Panel 2: WINS (AUTHENTIC 3D BOOK / JOURNAL)
          ========================================================= */}
      <section ref={p2Ref} className="pn p2" style={{ zIndex: 2, display: 'none' }}>
        <div ref={bookStageRef} className="book-3d-stage">
          {/* Dynamic Floor Shadow */}
          <div ref={bookShadowRef} className="book-floor-shadow" />

          {/* 3D Book Assemble Wrapper */}
          <div ref={bookWrapRef} className="book-wrap">
            {/* Back Hardback Cover */}
            <div ref={bookBackRef} className="book-back-cover" />

            {/* Bound Spine Edge on Left */}
            <div ref={bookSpineRef} className="book-spine">
              <div className="book-spine-rib" />
              <div className="book-spine-rib" />
              <div className="book-spine-rib" />
            </div>

            {/* 3D Paper Fore-Edge on Right */}
            <div ref={bookForeRef} className="book-fore-edge" />

            {/* 3D Paper Top Edge */}
            <div ref={bookTopEdgeRef} className="book-top-edge" />

            {/* 3D Paper Bottom Edge */}
            <div ref={bookBotEdgeRef} className="book-bot-edge" />

            {/* 5 Page Leaves (Rendered in natural order, z-indexes and transforms handled in RAF) */}
            {W5_DATA.map((win, i) => (
              <div
                key={win.title}
                ref={(el) => { bookLeafRefs.current[i] = el; }}
                className="book-leaf"
                onClick={() => handleLeafClick(i)}
              >
                {/* Front Side: Win Scrapbook Journal Spread */}
                <div className="page-front">
                  <div className="page-spine-shadow" />

                  {/* Top Metadata Row */}
                  <div className="page-top-row">
                    <span className="page-stamp-pill">{win.sub}</span>
                    <span className="page-stamp-cat">{win.category}</span>
                  </div>

                  {/* Photo with Washi Tape */}
                  <div className="page-photo-card">
                    <div className="book-tape" />
                    <img
                      src={win.img}
                      alt={win.title}
                      className="page-photo-img"
                      loading="eager"
                      decoding="async"
                    />
                  </div>

                  {/* Main Project Story */}
                  <div className="page-body">
                    <div className="page-tag">{win.tag}</div>
                    <h3 className="page-title">{win.title}</h3>
                    <p className="page-desc">{win.desc}</p>
                  </div>

                  {/* Bottom Stack & Index Stamp */}
                  <div className="page-bottom-row">
                    <div className="page-stack-pills">
                      {win.stack.map((st) => (
                        <span key={st} className="page-stack-pill">{st}</span>
                      ))}
                    </div>
                    <span className="page-num-stamp">PAGE 0{i + 1}</span>
                  </div>
                </div>

                {/* Back Side: Vintage Dev Log & Blueprint Sketch */}
                <div className="page-back">
                  <div className="page-back-crease" />

                  <div className="page-back-blueprint">
                    <div className="page-back-stamp">ARCHIVE #0{i + 1} • FIELD LOG</div>
                    <div className="page-back-quote">"{win.quote}"</div>
                  </div>

                  <div className="page-body">
                    <div className="page-tag" style={{ color: '#555' }}>SYSTEM TELEMETRY</div>
                    <div className="page-desc" style={{ color: '#444' }}>
                      Designed for sub-millisecond dispatching, high-load inference, and resilient offline execution.
                    </div>
                  </div>

                  <div className="page-back-meta">
                    <span>STATUS: VERIFIED</span>
                    <span>METRIC: {win.metric}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Front Hardback Cover */}
            <div
              ref={bookCoverRef}
              className="book-cover"
              onClick={() => handleCoverClick()}
            >
              {/* Front Face: The cream sheet that scales from full-screen down to the book */}
              <div ref={bookFrontRef} className="book-cover-front">
                <div className="book-cover-spine-crease" />

                <div ref={bookCoverTopRef} className="book-cover-top">
                  <span className="book-cover-meta">Debashree Mal • CE '28</span>
                  <span className="book-cover-sub">National build archive</span>
                </div>

                <div className="book-cover-center">
                  <div ref={bookTitleWrapRef} className="book-cover-title-wrap">
                    {['W', 'I', 'N', 'S'].map((ch, i) => (
                      <span
                        key={ch + i}
                        ref={(el) => { bookLetterRefs.current[i] = el; }}
                        className="book-cover-letter"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                <div ref={bookCoverBottomRef} className="book-cover-bottom">
                  <span>5 awards &amp; hackathons</span>
                  <span>2025–26</span>
                </div>

                {/* Specular sheen gliding across the cover */}
                <div ref={bookShineRef} className="book-shine" />
              </div>

              {/* Back Face of Cover: Cream Archival Endpaper */}
              <div className="book-cover-back">
                <div className="book-endpaper-plate">
                  <h4 className="book-endpaper-title">ARCHIVE OF WINS</h4>
                  <p className="book-endpaper-desc">
                    A curated collection of national hackathon victories, offline computer vision SDKs, and autonomous agent systems engineered across India.
                  </p>
                </div>
                <div className="book-cover-bottom" style={{ color: '#444', borderTopColor: 'rgba(0,0,0,0.12)' }}>
                  <span>EXHIBIT 2025–2026</span>
                  <span>MUMBAI, INDIA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Floating Controls */}
          <div ref={bookControlsRef} className="book-controls">
            <div className="book-nav-bar">
              <button
                type="button"
                ref={bookPrevBtnRef}
                className="book-nav-btn"
                onClick={() => turnPrev()}
              >
                ‹ PREV
              </button>
              <div className="book-page-pill">
                <span ref={bookCounterRef}>
                  01 / 05
                </span>
              </div>
              <button
                type="button"
                ref={bookNextBtnRef}
                className="book-nav-btn"
                onClick={() => turnNext()}
              >
                NEXT ›
              </button>
            </div>
          </div>
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
          <div className="coin-face coin-front portrait-card-3d" style={{ padding: '12px 10px' }}>
            <div className="portrait-img-box">
              <img
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80&auto=format&fit=crop"
                alt="Axion Hackathon"
                className="portrait-img"
              />
              <div className="portrait-vignette" />
              <div className="coin-sticker-tape">STICKER</div>
            </div>

            {/* Top-Left: Title & Subtitle */}
            <div className="portrait-card-header">
              <h4 className="portrait-card-title">Axion Hackathon</h4>
              <span className="portrait-card-sub">AI Project Manager</span>
            </div>

            {/* Bottom-Left: See more » */}
            <div className="portrait-card-footer">
              <span className="portrait-card-seemore">See more »</span>
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
