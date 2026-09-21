import { useEffect, useRef } from "react";

interface Skill {
  name: string;
  pct: number;
  src: string;
  color: string;
  ring: number;
}

interface Particle {
  ri: number;
  angle: number;
  speed: number;
  color: string;
  size: number;
  phase: number;
  twinkleSpeed: number;
}

const skills: Skill[] = [
  // Ring 2: Frontend (Outer)
  { name: "React",      pct: 90, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",          color: "#61dafb", ring: 2 },
  { name: "TypeScript", pct: 85, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",color: "#3178c6", ring: 2 },
  { name: "JavaScript", pct: 90, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",color: "#f7df1e", ring: 2 },
  { name: "HTML",       pct: 95, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",          color: "#e34f26", ring: 2 },
  { name: "CSS",        pct: 95, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",            color: "#1572b6", ring: 2 },
  { name: "Tailwind",   pct: 90, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", color: "#38bdf8", ring: 2 },
  { name: "Vite",       pct: 85, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg",            color: "#646cff", ring: 2 },

  // Ring 1: Backend (Middle)
  { name: "NodeJS",     pct: 85, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",        color: "#68a063", ring: 1 },
  { name: "Python",     pct: 85, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",        color: "#3776ab", ring: 1 },
  { name: "FastAPI",    pct: 75, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",      color: "#009688", ring: 1 },
  { name: "C++",        pct: 70, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",  color: "#9c6af7", ring: 1 },

  // Ring 0: Databases & Tools (Inner)
  { name: "MongoDB",    pct: 80, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",      color: "#47a248", ring: 0 },
  { name: "Supabase",   pct: 80, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",    color: "#3ecf8e", ring: 0 },
  { name: "Git",        pct: 85, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",              color: "#f05032", ring: 0 },
  { name: "Figma",      pct: 80, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",          color: "#f24e1e", ring: 0 },
];

const rings = [
  { frac: 0.24, speed: 0.00045 },
  { frac: 0.34, speed: -0.00032 },
  { frac: 0.44, speed: 0.00026 },
];

export default function SkillsOrbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const lblRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const lbl = lblRef.current;
    if (!canvas || !wrap || !lbl) return;

    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    let W = 0, H = 0, cx = 0, cy = 0;
    let t = 0;
    let mouse = { x: -9999, y: -9999 };
    let hoveredSkill: Skill | null = null;
    let animId: number;

    // Preload images
    const imgs: Record<string, HTMLImageElement> = {};
    skills.forEach((s) => {
      const img = new Image();
      img.src = s.src;
      imgs[s.name] = img;
    });

    // Particles
    // Particles (65 stars for rich, organic density)
    const particles: Particle[] = Array.from({ length: 65 }, () => {
      const ri = Math.floor(Math.random() * 3);
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 0.0003 + 0.0001) * (Math.random() < 0.5 ? 1 : -1);

      // Assign sizes and colors based on depth layer (ri) to create a beautiful 3D parallax!
      let size = 0.2;
      let colorType = 0; // 0: white, 1: purple, 2: cyan

      if (ri === 2) {
        size = Math.random() * 0.2 + 0.15; // Far background (0.15px - 0.35px)
        colorType = Math.random() < 0.65 ? 1 : 0; // Purple-indigo to merge into the dark space
      } else if (ri === 1) {
        size = Math.random() * 0.3 + 0.3; // Mid ground (0.3px - 0.6px)
        colorType = Math.random() < 0.5 ? 2 : 0; // Soft cyan or warm white
      } else {
        size = Math.random() * 0.4 + 0.5; // Foreground (0.5px - 0.9px)
        colorType = 0; // Bright white stars
      }

      return {
        ri,
        angle,
        speed,
        color: String(colorType),
        size,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.01 + 0.005,
      };
    });

    function resize() {
      const r = wrap!.getBoundingClientRect();
      W = canvas!.width = r.width * dpr;
      H = canvas!.height = r.height * dpr;
      canvas!.style.width = r.width + "px";
      canvas!.style.height = r.height + "px";
      cx = W / 2;
      cy = H / 2;
    }
    resize();
    window.addEventListener("resize", resize);

    function getRingSkills(ri: number) {
      return skills.filter((s) => s.ring === ri);
    }

    function skillPos(ri: number, si: number, total: number, time: number) {
      const base = ((2 * Math.PI) / total) * si;
      // Phase offsets per ring to create a beautiful, symmetrical starting geometry that is not a '+'
      const ringOffsets = [0, Math.PI / 6, Math.PI / 3]; // 0, 30, and 60 degrees
      const angle = base + ringOffsets[ri] + rings[ri].speed * time;
      const baseSize = Math.min(W, H);
      const rx = rings[ri].frac * baseSize * 1.65;
      const ry = rings[ri].frac * baseSize * 0.85;
      return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
    }

    function drawRing(frac: number, alpha: number) {
      const baseSize = Math.min(W, H);
      const rx = frac * baseSize * 1.65;
      const ry = frac * baseSize * 0.85;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(168,85,247,${alpha})`;
      ctx.lineWidth = 0.6 * dpr;
      ctx.setLineDash([3 * dpr, 10 * dpr]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function drawCenter() {
      const R = 0.12 * Math.min(W, H);



      // Inner counter-rotating arc
      const segments2 = 6;
      for (let i = 0; i < segments2; i++) {
        const a1 = (i / segments2) * Math.PI * 2 - t * 0.007;
        const a2 = ((i + 0.4) / segments2) * Math.PI * 2 - t * 0.007;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.72, a1, a2);
        ctx.strokeStyle = `rgba(148,163,184,${0.45 + 0.25 * Math.sin(t * 0.015 + i * 1.3)})`;
        ctx.lineWidth = 1.5 * dpr;
        ctx.stroke();
      }

      // Inner disc
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.66, 0, Math.PI * 2);
      const gr = ctx.createRadialGradient(cx, cy - R * 0.1, 0, cx, cy, R * 0.66);
      gr.addColorStop(0, "#333333");
      gr.addColorStop(0.6, "#1a1a1a");
      gr.addColorStop(1, "#0d0d0d");
      ctx.fillStyle = gr;
      ctx.fill();
      ctx.strokeStyle = "rgba(51, 51, 51, 0.8)";
      ctx.lineWidth = 1.2 * dpr;
      ctx.stroke();

      // Text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 ${16.5 * dpr}px 'JetBrains Mono', sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.fillText("SKILLS", cx, cy);
    }

    function drawNode(skill: Skill, pos: { x: number; y: number }, ri: number) {
      const baseR = (ri === 0 ? 21 : ri === 1 ? 18 : 15) * dpr;
      const isHov = hoveredSkill === skill;
      const r = isHov ? baseR * 1.3 : baseR;

      ctx.save();
      ctx.translate(pos.x, pos.y);

      // Glow (slightly smaller, tighter border shadow)
      const glow = ri === 0 ? 0.18 : ri === 1 ? 0.14 : 0.11;
      const pulse = glow + 0.07 * Math.sin(t * 0.025 + skills.indexOf(skill) * 0.8);
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2); // Reduced glow radius from 1.8 to 1.35
      ctx.fillStyle = skill.color + Math.round(pulse * 255).toString(16).padStart(2, "0");
      ctx.fill();

      // Node bg
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = "#0a0816";
      ctx.fill();
      ctx.strokeStyle = skill.color + "55";
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();



      // Hover tick burst
      if (isHov) {
        const ticks = 8;
        for (let i = 0; i < ticks; i++) {
          const a = (i / ticks) * Math.PI * 2 + t * 0.05;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * (r + 3 * dpr), Math.sin(a) * (r + 3 * dpr));
          ctx.lineTo(Math.cos(a) * (r + 7 * dpr), Math.sin(a) * (r + 7 * dpr));
          ctx.strokeStyle = skill.color + "99";
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();
        }
      }

      // Logo (slightly larger for better visibility)
      const img = imgs[skill.name];
      const s = r * 1.25; // Increased logo size from 0.9 to 1.25
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, -s / 2, -s / 2, s, s);
      } else {
        ctx.fillStyle = skill.color;
        ctx.font = `600 ${9 * dpr}px 'JetBrains Mono', sans-serif`; // Enlarged fallback text size
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(skill.name.slice(0, 3).toUpperCase(), 0, 0);
      }

      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      rings.forEach((ring, i) => drawRing(ring.frac, 0.13 + i * 0.03));

      // Particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const baseSize = Math.min(W, H);
        const rx = rings[p.ri].frac * baseSize * 1.65;
        const ry = rings[p.ri].frac * baseSize * 0.85;
        const px = cx + rx * Math.cos(p.angle);
        const py = cy + ry * Math.sin(p.angle);

        // Determine brightness based on depth layer (ri)
        const maxAlpha = p.ri === 2 ? 0.25 : p.ri === 1 ? 0.45 : 0.65;
        const minAlpha = p.ri === 2 ? 0.03 : p.ri === 1 ? 0.06 : 0.1;
        const alpha = minAlpha + (maxAlpha - minAlpha) * Math.abs(Math.sin(t * p.twinkleSpeed + p.phase));

        // Determine color styling based on colorType
        let fillStyle = `rgba(226, 232, 240, ${alpha})`; // Slate white
        if (p.color === "1") {
          fillStyle = `rgba(168, 85, 247, ${alpha * 0.85})`; // Soft purple/indigo starlight to merge with space
        } else if (p.color === "2") {
          fillStyle = `rgba(56, 189, 248, ${alpha * 0.85})`; // Soft cyan starlight
        }

        ctx.beginPath();
        ctx.arc(px, py, p.size * dpr, 0, Math.PI * 2);
        ctx.fillStyle = fillStyle;
        ctx.fill();

        // Faint outer glow halo for the slightly larger stars
        if (p.size > 0.65) {
          ctx.beginPath();
          ctx.arc(px, py, p.size * 2.5 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = p.color === "2"
            ? `rgba(56, 189, 248, ${alpha * 0.15})`
            : `rgba(226, 232, 240, ${alpha * 0.15})`;
          ctx.fill();
        }
      });

      // Collect all positions + draw connector lines
      const allPos: { skill: Skill; pos: { x: number; y: number }; ri: number }[] = [];
      rings.forEach((_, ri) => {
        const rs = getRingSkills(ri);
        rs.forEach((skill, si) => {
          const pos = skillPos(ri, si, rs.length, t);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(pos.x, pos.y);
          ctx.strokeStyle = skill.color + "18";
          ctx.lineWidth = 0.5 * dpr;
          ctx.stroke();
          allPos.push({ skill, pos, ri });
        });
      });

      allPos.forEach(({ skill, pos, ri }) => drawNode(skill, pos, ri));
      drawCenter();

      t++;

      // Hover detection
      const mx = mouse.x * dpr;
      const my = mouse.y * dpr;
      let found: Skill | null = null;
      allPos.forEach(({ skill, pos, ri }) => {
        const baseR = (ri === 0 ? 21 : ri === 1 ? 18 : 15) * dpr;
        const dx = pos.x - mx;
        const dy = pos.y - my;
        if (Math.sqrt(dx * dx + dy * dy) < baseR * 1.6) found = skill;
      });

      if (found !== hoveredSkill) {
        hoveredSkill = found;
        if (lbl) {
          lbl.style.opacity = found ? "1" : "0";
          if (found) lbl.textContent = (found as Skill).name;
        }
      }

      animId = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      const r = wrap!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    wrap.addEventListener("mousemove", onMouseMove);
    wrap.addEventListener("mouseleave", onMouseLeave);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("mousemove", onMouseMove);
      wrap.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        background: "transparent",
        overflow: "hidden",
        position: "relative",
        height: "100%",
        width: "100%",
        fontFamily: "'JetBrains Mono', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "18px",
          left: "22px",
          fontFamily: "'JetBrains Mono', sans-serif",
          fontSize: "17px",
          letterSpacing: "0.2em",
          color: "#ffffff",
          opacity: 0.9,
          zIndex: 2,
        }}
      >
        MY SKILLS MATRIX
      </div>

      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />

      <div
        ref={lblRef}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'JetBrains Mono', sans-serif",
          fontSize: "11px",
          color: "#e2e8f0",
          background: "rgba(24, 24, 27, 0.85)",
          border: "none",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "20px",
          padding: "5px 16px",
          pointerEvents: "none",
          transition: "opacity 0.25s",
          opacity: 0,
          whiteSpace: "nowrap",
          zIndex: 2,
        }}
      />
    </div>
  );
}
