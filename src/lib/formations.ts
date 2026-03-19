import * as THREE from 'three';

export interface Formation {
  positions: THREE.Vector3[];
}

const COUNT = 80;

// Seeded random for deterministic scatter
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Ring — blocks arranged in a circle */
function createRing(radius = 6): Formation {
  const positions: THREE.Vector3[] = [];
  for (let i = 0; i < COUNT; i++) {
    const angle = (i / COUNT) * Math.PI * 2;
    positions.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    ));
  }
  return { positions };
}

/** Vortex — tornado funnel spiral */
function createVortex(): Formation {
  const positions: THREE.Vector3[] = [];
  for (let i = 0; i < COUNT; i++) {
    const t = i / COUNT;
    const angle = t * Math.PI * 6; // 3 full rotations
    const radius = 1 + t * 7;
    const y = (t - 0.5) * 12;
    positions.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    ));
  }
  return { positions };
}

/** Scatter — chaotic cloud in sphere volume */
function createScatter(): Formation {
  const rng = seededRandom(42);
  const positions: THREE.Vector3[] = [];
  for (let i = 0; i < COUNT; i++) {
    // Fibonacci sphere for even distribution with some noise
    const phi = Math.acos(1 - 2 * (i + 0.5) / COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = 5 + rng() * 4;
    positions.push(new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta) + (rng() - 0.5) * 2,
      r * Math.sin(phi) * Math.sin(theta) + (rng() - 0.5) * 2,
      r * Math.cos(phi) + (rng() - 0.5) * 2
    ));
  }
  return { positions };
}

/** Column — vertical cylinder */
function createColumn(): Formation {
  const positions: THREE.Vector3[] = [];
  const layers = 16;
  const perLayer = Math.ceil(COUNT / layers);
  const radius = 2;
  const height = 14;
  
  for (let i = 0; i < COUNT; i++) {
    const layer = Math.floor(i / perLayer);
    const idx = i % perLayer;
    const angle = (idx / perLayer) * Math.PI * 2 + (layer % 2) * (Math.PI / perLayer);
    const y = (layer / (layers - 1)) * height - height / 2;
    positions.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    ));
  }
  return { positions };
}

/** Grid — flat 2D grid */
function createGrid(): Formation {
  const positions: THREE.Vector3[] = [];
  const cols = 10;
  const rows = 8;
  const gap = 1.4;
  
  for (let i = 0; i < COUNT; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.push(new THREE.Vector3(
      (col - (cols - 1) / 2) * gap,
      (row - (rows - 1) / 2) * gap,
      0
    ));
  }
  return { positions };
}

/** Helix — double helix DNA */
function createHelix(): Formation {
  const positions: THREE.Vector3[] = [];
  const half = COUNT / 2;
  const height = 14;
  const radius = 3;
  
  for (let i = 0; i < COUNT; i++) {
    const strand = i < half ? 0 : 1;
    const idx = i < half ? i : i - half;
    const t = idx / (half - 1);
    const angle = t * Math.PI * 4 + strand * Math.PI;
    const y = t * height - height / 2;
    positions.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    ));
  }
  return { positions };
}

/** Panel — flat wall */
function createPanel(): Formation {
  const positions: THREE.Vector3[] = [];
  const cols = 10;
  const rows = 8;
  const gapX = 1.6;
  const gapY = 1.2;
  
  for (let i = 0; i < COUNT; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.push(new THREE.Vector3(
      (col - (cols - 1) / 2) * gapX,
      (row - (rows - 1) / 2) * gapY,
      -2
    ));
  }
  return { positions };
}

/** Dome — upper hemisphere */
function createDome(): Formation {
  const positions: THREE.Vector3[] = [];
  const radius = 6;
  
  for (let i = 0; i < COUNT; i++) {
    // Fibonacci hemisphere
    const t = i / (COUNT - 1);
    const phi = Math.acos(1 - t); // 0 to π/2 for hemisphere
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    positions.push(new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi), // top = positive Y
      radius * Math.sin(phi) * Math.sin(theta)
    ));
  }
  return { positions };
}

/** Rain — blocks falling down from ring positions */
function createRain(): Formation {
  const ring = createRing(6);
  const rng = seededRandom(99);
  const positions = ring.positions.map(p => new THREE.Vector3(
    p.x + (rng() - 0.5) * 3,
    p.y - 15 - rng() * 8,
    p.z + (rng() - 0.5) * 3
  ));
  return { positions };
}

/** Cross — 3D plus/cross shape (Team — unity symbol) */
function createCross(): Formation {
  const positions: THREE.Vector3[] = [];
  const armLength = 6;
  const gap = 0.9;
  const arms = [
    { axis: 'x', sign: 1 },
    { axis: 'x', sign: -1 },
    { axis: 'y', sign: 1 },
    { axis: 'y', sign: -1 },
    { axis: 'z', sign: 1 },
    { axis: 'z', sign: -1 },
  ];

  const perArm = Math.floor(COUNT / arms.length);
  const center = Math.floor(COUNT - perArm * arms.length);

  // Center cluster
  for (let i = 0; i < center; i++) {
    positions.push(new THREE.Vector3(0, 0, 0));
  }

  for (const arm of arms) {
    for (let i = 0; i < perArm; i++) {
      const t = ((i + 1) / perArm) * armLength;
      const pos = new THREE.Vector3(0, 0, 0);
      if (arm.axis === 'x') pos.x = t * arm.sign;
      else if (arm.axis === 'y') pos.y = t * arm.sign;
      else pos.z = t * arm.sign;
      // Slight offset along perpendicular axes for thickness
      const rng = seededRandom(i * 17 + arms.indexOf(arm) * 31);
      const off = (rng() - 0.5) * gap;
      if (arm.axis !== 'x') pos.x += off;
      if (arm.axis !== 'y') pos.y += off;
      if (arm.axis !== 'z') pos.z += off;
      positions.push(pos);
    }
  }

  // Fill remaining if any
  while (positions.length < COUNT) {
    positions.push(new THREE.Vector3(0, 0, 0));
  }

  return { positions: positions.slice(0, COUNT) };
}

/** Sphere — full 3D sphere (Equipment — completeness) */
function createSphere(): Formation {
  const positions: THREE.Vector3[] = [];
  const radius = 5.5;

  for (let i = 0; i < COUNT; i++) {
    // Fibonacci sphere for even distribution
    const phi = Math.acos(1 - 2 * (i + 0.5) / COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    positions.push(new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    ));
  }
  return { positions };
}

// Pre-generate all formations (15 total — one per visual section)
export const formations: Formation[] = [
  createRing(6),         // 0:  Hero
  createVortex(),        // 1:  TrustMarquee
  createVortex(),        // 2:  Stories (sustained vortex)
  createScatter(),       // 3:  Services
  createColumn(),        // 4:  Expertise
  createCross(),         // 5:  Team
  createGrid(),          // 6:  Process
  createHelix(),         // 7:  Portfolio
  createSphere(),        // 8:  Equipment
  createDome(),          // 9:  Certificate (NEW)
  createPanel(),         // 10: Pricing
  createCross(),         // 11: Reviews
  createRing(7),         // 12: FAQ (large ring)
  createRing(6.5),       // 13: Contact (pulse ring)
  createRain(),          // 14: Footer/Outro
];

export const PARTICLE_COUNT = COUNT;

