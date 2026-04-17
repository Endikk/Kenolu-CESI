import { useFrame } from '@react-three/fiber'
import { Edges, RoundedBox } from '@react-three/drei'
import { forwardRef, useMemo, useRef } from 'react'
import * as THREE from 'three'

/* ============================================================
   KENOLU TINY HOUSE — atoms, textures and constants.
   This file holds every reusable piece of geometry; the main
   composition lives in TinyHouse3D.jsx and imports from here.
   Co-ordinates are in metres, expressed in the ROOT group's
   local frame (the root is offset by y=-0.2 in world).
   ============================================================ */

/* ------------------------------------------------------------
   1. DIMENSIONS & DERIVED CONSTANTS
   ------------------------------------------------------------ */

export const L = 7.2 // length along X
export const W = 2.5 // width along Z
export const H = 2.5 // wall height along Y
export const T = 0.12 // wall thickness
export const ROOF_PITCH = 0.55 // rise from eave to ridge

// Floor deck
export const FLOOR_Y = -H / 2 // center of floor
export const FLOOR_THICKNESS = 0.12

// Chassis sits directly under the floor; wheels hang beneath the chassis.
export const CHASSIS_Y = -H / 2 - 0.4 // chassis group center
export const CHASSIS_BEAM_THICKNESS = 0.2
export const SUBFLOOR_Y = (CHASSIS_Y + CHASSIS_BEAM_THICKNESS / 2 + (FLOOR_Y - FLOOR_THICKNESS / 2)) / 2
export const SUBFLOOR_HEIGHT =
  FLOOR_Y - FLOOR_THICKNESS / 2 - (CHASSIS_Y + CHASSIS_BEAM_THICKNESS / 2)

export const WHEEL_OFFSET_Y = -0.3 // wheel y within chassis group
export const WHEEL_CENTER_Y = CHASSIS_Y + WHEEL_OFFSET_Y
export const WHEEL_RADIUS = 0.58
export const GROUND_Y = WHEEL_CENTER_Y - WHEEL_RADIUS // wheels kiss the ground

// Roof geometry
export const ROOF_BASE_Y = H / 2 + 0.1
export const SLOPE_LEN = Math.sqrt((W / 2) ** 2 + ROOF_PITCH ** 2)
export const SLOPE_ANGLE = Math.atan2(ROOF_PITCH, W / 2) // pitch from horizontal

// Shared colour palette
export const COLORS = {
  steel: '#14161d',
  darkMetal: '#1a1d26',
  brightMetal: '#c8ccd4',
  brass: '#e0c070',
  darkWood: '#2a1a10',
  deepDark: '#05050a',
  insulation: '#c9a86a',
  cyan: '#00e5ff',
  violet: '#6a5cff',
  warm: '#ffcf7a',
}

/* ------------------------------------------------------------
   2. PROCEDURAL TEXTURES (generated via CanvasTexture, cached)
   ------------------------------------------------------------ */

