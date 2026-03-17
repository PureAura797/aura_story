"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* ─── SVG path data ─── */
const P_LEFT =
  "M108 507.24C135.22 499.75 150.82 487.95 166.51 463 170.77 456.23 180.29 436.65 185.54 423.86 188.11 417.61 192.89 406.93 196.16 400.12 199.43 393.32 203.92 383.64 206.14 378.62 208.35 373.61 211.52 366.58 213.19 363 214.86 359.42 218.69 350.88 221.71 344 224.73 337.12 230.3 325.07 234.1 317.21 237.89 309.35 241 302.71 241 302.45 241 302.19 243.48 296.76 246.5 290.37 249.52 283.98 252 278.63 252 278.47 252 278.32 253.8 274.34 256 269.62 258.2 264.9 260 260.84 260 260.58 260 260.33 261.97 255.93 264.37 250.81 266.78 245.69 270.21 238.35 272 234.5 273.8 230.65 276.94 223.9 279 219.5 281.05 215.1 283.74 209.25 284.97 206.5 286.21 203.75 288.52 198.66 290.11 195.18 291.7 191.7 293 188.7 293 188.5 293 188.09 297.9 177.1 301.47 169.5 308.25 155.07 314.02 142.27 326.53 114 331.27 103.28 337.29 90.45 339.91 85.5 345.44 75.05 357.97 56.64 365.09 48.5 367.8 45.39 369.75 42.4 369.41 41.86 368.53 40.43 299.5 41.87 290.5 43.5 263.85 48.33 246.67 58.7 227.58 81.5 213.86 97.89 205.69 111.06 197.44 130.05 194.95 135.8 192.26 141.85 191.46 143.5 177.47 172.55 168.22 192.11 164.27 201 161.68 206.85 160.6 209.25 156.69 218 155.33 221.02 151.19 229.8 147.49 237.5 136.61 260.1 132.11 269.76 126.45 282.64 123.52 289.32 117.55 302.15 113.19 311.14 108.83 320.14 104.13 329.98 102.74 333 101.36 336.02 98.83 341.55 97.12 345.28 95.4 349 94 352.21 94 352.41 94 352.92 86.05 369.85 77.75 387 66.38 410.51 61.47 421.1 58.72 428.02 55.48 436.14 50.97 445.86 38.17 472.21 24.93 499.47 21.73 506.86 22.43 508.67 22.93 509.97 28.01 510.11 61.75 509.73 97.01 509.34 101.18 509.12 108 507.24Z";
const P_RIGHT =
  "M583 507.99C583 504.66 574.6 485.67 557.78 451 552.31 439.73 544.33 422.62 540.04 413 529.46 389.25 527.39 384.8 517 363.5 512.05 353.35 508 344.84 508 344.58 508 343.9 497.79 321.62 490.78 307 477.06 278.39 471.97 267.41 468.99 260 468 257.52 464.63 250.1 461.5 243.5 450.15 219.56 442.4 202.82 441.84 201.09 441.38 199.65 437 206.05 437 208.15 437 209.8 429.18 224.39 425.61 229.41 417.48 240.86 402.51 254.44 388.79 262.83 381.13 267.51 360.18 278.38 352 281.91 348.98 283.21 344.02 285.39 341 286.75 337.98 288.1 326.95 292.79 316.5 297.17 283.22 311.1 269.18 319.61 254.11 335 245.5 343.79 236.86 358.5 227.1 381 222.28 392.13 219.07 399.25 211.87 414.89 209.74 419.5 208 424.12 208 425.14 208 427.42 211.61 427.66 214.58 425.58 216.68 424.11 235.84 414.39 242 411.68 260.22 403.64 284.93 395.12 313.46 387.04 336.88 380.4 342.33 379.16 355.34 377.55 385.82 373.78 400.25 383.15 416.04 417 423.23 432.41 436.84 458.85 442.29 468 449.67 480.39 461.85 492.16 473.61 498.26 494.12 508.9 499.77 509.81 546.25 509.92 582.42 510 583 509.97 583 507.99Z";
const P_LEAF =
  "M362.48 255.12C395.84 238.04 413.65 220.51 421.66 196.88 424.1 189.68 424.5 186.95 424.5 177.5 424.5 162.99 423.26 158.87 410.96 132.5 408.65 127.55 403.51 115.85 399.53 106.5 379.34 59.06 380.82 62.13 378.57 62.94 376.68 63.62 367.3 75.74 364.98 80.5 364.44 81.6 363.44 83.38 362.75 84.46 356.27 94.63 347.77 111.61 340.6 128.73 338.03 134.87 334.79 142.22 330.8 151 327.23 158.85 322.31 175.21 320.95 183.75 318.92 196.5 321.6 208.81 330.8 229 333.51 234.96 338.17 246.07 341.07 253.5 343.96 260.9 344.74 262 347.14 262 348.18 262 355.09 258.9 362.48 255.12Z";

/**
 * Parse SVG path "d" to THREE.Shape — handles M, C, L, Z.
 * SSR-safe: pure math, no DOMParser.
 */
