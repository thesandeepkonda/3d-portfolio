import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import './App.css';

// 1. Create a dynamic 3D Object
function InteractiveShape() {
  const sphereRef = useRef();

  // Rotate the shape slightly on every frame
  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.005;
      sphereRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={sphereRef} scale={1.5}>
        <sphereGeometry args={[1, 64, 64]} />
        {/* Distort Material gives a liquid/blobby effect often seen on Awwwards */}
        <MeshDistortMaterial 
          color="#7a5d6d" 
          attach="material" 
          distort={0.4} 
          speed={2} 
          roughness={0.2} 
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

// 2. Main Application
export default function App() {
  return (
    <div className="portfolio-container">
      {/* HTML Overlay for Text */}
      <div className="hero-text">
        <h1>Hello, I'm a Developer.</h1>
        <p>Welcome to my Creative 3D Portfolio</p>
        <button className="cta-btn">View Work</button>
      </div>

      {/* 3D Canvas rendering underneath the text */}
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} color="#c09e9c" intensity={2} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <InteractiveShape />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}