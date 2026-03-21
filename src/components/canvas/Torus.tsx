'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scProps } from '@/lib/scrollProps';

function useCurrentTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  useEffect(() => {
    const check = () => {
      const t = document.documentElement.getAttribute('data-theme');
      setTheme(t === 'light' ? 'light' : 'dark');
    };
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return theme;
}

export default function Torus() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const theme = useCurrentTheme();

  // Torus parameters
  const count = 80;
  const radius = 6;

  // Geometry computation
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 1.2, h = 0.4, r = 0.05;
    
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

    const geo = new THREE.ExtrudeGeometry(shape, { 
      depth: 0.2, 
      bevelEnabled: true, 
      bevelSize: 0.01, 
      bevelThickness: 0.01 
    });
    geo.center();
    return geo;
  }, []);

  const baseAngles = useMemo(() => {
    const angles = [];
    for (let i = 0; i < count; i++) {
      angles.push((i / count) * Math.PI * 2);
    }
    return angles;
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const { speedMul, radiusScale, groupX, groupY, rotX, rotY, rotZ } = scProps;
    
    // Group transformation
    meshRef.current.position.set(groupX, groupY, 0);
    meshRef.current.rotation.set(rotX, rotY, rotZ);

    if (!meshRef.current.userData.totalRotation) {
      meshRef.current.userData.totalRotation = 0;
    }
    meshRef.current.userData.totalRotation += speedMul * delta;
    const totalRotation = meshRef.current.userData.totalRotation;

    for (let i = 0; i < count; i++) {
        const angle = baseAngles[i];
        const currentRadius = radius * radiusScale;
        
        dummy.position.set(Math.cos(angle) * currentRadius, Math.sin(angle) * currentRadius, 0);
        dummy.lookAt(0, 0, 0);
        dummy.rotateX(Math.PI / 2);
        dummy.rotateY(totalRotation);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Darker material on light theme for contrast against white bg
  const matColor = theme === 'light' ? 0x222222 : 0x555555;

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]} >
      <meshStandardMaterial 
        color={matColor} 
        metalness={0.4} 
        roughness={0.8} 
      />
    </instancedMesh>
  );
}