function parseSvgPathToShape(d: string): THREE.Shape {
  const shape = new THREE.Shape();
  const re = /([MCLZmclz])([\s\S]*?)(?=[MCLZmclz]|$)/g;
  let m;
  while ((m = re.exec(d)) !== null) {
    const cmd = m[1];
    const raw = m[2].trim();
    const nums = raw ? (raw.match(/-?\d+(?:\.\d+)?/g) || []).map(Number) : [];

    switch (cmd) {
      case "M":
        shape.moveTo(nums[0], nums[1]);
        for (let i = 2; i < nums.length; i += 2) shape.lineTo(nums[i], nums[i + 1]);
        break;
      case "L":
        for (let i = 0; i < nums.length; i += 2) shape.lineTo(nums[i], nums[i + 1]);
        break;
      case "C":
        for (let i = 0; i < nums.length; i += 6)
          shape.bezierCurveTo(nums[i], nums[i+1], nums[i+2], nums[i+3], nums[i+4], nums[i+5]);
        break;
      case "Z": case "z":
        shape.closePath();
        break;
    }
  }
  return shape;
}

/* ─── Logo Mesh ─── */
function LogoMesh() {
  const groupRef = useRef<THREE.Group>(null);

  const geometries = useMemo(() => {
    try {
      const leftShape = parseSvgPathToShape(P_LEFT);
      const rightShape = parseSvgPathToShape(P_RIGHT);
      const leafShape = parseSvgPathToShape(P_LEAF);

      const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: 24,
        bevelEnabled: true,
        bevelThickness: 2.5,
        bevelSize: 1.8,
        bevelSegments: 6,
        curveSegments: 24,
      };

      const bodyGeo = new THREE.ExtrudeGeometry(
        [leftShape, rightShape],
        extrudeSettings
      );
      const leafGeo = new THREE.ExtrudeGeometry(
        [leafShape],
        { ...extrudeSettings, depth: 28 }
      );

      // Center on body
      bodyGeo.computeBoundingBox();
      const center = new THREE.Vector3();
      bodyGeo.boundingBox!.getCenter(center);
      bodyGeo.translate(-center.x, -center.y, -center.z);
      leafGeo.translate(-center.x, -center.y, -center.z);

      // Flip Y (SVG coord inverted)
      bodyGeo.scale(1, -1, 1);
      leafGeo.scale(1, -1, 1);

      // Scale
      const s = 0.005;
      bodyGeo.scale(s, s, s);
      leafGeo.scale(s, s, s);

      bodyGeo.computeVertexNormals();
      leafGeo.computeVertexNormals();

      return { bodyGeo, leafGeo };
    } catch (e) {
      console.error("Logo geometry failed:", e);
      return null;
    }
  }, []);

  // Subtle float + breathing
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.25) * 0.04;
    groupRef.current.rotation.y = -0.35 + Math.sin(t * 0.12) * 0.015;
  });

  if (!geometries) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 0.3]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.2} />
      </mesh>
    );
  }

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      rotation={[0.4, -0.35, 0.05]}
    >
      {/* Body — polished obsidian chrome */}
      <mesh geometry={geometries.bodyGeo} castShadow>
        <meshPhysicalMaterial
          color="#0c0c10"
          metalness={1.0}
          roughness={0.18}
          envMapIntensity={1.4}
          reflectivity={0.9}
          ior={2.0}
        />
      </mesh>
      {/* Leaf — slightly different finish for depth */}
      <mesh geometry={geometries.leafGeo} castShadow>
        <meshPhysicalMaterial
          color="#0a0a0e"
          metalness={1.0}
          roughness={0.22}
          envMapIntensity={1.2}
          reflectivity={0.9}
          ior={2.0}
        />
      </mesh>
    </group>
  );
}

/* ─── Scene ─── */
function AdminLogoScene() {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0.3, 6]}
        fov={40}
        near={0.1}
        far={60}
      />

      {/* Studio HDRI — bright controlled reflections for chrome */}
      <Environment preset="studio" background={false} environmentIntensity={1.0} />

      <color attach="background" args={["#0a0a0c"]} />

      {/* ─── Ambient — slight fill ─── */}
      <ambientLight intensity={0.04} />

      {/* ─── Key light — bottom-right, in front, off-screen ─── */}
      <directionalLight
        position={[6, -3, 8]}
        intensity={2}
        color="#f0ece8"
      />

      {/* ─── Top hair light — highlights top edges ─── */}
      <directionalLight
        position={[0, 8, 2]}
        intensity={3}
        color="#e0e0e8"
      />

      {/* ─── Rim/edge light — behind-left, edge highlight ─── */}
      <spotLight
        position={[-6, 3, -5]}
        intensity={12}
        color="#c0c8e0"
        angle={0.35}
        penumbra={0.8}
        distance={25}
      />

      {/* ─── Warm accent — bottom-left ─── */}
      <pointLight position={[-3, -2, 4]} intensity={0.5} color="#e8c090" distance={12} />

      {/* ─── Fill — prevents pure black ─── */}
      <pointLight position={[2, 0, 5]} intensity={0.15} color="#404050" distance={10} />

      <LogoMesh />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.85}
          luminanceSmoothing={0.7}
          intensity={0.15}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

/* ─── Export ─── */
export default function AdminBgLogo() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, 1.5]}
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.6,
          powerPreference: "default",
        }}
        style={{ pointerEvents: "none" }}
        onCreated={({ gl }) => {
          console.log("[AdminBgLogo] WebGL context OK");
        }}
      >
        <AdminLogoScene />
      </Canvas>
    </div>
  );
}
