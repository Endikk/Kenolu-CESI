import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* ============================================================
   KENOLU — procedural tiny house model.
   `progress` (0→1) drives the exploded-view reveal:
     0.0  → closed, idle rotation
     0.3  → roof lifts & tilts back, solar panels deploy
     0.6  → front & side walls split open, interior glow turns on
     0.85 → interior modules (bed, kitchen, bath) rise
     1.0  → full exploded diagram
   ============================================================ */

const EASE = (t) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t))
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t)

function Wheel({ position }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.35, 40]} />
        <meshStandardMaterial color="#0b0b10" roughness={0.85} metalness={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.4, 20]} />
        <meshStandardMaterial color="#c8cdd4" roughness={0.25} metalness={1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.025, 10, 32]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </mesh>
      {/* Spokes */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i / 5) * Math.PI]}>
          <boxGeometry args={[0.04, 0.03, 0.55]} />
          <meshStandardMaterial color="#6a5cff" emissive="#6a5cff" emissiveIntensity={0.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function SolarPanel() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[3.4, 0.06, 1.8]} />
        <meshStandardMaterial
          color="#0a1428"
          roughness={0.2}
          metalness={0.95}
          emissive="#1a2a4a"
          emissiveIntensity={0.25}
        />
      </mesh>
      {Array.from({ length: 4 }).map((_, i) =>
        Array.from({ length: 2 }).map((_, j) => (
          <mesh
            key={`${i}-${j}`}
            position={[-1.275 + i * 0.85, 0.035, -0.45 + j * 0.9]}
          >
            <planeGeometry args={[0.78, 0.82]} />
            <meshStandardMaterial
              color="#0d1a33"
              emissive="#2a4a80"
              emissiveIntensity={0.4}
              roughness={0.12}
              metalness={1}
            />
          </mesh>
        ))
      )}
      <Edges threshold={15} color="#00e5ff" scale={1.001} />
    </group>
  )
}

function InteriorModule({ position, size, emissive }) {
  return (
    <group position={position}>
      <RoundedBox args={size} radius={0.04} smoothness={4} castShadow>
        <meshStandardMaterial
          color="#1a1a28"
          roughness={0.35}
          metalness={0.55}
        />
      </RoundedBox>
      <mesh position={[0, size[1] / 2 + 0.02, 0]}>
        <boxGeometry args={[size[0] * 0.6, 0.015, size[2] * 0.6]} />
        <meshStandardMaterial
          color={emissive}
          emissive={emissive}
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/** Low-poly dog silhouette that sits next to the house. */
function Dog({ progressRef }) {
  const body = useRef()
  const head = useRef()
  const tail = useRef()

  useFrame((state) => {
    if (!body.current) return
    const t = state.clock.elapsedTime
    body.current.position.y = -2.3 + Math.sin(t * 2) * 0.02
    if (head.current) head.current.rotation.y = Math.sin(t * 0.8) * 0.15
    if (tail.current) tail.current.rotation.z = Math.sin(t * 6) * 0.35 - 0.3
  })

  return (
    <group ref={body} position={[5.2, -2.3, 1.2]} rotation={[0, -0.4, 0]}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.35, 0.3]} />
        <meshStandardMaterial color="#12141c" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Head */}
      <group ref={head} position={[0.38, 0.15, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.3, 0.28]} />
          <meshStandardMaterial color="#12141c" roughness={0.6} metalness={0.2} />
        </mesh>
        {/* Ears */}
        <mesh position={[0.05, 0.2, -0.1]}>
          <coneGeometry args={[0.07, 0.14, 4]} />
          <meshStandardMaterial color="#0a0b10" />
        </mesh>
        <mesh position={[0.05, 0.2, 0.1]}>
          <coneGeometry args={[0.07, 0.14, 4]} />
          <meshStandardMaterial color="#0a0b10" />
        </mesh>
        {/* Eye glow */}
        <mesh position={[0.15, 0.04, 0.08]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        <mesh position={[0.15, 0.04, -0.08]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={3} toneMapped={false} />
        </mesh>
      </group>
      {/* Legs */}
      {[
        [0.22, -0.22, 0.1],
        [0.22, -0.22, -0.1],
        [-0.22, -0.22, 0.1],
        [-0.22, -0.22, -0.1],
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.08, 0.25, 0.08]} />
          <meshStandardMaterial color="#0a0b10" />
        </mesh>
      ))}
      {/* Tail */}
      <mesh ref={tail} position={[-0.34, 0.08, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.25, 0.06, 0.06]} />
        <meshStandardMaterial color="#12141c" />
      </mesh>
      {/* LED collar */}
      <mesh position={[0.22, 0.08, 0]}>
        <torusGeometry args={[0.12, 0.015, 8, 20]} />
        <meshStandardMaterial color="#6a5cff" emissive="#6a5cff" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Glowing cone of light (volumetric feel) above the house when open. */
