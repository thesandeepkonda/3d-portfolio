import React, { useState, useEffect, useRef } from 'react';
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
      // First half of the long scroll
      const t = offset * 2; 
      x = THREE.MathUtils.lerp(0, 20, t);
      y = THREE.MathUtils.lerp(100, 40, t);
      z = THREE.MathUtils.lerp(80, 50, t);
    } else {
      // Second half of the long scroll
      const t = (offset - 0.5) * 2; 
      x = THREE.MathUtils.lerp(20, 35, t);
      y = THREE.MathUtils.lerp(40, 15, t);
      z = THREE.MathUtils.lerp(50, 40, t);
    }

    camera.position.set(x, y, z);
    
    // Look smoothly at the center object (which sits at Y=15)
    const targetY = THREE.MathUtils.lerp(80, 15, offset);
    camera.lookAt(0, targetY, 0);

    // Fade out fog as we drop
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
// --- 3D SCENE ASSETS ---
function EnvironmentObjects() {
  return (
    <>
      {/* CHANGED: We removed 'preset="sunset"' and added 'files="/eiffel-tower.jpg"'. 
        This tells Three.js to look in your public folder for the photo and wrap it around the scene! 
      */}
      <Environment files="/eiffel-tower.webp" background={true} />
      
      <group position={[0, 90, 0]}>
        <Cloud position={[-30, 0, -40]} speed={0.2} opacity={0.5} scale={2} color="#ffffff" />
        <Cloud position={[30, 10, -20]} speed={0.2} opacity={0.5} scale={2.5} color="#ffd9a0" />
        <Cloud position={[10, -10, 40]} speed={0.2} opacity={0.3} scale={1.5} color="#ffffff" />
      </group>
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[50, 50, 30]} intensity={1.5} castShadow />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.8} />
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
        {/* CHANGED pages={3} to pages={4} to give us room for the new section */}
        <ScrollControls pages={4} damping={0.25}>
          <ScrollCamera />
          <EnvironmentObjects />

          <Scroll html style={{ width: '100%' }}>
            
            {/* PAGE 1: Hero */}
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

            {/* PAGE 2: Statement */}
            <div className="scroll-section">
               <div className="middle-content">
                  <p className="statement-text">"Excellence is not an act, but a habit of continuous refinement."</p>
               </div>
            </div>

            {/* PAGE 3: Professional Grid */}
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

            {/* PAGE 4: SELECTED WORKS (NEW) */}
            <div className="scroll-section" style={{ justifyContent: 'center' }}>
              <div className="projects-container">
                <h2 className="projects-header">Selected Works</h2>
                
                <div className="projects-grid">
                  
                  {/* Project 1 */}
                  <div className="project-card">
                    <div className="project-img-placeholder">
                      {/* To add a real image later, replace the text below with: <img src="your-image.jpg" alt="Project 1" /> */}
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

                  {/* Project 2 */}
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
      </Canvas>

    </div>
  );
}