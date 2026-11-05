import React, { useEffect, useRef, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import debashreePhoto from './assets/debashree.png';

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
function bump(p: number, a: number, b: number, c: number) {
  return sg(p, a, b) * (1 - sg(p, b, c));
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

const DOME_CC = [
  ['#EFEAE0', '#111'],
  ['#111', '#EFEAE0'],
  ['#EE3B1F', '#111'],
];

const MILESTONES = [0, 0.22, 0.44, 0.72, 1.0];
const THRESHOLDS = [0, 0.16, 0.34, 0.58, 0.84];
const SECTIONS = ['HOME', 'ABOUT', 'WINS', 'MOMENTS', 'CONTACT'];

export const App: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const zlRef = useRef<HTMLDivElement>(null);

  // Panel Refs
  const p0Ref = useRef<HTMLElement>(null);
  const p1Ref = useRef<HTMLElement>(null);
  const p2Ref = useRef<HTMLElement>(null);
  const p4Ref = useRef<HTMLElement>(null);
  const p5Ref = useRef<HTMLElement>(null);

  // Contact Refs (Last Screen)
  const cSheetRef = useRef<HTMLDivElement>(null);
  const cBdRef = useRef<SVGSVGElement>(null);
  const cTopBtnRef = useRef<HTMLDivElement>(null);

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

  // Wins Refs
  const wLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const wStackRef = useRef<HTMLDivElement>(null);
  const wInfoRef = useRef<HTMLDivElement>(null);
  const wBarRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Moments Refs
  const domewRef = useRef<HTMLDivElement>(null);
  const domeRef = useRef<HTMLDivElement>(null);
  const mtlRef = useRef<HTMLDivElement>(null);
  const tileInnersRef = useRef<(HTMLDivElement | null)[]>([]);

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

  // Mouse & tilt smoothing
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseSmoothRef = useRef({ x: 0, y: 0 });

  // Dome interaction physics
  const domeState = useRef({
    rx: -6,
    ry: 0,
    vx: 0,
    vy: 0,
    drag: null as { x: number; y: number } | null,
  });

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 900);

  // Proportional scale factor K to scale the 3D geometry
  const K = useMemo(() => {
    const scale = Math.min(windowWidth / 736, windowHeight / 440);
    return Math.max(1.0, scale * 1.38);
  }, [windowWidth, windowHeight]);

  // 3D Expansive Panoramic Horizon parameters (spacious, global, wide breathing room)
  const domeConfig = useMemo(() => {
    const k = K;
    return {
      perspective: Math.round(1400 * k),
      R: Math.round(760 * k),
      tileWidth: Math.round(168 * k),
      tileHeight: Math.round(218 * k),
      marginLeft: Math.round(-84 * k),
      marginTop: Math.round(-109 * k),
      fontSize: Math.max(11, Math.round(11 * k)),
      iconSize: Math.max(26, Math.round(30 * k)),
      borderRadius: Math.max(10, Math.round(12 * k)),
    };
  }, [K]);

  // Torn paper procedurally generated clip-path
  const generateTornPath = useCallback((amp: number) => {
    const points: string[] = [];
    for (let x = 0; x <= 100; x += 2) {
      points.push(`${x}% ${(Math.random() * amp).toFixed(1)}px`);
    }
    return `polygon(${points.join(',')}, 100% 100%, 0 100%)`;
  }, []);

  // Smooth Navigation to section milestone
  const goTo = useCallback((n: number) => {
    const targetIdx = Math.max(0, Math.min(3, n));
    tgtRef.current = MILESTONES[targetIdx];
  }, []);

  // Window resize & mouse tilt
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
      if (sheetRef.current) {
        sheetRef.current.style.clipPath = generateTornPath(12);
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

      tgtRef.current = cl(tgtRef.current + d * 0.00052);
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
  }, [generateTornPath]);

  // Dome pointer drag listener for Panel 3 (Moments)
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

      // Exponential progress damping
      curProgressRef.current += (tgtRef.current - curProgressRef.current) * (1 - Math.exp(-dt * 5.2));
      const p = curProgressRef.current;

      // Dynamic velocity calculation & skew
      const vel = ((curProgressRef.current - prevProgressRef.current) / Math.max(dt, 0.001)) * 0.016;
      prevProgressRef.current = curProgressRef.current;
      const sk = clp(vel * 420, 5);

      // Mouse smoothing
      mouseSmoothRef.current.x += (mouseTargetRef.current.x - mouseSmoothRef.current.x) * (1 - Math.exp(-dt * 5));
      mouseSmoothRef.current.y += (mouseTargetRef.current.y - mouseSmoothRef.current.y) * (1 - Math.exp(-dt * 5));
      const mx = mouseSmoothRef.current.x;
      const my = mouseSmoothRef.current.y;
      const tt = now / 1000;

      // 1. Hyperspace Speed Lines Warp Overlay (#zl)
      if (zlRef.current) {
        const zz = Math.max(bump(p, 0.25, 0.30, 0.36) * 0.4, bump(p, 0.56, 0.62, 0.68) * 0.4, bump(p, 0.78, 0.84, 0.90) * 0.4);
        zlRef.current.style.opacity = `${zz * 0.85}`;
        zlRef.current.style.transform = `scale(${1 + zz * 0.7}) rotate(${p * 40}deg)`;
      }

      // 2. Active Section Index calculation
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
      if (p0Ref.current) {
        p0Ref.current.style.display = heroVisible ? 'block' : 'none';
        if (heroVisible) {
          const hs = sg(p, 0, 0.16);

          // Split Name parallax exit with velocity skew
          if (hLeftRef.current) {
            hLeftRef.current.style.transform = `translate3d(${-260 * hs}px, ${-180 * hs - p * 60}px, 0) rotate(${-8 * hs}deg) skewX(${-sk}deg)`;
            hLeftRef.current.style.opacity = `${1 - cl(hs * 1.5)}`;
          }
          if (hRightRef.current) {
            hRightRef.current.style.transform = `translate3d(${260 * hs}px, ${-180 * hs - p * 60}px, 0) rotate(${8 * hs}deg) skewX(${-sk}deg)`;
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
      // PANEL 1: ABOUT (0.04 < p < 0.38) - Tactile Paper Peel Transition
      // =========================================================
      const aboutVisible = p > 0.04 && p < 0.38;
      if (p1Ref.current) {
        p1Ref.current.style.display = aboutVisible ? 'block' : 'none';
        if (aboutVisible) {
          const ab = io(sg(p, 0.05, 0.15));
          const ax = io(sg(p, 0.23, 0.36));
          // Peel upward with slight curl rotation revealing Wins underneath
          p1Ref.current.style.transform = `translateY(${105 * (1 - ab) - 105 * ax}%) rotate(${-3.5 * ax}deg)`;
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

          // Red circle expands and floats upward, echoing into the red glow of WINS
          if (aCircRef.current) {
            const circScale = Math.max(0, eb(sg(p, 0.1, 0.175))) * (1 + ax * 0.4);
            aCircRef.current.style.transform = `translateY(${(p - 0.2) * 120 - ax * 180}px) scale(${circScale})`;
            aCircRef.current.style.opacity = `${cl(1 - ax * 0.7)}`;
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
      // PANEL 2: WINS (0.24 < p < 0.65) - Expansive 3D Card Stack
      // =========================================================
      const winsVisible = p > 0.24 && p < 0.65;
      if (p2Ref.current) {
        p2Ref.current.style.display = winsVisible ? 'block' : 'none';
        if (winsVisible) {
          // WINS title letter stagger reveal with spring easing & skew
          wLettersRef.current.forEach((s, i) => {
            if (s) {
              const u = sg(p, 0.26 + i * 0.014, 0.35 + i * 0.014);
              s.style.transform = `translateX(${-240 * (1 - eo(u))}px) skewX(${-sk * 1.1}deg)`;
              s.style.opacity = `${cl(u * 4) * (1 - sg(p, 0.58, 0.64))}`;
            }
          });

          // Stack container entry on perspective arc and smooth cinematic recession into Moments
          const stackIn = io(sg(p, 0.26, 0.38));
          const ex = io(sg(p, 0.57, 0.65));
          if (wStackRef.current) {
            wStackRef.current.style.transform = `translate3d(0, ${360 * (1 - stackIn) - (p - 0.46) * 70 + 120 * ex}px, ${-360 * ex}px) rotateX(${15 * (1 - stackIn) + 12 * ex}deg) scale(${(0.9 + 0.1 * stackIn) * (1 - 0.22 * ex)})`;
            wStackRef.current.style.opacity = `${stackIn * (1 - ex)}`;
          }

          // Info block parallax and fade
          if (wInfoRef.current) {
            wInfoRef.current.style.transform = `translateY(${-(p - 0.44) * 60 + 50 * (1 - stackIn)}px) skewY(${sk * 0.5}deg)`;
            wInfoRef.current.style.opacity = `${sg(p, 0.28, 0.34) * (1 - sg(p, 0.56, 0.62))}`;
          }

          // Scroll-driven card peeling progress (generous span from 0.37 to 0.55)
          const wp = sg(p, 0.37, 0.55) * 4;
          const act = Math.max(0, Math.min(4, Math.round(wp)));
          if (act !== lastActRef.current) {
            lastActRef.current = act;
            setWCard(act);
          }

          // Fill red progress bar
          if (wBarRef.current) {
            wBarRef.current.style.width = `${(wp / 4) * 100}%`;
          }

          // Authentic 3D Peeling math on parabolic trajectory
          cardRefs.current.forEach((c, i) => {
            if (!c) return;
            const r = i - wp;
            let x = 0, y = 0, rz = 0, ry = 0, rx = 0, sc = 1, z = 0, op = 1, dim = 0;
            if (r < 0) {
              const q = cl(-r);
              const e = io(q);
              x = -520 * e;
              y = -100 * e + 190 * e * e;
              rz = W_ROTS[i] - 50 * e;
              ry = 70 * e;
              op = 1 - cl((q - 0.5) / 0.5);
            } else {
              const d = Math.min(r, 4);
              x = d * 30;
              y = -d * 20;
              rz = W_ROTS[i] * (r > 0 ? Math.min(1, r * 1.2 + 0.25) : 0.3);
              sc = 1 - 0.05 * d;
              z = -d * 40;
              dim = 0.14 * d;
              if (r < 0.5) {
                ry = mx * 10;
                rx = my * -8;
              }
            }
            rz += sk * 0.8;
            c.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`;
            c.style.opacity = `${op}`;
            c.style.filter = `brightness(${1 - dim})`;
            c.style.visibility = op < 0.02 || r > 4.2 ? 'hidden' : 'visible';
          });
        }
      }

      // =========================================================
      // PANEL 3: MOMENTS (0.56 < p < 0.88) - Expansive Panoramic Horizon (No Tight Sphere!)
      // =========================================================
      const momentsVisible = p > 0.56 && p < 0.88;
      if (p4Ref.current) {
        p4Ref.current.style.display = momentsVisible ? 'block' : 'none';
        if (momentsVisible) {
          const momIn = io(sg(p, 0.57, 0.65));
          const momOut = io(sg(p, 0.80, 0.87));
          p4Ref.current.style.opacity = `${momIn * (1 - momOut)}`;

          // 3D Panoramic Fly-in: opens up with vast space, centers to middle
          const en = io(sg(p, 0.58, 0.69));
          const sr = sg(p, 0.60, 0.82);
          const mid = io(sg(p, 0.72, 0.84));
          const dz = -700 * (1 - en) + 260 * mid;

          if (!domeState.current.drag) {
            domeState.current.ry += domeState.current.vy * 0.94;
            domeState.current.vy *= 0.94;
          }

          // Slow, dignified, panoramic sweep across the wide cylinder (55 deg sweep, very gentle float)
          const ry = -tt * 0.5 + sr * 55 + mx * 7 + domeState.current.ry;
          const rx = -5 + 7 * io(sr) - my * 4 + domeState.current.rx;

          if (domeRef.current) {
            domeRef.current.style.transform = `translateZ(${dz}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
          }

          // Individual 3D tiles: elastic pop, subtle depth blur & front face highlight
          tileInnersRef.current.forEach((tin, idx) => {
            if (!tin) return;
            const lo = (idx % 14) * (360 / 14) + (Math.floor(idx / 14) % 2) * (180 / 14);
            const angleDiff = Math.abs((((lo + ry) % 360) + 360) % 360 - 180);
            const dist = angleDiff / 180;
            const f = Math.cos(((lo + ry) * Math.PI) / 180);
            const u = cl((en - dist * 0.4) / 0.6);
            tin.style.transform = `scale(${Math.max(0, eb(u)) * (1 + 0.12 * Math.pow(Math.max(0, f), 6))})`;
            tin.style.opacity = `${(0.35 + 0.65 * cl(f * 1.2 + 0.2)) * cl(u * 2.5)}`;
          });

          // MOMENTS heading skew & smooth zoom
          if (mtlRef.current) {
            const mo2 = sg(p, 0.58, 0.66) * (1 - io(sg(p, 0.78, 0.84)));
            mtlRef.current.style.opacity = `${mo2}`;
            mtlRef.current.style.transform = `translateX(${-(p - 0.70) * 50}px) skewY(${sk * 0.4}deg) scale(1)`;
          }
        }
      }

      // =========================================================
      // PANEL 4: CONTACT (LAST SCREEN - Starts as Moments reaches middle)
      // =========================================================
      const contactVisible = p > 0.78;
      if (p5Ref.current) {
        p5Ref.current.style.display = contactVisible ? 'block' : 'none';
        if (contactVisible) {
          p5Ref.current.style.opacity = `${sg(p, 0.79, 0.86)}`;

          // Cream contact sheet glides up with luxury paper elevation
          if (cSheetRef.current) {
            const cIn = io(sg(p, 0.80, 0.92));
            cSheetRef.current.style.transform = `translateY(${105 * (1 - cIn)}%)`;
          }

          // Rotating "SAY HI" badge elastic pop
          if (cBdRef.current) {
            const bIn = sg(p, 0.86, 0.95);
            cBdRef.current.style.transform = `scale(${Math.max(0, eb(bIn))}) rotate(${tt * 12}deg)`;
          }

          // Back to top floating pill
          if (cTopBtnRef.current) {
            const tpIn = sg(p, 0.89, 0.97);
            cTopBtnRef.current.style.opacity = `${tpIn}`;
            cTopBtnRef.current.style.pointerEvents = tpIn > 0.5 ? 'auto' : 'none';
          }
        }
      }

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pre-generate 3D Expansive Panoramic Horizon tiles (3 gentle tiers across wide radius)
  const domeTiles = useMemo(() => {
    const lats = [-14, 0, 14];
    const N = 14;
    const R = domeConfig.R;
    let idx = 0;
    const tiles: React.ReactNode[] = [];

    const LABELS = [
      'AXION WIN', 'FLOWMIND AI', 'NHAI 7.0', 'HACKHAZARDS', 'SIH 2026', 'SULAJH AI', 'MUMBAI TECH',
      'BUILDER 28', 'TEAMWORK', 'DEV NIGHTS', 'AI BHARAT', 'SYSTEMS', 'PROTOTYPE', 'FINAL PITCH',
    ];

    lats.forEach((la, r) => {
      for (let i = 0; i < N; i++) {
        const lo = (i * 360) / N + (r % 2) * (180 / N);
        const k = DOME_CC[(i + r) % 3];
        const currentIdx = idx++;
        const isDark = k[0] === '#111';
        const label = LABELS[i % LABELS.length];

        tiles.push(
          <div
            key={currentIdx}
            className="dt"
            style={{
              width: `${domeConfig.tileWidth}px`,
              height: `${domeConfig.tileHeight}px`,
              marginLeft: `${domeConfig.marginLeft}px`,
              marginTop: `${domeConfig.marginTop}px`,
              transform: `rotateY(${lo}deg) rotateX(${la}deg) translateZ(${-R}px)`,
            }}
          >
            <div
              ref={(el) => {
                tileInnersRef.current[currentIdx] = el;
              }}
              className="di"
              style={{
                ['--i' as any]: currentIdx,
                background: k[0],
                color: k[1],
                border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: `${domeConfig.borderRadius}px`,
                padding: '14px',
                fontSize: `${domeConfig.fontSize}px`,
                boxShadow: isDark ? '0 16px 36px rgba(0, 0, 0, 0.7)' : '0 16px 36px rgba(0, 0, 0, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.75 }}>
                <span style={{ fontSize: '9px', letterSpacing: '0.12em', fontFamily: 'var(--mo)' }}>
                  #{('0' + (currentIdx + 1)).slice(-2)}
                </span>
                <i className="ti ti-star" style={{ fontSize: '12px', color: k[0] === '#EE3B1F' ? '#111' : 'var(--rd)' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-photo" style={{ fontSize: `${domeConfig.iconSize}px`, opacity: 0.85 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontWeight: 700, letterSpacing: '0.06em', fontSize: `${domeConfig.fontSize}px` }}>
                  {label}
                </span>
                <span style={{ fontSize: '9px', opacity: 0.65, letterSpacing: '0.04em' }}>
                  MOMENT 2026
                </span>
              </div>
            </div>
          </div>
        );
      }
    });

    return tiles;
  }, [domeConfig]);

  return (
    <div
      className="stage"
      id="st"
      ref={stageRef}
      tabIndex={0}
    >
      {/* Speed Lines Hyperspace Warp Overlay from v10 */}
      <div id="zl" ref={zlRef} />

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
        {/* Split Name: DEBASHREE on Left, MAL on Right in exact #EFEAE0 */}
        <div className="hero-split-name">
          <span ref={hLeftRef} className="hero-name-left l">DEBASHREE</span>
          <span ref={hRightRef} className="hero-name-right l">MAL</span>
        </div>

        {/* 3D Robot Model centered, waist touching bottom of the screen */}
        <div ref={hRobotRef} className="hero-robot-wrap">
          <Suspense fallback={null}>
            <HeroRobot />
          </Suspense>
        </div>
      </section>

      {/* =========================================================
          Panel 1: ABOUT (FULL SCREEN)
          ========================================================= */}
      <section ref={p1Ref} className="pn p1" style={{ zIndex: 3, display: 'none' }}>
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
              background: '#111',
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
              background: 'var(--cr)',
              color: '#111',
              border: '2px solid #111',
            }}
          >
            AI FOR BHARAT
          </div>
        </div>
      </section>

      {/* =========================================================
          Panel 2: WINS (3D CARD STACK - FROM v9 & v10)
          ========================================================= */}
      <section ref={p2Ref} className="pn p2" style={{ zIndex: 2, display: 'none' }}>
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
          <div className="w-counter">0{wCard + 1} / 05</div>
          <div className="w-bar-bg">
            <i ref={wBarRef} className="w-bar-fill" />
          </div>
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
                background: 'transparent',
                color: wCard === 0 ? '#666' : 'var(--cr)',
                border: '1px solid rgba(239, 234, 224, 0.25)',
                padding: '5px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'var(--mo)',
                fontSize: '11px',
                letterSpacing: '0.1em',
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
                background: 'transparent',
                color: 'var(--cr)',
                border: '1px solid var(--rd)',
                padding: '5px 14px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'var(--mo)',
                fontSize: '11px',
                letterSpacing: '0.1em',
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
                  background: k[0],
                  color: k[1],
                  border: isDark ? '1px solid #333' : 'none',
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
          Panel 3: MOMENTS (AUTHENTIC 3D DOME GALLERY)
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
      </section>

      {/* =========================================================
          Panel 4: CONTACT (LAST SCREEN - STARTS AS MOMENTS REACHES MIDDLE)
          ========================================================= */}
      <section ref={p5Ref} className="pn p5" style={{ zIndex: 5, display: 'none' }}>
        {/* Ambient Top Tagline / Title */}
        <div
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

          {/* Rotating "SAY HI" Red Circular Stamp */}
          <svg
            ref={cBdRef}
            style={{
              width: 'clamp(72px, 8vw, 100px)',
              height: 'clamp(72px, 8vw, 100px)',
              transformOrigin: 'center',
            }}
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r="48" fill="#EE3B1F" />
            <defs>
              <path id="sayHiPath" d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0" />
            </defs>
            <text fontSize="9.5" fill="#0E0E10" fontFamily="monospace" letterSpacing="1.6">
              <textPath href="#sayHiPath">SAY HI • SAY HI • SAY HI • </textPath>
            </text>
            <text x="50" y="58" textAnchor="middle" fontSize="22" fill="#0E0E10" fontFamily="Anton">
              :)
            </text>
          </svg>
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
              href="mailto:debashreemal08@gmail.com"
              className="contact-me-btn"
              title="Send direct email"
            >
              SAY HELLO ↗
            </a>

            {/* Center: Email Address */}
            <a
              href="mailto:debashreemal08@gmail.com"
              className="contact-email-link"
              title="Copy or send email"
            >
              debashreemal08@gmail.com
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
                  href="mailto:debashreemal08@gmail.com"
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

        {/* Back to Top Smooth Trigger Pill */}
        <div
          ref={cTopBtnRef}
          onClick={() => goTo(0)}
          style={{
            position: 'absolute',
            right: 'clamp(24px, 4vw, 48px)',
            bottom: 'clamp(14px, 2.5vh, 24px)',
            zIndex: 15,
            cursor: 'pointer',
            background: '#111',
            color: 'var(--cr)',
            padding: '7px 18px',
            borderRadius: '999px',
            font: '600 11px var(--mo)',
            letterSpacing: '0.12em',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = 'var(--rd)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          }}
        >
          <span>BACK TO TOP</span>
          <span style={{ color: 'var(--rd)' }}>↑</span>
        </div>
      </section>
    </div>
  );
};

export default App;
