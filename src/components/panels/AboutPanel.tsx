import type { PanelProps } from '../../types';
import { motion } from 'motion/react';
import { FaTrophy } from 'react-icons/fa';
import TiltedCard from './TiltedCard';
import profileAvatar from '../../assets/profileimage.avif';

// Eagerly preload the avatar image so it is cached before the panel ever opens
if (typeof window !== 'undefined') {
  const img = new Image();
  img.src = profileAvatar;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 300, damping: 24 } 
  }
};

let hasAnimatedName = false;

const stats = [
  { num: '9.72', label: 'SGPA' },
  { num: '3+', label: 'Hackathons', sub: '1 WON' },
];

export default function AboutPanel({ onClose }: PanelProps) {
  const currentNameVariants: any = {
    hidden: { opacity: 0, y: 15, color: hasAnimatedName ? '#ffffff' : '#64748b' },
    show: { 
      opacity: 1, 
      y: 0, 
      color: hasAnimatedName ? '#ffffff' : ['#64748b', '#ffffff'],
      transition: { 
        y: { type: "spring" as const, stiffness: 300, damping: 24 },
        opacity: { duration: 0.3 },
        color: { duration: 1.2, ease: "easeOut", delay: 0.3 }
      } 
    }
  };

  return (
    <div className="panel panel-open" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="panel-traffic">
        <div className="traffic-dot traffic-red" onClick={onClose} />
        <div className="traffic-dot traffic-yellow" />
        <div className="traffic-dot traffic-green" />
      </div>

      <h2 style={{ fontFamily: "'JetBrains Mono', sans-serif", fontSize: '17px', fontWeight: 600, color: '#ffffff', letterSpacing: '0.2em', padding: '16px 24px 0 24px', margin: 0, opacity: 0.9 }}>
        IDENTITY MATRIX
      </h2>

      <motion.div 
        className="panel-body"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: '6fr 4fr', gap: '48px', alignItems: 'center', padding: '32px 48px', overflowY: 'auto', flex: 1, width: '100%' }}
      >
        {/* LHS: TiltedCard */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
          <TiltedCard
            imageSrc={profileAvatar}
            altText="Debashree Mal Avatar"
            captionText="DEBASHREE MAL"
            containerHeight="360px"
            containerWidth="90%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={12}
            scaleOnHover={1.05}
            showMobileWarning={false}
            showTooltip={true}
            displayOverlayContent={false}
          />
        </div>

        {/* RHS: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
          <div className="about-header-text" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 0 }}>
            <motion.h1 
              variants={currentNameVariants} 
              onAnimationComplete={() => { hasAnimatedName = true; }}
              style={{ margin: 0, fontFamily: "'JetBrains Mono', sans-serif", fontWeight: 700, fontSize: '32px' }}
            >
              DEBASHREE MAL
            </motion.h1>
            <motion.p variants={itemVariants} style={{ margin: 0, color: '#94a3b8', fontFamily: "'JetBrains Mono', sans-serif", fontSize: '14px', fontWeight: 600 }}>
              Computer Engineering
            </motion.p>
          </div>


          <motion.p variants={itemVariants} className="about-bio" style={{ fontSize: '18px', lineHeight: '1.6', color: '#e2e8f0' }}>
            Transforming India's unaddressed challenges into purposeful, AI-powered products — through engineering, design, and a relentless drive to build what's missing.
          </motion.p>

          <motion.div variants={itemVariants} className="about-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
            {stats.map((stat) => (
              <motion.div 
                key={stat.label} 
                className="about-stat"
                whileHover={{ 
                  scale: 1.04, 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)'
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{
                  padding: '20px',
                  background: 'rgba(255,255,255,0.03)',
                  border: 'none',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <div className="stat-num" style={{ fontSize: '32px', fontWeight: 'bold', color: '#cbd5e1' }}>{stat.num}</div>
                <div className="stat-label" style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>{stat.label}</div>
                {stat.sub && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#f8fafc', marginTop: '8px', fontWeight: 600, background: 'rgba(255, 255, 255, 0.1)', padding: '6px 14px', borderRadius: '16px' }}>
                    <FaTrophy size={15} color="#FFD700" /> {stat.sub}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

