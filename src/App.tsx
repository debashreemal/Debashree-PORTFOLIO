import React, { useEffect, useRef, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import debashreePhoto from './assets/debashree.png';
import FlyingButton from './components/FlyingButton';
import FoldText from './components/FoldText';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa6';
import { LinkedInBrandIcon, GitHubBrandIcon, GmailBrandIcon } from './components/BrandIcons';

// Pre-warm 3D WebGL chunk immediately on page parse for instantaneous, stutter-free render
import('./components/canvas/HeroRobot');
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

export interface ProjectItem {
  index: number;
  badge: string;
  title: string;
  tagline: string;
  metaTeam: string;
  metaDuration: string;
  metaYear: string;
  tabs: string[];
  screenshots: string[];
  isPortrait?: boolean;
  aspectRatio?: string;
  role: string;
  problem: string;
  solution: string;
  stack: string[];
  quote: string;
  liveUrl: string;
  githubUrl: string;
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    index: 1,
    badge: '1st place at Axion Hackathon',
    title: 'FLOWMIND',
    tagline: 'An autonomous multi-agent workflow engine',
    metaTeam: 'Team of 4 people',
    metaDuration: '36 hours',
    metaYear: '2025',
    tabs: ['Interface', 'Dashboard', 'AI meet', 'AI logs'],
    screenshots: [
      '/Flowmind/flowmind1- Interface.jpeg',
      '/Flowmind/flowmind2 - Dashboard.jpeg',
      '/Flowmind/flowmind3 - AI meet.jpeg',
      '/Flowmind/flowmind 4 - AI logs.jpeg',
    ],
    aspectRatio: '1600 / 828',
    role: 'Designed the DAG compiler, the dynamic dependency scheduler and the agent communication protocol.',
    problem: 'Linear LLM chains break when a sub-tool fails. The run loses its context and someone has to restart it by hand.',
    solution: 'A team project: a state-graph orchestrator that checks its own intermediate steps and re-routes failed tasks, so the workflow keeps going.',
    stack: ['LangGraph', 'Python', 'FastAPI', 'Next.js', 'Tailwind CSS'],
    quote: '“FlowMind never forgets – so your team doesn\'t have to.”',
    liveUrl: 'https://flowmind.vercel.app',
    githubUrl: 'https://github.com/debashree-08/flowmind',
  },
  {
    index: 2,
    badge: 'Production Full-Stack Architecture',
    title: 'ZWIGGY',
    tagline: 'High-concurrency hyperlocal food ordering & dispatch engine',
    metaTeam: 'Solo Architect',
    metaDuration: '3 weeks',
    metaYear: '2025',
    tabs: ['Silent Track', 'Audio Map', 'Live SOS', 'Contacts'],
    screenshots: [
      '/Zwiggy/zwiggy1 - Silent Track.png',
      '/Zwiggy/zwiggy2 - Audio Map.png',
      '/Zwiggy/zwiggy3 - Live SOS.png',
      '/Zwiggy/zwiggy4 - Contacts.png',
    ],
    aspectRatio: '1918 / 907',
    role: 'Designed distributed order state-machine, geospatial proximity querying, and real-time bidirectional socket tracking.',
    problem: 'Hyperlocal delivery platforms buckle during flash order spikes, creating severe inventory race conditions and dispatch stalls.',
    solution: 'Engineered an event-driven microservices architecture with optimistic concurrency control, Redis geospatial indexing, and WebSocket pub/sub live order updates.',
    stack: ['React', 'Node.js', 'MongoDB', 'Redis', 'Socket.io', 'Tailwind CSS'],
    quote: '“Sub-15ms spatial query dispatch under peak concurrent flash loads.”',
    liveUrl: 'https://zwiggy.vercel.app',
    githubUrl: 'https://github.com/debashree-08/zwiggy',
  },
  {
    index: 3,
    badge: 'National Finalist • NHAI Hackathon 7.0',
    title: 'NHAI FACE ID',
    tagline: 'Offline edge toll facial recognition SDK for remote highways',
    metaTeam: 'Team of 2 people',
    metaDuration: '36 hours',
    metaYear: '2025',
    tabs: ['Dashboard', 'Enrollement', 'Pipeline'],
    screenshots: [
      '/nhai/nhai1- Dashboard.jpeg',
      '/nhai/nhai2 - Enrollement.jpeg',
      '/nhai/nhai3 - Pipeline.jpeg',
    ],
    isPortrait: true,
    aspectRatio: '424 / 900',
    role: 'Built with Piyush Yenorkar — implemented facial landmark quantization, local vector embeddings, and zero-cloud WASM runtime.',
    problem: 'Remote highway toll plazas suffer frequent network blackouts, rendering cloud-dependent facial inspection systems completely unusable.',
    solution: 'Engineered a 100% offline edge SDK compiling optimized OpenCV models and INT8 quantized embeddings directly into on-device WebAssembly and C++.',
    stack: ['WebAssembly', 'C++', 'OpenCV', 'Python', 'ONNX Runtime'],
    quote: '“Zero cloud dependence. Complete on-device toll inspection at edge.”',
    liveUrl: 'https://nhai-faceid.vercel.app',
    githubUrl: 'https://github.com/debashree-08/nhai-faceid',
  },
  {
    index: 4,
    badge: 'Student Innovation Winner 2024',
    title: 'PLUTO',
    tagline: 'Next-gen campus collaboration & verified academic resource hub',
    metaTeam: 'Founding Lead',
    metaDuration: '2 months',
    metaYear: '2024',
    tabs: ['Events', 'User Rank', 'Create Event', 'Transactions'],
    screenshots: [
      '/Pluto/pluto1 - Events.jpeg',
      '/Pluto/pluto2 - User Rank.jpeg',
      '/Pluto/pluto3 - Create Event.jpeg',
      '/Pluto/pluto4 - Transactions.jpeg',
    ],
    aspectRatio: '1600 / 819',
    role: 'Architected responsive multi-tenant portal, granular RBAC student permissions, and high-throughput asset delivery.',
    problem: 'University peer collaboration is fractured across disjoint WhatsApp groups, Notion boards, and drives, causing acute resource loss.',
    solution: 'Built an integrated campus platform consolidating verified academic repositories, peer-to-peer asset exchange, and real-time departmental discussions.',
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    quote: '“A unified institutional repository for 1,200+ student collaborators.”',
    liveUrl: 'https://pluto-campus.vercel.app',
    githubUrl: 'https://github.com/debashree-08/pluto',
  },
  {
    index: 5,
    badge: 'National Finalist • Paytm HQ 2025',
    title: 'SULAJH AI',
    tagline: 'Autonomous merchant simulation & KYC exception resolution',
    metaTeam: 'Team of 3 people',
    metaDuration: '48 hours',
    metaYear: '2025',
    tabs: ['Merchants', 'Dashboard'],
    screenshots: [
      '/paytm/paytm1 - Merchants.png',
      '/paytm/paytm2 - Dashboard.jpeg',
    ],
    aspectRatio: '1919 / 907',
    role: 'Architected multilingual OCR pipeline, automated merchant exception classification, and webhook dispatch.',
    problem: 'Indian merchant onboarding has high drop-offs due to ambiguous Hindi/regional document scans and complex GST exception handling queues.',
    solution: 'Built autonomous AI teammates simulating merchant onboarding, parsing noisy physical KYC paperwork, and auto-generating corrective tasks.',
    stack: ['LLM Agents', 'FastAPI', 'FinTech SDK', 'React', 'Python'],
    quote: '“Turning merchant onboarding exceptions into zero-touch resolution.”',
    liveUrl: 'https://paytm-hackathon.vercel.app',
    githubUrl: 'https://github.com/debashree-08/sulajh-ai',
  },
];