function VolumetricLight({ position, intensity = 1 }) {
  return (
    <mesh position={position} rotation={[0, 0, 0]}>
      <coneGeometry args={[0.9, 3.2, 32, 1, true]} />
      <meshBasicMaterial
        color="#00e5ff"
        transparent
        opacity={0.05 * intensity}
        side={THREE.DoubleSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

export default function TinyHouse3D({ progressRef }) {
  const root = useRef()
  const roofRef = useRef()
  const panelLeft = useRef()
  const panelRight = useRef()
  const wallFront = useRef()
  const wallBack = useRef()
  const wallLeft = useRef()
  const wallRight = useRef()
  const interior = useRef()
  const interiorLight = useRef()
  const doorLight = useRef()
  const underglow = useRef()

  // Geometry constants (metres, scale preserved)
  const L = 7.2  // length
  const W = 2.5  // width
  const H = 2.5  // height (walls)
  const T = 0.12 // wall thickness

  const interiorModules = useMemo(
    () => [
      // Kitchen block
      { pos: [-L / 2 + 1.0, -H / 2 + 0.5, -W / 2 + 0.5], size: [1.6, 1.0, 0.7], emissive: '#00e5ff' },
      // Bed platform
      { pos: [L / 2 - 1.2, -H / 2 + 0.3, 0], size: [1.9, 0.4, 1.8], emissive: '#6a5cff' },
      // Bathroom cube
      { pos: [0, -H / 2 + 1.0, W / 2 - 0.6], size: [1.2, 1.8, 0.9], emissive: '#00e5ff' },
      // Sofa / desk
      { pos: [-0.2, -H / 2 + 0.35, -W / 2 + 0.4], size: [1.8, 0.5, 0.6], emissive: '#6a5cff' },
    ],
    []
  )

  useFrame((state) => {
    const p = progressRef?.current ?? 0
    const tp0 = EASE(clamp01(p / 0.35))
    const tp1 = EASE(clamp01((p - 0.25) / 0.35))
    const tp2 = EASE(clamp01((p - 0.55) / 0.35))
    const tp3 = EASE(clamp01((p - 0.7) / 0.3))
    const t = state.clock.elapsedTime

    if (root.current) {
      root.current.rotation.y = t * 0.12 + p * 1.0
      root.current.rotation.x = -0.06 + Math.sin(t * 0.4) * 0.015
      root.current.position.y = -0.2 + Math.sin(t * 0.5) * 0.02
    }

    if (roofRef.current) {
      roofRef.current.position.y = H / 2 + 0.1 + tp0 * 2.6
      roofRef.current.rotation.x = tp0 * -0.38
    }

    if (panelLeft.current) {
      panelLeft.current.rotation.z = 0.25 - tp3 * 0.6
      panelLeft.current.position.y = H / 2 + 0.45 + tp0 * 2.5
      panelLeft.current.position.x = -0.9 - tp3 * 0.45
    }
    if (panelRight.current) {
      panelRight.current.rotation.z = -0.25 + tp3 * 0.6
      panelRight.current.position.y = H / 2 + 0.45 + tp0 * 2.5
      panelRight.current.position.x = 0.9 + tp3 * 0.45
    }

    if (wallFront.current) {
      wallFront.current.position.z = -W / 2 - tp1 * 1.5
      wallFront.current.rotation.y = tp1 * -0.14
    }
    if (wallBack.current) {
      wallBack.current.position.z = W / 2 + tp1 * 1.5
      wallBack.current.rotation.y = tp1 * 0.14
    }
    if (wallLeft.current) wallLeft.current.position.x = -L / 2 - tp1 * 1.8
    if (wallRight.current) wallRight.current.position.x = L / 2 + tp1 * 1.8

    if (interior.current) {
      interior.current.children.forEach((child, i) => {
        const base = interiorModules[i]
        if (!base) return
        child.position.y = base.pos[1] + tp2 * (0.3 + i * 0.18)
        child.rotation.y = tp2 * 0.1 * (i % 2 === 0 ? 1 : -1)
      })
    }

    // Interior light that pulses on when walls open
    if (interiorLight.current) {
      interiorLight.current.intensity = tp1 * (2.8 + Math.sin(t * 3) * 0.4)
    }
    if (doorLight.current) {
      doorLight.current.material.emissiveIntensity = 1.6 + Math.sin(t * 2.2) * 0.4
    }
    if (underglow.current) {
      underglow.current.material.opacity = 0.25 + Math.sin(t * 1.2) * 0.1
    }
  })

  return (
    <group ref={root} position={[0, -0.2, 0]}>
      {/* ==================== TRAILER / CHASSIS ==================== */}
      <group position={[0, -H / 2 - 0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[L + 0.2, 0.18, W - 0.4]} />
          <meshStandardMaterial color="#1a1d24" roughness={0.6} metalness={0.8} />
        </mesh>
        <Wheel position={[-L / 2 + 1.2, -0.3, -W / 2 + 0.4]} />
        <Wheel position={[-L / 2 + 1.2, -0.3, W / 2 - 0.4]} />
        <Wheel position={[L / 2 - 1.2, -0.3, -W / 2 + 0.4]} />
        <Wheel position={[L / 2 - 1.2, -0.3, W / 2 - 0.4]} />
        {/* Hitch */}
        <mesh position={[-L / 2 - 0.9, 0, 0]}>
          <boxGeometry args={[1.8, 0.1, 0.1]} />
          <meshStandardMaterial color="#2a2d35" metalness={1} roughness={0.3} />
        </mesh>
      </group>

      {/* ==================== FLOOR ==================== */}
      <mesh position={[0, -H / 2, 0]} receiveShadow>
        <boxGeometry args={[L, 0.12, W]} />
        <meshStandardMaterial color="#0c0c14" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* ==================== INTERIOR POINT LIGHT ==================== */}
      <pointLight
        ref={interiorLight}
        position={[0, 0, 0]}
        intensity={0}
        color="#ffd28a"
        distance={8}
        decay={1.5}
      />

      {/* ==================== WALLS ==================== */}
      <group ref={wallFront}>
        <Wall args={[L, H, T]} position={[0, 0, 0]}>
          <mesh position={[-1.5, 0.3, T / 2 + 0.005]}>
            <planeGeometry args={[2.8, 1.4]} />
            <meshPhysicalMaterial
              color="#0a2a3a"
              transmission={0.6}
              roughness={0.08}
              metalness={0.2}
              thickness={0.5}
              transparent
              opacity={0.55}
              ior={1.4}
              clearcoat={1}
            />
          </mesh>
          <mesh position={[2.2, -0.3, T / 2 + 0.005]}>
            <planeGeometry args={[0.9, 1.9]} />
            <meshStandardMaterial color="#05050a" roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh ref={doorLight} position={[2.55, -0.3, T / 2 + 0.01]}>
            <boxGeometry args={[0.03, 0.6, 0.02]} />
            <meshStandardMaterial
              color="#00e5ff"
              emissive="#00e5ff"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, -H / 2 + 0.05, T / 2 + 0.005]}>
            <boxGeometry args={[L - 0.2, 0.03, 0.015]} />
            <meshStandardMaterial
              color="#00e5ff"
              emissive="#00e5ff"
              emissiveIntensity={1.8}
              toneMapped={false}
            />
          </mesh>
        </Wall>
      </group>

      <group ref={wallBack}>
        <Wall args={[L, H, T]} position={[0, 0, 0]}>
          {[-2, 0, 2].map((x) => (
            <mesh key={x} position={[x, 0.3, -T / 2 - 0.005]}>
              <planeGeometry args={[0.5, 1.3]} />
              <meshPhysicalMaterial
                color="#0a2a3a"
                transmission={0.6}
                roughness={0.08}
                transparent
                opacity={0.55}
                ior={1.4}
              />
            </mesh>
          ))}
          <mesh position={[0, -H / 2 + 0.05, -T / 2 - 0.005]}>
            <boxGeometry args={[L - 0.2, 0.03, 0.015]} />
            <meshStandardMaterial
              color="#6a5cff"
              emissive="#6a5cff"
              emissiveIntensity={1.6}
              toneMapped={false}
            />
          </mesh>
        </Wall>
      </group>

      <group ref={wallLeft}>
        <Wall args={[T, H, W]} position={[0, 0, 0]}>
          <mesh position={[-T / 2 - 0.005, 0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[1.4, 1.2]} />
            <meshPhysicalMaterial
              color="#0a2a3a"
              transmission={0.6}
              roughness={0.08}
              transparent
              opacity={0.55}
              ior={1.4}
            />
          </mesh>
        </Wall>
      </group>

      <group ref={wallRight}>
        <Wall args={[T, H, W]} position={[0, 0, 0]} />
      </group>

      {/* ==================== ROOF ==================== */}
      <group ref={roofRef} position={[0, H / 2 + 0.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[L + 0.1, 0.12, W + 0.1]} />
          <meshStandardMaterial color="#0a0a12" roughness={0.5} metalness={0.7} />
        </mesh>
        <Edges threshold={15} color="#2a2d35" scale={1.001} />
      </group>

      {/* ==================== SOLAR PANELS ==================== */}
      <group ref={panelLeft} position={[-0.9, H / 2 + 0.45, 0]} rotation={[0, 0, 0.25]}>
        <SolarPanel />
      </group>
      <group ref={panelRight} position={[0.9, H / 2 + 0.45, 0]} rotation={[0, 0, -0.25]}>
        <SolarPanel />
      </group>

      {/* ==================== INTERIOR MODULES ==================== */}
      <group ref={interior}>
        {interiorModules.map((m, i) => (
          <InteriorModule key={i} position={m.pos} size={m.size} emissive={m.emissive} />
        ))}
      </group>

      {/* ==================== DOG COMPANION ==================== */}
      <Dog progressRef={progressRef} />

      {/* ==================== UNDERGLOW RING ==================== */}
      <mesh ref={underglow} position={[0, -H / 2 - 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[L / 2, L / 2 + 0.1, 96]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.35} toneMapped={false} />
      </mesh>

      {/* ==================== GROUND DISC ==================== */}
      <mesh position={[0, -H / 2 - 0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[L * 0.75, 96]} />
        <meshStandardMaterial color="#050508" roughness={1} metalness={0} />
      </mesh>

      {/* ==================== LOCATOR CROSS ==================== */}
      <mesh position={[0, -H / 2 - 0.89, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.22, 64]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.4} toneMapped={false} />
      </mesh>
      <mesh position={[0, -H / 2 - 0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.02, 64]} />
        <meshBasicMaterial color="#6a5cff" transparent opacity={0.25} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Wall({ args, position, rotation, color = '#0c0c14', children }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.55} />
      </mesh>
      <Edges threshold={15} color="#2a2d35" scale={1.001} />
      {children}
    </group>
  )
}
