'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scProps } from '@/lib/scrollProps';

export default function TrafficStreaks() {
  const lineRef = useRef<THREE.LineSegments>(null);
  
  const streakCount = 250;
  
  const { positions, colors, speeds } = useMemo(() => {
    const pos = new Float32Array(streakCount * 2 * 3);
    const cols = new Float32Array(streakCount * 2 * 3);
    const spds = new Float32Array(streakCount);
    
    const colRed = new THREE.Color(0xff0000); // brake lights
    const colWhite = new THREE.Color(0xffffee); // headlights

    for (let i = 0; i < streakCount; i++) {
        const y = (Math.random() - 0.5) * 60;
        const z = (Math.random() - 0.5) * 40 - 10;
        const x = (Math.random() - 0.5) * 150;
        const length = Math.random() * 8 + 2;
        const isRed = Math.random() > 0.5;
        const color = isRed ? colRed : colWhite;
        const speed = (isRed ? -1 : 1) * (Math.random() * 0.5 + 0.1);
        
        pos[i * 6]     = x;          pos[i * 6 + 1] = y; pos[i * 6 + 2] = z;     // start pos
        pos[i * 6 + 3] = x + length; pos[i * 6 + 4] = y; pos[i * 6 + 5] = z;     // end pos
        
        color.toArray(cols, i * 6); 
        color.toArray(cols, i * 6 + 3);
        spds[i] = speed;
    }
    
    return { positions: pos, colors: cols, speeds: spds };
  }, [streakCount]);

  useFrame(() => {
    if (!lineRef.current) return;
    
    const currentSpeedMul = scProps.speedMul || 1.0;
    
    const sPos = lineRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < streakCount; i++) {
        const spd = speeds[i] * currentSpeedMul;
        sPos[i * 6] += spd; 
        sPos[i * 6 + 3] += spd;
        
        // Infinite loop side to side
        if (spd > 0 && sPos[i * 6] > 100) { 
            sPos[i * 6] -= 200; 
            sPos[i * 6 + 3] -= 200; 
        }
        if (spd < 0 && sPos[i * 6] < -100) { 
            sPos[i * 6] += 200; 
            sPos[i * 6 + 3] += 200; 
        }
    }
    
    lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.2} />
    </lineSegments>
  );
}
