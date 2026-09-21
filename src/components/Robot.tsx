import { useEffect, useRef, Suspense, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import RotatingText from './RotatingText';



// Global variable strictly for buttery 60fps tracking without causing React to stutter
const cursorState = { x: 0, y: 0, isHoveringCanvas: false };

let robotTicking = false;
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    if (!robotTicking) {
      window.requestAnimationFrame(() => {
        // SPATIAL TRACKING ALGORITHM:
        // The robot physically sits on the Right Hand Side at roughly 81% (0.81) of the screen width, and its eyes are at roughly 40% (0.40) screen height.
        // By calculating the cursor's Delta exactly relative to the robot's mechanical eyes, it will literally 'look' at the cursor natively!
        const robotEyeX = window.innerWidth * 0.81;
        const robotEyeY = window.innerHeight * 0.40;

        // Generate normalized true-relative coordinates (Sensitivity calmed down to 0.8 for subtle glances)
        cursorState.x = ((e.clientX - robotEyeX) / window.innerWidth) * 0.8;
        cursorState.y = -(e.clientY - robotEyeY) / window.innerHeight; 
        robotTicking = false;
      });
      robotTicking = true;
    }
  }, { passive: true });
}

// 1. Our Native 3D Robot Component Engine
function RobotModel() {
  // Pre-loads and parses the .glb geometry natively at lightspeed from the public folder
  const { scene } = useGLTF('/robot_opt.glb');
  const groupRef = useRef<THREE.Group>(null);

  // Removed expensive scene.traverse console logging here

  // 2. True 3D Mouse Tracking sequence
  useFrame((_, delta) => {
    if (groupRef.current) {
      // HOVER OVERRIDE: If the user brings the mouse to the robot to manually grab it, 
      // the robot smoothly 'relaxes' its neck back to the neutral looking-forward position!
      let targetX = cursorState.isHoveringCanvas ? 0 : cursorState.x * (Math.PI / 2.5); 
      
      // STRICT GEOMETRY CLAMP: Prevents the robot from doing too large of a body pivot.
      // Capped rigidly at roughly 36 degrees! It will execute a very polite, tight glance instead of a deep turn.
      const maxAngle = Math.PI / 5;
      targetX = Math.max(-maxAngle, Math.min(maxAngle, targetX));

      // Capped the pitch limit strictly to PI/10 (roughly 18 degrees) so the vertical movements are equally subtle.
      const targetY = cursorState.isHoveringCanvas ? 0 : -cursorState.y * (Math.PI / 10);   

      // Frame-independent spring damping creates consistently buttery smooth mechanical neck/body movement across any monitor refresh rate (60Hz, 120Hz, 144Hz)
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetX, 4, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetY, 4, delta);
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* 
        User Request: "head to waist only". 
        Removed the aggressive negative Y drop. 
      */}
      <primitive object={scene} scale={3.5} position={[0, -2, 0]} />
    </group>
  );
}

// Preload the optimized model instantly
useGLTF.preload('/robot_opt.glb');

// 3. Hero Section Parent Component
const Robot = memo(function Robot({ onReady }: { onReady: () => void }) {
  // Fire the portfolio boot sequence immediately — no typing delay
  useEffect(() => {
    const t = setTimeout(() => onReady(), 300);
    return () => clearTimeout(t);
  }, [onReady]);

  return (
    <>
      <div 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 0, 
          overflow: 'hidden', 
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          pointerEvents: 'none'
        }}
      >
        {/* LHS: Hero Text occupying exactly 70vw */}
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          style={{ 
            width: '70vw', 
            zIndex: 2, 
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingLeft: '8vw' 
          }}
        >
          {/* Line 1: Name — appears instantly in grey, then shimmers to white character by character */}
          <h1 className="hero-name" style={{ color: '#ffffff' }}>
            DEBASHREE MAL
          </h1>

          {/* Line 2: Taglines — smaller, loops fast with quick delete */}
          {/* Line 2: Build [RotatingText] animation */}
          <div 
            className="hero-tagline" 
            style={{ 
              opacity: 1,
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              overflow: 'hidden',
            }}
          >
            <span style={{ color: 'white', fontWeight: 500 }}>Build</span>
            <RotatingText
              texts={['Ideas', 'Logic', 'Systems', 'Scale']}
              staggerFrom="last"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-120%' }}
              staggerDuration={0.04}
              splitLevelClassName="overflow-hidden"
              transition={{ type: 'spring', damping: 20, stiffness: 500 }}
              rotationInterval={2000}
              splitBy="characters"
              auto
              loop
              mainClassName="hero-rotating-text"
            />
          </div>
        </motion.div>

        {/* RHS: 3D Robot Native Canvas */}
        <div 
          className="native-3d-wrapper" 
          onPointerEnter={() => { cursorState.isHoveringCanvas = true; }}
          onPointerLeave={() => { cursorState.isHoveringCanvas = false; }}
          style={{ 
            width: '30vw', 
            height: '80vh',
            transform: 'translateX(-4vw) translateY(-2.5%)', // Shift the entire grid element slightly left and 2.5% up
            pointerEvents: 'auto',
            position: 'relative'
          }}
        >
          {/* React Three Fiber Canvas engine replaces Sketchfab completely */}
          {/* By floating the physical 3D camera upwards to Y=2.5, we perfectly frame the upper chest natively */}
          <Canvas dpr={[1, 1.5]} performance={{ min: 0.5 }} camera={{ position: [0, 2.5, 4.5], fov: 45 }} gl={{ alpha: true, antialias: true }} style={{ background: 'transparent' }}>
            {/* Professional studio lighting setup */}
            <ambientLight intensity={0.6} />
            <spotLight position={[10, 10, 10]} intensity={1.5} angle={0.15} penumbra={1} />
            <Environment preset="city" resolution={256} />
            
            {/* INJECTED CONTROL: This single line grants you the power to click, drag, spin, and scroll-wheel zoom! */}
            {/* Added maxPolarAngle constraint so you can't accidentally drag the camera 'underground' violently */}
            <OrbitControls 
              enableZoom={true} 
              enablePan={true} 
              enableDamping={true}
              dampingFactor={0.05}
              makeDefault 
              target={[0, 2.5, 0]} 
              maxPolarAngle={Math.PI / 1.5}
            />

            <Suspense fallback={null}>
              <RobotModel />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </>
  );
});

export default Robot;