const MOMENTS_ITEMS = [
  {
    id: 1,
    title: 'Paytm Headquaters',
    category: 'MOMENT #01',
    tag: 'Paytm Headquaters',
    desc: 'Paytm Headquarters moment with product leadership and engineering teams.',
    date: '2025',
    color: '#EFEAE0',
    img: '/moments/m1 - Paytm Headquaters.jpeg',
  },
  {
    id: 2,
    title: 'Pluto Campus',
    category: 'MOMENT #02',
    tag: 'Pluto Campus',
    desc: 'Campus initiatives and engineering sprints building developer tooling.',
    date: '2025',
    color: '#EFEAE0',
    img: '/moments/m2 - Pluto Campus.jpeg',
  },
  {
    id: 3,
    title: 'Pitching ZOKU',
    category: 'MOMENT #03',
    tag: 'Pitching ZOKU',
    desc: 'Live onstage pitch for ZOKU, showcasing architecture and market vision.',
    date: '2026',
    color: '#8F9BFF',
    img: '/moments/m3 - Pitching ZOKU.jpeg',
  },
  {
    id: 4,
    title: 'Connections',
    category: 'MOMENT #04',
    tag: 'Connections',
    desc: 'Networking with fellow builders, founders, and engineers at tech summits.',
    date: '2026',
    color: '#EFEAE0',
    img: '/moments/m4 - Connections.jpeg',
  },
  {
    id: 5,
    title: 'Team STARCY',
    category: 'MOMENT #05',
    tag: 'Team STARCY',
    desc: 'Building together with Team STARCY during intense hackathon sprints.',
    date: '2025',
    color: '#8F9BFF',
    img: '/moments/m5 - Team STARCY.jpeg',
  },
  {
    id: 6,
    title: 'Saavishkar',
    category: 'MOMENT #06',
    tag: 'Saavishkar',
    desc: 'Showcasing innovations and technical research at Saavishkar expo.',
    date: '2025',
    color: '#EFEAE0',
    img: '/moments/m6 - Saavishkar.jpeg',
  },
  {
    id: 7,
    title: 'Hack with Mumbai',
    category: 'MOMENT #07',
    tag: 'Hack with Mumbai',
    desc: 'Hacking through the weekend at Hack with Mumbai with the builder community.',
    date: '2026',
    color: '#8F9BFF',
    img: '/moments/m7 - Hack with Mumbai.jpeg',
  },
  {
    id: 8,
    title: 'WON  AXION Hackathon',
    category: '1ST PLACE',
    tag: 'WON  AXION Hackathon',
    desc: 'Taking 1st place at Axion Hackathon with FlowMind multi-agent workflow intelligence.',
    date: '2025',
    color: '#EFEAE0',
    img: '/moments/m8 - WON  AXION Hackathon.jpeg',
  },
  {
    id: 9,
    title: 'SIH Internal Round',
    category: 'MOMENT #09',
    tag: 'SIH Internal Round',
    desc: 'Qualifying rounds for Smart India Hackathon solving ministry problem statements.',
    date: '2025',
    color: '#8F9BFF',
    img: '/moments/m9 - SIH Internal Round.jpeg',
  },
  {
    id: 10,
    title: 'Official Participant',
    category: 'MOMENT #10',
    tag: 'Official Participant',
    desc: 'Accredited participant at premier developer conferences and hackathons.',
    date: '2026',
    color: '#EFEAE0',
    img: '/moments/m10 - Official Participant.jpeg',
  },
  {
    id: 11,
    title: 'Live Coding',
    category: 'MOMENT #11',
    tag: 'Live Coding',
    desc: 'In the zone: live architectural execution and debugging during 36hr hackathon.',
    date: '2025',
    color: '#8F9BFF',
    img: '/moments/m11 - Live Coding.jpeg',
  },
  {
    id: 12,
    title: 'Live Pitch',
    category: 'MOMENT #12',
    tag: 'Live Pitch',
    desc: 'Defending technical architecture and live product demo in front of jury.',
    date: '2025',
    color: '#EFEAE0',
    img: '/moments/m12- Live Pitch.jpeg',
  },
  {
    id: 13,
    title: '1st Rank at Enterprenuership Quest',
    category: 'CHAMPION',
    tag: '1st Rank at Enterprenuership Quest',
    desc: 'Securing top honours and standing 1st on the podium among 120+ teams.',
    date: '2026',
    color: '#8F9BFF',
    img: '/moments/m13 - 1st Rank at Enterprenuership Quest.jpeg',
  },
  {
    id: 14,
    title: 'Open Discussion',
    category: 'FEATURED MOMENT',
    tag: 'Open Discussion',
    desc: 'Panel discussions, Q&A, and technical deep-dives with mentors.',
    date: '2026',
    color: '#8F9BFF',
    img: '/moments/m14 - Open Discussion.jpeg',
  },
  {
    id: 15,
    title: 'SIH Presentation',
    category: 'FINALIST',
    tag: 'SIH Presentation',
    desc: 'Presenting Ministry of Statistics telemetry solutions on national stage.',
    date: '2025',
    color: '#8F9BFF',
    img: '/moments/m15 - SIH Presentation.jpeg',
  },
  {
    id: 16,
    title: 'Paytm Collaborative Coding',
    category: 'MOMENT #16',
    tag: 'Paytm Collaborative Coding',
    desc: 'Pair programming and sprint execution at Paytm Build for India.',
    date: '2026',
    color: '#EFEAE0',
    img: '/moments/m16 - Paytm Collaborative Coding.jpeg',
  },
  {
    id: 17,
    title: 'Paytm Hackathon',
    category: 'MOMENT #17',
    tag: 'Paytm Hackathon',
    desc: 'FinTech agent hackathon sprints creating autonomous merchant solutions.',
    date: '2026',
    color: '#8F9BFF',
    img: '/moments/m17 - Paytm Hackathon.jpeg',
  },
  {
    id: 18,
    title: 'Audience Agreement',
    category: 'MOMENT #18',
    tag: 'Audience Agreement',
    desc: 'Engaging audience reactions during live product demonstrations.',
    date: '2025',
    color: '#EFEAE0',
    img: '/moments/m18 - Audience Agreement.jpeg',
  },
  {
    id: 19,
    title: 'Paytm AI Hackathon',
    category: 'MOMENT #19',
    tag: 'Paytm AI Hackathon',
    desc: 'AI teammates and autonomous agent systems at Paytm AI Hackathon.',
    date: '2025',
    color: '#8F9BFF',
    img: '/moments/m19 - Paytm AI Hackathon.jpeg',
  },
  {
    id: 20,
    title: 'Enterpreneurship Quest',
    category: 'MOMENT #20',
    tag: 'Enterpreneurship Quest',
    desc: 'Exploring product market fit and venture building challenges.',
    date: '2026',
    color: '#EFEAE0',
    img: '/moments/m20 - Enterpreneurship Quest.jpeg',
  },
  {
    id: 21,
    title: 'Waterstone Co-operate Campus',
    category: 'MOMENT #21',
    tag: 'Waterstone Co-operate Campus',
    desc: 'Tech summit and cohort workshops at Waterstone Corporate Campus.',
    date: '2025',
    color: '#8F9BFF',
    img: '/moments/m21 - Waterstone Co-operate Campus.jpeg',
  },
  {
    id: 22,
    title: 'Calm Confidence',
    category: 'MOMENT #22',
    tag: 'Calm Confidence',
    desc: 'Behind the scenes: focused preparation before the grand finale pitch.',
    date: '2026',
    color: '#EFEAE0',
    img: '/moments/m22 - Calm Confidence.jpeg',
  },
  {
    id: 23,
    title: 'Paytm Innovators',
    category: 'MOMENT #23',
    tag: 'Paytm Innovators',
    desc: 'Celebrating with fellow Paytm innovators at the hackathon conclusion.',
    date: '2025',
    color: '#8F9BFF',
    img: '/moments/m23 - Paytm Innovators.jpeg',
  },
];

const MOMENTS_MAP: Record<number, (typeof MOMENTS_ITEMS)[0]> = {};
MOMENTS_ITEMS.forEach((item) => {
  MOMENTS_MAP[item.id] = item;
});

// Mathematically optimal 3-row x 23-column cyclorama mapping:
// Shifts of 8 columns between tiers ensure that for EVERY 7-column viewport window,
// all 21 visible slots contain 100% UNIQUE images with ZERO redundancy on initial open or when scrolling!
// - Col 3:             m1 (Paytm Headquaters), m5 (Team STARCY), m6 (Saavishkar)
// - Col 2 (mid-left):  m10 (Official Participant), m4 (Connections), m21 (Waterstone)
// - Col 1 (near-left): m16 (Paytm Collab Coding), m13 (1st Rank at Ent Quest), m22 (Calm Confidence)
// - Col 0 (center):    m3 (Pitching ZOKU), m14 (Open Discussion hero), m2 (Pluto Campus)
// - Col 22 (near-right): m15 (SIH Presentation), m8 (WON AXION Hackathon), m17 (Paytm Hackathon)
// - Col 21 (mid-right):  m19 (Paytm AI Hackathon), m20 (Enterpreneurship Quest), m9 (SIH Internal Round)
// - Col 20:            m18 (Audience Agreement), m23 (Paytm Innovators), m7 (Hack with Mumbai)
const MOMENTS_GRID: number[][] = [
  [3, 16, 10, 1, 11, 23, 20, 8, 14, 13, 4, 5, 12, 7, 9, 17, 2, 22, 21, 6, 18, 19, 15],
  [14, 13, 4, 5, 12, 7, 9, 17, 2, 22, 21, 6, 18, 19, 15, 3, 16, 10, 1, 11, 23, 20, 8],
  [2, 22, 21, 6, 18, 19, 15, 3, 16, 10, 1, 11, 23, 20, 8, 14, 13, 4, 5, 12, 7, 9, 17],
];

