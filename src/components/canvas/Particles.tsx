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

  // Final resolved positions (after repulsion)
  const resolvedPositions = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push(new THREE.Vector3());
    }
    return arr;
  }, []);

  const mouse = useMemo(() => ({ x: 0, y: 0 }), []);
  const mouseWorld = useMemo(() => new THREE.Vector3(), []);
  const smoothDelta = useRef(0.016);

  // Original rounded rectangle geometry
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
      bevelThickness: 0.01,
      bevelSegments: 1,
    });
    geo.center();
    return geo;
  }, []);

  // Pointer events
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

    // Smooth delta
    const rawDelta = Math.min(delta, 0.05);
    smoothDelta.current += (rawDelta - smoothDelta.current) * 0.3;
    const dt = smoothDelta.current;

    const { formation, speedMul, groupX, groupY, rotX, rotY, rotZ, lerpSpeed } = scProps;

    meshRef.current.position.set(groupX, groupY, 0);
    meshRef.current.rotation.set(rotX, rotY, rotZ);

    if (!meshRef.current.userData.totalRotation) {
      meshRef.current.userData.totalRotation = 0;
    }
    meshRef.current.userData.totalRotation += speedMul * dt * 0.5;
    const totalRotation = meshRef.current.userData.totalRotation;

    const formFloor = Math.floor(formation);
    const formCeil = Math.min(formFloor + 1, formations.length - 1);
    const formFrac = formation - formFloor;
    const formA = formations[formFloor];
    const formB = formations[formCeil];

    mouseWorld.set(mouse.x * 10, mouse.y * 6, 0);

    const pulseScale = 1;

    const lerpFactor = 1 - Math.exp(-lerpSpeed * dt);
    const entrance = scProps.entranceProgress;

    // ─── Pass 1: compute base positions ───
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const targetX = THREE.MathUtils.lerp(formA.positions[i].x, formB.positions[i].x, formFrac) * pulseScale;
      const targetY = THREE.MathUtils.lerp(formA.positions[i].y, formB.positions[i].y, formFrac) * pulseScale;
      const targetZ = THREE.MathUtils.lerp(formA.positions[i].z, formB.positions[i].z, formFrac);

      currentPositions[i].x += (targetX - currentPositions[i].x) * lerpFactor;
      currentPositions[i].y += (targetY - currentPositions[i].y) * lerpFactor;
      currentPositions[i].z += (targetZ - currentPositions[i].z) * lerpFactor;

      const scatterFade = 1 - entrance;
      resolvedPositions[i].set(
        currentPositions[i].x + scatterOffsets[i].x * scatterFade,
        currentPositions[i].y + scatterOffsets[i].y * scatterFade,
        currentPositions[i].z + scatterOffsets[i].z * scatterFade
      );
    }

    // ─── Pass 2: mouse repulsion ───
    const mouseRepRadiusSq = 16;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const dx = resolvedPositions[i].x - mouseWorld.x;
      const dy = resolvedPositions[i].y - mouseWorld.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < mouseRepRadiusSq && distSq > 0.0001) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / 4) * 1.5;
        resolvedPositions[i].x += (dx / dist) * force * dt * 4;
        resolvedPositions[i].y += (dy / dist) * force * dt * 4;
      }
    }

    // ─── Pass 3: inter-particle soft repulsion (prevent overlap) ───
    const MIN_DIST = 1.0;            // minimum distance between particle centers
    const MIN_DIST_SQ = MIN_DIST * MIN_DIST;
    const SEPARATION_STRENGTH = 2.0; // how strongly they push apart

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = resolvedPositions[i].x - resolvedPositions[j].x;
        const dy = resolvedPositions[i].y - resolvedPositions[j].y;
        const dz = resolvedPositions[i].z - resolvedPositions[j].z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < MIN_DIST_SQ && distSq > 0.0001) {
          const dist = Math.sqrt(distSq);
          const overlap = MIN_DIST - dist;
          const pushX = (dx / dist) * overlap * SEPARATION_STRENGTH * dt;
          const pushY = (dy / dist) * overlap * SEPARATION_STRENGTH * dt;
          const pushZ = (dz / dist) * overlap * SEPARATION_STRENGTH * dt;

          // Push both particles apart equally
          resolvedPositions[i].x += pushX;
          resolvedPositions[i].y += pushY;
          resolvedPositions[i].z += pushZ;
          resolvedPositions[j].x -= pushX;
          resolvedPositions[j].y -= pushY;
          resolvedPositions[j].z -= pushZ;
        }
      }
    }

    // ─── Pass 4: apply transforms ───
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      dummy.position.copy(resolvedPositions[i]);
      dummy.lookAt(0, 0, 0);
      dummy.rotateX(Math.PI / 2);
      dummy.rotateY(totalRotation);
      dummy.scale.setScalar(entrance); // uniform size
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, PARTICLE_COUNT]}>
      <meshPhysicalMaterial
        color={0x888888}
        metalness={0.1}
        roughness={0.05}
        transparent
        transmission={0.6}
        thickness={1.5}
        ior={1.5}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        envMapIntensity={1.5}
      />
    </instancedMesh>
  );
}
