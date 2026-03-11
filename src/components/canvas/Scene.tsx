'use client';

import { Canvas, useFrame } from '@react-three/fiber';
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

function CameraManager() {
  useFrame(({ camera }) => {
    camera.position.z = scProps.camZ;
    
    if (camera.position.z < 6) {
      const darken = 1.0 - (6 - camera.position.z) / 6;
      document.body.style.backgroundColor = `rgb(${42 * darken}, ${42 * darken}, ${42 * darken})`;
    } else {
      document.body.style.backgroundColor = '#171717';
    }
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
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} near={0.1} far={100} />
        <fog attach="fog" args={['#2a2a2a', 10, 30]} />
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={3} />
        <DynamicLighting />

        <group>
          <Particles />
        </group>
        <TrafficStreaks />
      </Canvas>
    </div>
  );
}