// The hero moment card in slot (Row 1, Col 0):
const HERO_MOMENT = MOMENTS_MAP[MOMENTS_GRID[1][0]];

const MILESTONES = [0, 0.24, 0.48, 0.74, 1.0];
const THRESHOLDS = [0, 0.12, 0.31, 0.65, 0.88];
const SECTIONS = ['HOME', 'ABOUT', 'BUILDS', 'MOMENTS', 'CONTACT'];

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
  const cTitleRef = useRef<HTMLDivElement>(null);
  const cSheetRef = useRef<HTMLDivElement>(null);
  const cSayHelloRef = useRef<HTMLDivElement>(null);

  // Moments-to-Contact Hero Coin-to-Sticker Refs
  const coinCardRef = useRef<HTMLDivElement>(null);
  const coinFlipperRef = useRef<HTMLDivElement>(null);

  // Hero Refs
  const hLeftRef = useRef<HTMLSpanElement>(null);
  const hRightRef = useRef<HTMLSpanElement>(null);
  const hRobotRef = useRef<HTMLDivElement>(null);
  const hSocialRef = useRef<HTMLDivElement>(null);

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
  const bookCoverFrameRef = useRef<HTMLDivElement>(null);
  const bookSpineStripRef = useRef<HTMLDivElement>(null);
  const bookScrollHintRef = useRef<HTMLParagraphElement>(null);
  const bookTitleWrapRef = useRef<HTMLDivElement>(null);
  const bookLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bookShineRef = useRef<HTMLDivElement>(null);
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
  const momentsArrivalRef = useRef<number | null>(null);
  const momentsAutoTriggeredRef = useRef(false);

  // Active Project Screenshot Tab state { [projIndex]: tabIndex }
  const [projectActiveTabs, setProjectActiveTabs] = useState<Record<number, number>>({});

  const activePageRef = useRef(0);

  // Real 3D Book Pages Refs (Base Left, Base Right, and 4 Physical 3D Turning Leaves)
  const bookSpreadRef = useRef<HTMLDivElement>(null);
  const baseLeftRef = useRef<HTMLDivElement>(null);
  const baseRightRef = useRef<HTMLDivElement>(null);
  const leafRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Preload all project screenshots for zero-latency instant tab switching
  useEffect(() => {
    PROJECTS_DATA.forEach((proj) => {
      proj.screenshots?.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });
  }, []);

  const renderProjectLeft = (proj: ProjectItem) => {
    const curTabIdx = projectActiveTabs[proj.index] ?? 0;
    const curImg = proj.screenshots?.[curTabIdx] || proj.screenshots?.[0];

    return (
      <div className="page left">
        <div className="ref-badge">{proj.badge}</div>
        <div>
          <h1>{proj.title}</h1>
          <div className="bar-accent" />
          <p className="sub">{proj.tagline}</p>
          <p className="meta">
            {proj.metaTeam}, {proj.metaDuration}, {proj.metaYear}
          </p>
        </div>
        <div className="gallery">
          <div className="tabs" role="tablist" data-active={curTabIdx}>
            {proj.tabs.map((tName, tIdx) => {
              const isActive = curTabIdx === tIdx;
              return (
                <button
                  key={tName}
                  type="button"
                  className={isActive ? 'on' : ''}
                  role="tab"
                  data-i={tIdx}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setProjectActiveTabs((prev) => ({ ...prev, [proj.index]: tIdx }));
                  }}
                >
                  {tName}
                </button>
              );
            })}
          </div>
          <div
            className={`shot ${proj.isPortrait ? 'shot-portrait' : 'shot-landscape'}`}
            style={proj.aspectRatio ? { aspectRatio: proj.aspectRatio } : undefined}
          >
            {curImg ? (
              <img
                key={curImg}
                src={curImg}
                alt={`${proj.title} - ${proj.tabs[curTabIdx] || ''}`}
                className="shot-img"
                loading="eager"
                decoding="async"
              />
            ) : null}
          </div>
        </div>
        <div className="role">
          <p className="label">My role</p>
          <p>{proj.role}</p>
        </div>
      </div>
    );
  };

  const renderProjectRight = (proj: ProjectItem) => (
    <div className="page right">
      <div className="sec">
        <p className="label">The problem</p>
        <p>{proj.problem}</p>
      </div>
      <div className="sec">
        <p className="label">What we built</p>
        <p>{proj.solution}</p>
      </div>
      <div className="sec">
        <p className="label">Tech stack</p>
        <div className="chips">
          {proj.stack.map((st) => (
            <span key={st}>{st}</span>
          ))}
        </div>
      </div>
      <div className="foot">
        <p className="script">{proj.quote}</p>
        <div className="cta">
          {proj.liveUrl && (
            <a
              className="p"
              href={proj.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Live demo
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </span>
            </a>
          )}
          {proj.githubUrl && (
            <a
              className="s"
              href={proj.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              GitHub
              <span className="ic">
                <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );



  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

  const K = useMemo(() => {
    const scale = Math.min(windowWidth / 1440, windowHeight / 900);
    return Math.max(0.85, Math.min(1.2, scale));
  }, [windowWidth, windowHeight]);

  const domeConfig = useMemo(() => {
    const k = K;
    // 4:3 Aspect Ratio cards (e.g. 336px wide x 252px high at base scale)
    const tileWidth = Math.round(336 * k);
    const tileHeight = Math.round(252 * k); // exactly 4:3 (336 * 3 / 4 = 252)
    const cols = MOMENTS_ITEMS.length;
    // Radius calculated so horizontal pitch gives clean, elegant ~32px gap
    const R = Math.round((cols * (tileWidth + 32)) / (2 * Math.PI));
    return {
      perspective: Math.round(960 * k),
      R,
      cols,
      tileWidth,
      tileHeight,
      marginLeft: Math.round(-tileWidth / 2),
      marginTop: Math.round(-tileHeight / 2),
      fontSize: Math.max(11, Math.round(13 * k)),
      borderRadius: Math.max(14, Math.round(18 * k)),
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

  // Continuous constant-pace scroll driver
  // Decoupled from wheel speed: If user continuously scrolls, website moves at the same steady pace
  const scrollDriveRef = useRef({
    activeDir: 0,
    lastInputTime: 0,
    currentVelocity: 0,
  });

  const resetScrollDrive = useCallback(() => {
    scrollDriveRef.current.activeDir = 0;
    scrollDriveRef.current.currentVelocity = 0;
    scrollDriveRef.current.lastInputTime = 0;
  }, []);

  // 3D Canvas dynamic pause state (stops WebGL loop when outside Hero to save 100% GPU)
  const [heroActive, setHeroActive] = useState(true);
  const heroActiveRef = useRef(true);

  // Mouse & tilt smoothing
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseSmoothRef = useRef({ x: 0, y: 0 });

  // Smooth Navigation to section milestone
  const goTo = useCallback((n: number) => {
    resetScrollDrive();
    const targetIdx = Math.max(0, Math.min(4, n));
    tgtRef.current = MILESTONES[targetIdx];
    momentsArrivalRef.current = null;
    momentsAutoTriggeredRef.current = false;
  }, [resetScrollDrive]);

  // 3D Book Page Turning Callbacks (exact, obstacle-free page targets)
  const turnNext = useCallback(() => {
    resetScrollDrive();
    if (tgtRef.current < 0.46) {
      tgtRef.current = 0.48; // Open cleanly to Page 1
    } else {
      const curTurn = sg(tgtRef.current, 0.48, 0.60) * 4;
      const curPage = Math.min(4, Math.floor(curTurn + 0.1));
      if (curPage < 4) {
        tgtRef.current = 0.48 + (curPage + 1) * (0.12 / 4);
      } else if (curPage === 4) {
        // At Page 5: CLOSE THE BOOK!
        tgtRef.current = 0.64;
      } else {
        // From closed book: GO TO MOMENTS!
        goTo(3);
      }
    }
  }, [goTo, resetScrollDrive]);

  const turnPrev = useCallback(() => {
    resetScrollDrive();
    if (tgtRef.current <= 0.485) {
      tgtRef.current = 0.38; // Cleanly close back to cover
    } else if (tgtRef.current >= 0.61) {
      // Re-open from closed book back to Page 5
      tgtRef.current = 0.60;
    } else {
      const curTurn = sg(tgtRef.current, 0.48, 0.60) * 4;
      const curPage = Math.min(4, Math.floor(curTurn + 0.1));
      if (curPage > 0) {
        tgtRef.current = 0.48 + (curPage - 1) * (0.12 / 4);
      } else {
        tgtRef.current = 0.38; // Cleanly close back to cover
      }
    }
  }, [resetScrollDrive]);

  const handleCoverClick = useCallback(() => {
    resetScrollDrive();
    if (tgtRef.current < 0.46) {
      tgtRef.current = 0.48;
    } else if (tgtRef.current >= 0.61) {
      tgtRef.current = 0.48;
    } else {
      tgtRef.current = 0.38;
    }
  }, [resetScrollDrive]);

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

    const registerScroll = (dir: number) => {
      // If already at boundary trying to push further, ignore
      if ((dir > 0 && tgtRef.current >= 1) || (dir < 0 && tgtRef.current <= 0)) {
        scrollDriveRef.current.activeDir = 0;
        return;
      }
      scrollDriveRef.current.activeDir = dir;
      scrollDriveRef.current.lastInputTime = performance.now();
    };

    // Continuous scroll progress wheel handler:
    // Captures scroll intent direction and sustains continuous constant-speed progression
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(d) < 0.1) return;
      registerScroll(d > 0 ? 1 : -1);
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const next = MILESTONES.find((a) => a > tgtRef.current + 0.01);
        if (next !== undefined) {
          resetScrollDrive();
          tgtRef.current = next;
        }
        e.preventDefault();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const prev = [...MILESTONES].reverse().find((a) => a < tgtRef.current - 0.01);
        if (prev !== undefined) {
          resetScrollDrive();
          tgtRef.current = prev;
        }
        e.preventDefault();
      }
    };

    // Drag to scroll on stage (excluding clickable items)
    let dragStart: { y: number; t: number } | null = null;
    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest('.nav, .hero-robot-wrap, .domew, .contact-footer-bar, button, a')) {
        return;
      }
      dragStart = { y: e.clientY, t: tgtRef.current };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (dragStart) {
        const diff = dragStart.y - e.clientY;
        if (Math.abs(diff) > 2) {
          registerScroll(diff > 0 ? 1 : -1);
        }
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
      registerScroll(diff > 0 ? 1 : -1);
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

      // =========================================================
      // CONTINUOUS UNIFORM-PACE SCROLL ENGINE
      // Decoupled from physical wheel speed: Continuous scrolling maintains
      // the exact same steady pace and speed throughout the entire site!
      // =========================================================
      const CONST_SPEED = 0.055; // Deliberate, smooth, slow cruising velocity (progress units/sec)
      const isScrollActive = (now - scrollDriveRef.current.lastInputTime) < 280;
      const dir = isScrollActive ? scrollDriveRef.current.activeDir : 0;

      let targetVel = 0;
      if (dir > 0 && tgtRef.current < 1) {
        // Extended scroll runway in Moments (+2s of exploration before card pop)
        const inMoments = tgtRef.current >= 0.72 && tgtRef.current < 0.83;
        targetVel = inMoments ? CONST_SPEED * 0.45 : CONST_SPEED;
      } else if (dir < 0 && tgtRef.current > 0) {
        const inMoments = tgtRef.current > 0.72 && tgtRef.current <= 0.83;
        targetVel = inMoments ? -CONST_SPEED * 0.45 : -CONST_SPEED;
      }

      // Smooth velocity interpolation:
      // Gentle acceleration into cruising speed and velvety glide when scrolling stops
      const accelRate = targetVel !== 0 ? 8 : 5;
      scrollDriveRef.current.currentVelocity += (targetVel - scrollDriveRef.current.currentVelocity) * (1 - Math.exp(-dt * accelRate));

      if (targetVel === 0 && Math.abs(scrollDriveRef.current.currentVelocity) < 0.0002) {
        scrollDriveRef.current.currentVelocity = 0;
      }

      if (scrollDriveRef.current.currentVelocity !== 0) {
        tgtRef.current = cl(tgtRef.current + scrollDriveRef.current.currentVelocity * dt);
      }

      // Smooth, unified progress tracking across the entire site with zero artificial slowdowns
      const damping = 12.0;
      curProgressRef.current += (tgtRef.current - curProgressRef.current) * (1 - Math.exp(-dt * damping));
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

      // Dwell timer for Moments:
      // When arriving at Moments round gallery zone (0.71 <= p <= 0.77), keep gallery round for 4.5 seconds (added 2s)
      // while it moves & rotates, before cards emerge to center focus!
      if (p >= 0.71 && p <= 0.77 && Math.abs(tgtRef.current - 0.74) < 0.035) {
        if (momentsArrivalRef.current === null && !momentsAutoTriggeredRef.current) {
          momentsArrivalRef.current = now;
        } else if (
          momentsArrivalRef.current !== null &&
          !momentsAutoTriggeredRef.current &&
          now - momentsArrivalRef.current >= 4500 &&
          !domeState.current.drag &&
          activeCardRef.current === null
        ) {
          momentsAutoTriggeredRef.current = true;
          tgtRef.current = 0.85; // Gently bring card out into center hero focus!
        }
      } else if (p < 0.64 || p > 0.89) {
        // Reset when leaving Moments so user can experience it again when returning
        momentsArrivalRef.current = null;
        momentsAutoTriggeredRef.current = false;
      }

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
        stageRef.current.dataset.dk = p > 0.07 && p < 0.28 ? '1' : '0';
      }

      // =========================================================
      // PANEL 0: HERO (p < 0.09)
      // =========================================================
      const heroVisible = p < 0.09;
      if (heroVisible !== heroActiveRef.current) {
        heroActiveRef.current = heroVisible;
        setHeroActive(heroVisible);
      }
      if (p0Ref.current) {
        p0Ref.current.style.display = heroVisible ? 'block' : 'none';
        if (heroVisible) {
          const uLeft = io(sg(p, 0.002, 0.026));
          const uRight = io(sg(p, 0.004, 0.032));
          const distLeft = Math.max(windowWidth * 0.75, 800);
          const distRight = Math.max(windowWidth * 0.95 + 300, 1250);

          // Name horizontal slide exit: Both DEBASHREE and MAL slide off to the LEFT swiftly
          if (hLeftRef.current) {
            hLeftRef.current.style.transform = `translate3d(${-distLeft * uLeft}px, 0, 0)`;
            hLeftRef.current.style.opacity = `${1 - cl((uLeft - 0.7) / 0.3)}`;
          }
          if (hRightRef.current) {
            hRightRef.current.style.transform = `translate3d(${-distRight * uRight}px, 0, 0)`;
            hRightRef.current.style.opacity = `${1 - cl((uRight - 0.7) / 0.3)}`;
          }

          // 3D Robot model smooth sink straight down below screen (zero scaling, original length preserved)
          if (hRobotRef.current) {
            const robotSink = io(sg(p, 0.002, 0.032));
            hRobotRef.current.style.transform = `translate3d(0, ${robotSink * 115}vh, 0)`;
            hRobotRef.current.style.opacity = `${1 - cl(robotSink * 1.5)}`;
          }

          // Left-bottom social column smooth fade out on scroll
          if (hSocialRef.current) {
            const hsOut = io(sg(p, 0.002, 0.026));
            hSocialRef.current.style.transform = `translate3d(${-45 * hsOut}px, 0, 0)`;
            hSocialRef.current.style.opacity = `${1 - cl(hsOut * 1.5)}`;
          }
        }
      }

      // Safe dimensions strictly bounded to never cross laptop screen borders
      const vw = windowWidth;
      const vh = windowHeight;
      const isMobile = vw < 760;

      // Responsive, commanding book dimensions tuned to be comfortably larger while staying safely within screen bounds
      const maxH = isMobile
        ? Math.min(570, vh * 0.82, vh - 70)
        : Math.min(640, vh * 0.82, vh - 70);
      const bh = Math.max(380, maxH);

      // Book width: 2-page spread fits comfortably within horizontal screen bounds
      const maxW = isMobile
        ? Math.min(410, vw * 0.94)
        : Math.min(485, (vw * 0.90) / 2);
      const bw = Math.min(maxW, bh / 1.32);
      const T = bw * 0.12;
      const D = isMobile ? Math.min(vw * 0.62, vh * 0.3) : Math.min(vw * 0.31, vh * 0.66);
      const cx0 = isMobile ? vw * 0.5 : vw * 0.76;
      const cy0 = isMobile ? vh * 0.7 : vh * 0.48;

      // Update CSS variables for book dimensions
      document.documentElement.style.setProperty('--w', `${bw}px`);
      document.documentElement.style.setProperty('--h', `${bh}px`);
      document.documentElement.style.setProperty('--t', `${T}px`);

      // =========================================================
      // PANEL 1: ABOUT ME (0.030 < p < 0.34)
      // Master Choreography:
      // 1. Debashree Mal text completely slides horizontally off-screen (p: 0.002 -> 0.032)
      // 2. Cream sheet foundation arrives from LEFT side with ZERO delay & faster slide (p: 0.032 -> 0.070)
      //    establishing the pristine archival canvas across the screen
      // 3. Orange circle appears SMALL, then smoothly blooms into
      //    BIG ORIGINAL size (p: 0.070 -> 0.140).
      // 4. Cutout portrait glides up into circle (p: 0.120 -> 0.185).
      // 5. Floating tags & pills pop into place (p: 0.160 -> 0.235).
      // =========================================================
      const aboutVisible = p > 0.030 && p < 0.34;
      if (p1Ref.current) {
        p1Ref.current.style.display = aboutVisible ? 'block' : 'none';
        p1Ref.current.style.zIndex = p > 0.28 ? '2' : '4';
        p1Ref.current.style.pointerEvents = (p > 0.16 && p < 0.26) ? 'auto' : 'none';

        if (aboutVisible) {
          // Keep p1Ref fixed at fullscreen so individual elements flow with independent physics
          p1Ref.current.style.transform = 'none';

          // -----------------------------------------------------
          // 1. CREAM SHEET FOUNDATION ARRIVES FROM LEFT SIDE! (p: 0.032 -> 0.070)
          // Slides fast across from the left side with ZERO delay right as MAL disappears!
          // -----------------------------------------------------
          if (sheetRef.current) {
            const sheetIn = io(sg(p, 0.032, 0.070));
            if (p < 0.26) {
              sheetRef.current.style.transform = `translateX(${(-100 * (1 - sheetIn)).toFixed(2)}%)`;
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
          // 2. ORANGE CIRCLE: STARTS SMALL, THEN BLOOMS TO BIG ORIGINAL! (p: 0.070 -> 0.140)
          // Emerges strictly after cream sheet has arrived from the left. Starts as a compact glowing seed,
          // then blossoms smoothly and organically into full original scale.
          // -----------------------------------------------------
          if (aCircRef.current) {
            if (p < 0.25) {
              if (p < 0.070) {
                aCircRef.current.style.opacity = '0';
                aCircRef.current.style.transform = 'translate3d(0, 140px, 0) scale(0)';
              } else {
                const uCirc = sg(p, 0.070, 0.140);
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
          // 3. CUTOUT PORTRAIT: ENTERS AFTER CIRCLE IS BIG ORIGINAL! (p: 0.120 -> 0.185)
          // Glides up from below into the glowing circle with gentle tilt
          // -----------------------------------------------------
          if (aPhRef.current) {
            if (p < 0.25) {
              if (p < 0.120) {
                aPhRef.current.style.opacity = '0';
                aPhRef.current.style.transform = 'translate3d(0, 340px, 0) rotate(-4deg) scale(0.88)';
              } else {
                const uPh = sg(p, 0.120, 0.185);
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
              const starts = [0.072, 0.092, 0.112, 0.130, 0.150, 0.170];
              const ends = [0.130, 0.150, 0.170, 0.185, 0.205, 0.225];
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
              aBarRef.current.style.transform = `scaleX(${eo(sg(p, 0.095, 0.155)).toFixed(3)})`;
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
          // Step 2: Cover frame & BUILDS letters tumble animation
          // p: 0.32 -> 0.355
          // -----------------------------------------------------
          const metaOp = sg(p, 0.325, 0.36);
          if (bookCoverFrameRef.current) bookCoverFrameRef.current.style.opacity = `${metaOp}`;
          if (bookSpineStripRef.current) bookSpineStripRef.current.style.opacity = `${metaOp}`;

          bookLetterRefs.current.forEach((l, i) => {
            if (!l) return;
            const w = eo(sg(p, 0.32 + i * 0.006, 0.355 + i * 0.006));
            l.style.transform = `translateX(${(2.5 - i) * bw * 0.16 * (1 - w)}px) scale(${0.06 + 0.94 * w}) rotate(${(i % 2 ? 1 : -1) * 35 * (1 - w)}deg)`;
            l.style.opacity = `${cl(w * 3)}`;
          });

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
          // Step 5: Clean, Unified Book Opening (Zero Tilt, Zero Wobble)
          // p: 0.40 -> 0.48 (Front cover swings smoothly open from 0 to -180 deg)
          // -----------------------------------------------------
          const openT = sg(p, 0.40, 0.48);
          const openEase = io(openT);

          // -----------------------------------------------------
          // Step 6: Interactive 3D Physical Page Turns
          // p: 0.48 -> 0.60 (4 physical turns across 5 projects)
          // -----------------------------------------------------
          const turnProgress = sg(p, 0.48, 0.60) * 4;
          const activePage = Math.min(4, Math.max(0, Math.round(turnProgress)));
          activePageRef.current = activePage;

          // -----------------------------------------------------
          // Step 7: Book Closes After Last Page!
          // p: 0.60 -> 0.635 (Front cover & leaves swing shut together)
          // -----------------------------------------------------
          const closeT = sg(p, 0.60, 0.635);
          const closeEase = io(closeT);

          // -----------------------------------------------------
          // Step 8: Smooth Zoom-Through Transition into Moments 3D Globe
          // p: 0.635 -> 0.685 (Closed book zooms dramatically towards camera & dissolves into Moments)
          // -----------------------------------------------------
          const zoomT = sg(p, 0.635, 0.685);
          const zoomEase = io(zoomT);

          // Fore-edge, top edge, and bottom edge:
          // Fully visible and 3D when the book is CLOSED (both before opening at p < 0.40 and after closing at p >= 0.60)
          // Smoothly hidden when the book is OPEN
          const isClosedBefore = (1 - openEase);
          const isClosedAfter = closeEase;
          const closedFactor = cl(isClosedBefore + isClosedAfter);
          const closedEdgeOp = cl(sg(p, 0.33, 0.365) * closedFactor * (1 - sg(zoomT, 0.70, 0.98)));

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
            const backOp = sg(p, 0.33, 0.365) * (1 - sg(zoomT, 0.70, 0.98));
            bookBackRef.current.style.opacity = `${backOp.toFixed(3)}`;
            if (closedFactor > 0.4) {
              bookBackRef.current.style.boxShadow = '0 20px 45px rgba(0, 0, 0, 0.65), -4px 0 12px rgba(0, 0, 0, 0.35)';
            } else {
              bookBackRef.current.style.boxShadow = 'none';
            }
          }

          if (bookSpineRef.current) {
            // Spine is 100% visible when book is closed, smoothly tucks away when book is flat open
            const spineOp = cl(sg(p, 0.33, 0.365) * (closedFactor + (1 - closedFactor) * 0.3) * (1 - sg(zoomT, 0.70, 0.98)));
            bookSpineRef.current.style.opacity = `${spineOp.toFixed(3)}`;
          }

          // Calculate Book Wrap coordinates: Stationary, Rigid reading position!
          // Zero lateral slide during cover phase and initial lift (coverRotY: 0 to -90 deg)
          let targetWrapX = 0;
          if (closeT > 0) {
            if (closeEase < 0.5) {
              const closeCenterEase = io(closeEase * 2);
              targetWrapX = (bw * 0.5) * (1 - closeCenterEase);
            } else {
              targetWrapX = 0;
            }
          } else if (openT > 0) {
            if (openEase > 0.5) {
              const openCenterEase = io((openEase - 0.5) * 2);
              targetWrapX = (bw * 0.5) * openCenterEase;
            } else {
              targetWrapX = 0;
            }
          }

          // Gentle depth glide on transition into Moments
          const wrapX = targetWrapX - (bw * 0.12) * zoomEase;
          const wrapZ = zoomEase * 320;
          const wrapScale = 1.0 + zoomEase * 0.35;
          const wrapOpacity = 1 - io(sg(zoomT, 0.45, 0.96));

          if (bookWrapRef.current) {
            bookWrapRef.current.style.transform = `translate3d(${wrapX.toFixed(1)}px, 0px, ${wrapZ.toFixed(1)}px) scale(${wrapScale.toFixed(3)})`;
            bookWrapRef.current.style.opacity = `${wrapOpacity.toFixed(3)}`;
            bookWrapRef.current.style.willChange = 'transform';
          }

          if (bookStageRef.current) {
            bookStageRef.current.style.perspective = '2200px';
          }

          // Cover rotation:
          // Closed (0deg) -> Opens flat (-180deg) -> Closes shut (0deg)
          let coverRotY = 0;
          if (closeT > 0) {
            coverRotY = -180 * (1 - closeEase);
          } else if (openT > 0) {
            coverRotY = -180 * openEase;
          }

          const isOpenOnLeft = coverRotY <= -90;

          if (bookCoverRef.current) {
            const coverZ = isOpenOnLeft ? -1 : 3;
            bookCoverRef.current.style.transform = `translateZ(${coverZ}px) rotateY(${coverRotY.toFixed(1)}deg)`;
            bookCoverRef.current.style.zIndex = isOpenOnLeft ? '5' : '45';
            bookCoverRef.current.style.pointerEvents = (p < 0.36 || closeT > 0 || (activePage === 0 && openEase >= 0.9)) ? 'auto' : 'none';
          }

          // Dynamic Floor Shadow
          if (bookShadowRef.current) {
            const shadowLeft = 50 - 50 * (openEase * (1 - closeEase));
            const shadowScaleX = (1 + 0.35 * openEase - 0.35 * closeEase) * (1 + zoomEase * 0.8);
            const shadowOpacity = (sg(p, 0.35, 0.40) * 0.8) * (1 - zoomT);
            bookShadowRef.current.style.left = `${shadowLeft.toFixed(1)}%`;
            bookShadowRef.current.style.transform = `translateX(-50%) rotateX(85deg) scale(${shadowScaleX.toFixed(2)}, 1)`;
            bookShadowRef.current.style.opacity = `${shadowOpacity.toFixed(2)}`;
          }

          // baseLeftRef is permanently visible on inside front cover (Flowmind Left)
          if (baseLeftRef.current) {
            baseLeftRef.current.style.display = 'block';
            baseLeftRef.current.style.opacity = '1';
            baseLeftRef.current.style.pointerEvents = (activePage === 0 && openEase >= 0.9 && closeT === 0) ? 'auto' : 'none';
          }

          if (p < 0.40) {
            // Book is completely closed (Cover phase)
            // Left desk is 100% empty, master spread hidden!
            if (bookSpreadRef.current) bookSpreadRef.current.style.display = 'none';
          } else if (openEase < 0.85 && closeT === 0) {
            // BOOK OPENING PHASE (Cover opens cleanly around spine revealing Page 1: Flowmind!)
            if (bookSpreadRef.current) {
              bookSpreadRef.current.style.display = 'block';
              bookSpreadRef.current.style.opacity = '1';
            }
            if (baseRightRef.current) {
              baseRightRef.current.style.display = 'block';
              baseRightRef.current.style.opacity = '1';
              baseRightRef.current.style.zIndex = '4';
              baseRightRef.current.style.pointerEvents = 'none';
            }
            // All leaves stay firmly flat on the right stack at 0deg! ZERO fanning, ZERO random pages!
            leafRefs.current.forEach((leaf, i) => {
              if (!leaf) return;
              leaf.style.display = 'block';
              const stackZ = (3 - i) * 0.4;
              leaf.style.transform = `translate3d(0, 0, ${stackZ.toFixed(1)}px) rotateY(0deg)`;
              leaf.style.zIndex = `${15 - i}`;
              leaf.style.pointerEvents = 'none';
            });
          } else if (closeT > 0) {
            // BOOK CLOSING PHASE! (Front cover & leaves swing shut together onto right side)
            if (bookSpreadRef.current) {
              bookSpreadRef.current.style.display = closeEase >= 0.98 ? 'none' : 'block';
              bookSpreadRef.current.style.opacity = '1';
            }
            if (baseRightRef.current) {
              baseRightRef.current.style.display = 'block';
              baseRightRef.current.style.zIndex = '4';
              baseRightRef.current.style.pointerEvents = 'none';
            }
            const closedLeafRotY = -180 * (1 - closeEase);
            leafRefs.current.forEach((leaf, i) => {
              if (!leaf) return;
              leaf.style.display = 'block';
              // When lifting off left desk (isOpenOnLeft), Leaf 3 must stay on top facing user (stackZ = i * 0.4)!
              // When landing on right desk, Leaf 0 is on top under front cover (stackZ = (3 - i) * 0.4).
              const stackZ = isOpenOnLeft ? (i * 0.4) : ((3 - i) * 0.4);
              leaf.style.transform = `translate3d(0, 0, ${stackZ.toFixed(1)}px) rotateY(${closedLeafRotY.toFixed(1)}deg)`;
              if (isOpenOnLeft) {
                // Lifting off the left desk: Leaf 3 Back (Sulajh AI Left) is on top facing the user!
                leaf.style.zIndex = `${20 + i}`;
              } else {
                // Coming down onto the right desk: underneath front cover (zIndex: 45)
                leaf.style.zIndex = `${15 - i}`;
              }
              leaf.style.pointerEvents = 'none';
            });
          } else {
            // OPEN 2-PAGE SPREAD & DYNAMIC 3D PAGE TURNS (turnProgress: 0.0 -> 4.0 across 5 projects)
            if (bookSpreadRef.current) {
              bookSpreadRef.current.style.display = 'block';
              bookSpreadRef.current.style.opacity = '1';
            }
            if (baseRightRef.current) {
              baseRightRef.current.style.display = 'block';
              baseRightRef.current.style.opacity = '1';
              baseRightRef.current.style.zIndex = '4';
              baseRightRef.current.style.pointerEvents = activePage === 4 ? 'auto' : 'none';
            }

            for (let i = 0; i < 4; i++) {
              const leaf = leafRefs.current[i];
              if (!leaf) continue;
              leaf.style.display = 'block';

              if (turnProgress <= i) {
                // Flat on right side stack (unturned)
                const stackZ = (3 - i) * 0.4;
                leaf.style.transform = `translate3d(0, 0, ${stackZ.toFixed(1)}px) rotateY(0deg)`;
                leaf.style.zIndex = `${15 - i}`;
                leaf.style.pointerEvents = activePage === i ? 'auto' : 'none';
              } else if (turnProgress >= i + 1) {
                // Flat on left side stack (already turned)
                const stackZ = i * 0.4;
                leaf.style.transform = `translate3d(0, 0, ${stackZ.toFixed(1)}px) rotateY(-180deg)`;
                leaf.style.zIndex = `${6 + i}`;
                leaf.style.pointerEvents = activePage === i + 1 ? 'auto' : 'none';
              } else {
                // ACTIVE 3D PAGE FLIGHT between project i and i + 1!
                const u = turnProgress - i;
                const easeTurn = 0.5 - 0.5 * Math.cos(u * Math.PI);
                const rotY = -180 * easeTurn;
                const arcZ = Math.sin(u * Math.PI) * 45 + 5;
                leaf.style.transform = `translate3d(0, 0, ${arcZ.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg)`;
                leaf.style.zIndex = '50';
                leaf.style.pointerEvents = 'none';
              }
            }
          }

          // Scroll to open hint (strictly visible ONLY when book cover is closed before opening)
          if (bookScrollHintRef.current) {
            const hintOp = sg(p, 0.33, 0.36) * (1 - sg(p, 0.39, 0.43));
            bookScrollHintRef.current.style.opacity = `${hintOp.toFixed(3)}`;
            bookScrollHintRef.current.style.pointerEvents = hintOp > 0.3 ? 'auto' : 'none';
          }

          // Minimalist Bottom Controls & Dynamic Direct DOM Updates
          // STRICTLY VISIBLE ONLY WHEN BOOK IS FLAT OPEN AND READY FOR READING!
          if (bookControlsRef.current) {
            const isOpenForReading = p >= 0.46 && p <= 0.60;
            const ctrlFadeIn = io(sg(p, 0.46, 0.49));
            const ctrlFadeOut = 1 - io(sg(p, 0.595, 0.61));
            const ctrlOp = (isOpenForReading ? ctrlFadeIn * ctrlFadeOut : 0) * (1 - zoomT);
            bookControlsRef.current.style.opacity = `${ctrlOp.toFixed(2)}`;
            bookControlsRef.current.style.pointerEvents = ctrlOp > 0.5 ? 'auto' : 'none';
          }

          if (bookCounterRef.current) {
            if (p < 0.46) {
              bookCounterRef.current.textContent = 'COVER';
            } else if (p > 0.60) {
              bookCounterRef.current.textContent = 'CLOSED';
            } else {
              bookCounterRef.current.textContent = `0${activePageRef.current + 1} / 05`;
            }
          }

          if (bookNextBtnRef.current) {
            if (p > 0.60) {
              bookNextBtnRef.current.textContent = 'MOMENTS →';
            } else if (activePageRef.current >= 4) {
              bookNextBtnRef.current.textContent = 'CLOSE BOOK ›';
            } else {
              bookNextBtnRef.current.textContent = 'NEXT ›';
            }
          }

          if (bookPrevBtnRef.current) {
            bookPrevBtnRef.current.disabled = (p < 0.46);
          }
        }
      }

      // =========================================================
      // PANEL 3: MOMENTS (0.635 < p < 0.94) - Inside Globe & Clean Zoom Fly-Through
      // =========================================================
      const momentsVisible = p > 0.635 && p < 0.94;
      if (p4Ref.current) {
        p4Ref.current.style.display = momentsVisible ? 'block' : 'none';
        p4Ref.current.style.zIndex = p < 0.68 ? '3' : '4';
        p4Ref.current.style.pointerEvents = p >= 0.68 ? 'auto' : 'none';
        if (momentsVisible) {
          // Entrance begins smoothly as the closed book zooms in (0.635 -> 0.72)
          const momIn = io(sg(p, 0.635, 0.72));
          // Clean forward zoom into blank space (starts at 0.86, fully clears by 0.94)
          const momFly = io(sg(p, 0.86, 0.94));
          p4Ref.current.style.opacity = `${momIn * (1 - momFly)}`;
          p4Ref.current.style.filter = 'none'; // Zero blur! Crystal sharp zoom

          // Close active pop-out card if scrolling towards transition
          if (p > 0.81 && activeCardRef.current !== null) {
            setActiveCard(null);
          }

          // 3D Panoramic Fly-in & Clean Forward Zoom: Inside-the-Globe View
          const en = io(sg(p, 0.635, 0.72));
          const sr = sg(p, 0.65, 0.82);

          // Resting zoom keeps cards large and immersive; transition flies forward into blank space
          const baseZoom = 485 * K;
          const slotZoom = io(sg(p, 0.81, 0.87)) * 160 * K;
          const transitionZoom = momFly * 850 * K;
          // Globe gently floats forward from depth (-160px) to full baseZoom, expanding outward behind the zooming book
          const entranceZoom = (1 - en) * -160 * K;
          const dz = entranceZoom + baseZoom + slotZoom + transitionZoom;

          if (!domeState.current.drag && activeCardRef.current === null) {
            domeState.current.ry += domeState.current.vy * 0.94;
            domeState.current.vy *= 0.94;
          }

          // Panoramic 360 rotation around inside cyclorama with subtle entry spin
          const spinIn = (1 - en) * 12;
          const ry = -tt * 0.7 + sr * 50 + mx * 8 + domeState.current.ry + spinIn;
          const rx = 0 + 4 * io(sr) - my * 5 + domeState.current.rx;

          // Globe expands gracefully from scale 0.88 to 1.0 as the book zooms past
          const domeScale = lp(0.88, 1.0, en);

          // Entire inside 3D cyclorama rotates as a single hardware-accelerated 4x4 matrix
          if (domeRef.current) {
            domeRef.current.style.transform = `translateZ(${dz.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${domeScale.toFixed(3)})`;
          }

          // MOMENTS heading: fades in cleanly as globe settles, exits cleanly when card pop-out begins
          if (mtlRef.current) {
            const mo2 = sg(p, 0.66, 0.72) * (1 - io(sg(p, 0.81, 0.86)));
            mtlRef.current.style.opacity = `${mo2}`;
            mtlRef.current.style.transform = `translateX(${-(p - 0.74) * 45}px) skewY(${sk * 0.3}deg) scale(1)`;
          }
        }
      }

      // =========================================================
      // PANEL 4: CONTACT (LAST SCREEN - Emerges from Blank Space with Choreographed Movement)
      // =========================================================
      const contactVisible = p > 0.86;
      if (p5Ref.current) {
        p5Ref.current.style.display = contactVisible ? 'block' : 'none';
        if (contactVisible) {
          // Contact emerges smoothly AFTER the globe has passed into blank space
          const contactIn = io(sg(p, 0.88, 0.98));
          p5Ref.current.style.opacity = `${contactIn}`;

          // Top Title smoothly descends and settles with scale
          if (cTitleRef.current) {
            cTitleRef.current.style.transform = `translate3d(0, ${(1 - contactIn) * -50}px, 0) scale(${0.92 + 0.08 * contactIn})`;
            cTitleRef.current.style.opacity = `${contactIn}`;
          }

          // Cream / Beige contact sheet glides up with luxury paper elevation
          if (cSheetRef.current) {
            cSheetRef.current.style.transform = `translateY(${100 * (1 - contactIn)}%)`;
          }

          // Say Hello Rocket Button container glides in smoothly
          if (cSayHelloRef.current) {
            const bIn = io(sg(p, 0.89, 0.98));
            cSayHelloRef.current.style.transform = `translate3d(0, ${(1 - bIn) * 35}px, 0)`;
            cSayHelloRef.current.style.opacity = `${bIn}`;
          }
        }
      }

      // =========================================================
      // MOMENTS-TO-CONTACT HERO COIN-TO-STICKER TRANSITION
      // =========================================================
      // 1. The exact card slot in the dome (Row 1 middle eye-level center, col 0)
      const heroTileIdx = domeConfig.cols;
      const heroTileInner = tileInnersRef.current[heroTileIdx];
      const slotEl = heroTileInner?.parentElement || heroTileInner;

      // Card comes out of its slot starting at p=0.825
      const coinVisible = p > 0.825 && p <= 1.0;
      if (heroTileInner) {
        if (p >= 0.825) {
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

          // Card dimensions (responsive 4:3 aspect ratio matching panoramic tiles)
          const cardW = Math.max(240, Math.min(320, vw * 0.21));
          const cardH = Math.round(cardW * (3 / 4));

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

          if (p < 0.88) {
            // -----------------------------------------------------
            // SUB-PHASE 1 (NEW IN-BETWEEN ANIMATION):
            // The card comes OUT of that specific slot into center
            // p: 0.825 -> 0.88
            // Zooms in prominently to hero focus!
            // -----------------------------------------------------
            const popT = io(sg(p, 0.825, 0.88));
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
            // p: 0.88 -> 0.98
            // -----------------------------------------------------
            const rawT = Math.min(1, Math.max(0, (p - 0.88) / 0.10));
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
          const liftOff = Math.min(1, Math.max(0, (p - 0.825) / 0.015));

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

  // Pre-generate 3D Globe Gallery (Inside view: 3 rows with clean ~36px vertical gap, concave curvature)
  const domeTiles = useMemo(() => {
    // 3 tiers: Top (-14°), Middle eye-level (0°), Bottom (+14°)
    const lats = [-14, 0, 14];
    const cols = domeConfig.cols;
    const R = domeConfig.R;
    const tiles: React.ReactNode[] = [];
    let idx = 0;

    lats.forEach((la, r) => {
      for (let i = 0; i < cols; i++) {
        const currentIdx = idx++;
        const lo = (i * 360) / cols;
        const mId = MOMENTS_GRID[r][i];
        const item = MOMENTS_MAP[mId];
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
                ? `rotateY(${lo}deg) rotateX(${la}deg) translateZ(${-R + 290}px) scale(1.35)`
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

              {/* Bottom: Heading extracted from image filename in place of See more */}
              <div className="portrait-card-footer">
                <h4 className="portrait-card-bottom-title">{item.title}</h4>
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

      {/* =========================================================
          Panel 0: HERO
          ========================================================= */}
      <section ref={p0Ref} className="pn p0" style={{ zIndex: 1 }}>
        {/* Split Name: DEBASHREE on Left, MAL on Right in exact #EFEAE0 (Recessed BEHIND Robot, Z-Index: 2) */}
        <div className="hero-split-name">
          <span ref={hLeftRef} className="hero-name-left l">
            <FoldText
              text="DEBASHREE"
              foldStyle="paper"
              splitBy="char"
              hinge="top"
              trigger="mount"
              foldAngle={92}
              duration={0.72}
              stagger={0.038}
              staggerFrom="start"
              ease="power2.out"
              perspective={700}
              creaseShading={0.48}
              hoverRefold={true}
              refoldRadius={140}
              refoldAngle={40}
              color="#EFEAE0"
            />
          </span>
          <span ref={hRightRef} className="hero-name-right l">
            <FoldText
              text="MAL"
              foldStyle="paper"
              splitBy="char"
              hinge="top"
              trigger="mount"
              delay={0.34}
              foldAngle={92}
              duration={0.72}
              stagger={0.038}
              staggerFrom="start"
              ease="power2.out"
              perspective={700}
              creaseShading={0.48}
              hoverRefold={true}
              refoldRadius={140}
              refoldAngle={40}
              color="var(--rd, #8F9BFF)"
            />
          </span>
        </div>

        {/* Left Bottom Corner: Vertical Social Icons (Portfolio Cream #EFEAE0 with Red Hover) */}
        <div ref={hSocialRef} className="hero-social-col">
          <a
            href="mailto:debashreee87@gmail.com"
            className="hero-social-btn"
            title="Email • debashreee87@gmail.com"
            aria-label="Send Direct Email"
          >
            <FaEnvelope />
          </a>
          <a
            href="https://github.com/debashree-08"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-btn"
            title="GitHub • @debashree-08"
            aria-label="GitHub Profile"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/debashree-mal-118837269/"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-btn"
            title="LinkedIn • Debashree Mal"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin />
          </a>
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

            {/* Master Open 2-Page Spread Container */}
            <div
              ref={bookSpreadRef}
              className="book-page-spread"
              style={{ display: 'none' }}
            >
              {/* Base Right Page: Fixed base underneath right stack (Project 4: Sulajh AI Right) */}
              <div
                ref={baseRightRef}
                className="book-base-right"
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
                  turnNext();
                }}
              >
                {renderProjectRight(PROJECTS_DATA[4])}
              </div>

              {/* 4 Physical 3D Turning Leaves */}
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={`leaf-${i}`}
                  ref={(el) => { leafRefs.current[i] = el; }}
                  className="book-leaf-item"
                >
                  <div
                    className="leaf-face-front"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
                      turnNext();
                    }}
                  >
                    {renderProjectRight(PROJECTS_DATA[i])}
                  </div>
                  <div
                    className="leaf-face-back"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
                      turnPrev();
                    }}
                  >
                    {renderProjectLeft(PROJECTS_DATA[i + 1])}
                  </div>
                </div>
              ))}
            </div>

            {/* Front Hardback Cover */}
            <div
              ref={bookCoverRef}
              className="book-cover"
              onClick={() => handleCoverClick()}
            >
              {/* Front Face: The cream sheet that scales from full-screen down to the book */}
              <div ref={bookFrontRef} className="book-cover-front">
                <div ref={bookSpineStripRef} className="book-cover-spine-strip" aria-hidden="true" />

                <div ref={bookCoverFrameRef} className="book-cover-frame">
                  <p className="book-cover-eyebrow">Proof of work</p>
                  <div className="book-cover-spacer" />
                  <div ref={bookTitleWrapRef} className="book-cover-title-wrap">
                    {['B', 'U', 'I', 'L', 'D', 'S'].map((ch, i) => (
                      <span
                        key={ch + i}
                        ref={(el) => { bookLetterRefs.current[i] = el; }}
                        className="book-cover-letter"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                  <div className="book-cover-bar" />
                  <p className="book-cover-desc">Hackathon wins &amp; shipped systems</p>
                  <p className="book-cover-script">Think. Build. Launch.</p>
                  <div className="book-cover-foot">
                    <p className="book-cover-who">DEBASHREE MAL<span>CE ’28</span></p>
                    <p className="book-cover-yr">2024–2026</p>
                  </div>
                </div>

                {/* Specular sheen gliding across the cover */}
                <div ref={bookShineRef} className="book-shine" />
              </div>

              {/* Back Face of Cover: Spread 1 Left (Flowmind Left) */}
              <div
                ref={baseLeftRef}
                className="book-cover-back"
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
                  turnPrev();
                }}
              >
                {renderProjectLeft(PROJECTS_DATA[0])}
              </div>
            </div>
          </div>

          {/* Scroll to open hint */}
          <p
            ref={bookScrollHintRef}
            className="book-scroll-hint"
            onClick={() => handleCoverClick()}
          >
            Scroll to open ↓
          </p>

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
        {activeCard !== null && (() => {
          const r = Math.floor(activeCard / domeConfig.cols);
          const i = activeCard % domeConfig.cols;
          const mId = MOMENTS_GRID[r]?.[i] ?? 14;
          const activeItem = MOMENTS_MAP[mId] || MOMENTS_ITEMS[0];

          return (
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
                  background: activeItem.color,
                  color: activeItem.color === '#171719' ? '#EFEAE0' : '#111',
                  border: activeItem.color === '#171719' ? '1px solid rgba(255, 255, 255, 0.2)' : '2px solid #111',
                }}
              >
                {/* Card Header */}
                <div className="mm-card-head">
                  <span className="mm-badge">
                    {activeItem.category}
                  </span>
                  <span className="mm-num">
                    #{('0' + activeItem.id).slice(-2)}
                  </span>
                </div>

                {/* Card Center Visual: High-res Portrait Photograph */}
                <div className="mm-card-img-wrap">
                  <img
                    src={activeItem.img}
                    alt={activeItem.title}
                    className="mm-card-img"
                  />
                </div>

                {/* Card Body */}
                <div className="mm-card-body">
                  <div className="mm-tag">{activeItem.tag}</div>
                  <h3 className="mm-title">{activeItem.title}</h3>
                  <p className="mm-desc">{activeItem.desc}</p>
                </div>

                {/* Card Footer */}
                <div className="mm-card-foot">
                  <span className="mm-year">{activeItem.date} • MUMBAI</span>
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
          );
        })()}
      </section>

      {/* =========================================================
          Panel 4: LET'S CONNECT (LAST SCREEN)
          ========================================================= */}
      <section ref={p5Ref} className="pn p5" style={{ zIndex: 5, display: 'none' }}>
        {/* Ambient Top Title */}
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
                userSelect: 'none',
              }}
              className="lets-connect-heading"
            >
              LET'S CONNECT
            </span>
          </div>
        </div>

        {/* SAY HELLO Flying Rocket Button & Center Quote */}
        <div
          ref={cSayHelloRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 'calc(clamp(260px, 42vh, 440px) + 6px)',
            zIndex: 15,
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          {/* Centered Quote line aligned with SAY HELLO rocket */}
          <div
            className="contact-shipping-quote"
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'auto',
              whiteSpace: 'nowrap',
              zIndex: 2,
            }}
          >
            “Let’s build something worth shipping.”
          </div>

          <FlyingButton
            theme="dark"
            size="medium"
            altitude={220}
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
            buttonRight={() => Math.round(Math.max(40, Math.min(68, window.innerWidth * 0.025 + 32)))}
            thrustColor="#8F9BFF"
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

        {/* Clean Beige Color Block Below */}
        <div ref={cSheetRef} className="contact-bottom-sheet">
          {/* Horizontal Social Icons placed directly below the SAY HELLO Rocket */}
          <div className="contact-social-row">
            <a
              href="mailto:debashreee87@gmail.com"
              className="contact-social-btn"
              title="Email • debashreee87@gmail.com"
              aria-label="Send Direct Email"
            >
              <GmailBrandIcon />
            </a>
            <a
              href="https://github.com/debashree-08"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-btn"
              title="GitHub • @debashree-08"
              aria-label="GitHub Profile"
            >
              <GitHubBrandIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/debashree-mal-118837269/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-btn"
              title="LinkedIn • Debashree Mal"
              aria-label="LinkedIn Profile"
            >
              <LinkedInBrandIcon />
            </a>
          </div>
        </div>
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
                src={HERO_MOMENT.img}
                alt={HERO_MOMENT.title}
                className="portrait-img"
              />
              <div className="portrait-vignette" />
            </div>

            {/* Bottom: Heading from image filename */}
            <div className="portrait-card-footer">
              <h4 className="portrait-card-bottom-title">{HERO_MOMENT.title}</h4>
            </div>
            <div className="coin-sheen" />
          </div>

          {/* BACK FACE: Identical to Front Face */}
          <div className="coin-face coin-back portrait-card-3d" style={{ padding: '12px 10px' }}>
            <div className="portrait-img-box">
              <img
                src={HERO_MOMENT.img}
                alt={HERO_MOMENT.title}
                className="portrait-img"
              />
              <div className="portrait-vignette" />
            </div>

            {/* Bottom: Heading from image filename */}
            <div className="portrait-card-footer">
              <h4 className="portrait-card-bottom-title">{HERO_MOMENT.title}</h4>
            </div>
            <div className="coin-sheen" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
