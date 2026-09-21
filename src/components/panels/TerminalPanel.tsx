import { useEffect, useRef } from 'react';
import type { PanelProps } from '../../types';

interface TerminalLine {
  text: string;
  color: string;
  cursor?: boolean;
  isCommand?: boolean;
}

const TERMINAL_LINES: TerminalLine[] = [
  { text: 'debashree@portfolio:~$ neofetch', color: '#e5e5e5', isCommand: true },
  { text: '  OS:       Portfolio OS v2.0', color: '#9ca3af' },
  { text: '  Host:     Debashree Mal', color: '#f3f4f6' },
  { text: '  Kernel:   Computer Engineering · 3rd Year', color: '#9ca3af' },
  { text: '  Shell:    React/TypeScript', color: '#9ca3af' },
  { text: '  DE:       macOS-Inspired', color: '#9ca3af' },
  { text: '', color: 'transparent' },

  { text: 'debashree@portfolio:~$ cat ~/.achievements', color: '#e5e5e5', isCommand: true },
  { text: '  → SGPA: 9.72', color: '#d4d4d4' },
  { text: '  → 1 Hackathon Won - AXION', color: '#d4d4d4' },
  { text: '  → 1 Live Production App - PLUTO', color: '#d4d4d4' },
  { text: '', color: 'transparent' },
  { text: '  → Smart India Hackathon (SIH)', color: '#d4d4d4' },
  { text: '  → Avishkar 2026', color: '#d4d4d4' },
  { text: '', color: 'transparent' },
  { text: 'debashree@portfolio:~$ echo $TECH_STACK', color: '#e5e5e5', isCommand: true },
  { text: '  Frontend: React, TypeScript, JavaScript, HTML, CSS, Tailwind, Vite', color: '#4ade80' },
  { text: '  Backend:  NodeJS, Python, FastAPI, C++', color: '#ec4899' },
  { text: '  Database: MongoDB, Supabase', color: '#f97316' },

  { text: 'debashree@portfolio:~$ _', color: '#e5e5e5', cursor: true }
];

export default function TerminalPanel({ onClose }: PanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    let i = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function typeLine() {
      if (i >= TERMINAL_LINES.length || !container) return;
      const line = TERMINAL_LINES[i];
      const div = document.createElement('div');
      div.className = 'terminal-line';
      div.style.whiteSpace = 'pre';
      div.style.fontFamily = "'JetBrains Mono', sans-serif";
      div.style.fontSize = '15px';
      div.style.lineHeight = '2';

      requestAnimationFrame(() => { div.classList.add('typed'); });

      if (line.cursor) {
        div.innerHTML = `<span style="color:#a855f7">debashree@portfolio:~$ </span><span class="terminal-cursor" style="animation: blink-cursor 1s step-end infinite; color:#e5e5e5">_</span>`;
        container.appendChild(div);
        finishLine();
      } else if (line.text === '') {
        div.style.height = '8px';
        container.appendChild(div);
        finishLine();
      } else {
        container.appendChild(div);
        
        if (line.isCommand) {
          const parts = line.text.split('~$ ');
          const promptHTML = `<span style="color:#a855f7">${parts[0]}~$ </span>`;
          div.innerHTML = promptHTML;
          const commandText = parts[1] || '';
          let cIdx = 0;
          function typeCommandChar() {
            if (cIdx < commandText.length) {
              div.innerHTML = promptHTML + `<span style="color:#e5e5e5; font-weight: 500;">${commandText.slice(0, cIdx + 1)}</span><span class="terminal-cursor" style="animation: blink-cursor 1s step-end infinite; color:#e5e5e5">_</span>`;
              cIdx++;
              timeouts.push(setTimeout(typeCommandChar, 15 + Math.random() * 30));
            } else {
              div.innerHTML = promptHTML + `<span style="color:#e5e5e5; font-weight: 500;">${commandText}</span>`;
              finishLine();
            }
          }
          typeCommandChar();
        } else {
          div.style.color = line.color || '#a3a3a3';
          let cIdx = 0;
          const outText = line.text;
          function typeOutChar() {
            if (cIdx < outText.length) {
              const safeText = outText.slice(0, cIdx + 1).replace(/</g, '&lt;').replace(/>/g, '&gt;');
              div.innerHTML = safeText + '<span class="terminal-cursor" style="animation: blink-cursor 1s step-end infinite; color:#e5e5e5">_</span>';
              cIdx++;
              timeouts.push(setTimeout(typeOutChar, 5 + Math.random() * 15));
            } else {
              if (i === TERMINAL_LINES.length - 1) {
                const finalSafeText = outText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                div.innerHTML = finalSafeText + '<span class="terminal-cursor" style="animation: blink-cursor 1s step-end infinite; color:#e5e5e5">_</span>';
              } else {
                div.textContent = outText;
              }
              finishLine();
            }
          }
          typeOutChar();
        }
      }

      function finishLine() {
        i++;
        if (i < TERMINAL_LINES.length) {
          const delay = TERMINAL_LINES[i - 1].isCommand ? 100 : 0;
          const t = setTimeout(typeLine, delay);
          timeouts.push(t);
        }
      }
    }

    typeLine();

    return () => { timeouts.forEach(clearTimeout); };
  }, []);

  return (
    <div className="panel panel-open" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-traffic">
        <div className="traffic-dot traffic-red" onClick={onClose} />
        <div className="traffic-dot traffic-yellow" />
        <div className="traffic-dot traffic-green" />
      </div>

      <div className="panel-body" style={{ padding: 0, flex: 1, overflow: 'hidden' }}>
        <div
          className="terminal-inner"
          ref={containerRef}
          style={{
            height: '100%',
            overflowY: 'auto',
            padding: '20px 24px',
            background: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '0 0 16px 16px',
          }}
        />
      </div>
    </div>
  );
}
