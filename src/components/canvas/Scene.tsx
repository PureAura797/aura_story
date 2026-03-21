'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Particles from './Particles';
import TrafficStreaks from './TrafficStreaks';
import { useRef, useEffect, useState } from 'react';
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

// Theme colors for 3D
const DARK_BG = '#0b0c0f';
const LIGHT_BG = '#f0f0f2';

function useCurrentTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  useEffect(() => {
    const checkTheme = () => {
      const t = document.documentElement.getAttribute('data-theme');
      setTheme(t === 'light' ? 'light' : 'dark');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

function DynamicBackground() {
  const { scene } = useThree();
  const bgColorObj = useRef(new THREE.Color(DARK_BG));
  const theme = useCurrentTheme();
  const themeTarget = useRef(new THREE.Color(DARK_BG));

  useEffect(() => {
    themeTarget.current.set(theme === 'light' ? LIGHT_BG : DARK_BG);
  }, [theme]);

  if (!scene.background) {
    scene.background = new THREE.Color(DARK_BG);
  }

  useFrame(() => {
    // Blend scroll-driven bg with theme bg
    bgColorObj.current.set(scProps.bgColor);
    // On light theme, override scroll-driven bg toward light
    bgColorObj.current.lerp(themeTarget.current, 0.3);
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(bgColorObj.current, 0.05);
    }
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

function ThemeAdaptiveLights() {
  const theme = useCurrentTheme();
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const targetAmbient = theme === 'light' ? 1.2 : 0.6;
    const targetDir = theme === 'light' ? 4.0 : 3.0;
    if (ambientRef.current) {
      ambientRef.current.intensity += (targetAmbient - ambientRef.current.intensity) * 0.03;
    }
    if (dirRef.current) {
      dirRef.current.intensity += (targetDir - dirRef.current.intensity) * 0.03;
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.6} />
      <directionalLight ref={dirRef} position={[10, 10, 10]} intensity={3} />
    </>
  );
}

function ThemeAdaptiveBloom() {
  const theme = useCurrentTheme();
  const bloomIntensity = theme === 'light' ? 0.08 : 0.35;
  const bloomThreshold = theme === 'light' ? 0.9 : 0.6;

  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.9}
        intensity={bloomIntensity}
        mipmapBlur
      />
    </EffectComposer>
  );
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
        
        {/* HDRI environment for realistic reflections on physical material */}
        <Environment preset="city" background={false} environmentIntensity={0.4} />

        <ThemeAdaptiveLights />
        <DynamicLighting />

        <group>
          <Particles />
        </group>
        <TrafficStreaks />

        {/* Subtle cinematic bloom — adapts to theme */}
        <ThemeAdaptiveBloom />
      </Canvas>
      {/* Vignette overlay for depth */}
      <div className="scene-vignette" />
    </div>
  );
}
