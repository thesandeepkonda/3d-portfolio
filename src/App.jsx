import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Cloud, ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

// --- SCROLL DRIVEN CAMERA CONTROLLER ---
function ScrollCamera() {
  const scroll = useScroll();
  const { camera, scene } = useThree();

  useFrame(() => {
    const offset = scroll.offset; 

    let x, y, z;
    if (offset < 0.5) {
      const t = offset * 2; 
      x = THREE.MathUtils.lerp(0, 20, t);
      y = THREE.MathUtils.lerp(100, 40, t);
      z = THREE.MathUtils.lerp(80, 50, t);
    } else {
      const t = (offset - 0.5) * 2; 
      x = THREE.MathUtils.lerp(20, 35, t);
      y = THREE.MathUtils.lerp(40, 15, t);
      z = THREE.MathUtils.lerp(50, 40, t);
    }

    camera.position.set(x, y, z);
    
    const targetY = THREE.MathUtils.lerp(80, 15, offset);
    camera.lookAt(0, targetY, 0);

    if (scene.fog) {
      scene.fog.density = THREE.MathUtils.lerp(0.008, 0.002, offset);
    }
  });
  return null;
}

// --- ABSTRACT KINETIC CENTERPIECE ---
function AbstractCenterpiece() {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = 15 + Math.sin(time * 0.5) * 2;
      groupRef.current.rotation.y = time * 0.1;
    }
    if (ring1Ref.current && ring2Ref.current) {
      ring1Ref.current.rotation.x = time * 0.2;
      ring1Ref.current.rotation.y = time * 0.3;
      ring2Ref.current.rotation.x = -time * 0.15;
      ring2Ref.current.rotation.z = time * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={[0, 15, 0]}>
      <mesh castShadow>
        <icosahedronGeometry args={[5, 0]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} flatShading={true} />
      </mesh>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[8, 0.4, 32, 100]} />
        <meshPhysicalMaterial color="#ffffff" transmission={1} opacity={1} metalness={0.1} roughness={0} ior={1.5} thickness={2} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[11, 0.1, 16, 100]} />
        <meshStandardMaterial color="#cda434" metalness={1} roughness={0.2} />
      </mesh>
      <pointLight color="#ffffff" intensity={2} distance={30} />
    </group>
  );
}

// --- 3D SCENE ASSETS ---
// --- 3D SCENE ASSETS (OFFLINE SAFE MODE) ---
function EnvironmentObjects() {
  return (
    <>
      {/* 1. Sets a dark, sleek background without downloading images */}
      <color attach="background" args={['#050505']} />
      
      {/* 2. Manual lighting setup to replace the HDRI Environment */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[50, 50, 30]} intensity={2} castShadow />
      <directionalLight position={[-50, 20, -30]} intensity={1} color="#cda434" />
      <pointLight position={[0, 100, 0]} intensity={2} color="#ffffff" />
      
      {/* 3. Highly reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#080808" roughness={0.1} metalness={0.9} />
      </mesh>

      <AbstractCenterpiece />
    </>
  );
}

// --- MAIN REACT COMPONENT ---
export default function App() {
  const [loadingPct, setLoadingPct] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 20 + 5;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoaded(true), 400);
      }
      setLoadingPct(pct);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      
      {!isLoaded && (
        <div className={`loading-screen ${loadingPct === 100 ? 'fade-out' : ''}`}>
          <div className="loader-text">Initializing Engine</div>
          <div className="loader-line-container">
            <div className="loader-line" style={{ width: `${loadingPct}%` }}></div>
          </div>
        </div>
      )}

      <Canvas shadows onCreated={({ scene }) => { scene.fog = new THREE.FogExp2('#111', 0.008); }}>
        <Suspense fallback={null}>
          <ScrollControls pages={4} damping={0.25}>
            <ScrollCamera />
            <EnvironmentObjects />

            <Scroll html style={{ width: '100%' }}>
              
              <div className="scroll-section">
                <div className="hero-content">
                  <span className="hero-label">Portfolio / 2024</span>
                  <h1 className="hero-title">Sandeep Konda.</h1>
                  <p className="hero-subtitle">Engineering elegant web applications and immersive digital experiences.</p>
                  <div className="scroll-line-indicator">
                    <div className="scroll-line"></div> Scroll down
                  </div>
                </div>
              </div>

              <div className="scroll-section">
                 <div className="middle-content">
                    <p className="statement-text">"Excellence is not an act, but a habit of continuous refinement."</p>
                 </div>
              </div>

              <div className="scroll-section" style={{ justifyContent: 'center' }}>
                <div className="bottom-content">
                  <div className="pro-grid">
                    <div className="pro-panel">
                      <div className="pro-header">About</div>
                      <h2 className="pro-title">Executive Summary</h2>
                      <p className="pro-desc">
                        A highly disciplined Full-Stack Developer with expertise in React, 3D WebGL, and scalable architectures. I focus on delivering robust, enterprise-grade solutions.
                      </p>
                    </div>
                    <div className="pro-panel">
                      <div className="pro-header">Capabilities</div>
                      <h2 className="pro-title">Core Competencies</h2>
                      <div className="pro-tags">
                        <span className="pro-tag">Architecture</span>
                        <span className="pro-tag">React & Three.js</span>
                        <span className="pro-tag">Node / Python</span>
                        <span className="pro-tag">System Design</span>
                        <span className="pro-tag">TypeScript</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="scroll-section" style={{ justifyContent: 'center' }}>
                <div className="projects-container">
                  <h2 className="projects-header">Selected Works</h2>
                  <div className="projects-grid">
                    <div className="project-card">
                      <div className="project-img-placeholder">
                        Image Placeholder
                      </div>
                      <div className="project-info">
                        <div>
                          <h3 className="project-title">Modern E-Commerce</h3>
                          <p className="project-tech">React.js, Node.js, Stripe</p>
                        </div>
                        <a href="#" className="project-link">View ↗</a>
                      </div>
                    </div>
                    <div className="project-card">
                      <div className="project-img-placeholder">
                        Image Placeholder
                      </div>
                      <div className="project-info">
                        <div>
                          <h3 className="project-title">Cinematic 3D Experience</h3>
                          <p className="project-tech">Three.js, WebGL, GSAP</p>
                        </div>
                        <a href="#" className="project-link">View ↗</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>

    </div>
  );
}