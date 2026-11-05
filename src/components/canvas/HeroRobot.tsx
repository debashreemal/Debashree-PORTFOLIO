import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Global spatial cursor tracking algorithm (strictly horizontal / left-to-right only)
const cursorState = { x: 0 };
const interactionState = { isInteracting: false };

if (typeof window !== 'undefined') {
  let robotTicking = false;
  window.addEventListener(
    'mousemove',
    (e) => {
      if (!robotTicking) {
        window.requestAnimationFrame(() => {
          // Horizontal cursor tracking only (left to right)
          const robotCenterX = window.innerWidth * 0.5;
          cursorState.x = ((e.clientX - robotCenterX) / window.innerWidth) * 0.85;
          robotTicking = false;
        });
        robotTicking = true;
      }
    },
    { passive: true }
  );
}

function RobotModel() {
  const { scene } = useGLTF('/robot_opt.glb');
  const groupRef = useRef<THREE.Group>(null);

  // Exact 3D Mouse Tracking sequence: Left-to-Right ONLY
  useFrame((_, delta) => {
    if (groupRef.current) {
      if (interactionState.isInteracting) {
        // While user is actively holding & turning 360 degrees, relax local yaw
        groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, 0, 4, delta);
      } else {
        // Cursor tracking ONLY moves left to right (yaw only, clamped to ~35 deg glance)
        let targetX = cursorState.x * (Math.PI / 3.0);
        const maxAngle = Math.PI / 5.2;
        targetX = Math.max(-maxAngle, Math.min(maxAngle, targetX));

        groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetX, 4, delta);
      }

      // Strictly zero vertical tilt / pitch (only left to right movement)
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, 0, 6, delta);
      groupRef.current.rotation.z = 0;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* 
        Standing straight, facing forward, centered.
        Scale = 2.62, position = [0, -1.45, 0].
        Waist rests slightly below the bottom edge of the screen.
      */}
      <primitive object={scene} scale={2.62} position={[0, -1.45, 0]} rotation={[0, 0, 0]} />
    </group>
  );
}

export default function HeroRobot() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 2.05, 3.6], fov: 38 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        {/* Rich self-contained studio lighting setup (zero external network dependency) */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[0, 8, 6]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-5, 4, 3]} intensity={1.3} color="#e0f2fe" />
        <directionalLight position={[5, 3, 3]} intensity={1.1} color="#fee2e2" />
        <directionalLight position={[0, -3, 2]} intensity={0.7} color="#ffffff" />
        <pointLight position={[0, 2.2, 3]} intensity={1.6} color="#ffffff" distance={12} />

        {/* OrbitControls enables full 360-degree rotation when hold and turn (zoom disabled to preserve framing) */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          enableDamping={true}
          dampingFactor={0.06}
          rotateSpeed={0.85}
          target={[0, 2.05, 0]}
          minDistance={1.6}
          maxDistance={5.5}
          minAzimuthAngle={-Infinity}
          maxAzimuthAngle={Infinity}
          maxPolarAngle={Math.PI / 1.65}
          minPolarAngle={Math.PI / 3.2}
          onStart={() => {
            interactionState.isInteracting = true;
          }}
          onEnd={() => {
            interactionState.isInteracting = false;
          }}
        />

        <Suspense fallback={null}>
          <RobotModel />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/robot_opt.glb');
