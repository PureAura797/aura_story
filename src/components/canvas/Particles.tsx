'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scProps } from '@/lib/scrollProps';
import { formations, PARTICLE_COUNT } from '@/lib/formations';

// Pre-generate random scatter offsets for entrance animation
const scatterOffsets: THREE.Vector3[] = [];
for (let i = 0; i < PARTICLE_COUNT; i++) {
  scatterOffsets.push(
    new THREE.Vector3(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 15
    )
  );
}

export default function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Current interpolated positions for each block
  const currentPositions = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push(formations[0].positions[i].clone());
    }
    return arr;
  }, []);

  // Mouse tracking in normalized coordinates
  const mouse = useMemo(() => ({ x: 0, y: 0 }), []);
  const mouseWorld = useMemo(() => new THREE.Vector3(), []);

  // Geometry — same rectangular block as original Torus
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

  // Subscribe to pointer events at canvas level
  const { gl } = useThree();
  useMemo(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    gl.domElement.addEventListener('pointermove', handlePointerMove);
    return () => gl.domElement.removeEventListener('pointermove', handlePointerMove);
  }, [gl, mouse]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const { formation, speedMul, groupX, groupY, rotX, rotY, rotZ, lerpSpeed } = scProps;

    // Group transformation
    meshRef.current.position.set(groupX, groupY, 0);
    meshRef.current.rotation.set(rotX, rotY, rotZ);

    // Self-rotation accumulator
    if (!meshRef.current.userData.totalRotation) {
      meshRef.current.userData.totalRotation = 0;
    }
    meshRef.current.userData.totalRotation += speedMul * delta * 0.5;
    const totalRotation = meshRef.current.userData.totalRotation;

    // Determine formation targets via interpolation
    const formationFloor = Math.floor(formation);
    const formationCeil = Math.min(formationFloor + 1, formations.length - 1);
    const formationFrac = formation - formationFloor;

    const formA = formations[formationFloor];
    const formB = formations[formationCeil];

    // Mouse world position for repulsion (approximate)
    mouseWorld.set(mouse.x * 10, mouse.y * 6, 0);

    // Pulse for Contact section (formation 9)
    const pulseScale = formation >= 8.5 && formation <= 9.5
      ? 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15
      : 1;

    const clampedDelta = Math.min(delta, 0.05);
    const lerpFactor = 1 - Math.exp(-lerpSpeed * clampedDelta);

    // Entrance animation progress (0 = scattered/hidden, 1 = fully assembled)
    const entrance = scProps.entranceProgress;
    const particleScale = entrance; // blocks grow from 0 to 1

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Target position: lerp between two adjacent formations
      const targetX = THREE.MathUtils.lerp(formA.positions[i].x, formB.positions[i].x, formationFrac) * pulseScale;
      const targetY = THREE.MathUtils.lerp(formA.positions[i].y, formB.positions[i].y, formationFrac) * pulseScale;
      const targetZ = THREE.MathUtils.lerp(formA.positions[i].z, formB.positions[i].z, formationFrac);

      // Smooth lerp towards target
      currentPositions[i].x += (targetX - currentPositions[i].x) * lerpFactor;
      currentPositions[i].y += (targetY - currentPositions[i].y) * lerpFactor;
      currentPositions[i].z += (targetZ - currentPositions[i].z) * lerpFactor;

      // During entrance: add scatter offset that fades out
      const scatterFade = 1 - entrance;
      const px = currentPositions[i].x + scatterOffsets[i].x * scatterFade;
      const py = currentPositions[i].y + scatterOffsets[i].y * scatterFade;
      const pz = currentPositions[i].z + scatterOffsets[i].z * scatterFade;

      // Mouse repulsion
      const dx = px - mouseWorld.x;
      const dy = py - mouseWorld.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repulsionRadius = 4;
      
      let finalX = px, finalY = py;
      if (dist < repulsionRadius && dist > 0.01) {
        const force = (1 - dist / repulsionRadius) * 1.5;
        finalX += (dx / dist) * force * clampedDelta * 4;
        finalY += (dy / dist) * force * clampedDelta * 4;
      }

      // Apply position, rotation, and entrance scale
      dummy.position.set(finalX, finalY, pz);
      dummy.lookAt(0, 0, 0);
      dummy.rotateX(Math.PI / 2);
      dummy.rotateY(totalRotation);
      dummy.scale.setScalar(particleScale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, PARTICLE_COUNT]}>
      <meshStandardMaterial 
        color={0x555555} 
        metalness={0.4} 
        roughness={0.8} 
      />
    </instancedMesh>
  );
}
