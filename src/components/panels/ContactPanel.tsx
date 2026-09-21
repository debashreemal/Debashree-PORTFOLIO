import type { PanelProps } from '../../types';

export default function ContactPanel({ onClose }: PanelProps) {
  const items = [
    {
      // @ts-ignore
      icon: <lord-icon src="/icons/gtvaxhwv.json" trigger="hover" stroke="bold" colors="primary:#ffffff,secondary:#00c8ff,tertiary:#7c3aed,quaternary:#e2e8f0" style={{ width: '120px', height: '120px', filter: 'grayscale(100%)', transition: 'filter 0.3s ease' }}></lord-icon>,
      title: "Email",
      url: "https://mail.google.com/mail/?view=cm&fs=1&to=debashreee87@gmail.com"
    },
    {
      // @ts-ignore
      icon: <lord-icon src="/icons/xerxcacw.json" trigger="hover" colors="primary:#ffffff,secondary:#00c8ff,tertiary:#7c3aed" style={{ width: '120px', height: '120px', filter: 'grayscale(100%)', transition: 'filter 0.3s ease' }}></lord-icon>,
      title: "LinkedIn",
      url: "https://linkedin.com/in/debashree-mal-4a6214370"
    },
    {
      // @ts-ignore
      icon: <lord-icon src="/icons/lllcnxva.json" trigger="hover" stroke="bold" colors="primary:#ffffff,secondary:#00c8ff,tertiary:#7c3aed" style={{ width: '120px', height: '120px', filter: 'grayscale(100%)', transition: 'filter 0.3s ease' }}></lord-icon>,
      title: "GitHub",
      url: "https://github.com/debashreemal"
    }
  ];

  return (
    <div className="panel panel-open" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-traffic">
        <div className="traffic-dot traffic-red" onClick={onClose} />
        <div className="traffic-dot traffic-yellow" />
        <div className="traffic-dot traffic-green" />
      </div>

      <h2 style={{ fontFamily: "'JetBrains Mono', sans-serif", fontSize: '17px', fontWeight: 600, color: '#ffffff', letterSpacing: '0.2em', padding: '16px 24px 0 24px', margin: 0, opacity: 0.9 }}>
        LET'S WORK TOGETHER
      </h2>

      <div className="panel-body" style={{ overflow: 'auto', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '120px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', padding: '20px' }}>
          {items.map((item, index) => (
            <a 
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#ffffff',
                transition: 'all 0.3s ease',
                opacity: 0.7,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                e.currentTarget.style.opacity = '1';
                const icon = e.currentTarget.querySelector('lord-icon');
                if (icon) (icon as HTMLElement).style.filter = 'grayscale(0%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.opacity = '0.7';
                const icon = e.currentTarget.querySelector('lord-icon');
                if (icon) (icon as HTMLElement).style.filter = 'grayscale(100%)';
              }}
            >
              {item.icon}
              <span style={{ fontFamily: "'JetBrains Mono', sans-serif", fontSize: '15px', marginTop: '16px', fontWeight: 600, letterSpacing: '0.1em' }}>
                {item.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