export function makeWoodTexture(repeat = [4, 1]) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  const base = ctx.createLinearGradient(0, 0, 0, 512)
  base.addColorStop(0, '#3b2a1d')
  base.addColorStop(1, '#241712')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 512, 512)

  const plankW = 48
  for (let x = 0; x < 512; x += plankW) {
    const hue = 22 + Math.random() * 12
    const sat = 28 + Math.random() * 18
    const lit = 14 + Math.random() * 10
    ctx.fillStyle = `hsl(${hue}, ${sat}%, ${lit}%)`
    ctx.fillRect(x + 1, 0, plankW - 2, 512)
    for (let i = 0; i < 14; i++) {
      ctx.strokeStyle = `rgba(0,0,0,${0.08 + Math.random() * 0.18})`
      ctx.lineWidth = 0.8 + Math.random() * 0.6
      ctx.beginPath()
      const y = Math.random() * 512
      ctx.moveTo(x, y)
      ctx.bezierCurveTo(
        x + 12,
        y + (Math.random() - 0.5) * 6,
        x + 28,
        y + (Math.random() - 0.5) * 6,
        x + plankW,
        y + (Math.random() - 0.5) * 6
      )
      ctx.stroke()
    }
    if (Math.random() < 0.4) {
      const ky = Math.random() * 512
      const r = 2 + Math.random() * 4
      const g = ctx.createRadialGradient(x + plankW / 2, ky, 0, x + plankW / 2, ky, r * 2)
      g.addColorStop(0, 'rgba(10,5,0,0.85)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x + plankW / 2, ky, r * 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.85)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 512)
    ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeat[0], repeat[1])
  tex.anisotropy = 8
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function makeMetalSeamTexture(repeat = [6, 1]) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 256, 0)
  g.addColorStop(0, '#0b0f1a')
  g.addColorStop(0.5, '#141a28')
  g.addColorStop(1, '#0b0f1a')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  for (let x = 0; x < 256; x += 32) {
    ctx.fillStyle = '#05070d'
    ctx.fillRect(x, 0, 2, 256)
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.fillRect(x + 2, 0, 1, 256)
  }
  for (let i = 0; i < 80; i++) {
    ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.04})`
    ctx.beginPath()
    ctx.moveTo(0, Math.random() * 256)
    ctx.lineTo(256, Math.random() * 256)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeat[0], repeat[1])
  tex.anisotropy = 8
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function makeGrassTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#0d1410'
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 256
    const y = Math.random() * 256
    const l = 12 + Math.random() * 22
    ctx.strokeStyle = `hsla(${130 + Math.random() * 40}, 40%, ${10 + Math.random() * 12}%, ${0.2 + Math.random() * 0.4})`
    ctx.lineWidth = 0.6
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + (Math.random() - 0.5) * 2, y - l * 0.3)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(8, 8)
  tex.anisotropy = 4
  return tex
}

/** Small checker (white / black) pattern for the human's scarf. */
export function makeCheckerTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#f6f2ea'
  ctx.fillRect(0, 0, 128, 128)
  ctx.fillStyle = '#0a0a0f'
  const size = 16
  for (let x = 0; x < 128; x += size) {
    for (let y = 0; y < 128; y += size) {
      if (((x / size) | 0) + ((y / size) | 0) & 1) {
        ctx.fillRect(x, y, size, size)
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(4, 2)
  tex.anisotropy = 4
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function makeSolarCellTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#020617'
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const x = i * 32
      const y = j * 32
      const g = ctx.createLinearGradient(x, y, x + 32, y + 32)
      g.addColorStop(0, '#071a3a')
      g.addColorStop(0.5, '#0e2b5c')
      g.addColorStop(1, '#05102a')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.moveTo(x + 4, y)
      ctx.lineTo(x + 28, y)
      ctx.lineTo(x + 32, y + 4)
      ctx.lineTo(x + 32, y + 28)
      ctx.lineTo(x + 28, y + 32)
      ctx.lineTo(x + 4, y + 32)
      ctx.lineTo(x, y + 28)
      ctx.lineTo(x, y + 4)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = 'rgba(180,200,230,0.28)'
      ctx.fillRect(x + 10, y + 2, 1, 28)
      ctx.fillRect(x + 21, y + 2, 1, 28)
    }
  }
  ctx.strokeStyle = '#0a0f1a'
  ctx.lineWidth = 4
  ctx.strokeRect(2, 2, 252, 252)
  const tex = new THREE.CanvasTexture(canvas)
  tex.anisotropy = 8
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/* ------------------------------------------------------------
   3. EXTERIOR PARTS (chassis, walls, windows, roof accents…)
   ------------------------------------------------------------ */

/** Minimal wheel: single smooth tire, silver hub, 5 bolts, dark cap.
    No concentric rings, no spokes — clean industrial look. */
export function DetailedWheel({ position }) {
  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[WHEEL_RADIUS, WHEEL_RADIUS, 0.38, 48]} />
        <meshStandardMaterial color="#0a0a10" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Hub plate (outer face) */}
      <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.04, 32]} />
        <meshStandardMaterial color={COLORS.brightMetal} metalness={1} roughness={0.3} />
      </mesh>
      {/* 5 lug bolts */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.22, Math.sin(a) * 0.22, 0.22]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.028, 0.028, 0.03, 6]} />
            <meshStandardMaterial color="#2a2e38" metalness={1} roughness={0.4} />
          </mesh>
        )
      })}
      {/* Central cap */}
      <mesh position={[0, 0, 0.225]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.04, 24]} />
        <meshStandardMaterial color={COLORS.darkMetal} metalness={1} roughness={0.25} />
      </mesh>
    </group>
  )
}

/** Clean half-torus fender arch, no inner skirt box. */
export function Fender({ position }) {
  return (
    <mesh position={position} castShadow>
      <torusGeometry args={[WHEEL_RADIUS + 0.1, 0.09, 10, 24, Math.PI]} />
      <meshStandardMaterial color="#12141c" roughness={0.5} metalness={0.9} />
    </mesh>
  )
}

export function Window({ width, height, thickness = 0.05, depth = 0.02, mullion = true }) {
  const frameMat = (
    <meshStandardMaterial color="#1a1f2a" metalness={0.7} roughness={0.4} />
  )
  return (
    <group>
      {/* Frame */}
      <mesh position={[0, height / 2 + thickness / 2, 0]}>
        <boxGeometry args={[width + thickness * 2, thickness, depth * 2]} />
        {frameMat}
      </mesh>
      <mesh position={[0, -height / 2 - thickness / 2, 0]}>
        <boxGeometry args={[width + thickness * 2, thickness, depth * 2]} />
        {frameMat}
      </mesh>
      <mesh position={[-width / 2 - thickness / 2, 0, 0]}>
        <boxGeometry args={[thickness, height, depth * 2]} />
        {frameMat}
      </mesh>
      <mesh position={[width / 2 + thickness / 2, 0, 0]}>
        <boxGeometry args={[thickness, height, depth * 2]} />
        {frameMat}
      </mesh>
      {mullion && (
        <>
          <mesh>
            <boxGeometry args={[width, thickness * 0.4, depth * 1.5]} />
            {frameMat}
          </mesh>
          <mesh>
            <boxGeometry args={[thickness * 0.4, height, depth * 1.5]} />
            {frameMat}
          </mesh>
        </>
      )}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          color="#0a2033"
          transmission={0.8}
          transparent
          opacity={0.55}
          thickness={0.5}
          roughness={0.05}
          metalness={0.1}
          ior={1.45}
          clearcoat={1}
          emissive={COLORS.warm}
          emissiveIntensity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[width + thickness * 0.3, height + thickness * 0.3]} />
        <meshBasicMaterial
          color={COLORS.cyan}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/** Door leaf with inset panels, window and brass handle on BOTH faces,
    so it reads as a real door whether seen from the porch or the interior. */
export function DoorLeaf() {
  const glassMat = (
    <meshPhysicalMaterial
      color="#0a2033"
      transmission={0.85}
      transparent
      opacity={0.55}
      thickness={0.2}
      roughness={0.05}
      metalness={0.1}
      ior={1.45}
      emissive={COLORS.warm}
      emissiveIntensity={0.5}
      side={THREE.DoubleSide}
    />
  )
  const face = (side) => {
    // side: +1 for exterior face (+Z), -1 for interior face (-Z)
    const z = side * 0.028
    return (
      <group>
        {/* Inset panels */}
        {[
          [0, 0.45],
          [0, -0.2],
        ].map((p, i) => (
          <mesh key={i} position={[p[0], p[1], z]}>
            <boxGeometry args={[0.65, 0.45, 0.01]} />
            <meshStandardMaterial color="#18100a" roughness={0.7} />
          </mesh>
        ))}
        {/* Small window */}
        <mesh position={[0, 0.7, z]}>
          <planeGeometry args={[0.5, 0.25]} />
          {glassMat}
        </mesh>
        {/* Brass handle spindle */}
        <mesh position={[0.32, 0, side * 0.04]}>
          <cylinderGeometry args={[0.03, 0.03, 0.14, 12]} />
          <meshStandardMaterial color={COLORS.brass} metalness={1} roughness={0.25} />
        </mesh>
        <mesh position={[0.32, 0, side * 0.09]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.08, 12]} />
          <meshStandardMaterial color={COLORS.brass} metalness={1} roughness={0.25} />
        </mesh>
      </group>
    )
  }
  return (
    <group>
      {/* Wood leaf body */}
      <mesh castShadow>
        <boxGeometry args={[0.9, 2.0, 0.05]} />
        <meshStandardMaterial color={COLORS.darkWood} roughness={0.6} metalness={0.2} />
      </mesh>
      {face(1)}
      {face(-1)}
      {/* Cyan threshold accent — visible only from the porch side */}
      <mesh position={[0, -1, 0.03]}>
        <boxGeometry args={[0.9, 0.02, 0.005]} />
        <meshStandardMaterial
          color={COLORS.cyan}
          emissive={COLORS.cyan}
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export function Porch() {
  // Foldable mini-staircase parameters. Deck top is at local y=0; the
  // ground is ~1.32 m below. 4 treads × 0.33 m rise / 0.22 m run reach
  // the ground while staying compact enough to read as a foldable step.
  const stairRise = 0.33
  const stairRun = 0.22
  const stairSteps = 4
  const stairAngle = Math.atan2(stairRun, stairRise)
  const stairLen =
    Math.sqrt(
      (stairRise * stairSteps) ** 2 + (stairRun * stairSteps) ** 2
    ) + 0.04
  return (
    <group>
      {/* Deck slab */}
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.1, 1.3]} />
        <meshStandardMaterial
          color={COLORS.darkWood}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      {/* Plank grooves */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, 0.001, -0.55 + i * 0.22]}>
          <boxGeometry args={[1.75, 0.005, 0.005]} />
          <meshStandardMaterial color="#05030a" />
        </mesh>
      ))}
      {/* Corner support posts */}
      {[
        [-0.85, -0.4, -0.6],
        [0.85, -0.4, -0.6],
        [-0.85, -0.4, 0.6],
        [0.85, -0.4, 0.6],
      ].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.08, 0.6, 0.08]} />
          <meshStandardMaterial color="#12141c" metalness={0.9} roughness={0.4} />
        </mesh>
      ))}

      {/* ── Side railings on the two LONG edges (x = ±0.9) ───────
          The house wall sits on +Z (local z=+0.65) so that side is left
          open for the door. The outer edge (-Z) is left open for the
          staircase. Only the two lateral edges carry railings. */}
      {[-0.9, 0.9].map((x, side) => (
        <group key={side}>
          <mesh position={[x, 0.45, 0]}>
            <boxGeometry args={[0.04, 0.04, 1.2]} />
            <meshStandardMaterial
              color={COLORS.darkMetal}
              metalness={0.8}
              roughness={0.35}
            />
          </mesh>
          {[-0.5, -0.3, -0.1, 0.1, 0.3, 0.5].map((z, j) => (
            <mesh key={j} position={[x, 0.2, z]} castShadow>
              <boxGeometry args={[0.02, 0.5, 0.02]} />
              <meshStandardMaterial
                color={COLORS.darkMetal}
                metalness={0.8}
                roughness={0.35}
              />
            </mesh>
          ))}
          {[-0.58, 0.58].map((z, j) => (
            <mesh key={`cap-${j}`} position={[x, 0.48, z]}>
              <boxGeometry args={[0.06, 0.04, 0.06]} />
              <meshStandardMaterial
                color={COLORS.darkMetal}
                metalness={0.9}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Neon under-deck glow */}
      <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.7, 1.2]} />
        <meshBasicMaterial
          color={COLORS.cyan}
          transparent
          opacity={0.28}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Foldable mini-staircase ────────────────────────────
          Anchored at the OUTER edge (local z = -0.65), descending in
          -Z and -Y. Hinge pin across the deck edge (so it reads as a
          ladder that could fold up), 2 steel stringers, 4 wood treads. */}
      <group position={[0, 0, -0.65]}>
        {/* Hinge pin along the deck edge */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.6, 14]} />
          <meshStandardMaterial
            color={COLORS.brightMetal}
            metalness={1}
            roughness={0.3}
          />
        </mesh>
        {/* 2 diagonal steel stringers running the full length */}
        {[-0.27, 0.27].map((x, i) => (
          <mesh
            key={i}
            position={[
              x,
              -(stairRise * stairSteps) / 2,
              -(stairRun * stairSteps) / 2,
            ]}
            rotation={[stairAngle, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.035, stairLen, 0.03]} />
            <meshStandardMaterial
              color={COLORS.darkMetal}
              metalness={0.9}
              roughness={0.4}
            />
          </mesh>
        ))}
        {/* Wooden treads */}
        {Array.from({ length: stairSteps }).map((_, i) => {
          const y = -stairRise * (i + 0.5)
          const z = -stairRun * (i + 0.5)
          return (
            <mesh key={i} position={[0, y, z]} castShadow receiveShadow>
              <boxGeometry args={[0.52, 0.035, 0.2]} />
              <meshStandardMaterial color={COLORS.darkWood} roughness={0.8} />
            </mesh>
          )
        })}
        {/* Cyan LED along the bottom tread's leading edge */}
        <mesh
          position={[
            0,
            -stairRise * (stairSteps - 0.5),
            -stairRun * (stairSteps - 0.5) - 0.095,
          ]}
        >
          <boxGeometry args={[0.5, 0.006, 0.008]} />
          <meshStandardMaterial
            color={COLORS.cyan}
            emissive={COLORS.cyan}
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

/** Door overhang. The group's origin is where the awning meets the wall;
    the slab tilts forward-down and the brackets anchor back to the wall. */
export function Awning() {
  const width = 1.25
  const depth = 0.55
  return (
    <group>
      {/* Tilted slab — leading edge drops 10 cm so rain runs off */}
      <mesh
        position={[0, 0.02, -depth / 2]}
        rotation={[-0.15, 0, 0]}
        castShadow
      >
        <boxGeometry args={[width, 0.05, depth]} />
        <meshStandardMaterial color="#0c0c14" metalness={0.7} roughness={0.5} />
      </mesh>
      {/* 2 diagonal brackets from wall to slab underside */}
      {[-(width / 2) + 0.08, width / 2 - 0.08].map((x, i) => (
        <mesh
          key={i}
          position={[x, -0.13, -0.2]}
          rotation={[0.55, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.018, 0.018, 0.42, 10]} />
          <meshStandardMaterial color="#2a2d35" metalness={1} roughness={0.35} />
        </mesh>
      ))}
      {/* Cyan LED strip along the front edge */}
      <mesh
        position={[0, 0.008, -depth + 0.015]}
        rotation={[-0.15, 0, 0]}
      >
        <boxGeometry args={[width - 0.08, 0.012, 0.008]} />
        <meshStandardMaterial
          color={COLORS.cyan}
          emissive={COLORS.cyan}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export function DetailedSolarPanel({ cellTex }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[3.4, 0.06, 1.2]} />
        <meshStandardMaterial
          map={cellTex}
          color="#ffffff"
          roughness={0.2}
          metalness={0.85}
          emissive="#1a2a4a"
          emissiveIntensity={0.2}
        />
      </mesh>
      {[
        [0, 0.035, 0.6],
        [0, 0.035, -0.6],
      ].map((p, i) => (
        <mesh key={`f1-${i}`} position={p}>
          <boxGeometry args={[3.4, 0.08, 0.04]} />
          <meshStandardMaterial color="#3a3f4a" metalness={1} roughness={0.3} />
        </mesh>
      ))}
      {[
        [1.7, 0.035, 0],
        [-1.7, 0.035, 0],
      ].map((p, i) => (
        <mesh key={`f2-${i}`} position={p}>
          <boxGeometry args={[0.04, 0.08, 1.2]} />
          <meshStandardMaterial color="#3a3f4a" metalness={1} roughness={0.3} />
        </mesh>
      ))}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, -0.06, 0]}>
          <boxGeometry args={[0.08, 0.06, 1]} />
          <meshStandardMaterial color="#2a2d35" metalness={1} roughness={0.4} />
        </mesh>
      ))}
      <Edges threshold={15} color={COLORS.cyan} scale={1.001} />
    </group>
  )
}

export function VentPipe() {
  return (
    <group>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.36, 16]} />
        <meshStandardMaterial color={COLORS.brightMetal} metalness={1} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.11, 0.08, 0.08, 16]} />
        <meshStandardMaterial color="#8a8f99" metalness={1} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.015, 16]} />
        <meshStandardMaterial color="#2a2d35" />
      </mesh>
    </group>
  )
}

export function Skylight({ w = 1.2, l = 0.9 }) {
  return (
    <group>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[w + 0.12, 0.06, l + 0.12]} />
        <meshStandardMaterial color="#1a1f2a" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[w, 0.04, l]} />
        <meshPhysicalMaterial
          color="#0a2033"
          transmission={0.9}
          transparent
          opacity={0.55}
          thickness={0.4}
          roughness={0.03}
          ior={1.45}
          clearcoat={1}
          emissive={COLORS.warm}
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0, 0.105, 0]}>
        <boxGeometry args={[w, 0.01, 0.02]} />
        <meshStandardMaterial color="#1a1f2a" metalness={0.9} />
      </mesh>
    </group>
  )
}

export function Antenna() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.012, 0.02, 1.0, 8]} />
        <meshStandardMaterial color={COLORS.brightMetal} metalness={1} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial
          color={COLORS.cyan}
          emissive={COLORS.cyan}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.3, 0.015, 0.015]} />
        <meshStandardMaterial color={COLORS.brightMetal} metalness={1} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.22, 0.015, 0.015]} />
        <meshStandardMaterial color={COLORS.brightMetal} metalness={1} />
      </mesh>
    </group>
  )
}

export function Gutter({ length }) {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, length, 12, 1, true, 0, Math.PI]} />
        <meshStandardMaterial
          color={COLORS.darkMetal}
          metalness={1}
          roughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export function WallLamp({ position }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.08, 0.16, 0.08]} />
        <meshStandardMaterial color={COLORS.darkMetal} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial
          color="#ffe0a0"
          emissive={COLORS.warm}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export function StringLight({ length = 7, above = 0.2 }) {
  const count = 18
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const t = i / (count - 1)
        const x = -length / 2 + t * length
        const dip = Math.sin(t * Math.PI) * 0.12
        return (
          <group key={i} position={[x, above - dip, 0]}>
            <mesh>
              <sphereGeometry args={[0.04, 10, 10]} />
              <meshStandardMaterial
                color="#ffd28a"
                emissive={COLORS.warm}
                emissiveIntensity={2.2}
                toneMapped={false}
              />
            </mesh>
          </group>
        )
      })}
      {Array.from({ length: count - 1 }).map((_, i) => {
        const t1 = i / (count - 1)
        const t2 = (i + 1) / (count - 1)
        const x1 = -length / 2 + t1 * length
        const x2 = -length / 2 + t2 * length
        const y1 = above - Math.sin(t1 * Math.PI) * 0.12
        const y2 = above - Math.sin(t2 * Math.PI) * 0.12
        const mx = (x1 + x2) / 2
        const my = (y1 + y2) / 2
        const dx = x2 - x1
        const dy = y2 - y1
        const len = Math.hypot(dx, dy)
        const angle = Math.atan2(dy, dx)
        return (
          <mesh key={`w-${i}`} position={[mx, my, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[len, 0.008, 0.008]} />
            <meshStandardMaterial color="#0a0a12" />
          </mesh>
        )
      })}
    </group>
  )
}

/** Wall built from `THREE.ExtrudeGeometry` so window/door holes are true
    see-through openings — not just planes stuck on a solid box.
    `holes` is an array of { shape: 'rect'|'circle', cx, cy, w, h } | { …, r }. */
export const CutoutWall = forwardRef(function CutoutWall(
  {
    width,
    height,
    thickness,
    holes = [],
    map,
    color = '#ffffff',
    roughness = 0.75,
  },
  ref
) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-width / 2, -height / 2)
    shape.lineTo(width / 2, -height / 2)
    shape.lineTo(width / 2, height / 2)
    shape.lineTo(-width / 2, height / 2)
    shape.closePath()

    for (const hole of holes) {
      const path = new THREE.Path()
      if (hole.shape === 'circle') {
        path.absarc(hole.cx, hole.cy, hole.r, 0, Math.PI * 2, false)
      } else {
        const { cx, cy, w, h } = hole
        path.moveTo(cx - w / 2, cy - h / 2)
        path.lineTo(cx + w / 2, cy - h / 2)
        path.lineTo(cx + w / 2, cy + h / 2)
        path.lineTo(cx - w / 2, cy + h / 2)
        path.closePath()
      }
      shape.holes.push(path)
    }

    const halfW = width / 2
    const halfH = height / 2
    const uvGenerator = {
      generateTopUV(_geom, vertices, indexA, indexB, indexC) {
        const topUV = (i) =>
          new THREE.Vector2(
            (vertices[i * 3] + halfW) / width,
            (vertices[i * 3 + 1] + halfH) / height
          )
        return [topUV(indexA), topUV(indexB), topUV(indexC)]
      },
      generateSideWallUV() {
        return [
          new THREE.Vector2(0, 0),
          new THREE.Vector2(1, 0),
          new THREE.Vector2(1, 1),
          new THREE.Vector2(0, 1),
        ]
      },
    }

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: false,
      steps: 1,
      UVGenerator: uvGenerator,
    })
    // Centre the extrusion along Z so the wall's mid-plane is at z=0.
    geom.translate(0, 0, -thickness / 2)
    geom.computeVertexNormals()
    return geom
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, thickness, JSON.stringify(holes)])

  return (
    <mesh ref={ref} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial map={map} color={color} roughness={roughness} />
    </mesh>
  )
})

/** Triangular gable panel to cap a short-end wall under the pitched roof. */
export function GableTriangle({ material }) {
  return (
    <mesh castShadow>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[
            new Float32Array([
              -W / 2, 0, 0,
               W / 2, 0, 0,
               0, ROOF_PITCH, 0,
            ]),
            3,
          ]}
        />
        <bufferAttribute
          attach="attributes-normal"
          args={[new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]), 3]}
        />
        <bufferAttribute
          attach="attributes-uv"
          args={[new Float32Array([0, 0, 1, 0, 0.5, 1]), 2]}
        />
      </bufferGeometry>
      {material}
    </mesh>
  )
}

/* ------------------------------------------------------------
   4. INTERIOR FURNITURE (modules that rise on explode)
   ------------------------------------------------------------ */

export function KitchenModule() {
  return (
    <group>
      {/* Counter body */}
      <RoundedBox args={[1.8, 0.9, 0.7]} radius={0.03} smoothness={3} castShadow>
        <meshStandardMaterial color="#1a1a22" roughness={0.5} metalness={0.4} />
      </RoundedBox>
      {/* Worktop */}
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[1.8, 0.02, 0.7]} />
        <meshStandardMaterial color="#3a3f4a" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Sink */}
      <mesh position={[-0.45, 0.47, 0]}>
        <boxGeometry args={[0.5, 0.03, 0.4]} />
        <meshStandardMaterial color={COLORS.deepDark} roughness={0.9} />
      </mesh>
      {/* Faucet */}
      <mesh position={[-0.45, 0.62, -0.2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.3, 10]} />
        <meshStandardMaterial color={COLORS.brightMetal} metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[-0.45, 0.76, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.22, 10]} />
        <meshStandardMaterial color={COLORS.brightMetal} metalness={1} roughness={0.2} />
      </mesh>
      {/* Stove surface */}
      <mesh position={[0.45, 0.47, 0]}>
        <boxGeometry args={[0.55, 0.025, 0.5]} />
        <meshStandardMaterial color="#0a0a10" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Burners */}
      {[
        [0.3, 0.12],
        [0.6, 0.12],
        [0.3, -0.12],
        [0.6, -0.12],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], 0.49, p[1]]}>
          <torusGeometry args={[0.05, 0.008, 8, 20]} />
          <meshStandardMaterial
            color={COLORS.cyan}
            emissive={COLORS.cyan}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* Cabinet doors */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0, 0.355]}>
            <boxGeometry args={[0.35, 0.8, 0.01]} />
            <meshStandardMaterial color="#24242e" roughness={0.55} />
          </mesh>
          <mesh position={[x + 0.12, 0, 0.365]}>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
            <meshStandardMaterial color={COLORS.brightMetal} metalness={1} />
          </mesh>
        </group>
      ))}
      {/* Upper cabinet */}
      <mesh position={[0, 1.2, -0.2]} castShadow>
        <boxGeometry args={[1.8, 0.5, 0.35]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.55} />
      </mesh>
      {/* Under-cabinet LED */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[1.7, 0.01, 0.02]} />
        <meshStandardMaterial
          color={COLORS.warm}
          emissive={COLORS.warm}
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export function LoftBedModule() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[1.9, 0.1, 1.8]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.6} />
      </mesh>
      <RoundedBox
        args={[1.85, 0.22, 1.75]}
        radius={0.04}
        smoothness={3}
        position={[0, 0.14, 0]}
        castShadow
      >
        <meshStandardMaterial color="#e6e2d6" roughness={0.9} />
      </RoundedBox>
      <mesh position={[0, 0.26, 0.12]}>
        <boxGeometry args={[1.8, 0.04, 1.4]} />
        <meshStandardMaterial color="#3a4866" roughness={0.95} />
      </mesh>
      {[-0.5, 0.5].map((x, i) => (
        <RoundedBox
          key={i}
          args={[0.7, 0.1, 0.45]}
          radius={0.04}
          smoothness={3}
          position={[x, 0.3, -0.6]}
        >
          <meshStandardMaterial color="#fbf4e4" roughness={0.9} />
        </RoundedBox>
      ))}
      <mesh position={[0, -0.055, 0]}>
        <boxGeometry args={[1.7, 0.01, 1.6]} />
        <meshStandardMaterial
          color={COLORS.violet}
          emissive={COLORS.violet}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/** Bathroom pod. Shower glass + door are on the module's LOCAL -Z face,
    so when you place it against the back wall the door opens INTO the
    house, not into the wall. */
export function BathroomModule() {
  return (
    <group>
      <RoundedBox args={[1.2, 1.8, 0.9]} radius={0.04} smoothness={3} castShadow>
        <meshStandardMaterial color="#1a1a22" roughness={0.5} metalness={0.3} />
      </RoundedBox>
      {/* Glass shower wall (front, -Z) */}
      <mesh position={[0.3, 0, -0.46]}>
        <planeGeometry args={[0.5, 1.6]} />
        <meshPhysicalMaterial
          color="#0a2033"
          transmission={0.85}
          transparent
          opacity={0.55}
          thickness={0.3}
          roughness={0.05}
          ior={1.45}
          emissive="#7aa0ff"
          emissiveIntensity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Wooden door panel */}
      <mesh position={[-0.3, 0, -0.46]}>
        <boxGeometry args={[0.55, 1.7, 0.02]} />
        <meshStandardMaterial color={COLORS.darkWood} roughness={0.6} />
      </mesh>
      {/* Brass handle */}
      <mesh position={[-0.08, 0, -0.48]}>
        <cylinderGeometry args={[0.022, 0.022, 0.1, 10]} />
        <meshStandardMaterial color={COLORS.brass} metalness={1} roughness={0.25} />
      </mesh>
      {/* Skylight panel on top */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[1.0, 0.01, 0.7]} />
        <meshStandardMaterial
          color={COLORS.warm}
          emissive={COLORS.warm}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <Edges threshold={15} color={COLORS.cyan} scale={1.001} />
    </group>
  )
}

/** Single-seater armchair sofa. */
export function SofaModule() {
  return (
    <group>
      {/* Frame */}
      <RoundedBox args={[0.9, 0.5, 0.8]} radius={0.06} smoothness={3} castShadow>
        <meshStandardMaterial color="#1a1a22" roughness={0.6} />
      </RoundedBox>
      {/* Seat cushion */}
      <RoundedBox
        args={[0.72, 0.18, 0.7]}
        radius={0.05}
        smoothness={3}
        position={[0, 0.3, 0.02]}
      >
        <meshStandardMaterial color="#3a4258" roughness={0.85} />
      </RoundedBox>
      {/* Back cushion */}
      <RoundedBox
        args={[0.7, 0.4, 0.18]}
        radius={0.04}
        smoothness={3}
        position={[0, 0.52, -0.28]}
      >
        <meshStandardMaterial color="#2b3244" roughness={0.9} />
      </RoundedBox>
      {/* Armrests */}
      {[-0.36, 0.36].map((x, i) => (
        <RoundedBox
          key={i}
          args={[0.14, 0.32, 0.75]}
          radius={0.03}
          smoothness={3}
          position={[x, 0.37, 0]}
        >
          <meshStandardMaterial color="#2b3244" roughness={0.9} />
        </RoundedBox>
      ))}
      {/* Throw pillow */}
      <RoundedBox
        args={[0.26, 0.08, 0.26]}
        radius={0.04}
        smoothness={3}
        position={[0.18, 0.42, 0]}
      >
        <meshStandardMaterial color="#c98b4a" roughness={0.9} />
      </RoundedBox>
      {/* Metal legs */}
      {[
        [-0.35, -0.27, 0.3],
        [0.35, -0.27, 0.3],
        [-0.35, -0.27, -0.3],
        [0.35, -0.27, -0.3],
      ].map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.06, 0.12, 0.06]} />
          <meshStandardMaterial color={COLORS.brightMetal} metalness={1} roughness={0.3} />
        </mesh>
      ))}
      {/* Under glow */}
      <mesh position={[0, -0.27, 0]}>
        <boxGeometry args={[0.78, 0.01, 0.6]} />
        <meshStandardMaterial
          color={COLORS.violet}
          emissive={COLORS.violet}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/** Wall-mounted flat-screen TV. When `screenOff` is true the emissive
    demo content is hidden so a YouTube iframe can cover the plane
    without the blue glow bleeding through. */
export function TVModule({ screenOff = false }) {
  return (
    <group>
      {/* Wall bracket / back plate */}
      <mesh position={[0, 0, -0.035]} castShadow>
        <boxGeometry args={[1.18, 0.68, 0.04]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Bezel */}
      <mesh position={[0, 0, -0.008]}>
        <boxGeometry args={[1.22, 0.72, 0.02]} />
        <meshStandardMaterial color="#05050a" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Screen — emissive when idle, plain black when a video streams */}
      <mesh position={[0, 0, 0.004]}>
        <planeGeometry args={[1.14, 0.64]} />
        <meshStandardMaterial
          color={screenOff ? '#000' : '#0a1a2e'}
          emissive={screenOff ? '#000' : '#2a64a8'}
          emissiveIntensity={screenOff ? 0 : 1.1}
          toneMapped={false}
        />
      </mesh>
      {/* Live-content light bar, hidden when a video is playing */}
      {!screenOff && (
        <mesh position={[0, -0.1, 0.005]}>
          <planeGeometry args={[1.14, 0.08]} />
          <meshStandardMaterial
            color={COLORS.cyan}
            emissive={COLORS.cyan}
            emissiveIntensity={1.5}
            transparent
            opacity={0.25}
            toneMapped={false}
          />
        </mesh>
      )}
      {/* Standby LED (always on) */}
      <mesh position={[0.5, -0.3, 0.012]}>
        <sphereGeometry args={[0.012, 10, 10]} />
        <meshStandardMaterial
          color={COLORS.cyan}
          emissive={COLORS.cyan}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      {/* Brand strip */}
      <mesh position={[0, -0.34, 0.012]}>
        <boxGeometry args={[0.12, 0.01, 0.005]} />
        <meshStandardMaterial
          color={COLORS.brightMetal}
          metalness={1}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

/** Low coffee/side table with a small warm lamp on top. */
export function CoffeeTable() {
  return (
    <group>
      {/* Table top */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <boxGeometry args={[0.55, 0.04, 0.55]} />
        <meshStandardMaterial color={COLORS.darkWood} roughness={0.55} />
      </mesh>
      {/* Metal legs */}
      {[
        [-0.22, 0.17, -0.22],
        [0.22, 0.17, -0.22],
        [-0.22, 0.17, 0.22],
        [0.22, 0.17, 0.22],
      ].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.34, 10]} />
          <meshStandardMaterial color={COLORS.darkMetal} metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
      {/* Table lamp — ceramic base + warm bulb */}
      <mesh position={[0.12, 0.42, 0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.045, 0.1, 14]} />
        <meshStandardMaterial color="#f0e4d0" roughness={0.8} />
      </mesh>
      <mesh position={[0.12, 0.49, 0.1]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshStandardMaterial
          color={COLORS.warm}
          emissive={COLORS.warm}
          emissiveIntensity={2.8}
          toneMapped={false}
        />
      </mesh>
      {/* A small stacked book on the other side */}
      <mesh position={[-0.12, 0.395, -0.05]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.03, 0.14]} />
        <meshStandardMaterial color="#3a5a7a" roughness={0.9} />
      </mesh>
      <mesh position={[-0.12, 0.42, -0.05]} rotation={[0, 0.1, 0]}>
        <boxGeometry args={[0.18, 0.025, 0.13]} />
        <meshStandardMaterial color="#8a1a28" roughness={0.9} />
      </mesh>
    </group>
  )
}

export function DiningModule() {
  return (
    <group>
      <mesh position={[0, 0.34, 0]} castShadow>
        <boxGeometry args={[1.0, 0.04, 0.6]} />
        <meshStandardMaterial color={COLORS.darkWood} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.7, 12]} />
        <meshStandardMaterial color={COLORS.darkMetal} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.04, 16]} />
        <meshStandardMaterial color={COLORS.darkMetal} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0.25, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.14, 12]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.8} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[0.25 + Math.cos(a) * 0.06, 0.57, Math.sin(a) * 0.06]}
            rotation={[0.2, a, 0.2]}
          >
            <coneGeometry args={[0.05, 0.22, 5]} />
            <meshStandardMaterial color="#3a6044" roughness={0.8} />
          </mesh>
        )
      })}
      <mesh position={[-0.2, 0.4, 0.1]}>
        <cylinderGeometry args={[0.035, 0.03, 0.08, 12]} />
        <meshStandardMaterial color="#e0e4ea" roughness={0.5} />
      </mesh>
    </group>
  )
}

export function BatteryModule() {
  return (
    <group>
      <RoundedBox args={[1.4, 0.5, 0.5]} radius={0.03} smoothness={3} castShadow>
        <meshStandardMaterial color="#14141c" metalness={0.8} roughness={0.4} />
      </RoundedBox>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-0.6 + i * 0.17, 0, 0.252]}>
          <boxGeometry args={[0.1, 0.3, 0.005]} />
          <meshStandardMaterial color={COLORS.deepDark} />
        </mesh>
      ))}
      <mesh position={[0, 0.1, 0.253]}>
        <planeGeometry args={[0.4, 0.1]} />
        <meshStandardMaterial
          color={COLORS.cyan}
          emissive={COLORS.cyan}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      {[-0.2, -0.1, 0, 0.1, 0.2].map((x, i) => (
        <mesh key={i} position={[x + 0.4, -0.1, 0.253]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial
            color={i < 4 ? '#4aff88' : '#ff8a4a'}
            emissive={i < 4 ? '#4aff88' : '#ff8a4a'}
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      ))}
      <Edges threshold={15} color={COLORS.cyan} scale={1.001} />
    </group>
  )
}

export function WaterTank() {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.0, 24]} />
        <meshStandardMaterial color={COLORS.brightMetal} metalness={0.9} roughness={0.35} />
      </mesh>
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <sphereGeometry args={[0.3, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#a0a6b0" metalness={1} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
        <meshStandardMaterial color="#2a2d35" metalness={1} />
      </mesh>
      <mesh position={[0, 0, 0.3]}>
        <boxGeometry args={[0.18, 0.06, 0.01]} />
        <meshStandardMaterial
          color={COLORS.cyan}
          emissive={COLORS.cyan}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/** Loft ladder. Rails stand vertically separated along Z (so the climber
    faces +X to go up); rungs span Z between them. Bottom at y=0, top at y=`height`. */
export function LoftLadder({ height = 1.5 }) {
  const rungSpacing = 0.3
  const rungCount = Math.max(3, Math.floor((height - 0.2) / rungSpacing))
  return (
    <group>
      {/* 2 side rails separated along Z */}
      {[-0.2, 0.2].map((z, i) => (
        <mesh key={i} position={[0, height / 2, z]} castShadow>
          <boxGeometry args={[0.04, height, 0.04]} />
          <meshStandardMaterial color={COLORS.darkWood} roughness={0.6} />
        </mesh>
      ))}
      {/* Rungs — cylinders rotated so their length runs along Z */}
      {Array.from({ length: rungCount }).map((_, i) => (
        <mesh
          key={i}
          position={[0, 0.2 + i * rungSpacing, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.02, 0.02, 0.5, 12]} />
          <meshStandardMaterial color={COLORS.brightMetal} metalness={1} roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

/** Small red dog pouf — a raised bolster around a darker inner cushion. */
export function DogBed() {
  return (
    <group>
      {/* Outer bolster ring (plush red) */}
      <RoundedBox args={[0.95, 0.14, 0.72]} radius={0.12} smoothness={3} castShadow>
        <meshStandardMaterial color="#8a1a28" roughness={0.95} />
      </RoundedBox>
      {/* Inner cushion (softer red, slightly sunken) */}
      <RoundedBox
        args={[0.78, 0.1, 0.56]}
        radius={0.08}
        smoothness={3}
        position={[0, 0.06, 0]}
      >
        <meshStandardMaterial color="#c44560" roughness={0.98} />
      </RoundedBox>
      {/* Tiny paw-print embossed mark */}
      {[
        [-0.08, 0.13, -0.05],
        [0.08, 0.13, -0.05],
        [-0.06, 0.13, 0.06],
        [0.06, 0.13, 0.06],
      ].map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.018, 10, 10]} />
          <meshStandardMaterial color="#f0c0c9" roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, 0.13, 0.01]}>
        <sphereGeometry args={[0.03, 10, 10]} />
        <meshStandardMaterial color="#f0c0c9" roughness={0.95} />
      </mesh>
    </group>
  )
}

export function PropaneTank() {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.5, 20]} />
        <meshStandardMaterial color="#d0d6e0" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
        <meshStandardMaterial color="#2a2d35" metalness={1} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------
   5. ENVIRONMENT (trees, rocks, path, flying birds, dog)
   All placed so that their BASE sits on y = 0 of their group
   — you anchor them to the ground by setting group.y = GROUND_Y.
   ------------------------------------------------------------ */

export function PineTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 1, 10]} />
        <meshStandardMaterial color={COLORS.darkWood} roughness={0.95} />
      </mesh>
      {[0, 1, 2].map((i) => {
        const y = 1.1 + i * 0.55
        const r = 0.7 - i * 0.16
        return (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <coneGeometry args={[r, 0.85, 7]} />
            <meshStandardMaterial
              color={`hsl(${135 + i * 4}, 48%, ${22 + i * 3}%)`}
              roughness={0.95}
            />
          </mesh>
        )
      })}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.55, 1.35 + Math.sin(a) * 0.2, Math.sin(a) * 0.55]}
          >
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial
              color={COLORS.warm}
              emissive={COLORS.warm}
              emissiveIntensity={2.2}
              toneMapped={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export function Rock({ position, scale = 1, seed = 0 }) {
  // Rotation derived from seed so it's stable across re-renders.
  const s = seed
  return (
    <mesh
      position={position}
      scale={scale}
      rotation={[s * 0.7, s * 1.3, s * 0.9]}
      castShadow
      receiveShadow
    >
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#1a1d26" roughness={0.95} metalness={0.1} />
    </mesh>
  )
}

export function PathStone({ position, rotation = 0 }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
      <circleGeometry args={[0.38, 10]} />
      <meshStandardMaterial color="#2a2d35" roughness={0.9} />
    </mesh>
  )
}

export function Birds() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = t * 0.15
    ref.current.children.forEach((child, i) => {
      const offset = (i * Math.PI * 2) / 3
      child.position.x = Math.cos(t * 0.4 + offset) * 9
      child.position.z = Math.sin(t * 0.4 + offset) * 9
      child.position.y = 4.5 + Math.sin(t * 0.7 + i) * 0.4
      child.rotation.y = t * 0.4 + offset + Math.PI / 2
      child.children.forEach((w, wi) => {
        if (wi < 1) return
        w.rotation.z = Math.sin(t * 10 + i) * (wi === 1 ? 0.6 : -0.6)
      })
    })
  })
  return (
    <group ref={ref}>
      {[0, 1, 2].map((i) => (
        <group key={i}>
          <mesh>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#0a0a10" />
          </mesh>
          <mesh position={[0, 0, -0.06]}>
            <boxGeometry args={[0.2, 0.01, 0.06]} />
            <meshStandardMaterial color="#0a0a10" />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[0.2, 0.01, 0.06]} />
            <meshStandardMaterial color="#0a0a10" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Waving human companion. Feet touch y=0 of the group, so place at
    `position=[x, GROUND_Y, z]`. Builds the requested traits:
    pale skin, thin grey semi-long hair, white beard, black/white
    checkered scarf, slightly-round dark glasses, right hand waving
    in the air. Call once per scene — the scarf texture is cached. */
export function Human({ position = [0, 0, 0], facing = 0 }) {
  const arm = useRef()

  useFrame((state) => {
    if (!arm.current) return
    const t = state.clock.elapsedTime
    // Arm is modelled straight up — this rotation waves it side-to-side
    // around the shoulder (base tilt 0.2 rad outward ± 0.3 rad swing).
    arm.current.rotation.z = 0.2 + Math.sin(t * 3.5) * 0.3
  })

  const scarfTex = useMemo(() => makeCheckerTexture(), [])

  // Palette
  const skin = '#f4d2b3'
  const hair = '#a6a8ac'
  const beardWhite = '#f2eee5'
  const shirt = '#455772'
  const pants = '#1a2038'
  const shoes = '#14141a'
  const frame = '#1a1c22'

  // Y landmarks (relative to feet at y=0). Total height ≈ 1.77 m.
  const Y_SHOULDER = 1.42
  const Y_NECK = 1.52
  const Y_HEAD = 1.64

  return (
    <group position={position} rotation={[0, facing, 0]}>
      {/* Shoes */}
      {[-0.1, 0.1].map((x, i) => (
        <mesh key={i} position={[x, 0.04, 0.05]} castShadow>
          <boxGeometry args={[0.13, 0.08, 0.28]} />
          <meshStandardMaterial color={shoes} roughness={0.6} />
        </mesh>
      ))}
      {/* Legs (dark trousers) */}
      {[-0.1, 0.1].map((x, i) => (
        <mesh key={i} position={[x, 0.48, 0]} castShadow>
          <cylinderGeometry args={[0.085, 0.07, 0.78, 16]} />
          <meshStandardMaterial color={pants} roughness={0.85} />
        </mesh>
      ))}

      {/* Slim torso */}
      <RoundedBox
        args={[0.42, 0.58, 0.26]}
        radius={0.08}
        smoothness={3}
        position={[0, 1.18, 0]}
        castShadow
      >
        <meshStandardMaterial color={shirt} roughness={0.85} />
      </RoundedBox>

      {/* Neck */}
      <mesh position={[0, Y_NECK, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.07, 0.12, 16]} />
        <meshStandardMaterial color={skin} roughness={0.85} />
      </mesh>

      {/* Head */}
      <mesh position={[0, Y_HEAD, 0]} castShadow>
        <sphereGeometry args={[0.135, 24, 24]} />
        <meshStandardMaterial color={skin} roughness={0.85} />
      </mesh>
      {/* Ears */}
      {[-0.128, 0.128].map((x, i) => (
        <mesh key={i} position={[x, Y_HEAD, 0]} castShadow>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color={skin} roughness={0.9} />
        </mesh>
      ))}
      {/* Small nose so the face has a clear forward direction */}
      <mesh position={[0, Y_HEAD - 0.005, 0.132]} castShadow>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshStandardMaterial color={skin} roughness={0.85} />
      </mesh>

      {/* Hair cap — single continuous piece covering top and back of the
          head. Fine, swept down, no separate fringe bump. */}
      <mesh position={[0, Y_HEAD + 0.012, -0.008]} scale={[1.04, 1.05, 1.04]}>
        <sphereGeometry
          args={[0.135, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.58]}
        />
        <meshStandardMaterial color={hair} roughness={0.98} />
      </mesh>
      {/* Soft swept fringe tilted back over the forehead */}
      <mesh
        position={[0, Y_HEAD + 0.08, 0.06]}
        rotation={[-0.32, 0, 0]}
        castShadow
      >
        <boxGeometry args={[0.2, 0.035, 0.12]} />
        <meshStandardMaterial color={hair} roughness={0.98} />
      </mesh>
      {/* Two side strands falling toward the shoulders */}
      {[-1, 1].map((sign, i) => (
        <mesh
          key={i}
          position={[0.12 * sign, Y_HEAD - 0.1, -0.01]}
          rotation={[0, 0, sign * 0.1]}
          castShadow
        >
          <cylinderGeometry args={[0.03, 0.02, 0.22, 10]} />
          <meshStandardMaterial color={hair} roughness={0.98} />
        </mesh>
      ))}

      {/* Scarf — donut-shaped ring of checkered fabric around the neck,
          plus two cloth tails hanging over the chest. */}
      <mesh
        position={[0, Y_NECK + 0.02, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <torusGeometry args={[0.115, 0.058, 14, 32]} />
        <meshStandardMaterial map={scarfTex} color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh
        position={[0.05, Y_NECK - 0.17, 0.14]}
        rotation={[0.2, 0, 0.1]}
        castShadow
      >
        <boxGeometry args={[0.12, 0.3, 0.035]} />
        <meshStandardMaterial map={scarfTex} color="#ffffff" roughness={0.95} />
      </mesh>
      <mesh
        position={[-0.045, Y_NECK - 0.21, 0.145]}
        rotation={[0.28, 0, -0.08]}
        castShadow
      >
        <boxGeometry args={[0.1, 0.24, 0.03]} />
        <meshStandardMaterial map={scarfTex} color="#ffffff" roughness={0.95} />
      </mesh>

      {/* Glasses — slightly rounded but noticeably wider than tall, not
          perfect circles. Each lens is a torus scaled into an oval. */}
      {[-0.055, 0.055].map((x, i) => (
        <group key={i} position={[x, Y_HEAD + 0.01, 0.12]}>
          <mesh scale={[1.2, 0.85, 1]}>
            <torusGeometry args={[0.04, 0.008, 12, 32]} />
            <meshStandardMaterial
              color={frame}
              metalness={0.7}
              roughness={0.25}
            />
          </mesh>
          <mesh scale={[1.2, 0.85, 1]}>
            <circleGeometry args={[0.04, 24]} />
            <meshPhysicalMaterial
              color="#0b1422"
              transmission={0.35}
              transparent
              opacity={0.75}
              thickness={0.05}
              roughness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
      {/* Bridge */}
      <mesh position={[0, Y_HEAD + 0.01, 0.12]}>
        <boxGeometry args={[0.03, 0.006, 0.006]} />
        <meshStandardMaterial color={frame} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Temple arms running back to the ears */}
      {[-0.098, 0.098].map((x, i) => (
        <mesh key={i} position={[x, Y_HEAD + 0.01, 0.04]}>
          <boxGeometry args={[0.005, 0.006, 0.16]} />
          <meshStandardMaterial color={frame} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Small white beard on the chin only (doesn't cover the mouth) */}
      <mesh position={[0, Y_HEAD - 0.09, 0.06]} scale={[1.05, 0.8, 0.9]}>
        <sphereGeometry args={[0.085, 18, 18]} />
        <meshStandardMaterial color={beardWhite} roughness={0.98} />
      </mesh>
      {/* Light side-whiskers along the jawline */}
      {[-1, 1].map((sign, i) => (
        <mesh
          key={i}
          position={[0.078 * sign, Y_HEAD - 0.075, 0.04]}
          scale={[0.7, 0.85, 0.8]}
        >
          <sphereGeometry args={[0.055, 14, 14]} />
          <meshStandardMaterial color={beardWhite} roughness={0.98} />
        </mesh>
      ))}
      {/* Moustache — thin pill right under the nose */}
      <mesh
        position={[0, Y_HEAD - 0.03, 0.122]}
        rotation={[0.2, 0, 0]}
      >
        <boxGeometry args={[0.08, 0.02, 0.022]} />
        <meshStandardMaterial color={beardWhite} roughness={0.98} />
      </mesh>

      {/* Left arm — hanging at the side. Shoulder tucks just inside the
          torso (x = ±0.23) so the arm reads as attached, not floating. */}
      <group position={[-0.23, Y_SHOULDER - 0.04, 0]} rotation={[0, 0, 0.08]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.042, 0.045, 0.4, 14]} />
          <meshStandardMaterial color={shirt} roughness={0.85} />
        </mesh>
        <mesh position={[-0.015, -0.52, 0]} castShadow>
          <cylinderGeometry args={[0.038, 0.042, 0.3, 14]} />
          <meshStandardMaterial color={skin} roughness={0.85} />
        </mesh>
        <mesh position={[-0.03, -0.69, 0]} castShadow>
          <boxGeometry args={[0.07, 0.09, 0.05]} />
          <meshStandardMaterial color={skin} roughness={0.85} />
        </mesh>
      </group>

      {/* Right arm — STRAIGHT UP, hand visibly above the head.
          All children point +Y (vertical). `useFrame` applies the wave
          via a Z-axis rotation on THIS group, so the whole arm swings
          around the shoulder pivot. */}
      <group ref={arm} position={[0.23, Y_SHOULDER - 0.04, 0]}>
        {/* Upper arm — shoulder → elbow, vertical */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.042, 0.42, 14]} />
          <meshStandardMaterial color={shirt} roughness={0.85} />
        </mesh>
        {/* Elbow bump */}
        <mesh position={[0, 0.44, 0]} castShadow>
          <sphereGeometry args={[0.045, 14, 14]} />
          <meshStandardMaterial color={shirt} roughness={0.85} />
        </mesh>
        {/* Forearm — elbow → wrist, vertical (skin, rolled sleeves) */}
        <mesh position={[0, 0.62, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.038, 0.32, 14]} />
          <meshStandardMaterial color={skin} roughness={0.85} />
        </mesh>
        {/* Wrist */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={skin} roughness={0.85} />
        </mesh>
        {/* Open palm facing forward */}
        <mesh position={[0, 0.91, 0.015]} castShadow>
          <boxGeometry args={[0.09, 0.13, 0.055]} />
          <meshStandardMaterial color={skin} roughness={0.85} />
        </mesh>
        {/* 4 fingers splayed above the palm */}
        {[-0.03, -0.01, 0.01, 0.03].map((x, i) => (
          <mesh key={i} position={[x, 1.0, 0.02]} castShadow>
            <boxGeometry args={[0.014, 0.06, 0.024]} />
            <meshStandardMaterial color={skin} roughness={0.9} />
          </mesh>
        ))}
        {/* Thumb sticking out to the side of the palm */}
        <mesh
          position={[0.055, 0.92, 0.02]}
          rotation={[0, 0, -0.5]}
          castShadow
        >
          <boxGeometry args={[0.015, 0.05, 0.022]} />
          <meshStandardMaterial color={skin} roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

/** Shiba-style companion dog. Its feet touch y=0 of its group,
    so parent it at `position=[x, GROUND_Y, z]` to sit on the ground. */
export function Dog({ position = [5.4, 0, 1.6], facing = -0.4 }) {
  const body = useRef()
  const head = useRef()
  const tail = useRef()
  const leftEar = useRef()
  const rightEar = useRef()

  // Offsets so paw bottom is at y=0 of the outer group.
  // paw bottom = body.y(0.58) + leg offset(-0.3) + paw offset(-0.2) - paw radius(0.08) = 0
  const BODY_Y = 0.58

  useFrame((state) => {
    if (!body.current) return
    const t = state.clock.elapsedTime
    body.current.position.y = BODY_Y + Math.sin(t * 2) * 0.02
    if (head.current) head.current.rotation.y = Math.sin(t * 0.8) * 0.18
    if (tail.current) tail.current.rotation.z = Math.sin(t * 7) * 0.45 - 0.25
    if (leftEar.current) leftEar.current.rotation.x = Math.sin(t * 3) * 0.1
    if (rightEar.current) rightEar.current.rotation.x = Math.sin(t * 3 + 0.4) * 0.1
  })

  const furA = '#c98b4a'
  const furB = '#f4d8a8'
  const furC = '#2a1a10'

  return (
    <group position={position} rotation={[0, facing, 0]}>
      <group ref={body} position={[0, BODY_Y, 0]}>
        {/* Torso */}
        <RoundedBox args={[0.85, 0.4, 0.36]} radius={0.1} smoothness={4} castShadow>
          <meshStandardMaterial color={furA} roughness={0.85} />
        </RoundedBox>
        <RoundedBox
          args={[0.8, 0.22, 0.3]}
          radius={0.08}
          smoothness={3}
          position={[0, -0.15, 0]}
        >
          <meshStandardMaterial color={furB} roughness={0.9} />
        </RoundedBox>

        {/* Neck */}
        <mesh position={[0.44, 0.08, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.12, 0.15, 0.2, 14]} />
          <meshStandardMaterial color={furA} roughness={0.85} />
        </mesh>

        {/* Head */}
        <group ref={head} position={[0.55, 0.22, 0]}>
          <RoundedBox args={[0.32, 0.3, 0.3]} radius={0.08} smoothness={4} castShadow>
            <meshStandardMaterial color={furA} roughness={0.85} />
          </RoundedBox>
          <mesh position={[0.22, -0.05, 0]}>
            <boxGeometry args={[0.14, 0.14, 0.18]} />
            <meshStandardMaterial color={furB} roughness={0.85} />
          </mesh>
          <mesh position={[0.3, -0.02, 0]}>
            <sphereGeometry args={[0.028, 12, 12]} />
            <meshStandardMaterial color="#050508" roughness={0.4} metalness={0.3} />
          </mesh>
          {[0.08, -0.08].map((z, i) => (
            <mesh key={`cheek-${i}`} position={[0.16, -0.02, z]}>
              <sphereGeometry args={[0.055, 12, 12]} />
              <meshStandardMaterial color={furB} roughness={0.9} />
            </mesh>
          ))}
          {[0.08, -0.08].map((z, i) => (
            <mesh key={`eye-${i}`} position={[0.15, 0.05, z]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshStandardMaterial color="#050508" roughness={0.3} metalness={0.5} />
            </mesh>
          ))}
          {[0.08, -0.08].map((z, i) => (
            <mesh key={`eye-shine-${i}`} position={[0.172, 0.06, z]}>
              <sphereGeometry args={[0.008, 8, 8]} />
              <meshStandardMaterial
                color={COLORS.cyan}
                emissive={COLORS.cyan}
                emissiveIntensity={4}
                toneMapped={false}
              />
            </mesh>
          ))}
          <mesh ref={leftEar} position={[0.02, 0.22, 0.11]} rotation={[0, 0, -0.1]}>
            <coneGeometry args={[0.07, 0.18, 4]} />
            <meshStandardMaterial color={furC} roughness={0.9} />
          </mesh>
          <mesh ref={rightEar} position={[0.02, 0.22, -0.11]} rotation={[0, 0, -0.1]}>
            <coneGeometry args={[0.07, 0.18, 4]} />
            <meshStandardMaterial color={furC} roughness={0.9} />
          </mesh>
          <mesh position={[0.035, 0.22, 0.11]} rotation={[0, 0, -0.1]}>
            <coneGeometry args={[0.04, 0.14, 4]} />
            <meshStandardMaterial color={furB} roughness={0.9} />
          </mesh>
          <mesh position={[0.035, 0.22, -0.11]} rotation={[0, 0, -0.1]}>
            <coneGeometry args={[0.04, 0.14, 4]} />
            <meshStandardMaterial color={furB} roughness={0.9} />
          </mesh>
        </group>

        {/* Legs */}
        {[
          [0.28, -0.3, 0.12],
          [0.28, -0.3, -0.12],
          [-0.28, -0.3, 0.12],
          [-0.28, -0.3, -0.12],
        ].map((pos, i) => (
          <group key={i} position={pos}>
            <mesh castShadow>
              <cylinderGeometry args={[0.065, 0.075, 0.35, 10]} />
              <meshStandardMaterial color={furA} roughness={0.85} />
            </mesh>
            <mesh position={[0, -0.2, 0]} castShadow>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color={furC} roughness={0.9} />
            </mesh>
          </group>
        ))}

        {/* Tail */}
        <group ref={tail} position={[-0.42, 0.12, 0]}>
          <mesh rotation={[0, 0, 1.2]} castShadow>
            <torusGeometry args={[0.14, 0.06, 8, 18, Math.PI]} />
            <meshStandardMaterial color={furA} roughness={0.85} />
          </mesh>
          <mesh position={[-0.05, 0.28, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color={furB} roughness={0.85} />
          </mesh>
        </group>

        {/* Collar */}
        <mesh position={[0.38, 0.12, 0]} rotation={[0, 0, 0.2]}>
          <torusGeometry args={[0.16, 0.02, 10, 24]} />
          <meshStandardMaterial color={COLORS.darkMetal} metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0.42, 0.02, 0]}>
          <sphereGeometry args={[0.032, 12, 12]} />
          <meshStandardMaterial
            color={COLORS.cyan}
            emissive={COLORS.cyan}
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}
