'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import Particles from './Particles';
import TrafficStreaks from './TrafficStreaks';
import { useRef } from 'react';
import { scProps } from '@/lib/scrollProps';
import * as THREE from 'three';

function DynamicLighting() {
  const pointLightRef = useRef<THREE.PointLight>(null);
  const colorObj = useRef(new THREE.Color('#ffb703'));

  useFrame(() => {
    if (!pointLightRef.current) return;
    colorObj.current.set(scProps.lightColor);
    pointLightRef.current.color.copy(colorObj.current);
    pointLightRef.current.intensity = scProps.lightIntensity;
  });

  return (
    <pointLight 
      ref={pointLightRef} 
      position={[-5, -5, 5]} 
      intensity={10} 
      color="#ffb703" 
      distance={20} 
    />
  );
}

function DynamicBackground() {
  const { scene } = useThree();
  const bgColorObj = useRef(new THREE.Color('#0b0c0f'));

  // Set initial background
  if (!scene.background) {
    scene.background = new THREE.Color('#0b0c0f');
  }

  useFrame(() => {
    bgColorObj.current.set(scProps.bgColor);
    // Smoothly lerp scene background
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(bgColorObj.current, 0.05);
    }
    // Also update fog color to match
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      scene.fog.color.lerp(bgColorObj.current, 0.05);
    }
  });

  return null;
}

function CameraManager() {
  useFrame(({ camera }) => {
    camera.position.z = scProps.camZ;
  });
  return null;
}

export default function Scene() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: 'none' }}
    >
      <Canvas dpr={[1, 2]} style={{ pointerEvents: 'auto' }}>
        <CameraManager />
        <DynamicBackground />
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} near={0.1} far={100} />
        <fog attach="fog" args={['#0b0c0f', 12, 35]} />
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={3} />
        <DynamicLighting />

        <group>
          <Particles />
        </group>
        <TrafficStreaks />
      </Canvas>
      {/* Vignette overlay for depth */}
      <div className="scene-vignette" />
    </div>
  );
}

