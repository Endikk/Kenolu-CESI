import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

import {
  // dimensions & constants
  L,
  W,
  H,
  T,
  ROOF_PITCH,
  ROOF_BASE_Y,
  SLOPE_LEN,
  SLOPE_ANGLE,
  FLOOR_Y,
  FLOOR_THICKNESS,
  CHASSIS_Y,
  CHASSIS_BEAM_THICKNESS,
  SUBFLOOR_Y,
  SUBFLOOR_HEIGHT,
  GROUND_Y,
  COLORS,
  // textures
  makeWoodTexture,
  makeMetalSeamTexture,
  makeGrassTexture,
  makeSolarCellTexture,
  // exterior parts
  DetailedWheel,
  Fender,
  Window,
  DoorLeaf,
  Porch,
  Awning,
  DetailedSolarPanel,
  VentPipe,
  Skylight,
  Antenna,
  Gutter,
  WallLamp,
  StringLight,
  GableTriangle,
  CutoutWall,
  // interior modules
  KitchenModule,
  LoftBedModule,
  BathroomModule,
  SofaModule,
  BatteryModule,
  WaterTank,
  LoftLadder,
  PropaneTank,
  DogBed,
  CoffeeTable,
  TVModule,
  // environment
  PineTree,
  Rock,
  PathStone,
  Birds,
  Dog,
  Human,
} from './tinyHouseParts'

/* ============================================================
   KENOLU TINY HOUSE — main composition.
   Scroll progress (0 → 1) drives an exploded view:
     0.00 closed idle
     0.25 roof lifts, skylights rise, solar array deploys
     0.50 walls split + insulation peeks
     0.75 interior furniture rises; door swings open
     1.00 full exploded technical diagram
   ============================================================ */

const EASE = (t) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t))
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t)

export default function TinyHouse3D({
  progressRef,
  disableAutoRotate = false,
  videoId = null,
}) {
  // ---------------- Refs driven by useFrame ----------------
  const root = useRef()
  const roofRef = useRef()
  const skylightsRef = useRef()
  const panelLeft = useRef()
  const panelRight = useRef()
  const wallFront = useRef()
  const wallBack = useRef()
  const wallLeft = useRef()
  const wallRight = useRef()
  // Inner meshes of each wall — used as occluders for the TV iframe so
  // the video disappears behind solid cladding but stays visible through
  // window and door openings (the CutoutWall geometry has real holes).
  const wallFrontMesh = useRef()
  const wallBackMesh = useRef()
  const wallLeftMesh = useRef()
  const wallRightMesh = useRef()
  const insulFront = useRef()
  const insulBack = useRef()
  const doorRef = useRef()
  const porchRef = useRef()
  const awningRef = useRef()
  const interiorRef = useRef()
  const interiorLightRef = useRef()
  const doorLightRef = useRef()
  const underglowRef = useRef()
  const batteryRef = useRef()
  const waterTankRef = useRef()
  const stringLightsRef = useRef()

  // ---------------- Procedural textures (cached) ----------------
  const woodLong = useMemo(() => makeWoodTexture([6, 1]), [])
  const woodShort = useMemo(() => makeWoodTexture([2, 1]), [])
  const woodGable = useMemo(() => makeWoodTexture([2.5, 1.2]), [])
  const deckWood = useMemo(() => makeWoodTexture([3, 2]), [])
  const metalRoof = useMemo(() => makeMetalSeamTexture([8, 1]), [])
  const grass = useMemo(() => makeGrassTexture(), [])
  const solarCells = useMemo(() => makeSolarCellTexture(), [])

  // ---------------- Interior module anchors ----------------
  // Each module's base sits on the floor top (FLOOR_Y + FLOOR_THICKNESS/2).
  const floorTop = FLOOR_Y + FLOOR_THICKNESS / 2
  const interiorAnchors = useMemo(
    () => [
      // kitchen — rotated 90° so the counter back presses against the LEFT
      // end wall; counter depth (0.7) runs along X after rotation.
      {
        id: 'kitchen',
        pos: [-L / 2 + 0.5, floorTop + 0.45, 0.1],
        rot: [0, Math.PI / 2, 0],
      },
      // loft bed — right end, raised as a mezzanine
      { id: 'loft', pos: [L / 2 - 1.2, floorTop + 1.45, 0], rot: [0, 0, 0] },
      // bathroom cube — middle, against back wall
      { id: 'bath', pos: [0.2, floorTop + 0.9, W / 2 - 0.55], rot: [0, 0, 0] },
      // single-seat sofa — front wall, close to the kitchen end
      { id: 'sofa', pos: [-1.8, floorTop + 0.3, -W / 2 + 0.55], rot: [0, 0, 0] },
    ],
    [floorTop]
  )

  // ---------------- Animation ----------------
  useFrame((state) => {
    const p = progressRef?.current ?? 0
    const tpRoof = EASE(clamp01(p / 0.35))
    const tpWalls = EASE(clamp01((p - 0.25) / 0.35))
    const tpInterior = EASE(clamp01((p - 0.55) / 0.35))
    const tpExtras = EASE(clamp01((p - 0.7) / 0.3))
    const t = state.clock.elapsedTime

    // Root drift / auto-rotation.
    if (root.current && !disableAutoRotate) {
      root.current.rotation.y = -Math.PI / 6 + Math.sin(t * 0.25) * 0.12 + p * 0.6
      root.current.rotation.x = -0.05 + Math.sin(t * 0.4) * 0.01
      root.current.position.y = Math.sin(t * 0.5) * 0.02
    }

    if (roofRef.current) {
      roofRef.current.position.y = ROOF_BASE_Y + tpRoof * 2.8
      roofRef.current.rotation.x = tpRoof * -0.32
    }
    if (skylightsRef.current) {
      skylightsRef.current.position.y = ROOF_BASE_Y + tpRoof * 2.3
    }

    // Solar panels — aligned with each slope, lift on explode.
    if (panelLeft.current) {
      panelLeft.current.rotation.x = -SLOPE_ANGLE + tpExtras * 0.25
      panelLeft.current.position.y = ROOF_BASE_Y + ROOF_PITCH / 2 + 0.08 + tpRoof * 2.6
      panelLeft.current.position.z = -W / 4 - tpExtras * 0.55
    }
    if (panelRight.current) {
      panelRight.current.rotation.x = SLOPE_ANGLE - tpExtras * 0.25
      panelRight.current.position.y = ROOF_BASE_Y + ROOF_PITCH / 2 + 0.08 + tpRoof * 2.6
      panelRight.current.position.z = W / 4 + tpExtras * 0.55
    }

    // Walls slide outward.
    if (wallFront.current) {
      wallFront.current.position.z = -W / 2 - tpWalls * 1.6
      wallFront.current.rotation.y = tpWalls * -0.14
    }
    if (wallBack.current) {
      wallBack.current.position.z = W / 2 + tpWalls * 1.6
      wallBack.current.rotation.y = tpWalls * 0.14
    }
    if (wallLeft.current) wallLeft.current.position.x = -L / 2 - tpWalls * 1.9
    if (wallRight.current) wallRight.current.position.x = L / 2 + tpWalls * 1.9

    if (insulFront.current) insulFront.current.position.z = -W / 2 - tpWalls * 1.0
    if (insulBack.current) insulBack.current.position.z = W / 2 + tpWalls * 1.0

    if (doorRef.current) doorRef.current.rotation.y = tpWalls * 1.2
    if (porchRef.current) porchRef.current.position.z = -W / 2 - 0.65 - tpWalls * 0.2
    if (awningRef.current) awningRef.current.position.y = 0.95 + tpRoof * 1.3

    if (interiorRef.current) {
      interiorRef.current.children.forEach((child, i) => {
        const base = interiorAnchors[i]
        if (!base) return
        child.position.y = base.pos[1] + tpInterior * (0.3 + i * 0.22)
        // Animate rotation AROUND the anchor's base rotation so rotated
        // modules (e.g. the kitchen) don't snap back to Y=0 on explode.
        const baseRotY = base.rot?.[1] ?? 0
        child.rotation.y =
          baseRotY + tpInterior * 0.1 * (i % 2 === 0 ? 1 : -1)
      })
    }

    // Battery + water tank are children of the chassis group — y is LOCAL to it.
    // At rest they're tucked against the chassis underside; explode drops them out.
    if (batteryRef.current) {
      batteryRef.current.position.y = -0.3 - tpExtras * 1.0
      batteryRef.current.position.x = -1.5 - tpExtras * 0.9
    }
    if (waterTankRef.current) {
      waterTankRef.current.position.y = -0.3 - tpExtras * 0.8
      waterTankRef.current.position.x = 1.5 + tpExtras * 0.9
    }

    if (interiorLightRef.current) {
      interiorLightRef.current.intensity = tpWalls * (3.2 + Math.sin(t * 3) * 0.4)
    }
    if (doorLightRef.current?.material) {
      doorLightRef.current.material.emissiveIntensity = 1.6 + Math.sin(t * 2.2) * 0.4
    }
    if (underglowRef.current?.material) {
      underglowRef.current.material.opacity = 0.28 + Math.sin(t * 1.2) * 0.1
    }
    if (stringLightsRef.current) {
      stringLightsRef.current.children.forEach((c, i) => {
        if (c.children?.[0]?.material) {
          c.children[0].material.emissiveIntensity =
            2 + Math.sin(t * 2 + i * 0.3) * 0.6
        }
      })
    }
  })

  // ======================================================
  // JSX composition
  // ======================================================
  return (
    <group ref={root}>
      {/* ==================== INTERIOR POINT LIGHT ==================== */}
      <pointLight
        ref={interiorLightRef}
        position={[0, 0, 0]}
        intensity={0}
        color={COLORS.warm}
        distance={9}
        decay={1.6}
      />

      {/* ==================== CHASSIS & UTILITIES ==================== */}
      <group position={[0, CHASSIS_Y, 0]}>
        {/* Main I-beam frame */}
        <mesh castShadow>
          <boxGeometry args={[L + 0.2, CHASSIS_BEAM_THICKNESS, W - 0.3]} />
          <meshStandardMaterial color={COLORS.steel} roughness={0.6} metalness={0.9} />
        </mesh>
        {/* Longitudinal rails underneath */}
        {[-W / 2 + 0.2, W / 2 - 0.2].map((z, i) => (
          <mesh key={i} position={[0, -0.12, z]} castShadow>
            <boxGeometry args={[L + 0.1, 0.1, 0.08]} />
            <meshStandardMaterial color={COLORS.deepDark} metalness={1} roughness={0.45} />
          </mesh>
        ))}
        {/* Cross-members */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} position={[-L / 2 + 1 + i * 1.3, -0.13, 0]} castShadow>
            <boxGeometry args={[0.08, 0.08, W - 0.35]} />
            <meshStandardMaterial color={COLORS.deepDark} metalness={1} roughness={0.45} />
          </mesh>
        ))}

        {/* Wheels (absolute Y within chassis = -0.3 → sitting on GROUND_Y) */}
        {[
          [-L / 2 + 1.4, -W / 2 + 0.4],
          [-L / 2 + 1.4, W / 2 - 0.4],
          [L / 2 - 1.4, -W / 2 + 0.4],
          [L / 2 - 1.4, W / 2 - 0.4],
        ].map((xy, i) => (
          <DetailedWheel key={i} position={[xy[0], -0.3, xy[1]]} />
        ))}
        {/* Fenders arch over wheels */}
        {[
          [-L / 2 + 1.4, -W / 2 + 0.4],
          [-L / 2 + 1.4, W / 2 - 0.4],
          [L / 2 - 1.4, -W / 2 + 0.4],
          [L / 2 - 1.4, W / 2 - 0.4],
        ].map((xy, i) => (
          <Fender key={i} position={[xy[0], -0.3, xy[1]]} />
        ))}

        {/* Corner jacks */}
        {[
          [-L / 2 + 0.2, -W / 2 + 0.4],
          [-L / 2 + 0.2, W / 2 - 0.4],
          [L / 2 - 0.2, -W / 2 + 0.4],
          [L / 2 - 0.2, W / 2 - 0.4],
        ].map((xy, i) => (
          <group key={i} position={[xy[0], -0.25, xy[1]]}>
            <mesh>
              <boxGeometry args={[0.1, 0.4, 0.1]} />
              <meshStandardMaterial color="#2a2d35" metalness={1} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.22, 0]}>
              <boxGeometry args={[0.22, 0.05, 0.22]} />
              <meshStandardMaterial color={COLORS.steel} metalness={0.8} roughness={0.5} />
            </mesh>
          </group>
        ))}

        {/* Hitch */}
        <group position={[-L / 2 - 0.9, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.8, 0.1, 0.1]} />
            <meshStandardMaterial color="#2a2d35" metalness={1} roughness={0.3} />
          </mesh>
          <mesh position={[-0.9, -0.05, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={COLORS.steel} metalness={1} roughness={0.35} />
          </mesh>
          <mesh position={[-0.3, -0.1, 0.2]} rotation={[0, 0.3, -0.2]}>
            <boxGeometry args={[1.2, 0.05, 0.05]} />
            <meshStandardMaterial color="#2a2d35" metalness={1} />
          </mesh>
          <mesh position={[-0.3, -0.1, -0.2]} rotation={[0, -0.3, -0.2]}>
            <boxGeometry args={[1.2, 0.05, 0.05]} />
            <meshStandardMaterial color="#2a2d35" metalness={1} />
          </mesh>
        </group>

        {/* Battery pack — mounted on the underside of the chassis.
            Drops and slides out on explode. */}
        <group ref={batteryRef} position={[-1.5, -0.3, 0]}>
          <BatteryModule />
        </group>

        {/* Water tank — bolted to the chassis, opposite side. */}
        <group ref={waterTankRef} position={[1.5, -0.3, 0]}>
          <WaterTank />
        </group>

        {/* Propane tank at the hitch side */}
        <group position={[-L / 2 - 0.1, 0, W / 2 - 0.3]}>
          <PropaneTank />
        </group>
      </group>

      {/* ==================== SUB-FLOOR BAND ==================== */}
      {/* closes the gap between the chassis top and the floor bottom. */}
      <mesh position={[0, SUBFLOOR_Y, 0]} castShadow receiveShadow>
        <boxGeometry args={[L, SUBFLOOR_HEIGHT, W]} />
        <meshStandardMaterial color="#1a1d26" metalness={0.6} roughness={0.7} />
      </mesh>
      {/* Insulation strip peeking out of subfloor edges */}
      {[-W / 2 + 0.02, W / 2 - 0.02].map((z, i) => (
        <mesh
          key={i}
          position={[0, SUBFLOOR_Y, z]}
        >
          <boxGeometry args={[L - 0.1, SUBFLOOR_HEIGHT - 0.04, 0.015]} />
          <meshStandardMaterial color={COLORS.insulation} roughness={0.95} />
        </mesh>
      ))}

      {/* ==================== FLOOR DECK ==================== */}
      <mesh position={[0, FLOOR_Y, 0]} receiveShadow>
        <boxGeometry args={[L, FLOOR_THICKNESS, W]} />
        <meshStandardMaterial color="#0c0c14" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Interior wood floor (visible when walls open) */}
      <mesh position={[0, FLOOR_Y + FLOOR_THICKNESS / 2 + 0.001, 0]} receiveShadow>
        <boxGeometry args={[L - 0.05, 0.01, W - 0.05]} />
        <meshStandardMaterial map={deckWood} color="#ffffff" roughness={0.85} />
      </mesh>

      {/* ==================== WALLS + INSULATION ====================
          Insulation is a thin CutoutWall with the same openings as the
          corresponding structural wall, so windows and door go all the
          way through from outside to inside. */}
      <group ref={insulFront} position={[0, 0, -W / 2 + T * 0.45]}>
        <CutoutWall
          width={L - 0.3}
          height={H}
          thickness={0.04}
          color={COLORS.insulation}
          roughness={0.95}
          holes={[
            { shape: 'rect', cx: -1.7, cy: 0.3, w: 2.4, h: 1.3 },
            { shape: 'rect', cx: 1.0, cy: 0.5, w: 1.0, h: 0.8 },
            { shape: 'rect', cx: 2.4, cy: -0.18, w: 0.95, h: 2.05 },
          ]}
        />
      </group>
      <group ref={insulBack} position={[0, 0, W / 2 - T * 0.45]}>
        <CutoutWall
          width={L - 0.3}
          height={H}
          thickness={0.04}
          color={COLORS.insulation}
          roughness={0.95}
          holes={[
            { shape: 'rect', cx: -2.2, cy: 0.3, w: 0.9, h: 1.2 },
            { shape: 'rect', cx: 0, cy: 0.3, w: 0.9, h: 1.2 },
            { shape: 'rect', cx: 2.2, cy: 0.3, w: 0.9, h: 1.2 },
          ]}
        />
      </group>

      {/* FRONT WALL — real cut-outs for 2 windows + door,
          single Window pane at the centre of each opening. */}
      <group ref={wallFront} position={[0, 0, -W / 2]}>
        <CutoutWall
          ref={wallFrontMesh}
          width={L}
          height={H}
          thickness={T}
          map={woodLong}
          holes={[
            { shape: 'rect', cx: -1.7, cy: 0.3, w: 2.4, h: 1.3 }, // picture window
            { shape: 'rect', cx: 1.0, cy: 0.5, w: 1.0, h: 0.8 },  // kitchen window
            { shape: 'rect', cx: 2.4, cy: -0.18, w: 0.95, h: 2.05 }, // door (with a 0.03 threshold)
          ]}
        />
        {/* Window glazing & frames, centred in each hole */}
        <group position={[-1.7, 0.3, 0]}>
          <Window width={2.4} height={1.3} />
        </group>
        <group position={[1.0, 0.5, 0]}>
          <Window width={1.0} height={0.8} mullion={false} />
        </group>
        {/* Door casing — 4 trim strips around the opening (NOT a full
            panel, so the opening stays hollow and the door can swing out
            freely without anything blocking behind it). */}
        <group position={[2.4, -0.18, -T / 2 - 0.015]}>
          {/* Head (top) */}
          <mesh position={[0, 2.05 / 2 + 0.025, 0]} castShadow>
            <boxGeometry args={[1.02, 0.05, 0.03]} />
            <meshStandardMaterial color={COLORS.darkWood} roughness={0.6} />
          </mesh>
          {/* Left jamb */}
          <mesh position={[-0.95 / 2 - 0.025, 0, 0]} castShadow>
            <boxGeometry args={[0.05, 2.05 + 0.1, 0.03]} />
            <meshStandardMaterial color={COLORS.darkWood} roughness={0.6} />
          </mesh>
          {/* Right jamb */}
          <mesh position={[0.95 / 2 + 0.025, 0, 0]} castShadow>
            <boxGeometry args={[0.05, 2.05 + 0.1, 0.03]} />
            <meshStandardMaterial color={COLORS.darkWood} roughness={0.6} />
          </mesh>
          {/* Threshold (bottom) */}
          <mesh position={[0, -2.05 / 2 - 0.02, 0]}>
            <boxGeometry args={[1.02, 0.04, 0.03]} />
            <meshStandardMaterial color={COLORS.darkWood} roughness={0.6} />
          </mesh>
        </group>
        {/* Pivoting door leaf — sits inside the opening, swings outward */}
        <group ref={doorRef} position={[1.97, -0.2, 0]}>
          <group position={[0.45, 0, 0]}>
            <DoorLeaf />
          </group>
        </group>
        {/* Wall lamp beside the door */}
        <WallLamp position={[3.15, 0.3, -T / 2 - 0.04]} />
        {/* Neon baseboard accent (exterior face) */}
        <mesh ref={doorLightRef} position={[0, -H / 2 + 0.05, -T / 2 - 0.005]}>
          <boxGeometry args={[L - 0.2, 0.03, 0.015]} />
          <meshStandardMaterial
            color={COLORS.cyan}
            emissive={COLORS.cyan}
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* BACK WALL — 3 cut-out windows. */}
      <group ref={wallBack} position={[0, 0, W / 2]}>
        <CutoutWall
          ref={wallBackMesh}
          width={L}
          height={H}
          thickness={T}
          map={woodLong}
          holes={[
            { shape: 'rect', cx: -2.2, cy: 0.3, w: 0.9, h: 1.2 },
            { shape: 'rect', cx: 0, cy: 0.3, w: 0.9, h: 1.2 },
            { shape: 'rect', cx: 2.2, cy: 0.3, w: 0.9, h: 1.2 },
          ]}
        />
        {[-2.2, 0, 2.2].map((x, i) => (
          <group key={i} position={[x, 0.3, 0]}>
            <Window width={0.9} height={1.2} mullion={i === 1} />
          </group>
        ))}
        {/* Flat-screen TV mounted on the interior face, between the left
            window and the middle window, at a comfortable viewing height
            for the sofa on the opposite wall. Rotated π so the screen
            points toward -Z (into the living space).
            When the user passes a videoId, an <Html transform> overlays
            a YouTube iframe exactly on the screen — the video plays
            ONLY on the 3D TV, not in any modal. */}
        <group position={[-1.1, 0.3, -T / 2 - 0.04]} rotation={[0, Math.PI, 0]}>
          <TVModule screenOff={Boolean(videoId)} />
          {videoId && (
            <Html
              /* Screen-aligned overlay pinned to the TV's 3D position.
                 `occlude` takes an array of mesh refs — drei raycasts from
                 the camera to the TV and hides the iframe if any of these
                 meshes is in the way. The CutoutWall meshes already have
                 real holes for windows and the door, so raycasts going
                 through a window opening DON'T hit the wall and the
                 iframe stays visible from those angles. */
              position={[0, 0, 0.008]}
              center
              distanceFactor={1.42}
              occlude={[
                wallFrontMesh,
                wallBackMesh,
                wallLeftMesh,
                wallRightMesh,
              ]}
              zIndexRange={[16, 0]}
              style={{
                width: '800px',
                height: '450px',
                background: '#000',
                overflow: 'hidden',
                pointerEvents: 'auto',
              }}
            >
              <iframe
                key={videoId}
                width="800"
                height="450"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title="TV Kenolu"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                style={{
                  border: 0,
                  display: 'block',
                  width: '800px',
                  height: '450px',
                }}
              />
            </Html>
          )}
        </group>
        {/* Violet baseboard on exterior */}
        <mesh position={[0, -H / 2 + 0.05, T / 2 + 0.005]}>
          <boxGeometry args={[L - 0.2, 0.03, 0.015]} />
          <meshStandardMaterial
            color={COLORS.violet}
            emissive={COLORS.violet}
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* LEFT END WALL + porthole cut-out + gable.
          Rotated 90° around Y so the CutoutWall's thickness aligns with X. */}
      <group ref={wallLeft} position={[-L / 2, 0, 0]}>
        <group rotation={[0, Math.PI / 2, 0]}>
          <CutoutWall
            ref={wallLeftMesh}
            width={W}
            height={H}
            thickness={T}
            map={woodShort}
            holes={[{ shape: 'circle', cx: 0, cy: 0.3, r: 0.3 }]}
          />
        </group>
        {/* Porthole glass + ring trim, centred in the circular hole */}
        <group position={[0, 0.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <ringGeometry args={[0.3, 0.38, 32]} />
            <meshStandardMaterial
              color="#1a1f2a"
              metalness={0.9}
              roughness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh>
            <circleGeometry args={[0.3, 32]} />
            <meshPhysicalMaterial
              color="#0a2033"
              transmission={0.85}
              transparent
              opacity={0.6}
              thickness={0.3}
              roughness={0.05}
              ior={1.45}
              emissive={COLORS.warm}
              emissiveIntensity={0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
        {/* Gable */}
        <group position={[-T / 2 - 0.001, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <GableTriangle
            material={
              <meshStandardMaterial
                map={woodGable}
                color="#ffffff"
                roughness={0.85}
                side={THREE.DoubleSide}
              />
            }
          />
          <mesh position={[0, ROOF_PITCH * 0.45, 0.01]}>
            <circleGeometry args={[0.12, 16]} />
            <meshStandardMaterial color="#05070d" metalness={0.9} roughness={0.5} />
          </mesh>
          <mesh position={[0, ROOF_PITCH * 0.45, 0.02]}>
            <ringGeometry args={[0.1, 0.12, 24]} />
            <meshStandardMaterial
              color={COLORS.cyan}
              emissive={COLORS.cyan}
              emissiveIntensity={1.8}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>

      {/* RIGHT END WALL + gable. Same 90° rotation as left, no holes. */}
      <group ref={wallRight} position={[L / 2, 0, 0]}>
        <group rotation={[0, -Math.PI / 2, 0]}>
          <CutoutWall
            ref={wallRightMesh}
            width={W}
            height={H}
            thickness={T}
            map={woodShort}
          />
        </group>
        <group position={[T / 2 + 0.001, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <GableTriangle
            material={
              <meshStandardMaterial
                map={woodGable}
                color="#ffffff"
                roughness={0.85}
                side={THREE.DoubleSide}
              />
            }
          />
          <mesh position={[0, ROOF_PITCH * 0.45, 0.01]}>
            <circleGeometry args={[0.12, 16]} />
            <meshStandardMaterial color="#05070d" metalness={0.9} roughness={0.5} />
          </mesh>
          <mesh position={[0, ROOF_PITCH * 0.45, 0.02]}>
            <ringGeometry args={[0.1, 0.12, 24]} />
            <meshStandardMaterial
              color={COLORS.violet}
              emissive={COLORS.violet}
              emissiveIntensity={1.6}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>

      {/* ==================== ROOF ==================== */}
      <group ref={roofRef} position={[0, ROOF_BASE_Y, 0]}>
        {/* Front slope */}
        <mesh
          position={[0, ROOF_PITCH / 2, -W / 4]}
          rotation={[Math.atan2(W / 2, ROOF_PITCH), 0, 0]}
          castShadow
          receiveShadow
        >
          <planeGeometry args={[L + 0.4, SLOPE_LEN + 0.05]} />
          <meshStandardMaterial
            map={metalRoof}
            color="#ffffff"
            metalness={0.85}
            roughness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Back slope */}
        <mesh
          position={[0, ROOF_PITCH / 2, W / 4]}
          rotation={[-Math.atan2(W / 2, ROOF_PITCH), 0, 0]}
          castShadow
          receiveShadow
        >
          <planeGeometry args={[L + 0.4, SLOPE_LEN + 0.05]} />
          <meshStandardMaterial
            map={metalRoof}
            color="#ffffff"
            metalness={0.85}
            roughness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Ridge cap */}
        <mesh position={[0, ROOF_PITCH + 0.02, 0]} castShadow>
          <boxGeometry args={[L + 0.5, 0.06, 0.18]} />
          <meshStandardMaterial color="#05080f" metalness={1} roughness={0.3} />
        </mesh>
        {/* Eave trims */}
        <mesh position={[0, 0, -W / 2 - 0.02]}>
          <boxGeometry args={[L + 0.4, 0.1, 0.05]} />
          <meshStandardMaterial color="#0a0a12" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, W / 2 + 0.02]}>
          <boxGeometry args={[L + 0.4, 0.1, 0.05]} />
          <meshStandardMaterial color="#0a0a12" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Gutters */}
        <group position={[0, -0.03, -W / 2 - 0.05]}>
          <Gutter length={L + 0.4} />
        </group>
        <group position={[0, -0.03, W / 2 + 0.05]}>
          <Gutter length={L + 0.4} />
        </group>
        {/* Vents */}
        <group position={[1.5, ROOF_PITCH * 0.6, 0.4]}>
          <VentPipe />
        </group>
        <group position={[-2.2, ROOF_PITCH * 0.6, -0.4]}>
          <VentPipe />
        </group>
        {/* Antenna */}
        <group position={[-L / 2 + 0.5, ROOF_PITCH + 0.05, -0.3]}>
          <Antenna />
        </group>
        {/* Neon eave accent */}
        <mesh position={[0, -0.04, -W / 2 - 0.03]}>
          <boxGeometry args={[L + 0.35, 0.015, 0.008]} />
          <meshStandardMaterial
            color={COLORS.cyan}
            emissive={COLORS.cyan}
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, -0.04, W / 2 + 0.03]}>
          <boxGeometry args={[L + 0.35, 0.015, 0.008]} />
          <meshStandardMaterial
            color={COLORS.violet}
            emissive={COLORS.violet}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ==================== SKYLIGHTS (lift independently) ==================== */}
      <group ref={skylightsRef} position={[0, ROOF_BASE_Y, 0]}>
        <group
          position={[-1.8, ROOF_PITCH / 2, -W / 4]}
          rotation={[-SLOPE_ANGLE, 0, 0]}
        >
          <Skylight w={1.3} l={0.8} />
        </group>
        <group
          position={[2.0, ROOF_PITCH / 2, W / 4]}
          rotation={[SLOPE_ANGLE, 0, 0]}
        >
          <Skylight w={1.0} l={0.7} />
        </group>
      </group>

      {/* ==================== SOLAR PANELS ==================== */}
      <group ref={panelLeft}>
        <DetailedSolarPanel cellTex={solarCells} />
      </group>
      <group ref={panelRight}>
        <DetailedSolarPanel cellTex={solarCells} />
      </group>

      {/* ==================== AWNING + PORCH ==================== */}
      {/* Awning sits just above the door head trim (door top ≈ y=0.85).
          Anchored on the front-wall exterior face. */}
      <group ref={awningRef} position={[2.4, 0.95, -W / 2 - 0.04]}>
        <Awning />
      </group>
      <group ref={porchRef} position={[2.4, FLOOR_Y + 0.05, -W / 2 - 0.65]}>
        <Porch />
      </group>

      {/* ==================== STRING LIGHTS over front eaves ==================== */}
      <group
        ref={stringLightsRef}
        position={[0, H / 2 + 0.2, -W / 2 - 0.15]}
      >
        <StringLight length={L - 0.4} above={0.1} />
      </group>

      {/* ==================== INTERIOR FURNITURE ==================== */}
      <group ref={interiorRef}>
        <group
          position={interiorAnchors[0].pos}
          rotation={interiorAnchors[0].rot}
        >
          <KitchenModule />
        </group>
        <group
          position={interiorAnchors[1].pos}
          rotation={interiorAnchors[1].rot}
        >
          <LoftBedModule />
          {/* Ladder at the front-left corner of the loft, bottom resting on
              the floor (local y = floorTop - loft anchor y = -1.45),
              reaching the platform 1.5 m above. */}
          <group position={[-0.95, -1.45, 0.35]}>
            <LoftLadder height={1.5} />
          </group>
        </group>
        <group
          position={interiorAnchors[2].pos}
          rotation={interiorAnchors[2].rot}
        >
          <BathroomModule />
        </group>
        <group
          position={interiorAnchors[3].pos}
          rotation={interiorAnchors[3].rot}
        >
          <SofaModule />
        </group>
      </group>

      {/* Dog pouf — tucked on the floor UNDER the loft mezzanine
          so the dog has its own nook. Stays on the floor on explode. */}
      <group position={[2.6, floorTop + 0.07, -0.15]} rotation={[0, -0.35, 0]}>
        <DogBed />
      </group>

      {/* Low coffee table right beside the single-seat sofa (+X side),
          slight gap so it's "next to" the sofa, not touching. */}
      <group position={[-0.95, floorTop + 0.01, -W / 2 + 0.55]}>
        <CoffeeTable />
      </group>

      {/* ==================== COMPANIONS + SKY ==================== */}
      <Dog position={[5.4, GROUND_Y, 1.6]} facing={-0.6} />
      {/* Human standing to the dog's left, same orientation as the dog. */}
      <Human position={[4.1, GROUND_Y, 2.0]} facing={-0.6} />
      <Birds />

      {/* ==================== LANDSCAPE / ENVIRONMENT ====================
           Everything sits on GROUND_Y so the dog isn't in the floor. */}
      {/* Pine trees */}
      <PineTree position={[-6.5, GROUND_Y, -3.2]} scale={1.4} />
      <PineTree position={[-7.5, GROUND_Y, 1.5]} scale={1.1} />
      <PineTree position={[6.5, GROUND_Y, -3.5]} scale={1.5} />
      <PineTree position={[8.2, GROUND_Y, 2.0]} scale={1.2} />
      <PineTree position={[3.5, GROUND_Y, 4.5]} scale={0.9} />
      <PineTree position={[-4.2, GROUND_Y, 4.8]} scale={1.0} />
      {/* Rocks — y nudged up by half their scaled radius */}
      <Rock position={[-3.2, GROUND_Y + 0.3, -2.5]} scale={0.8} seed={0.5} />
      <Rock position={[3.8, GROUND_Y + 0.2, -2.2]} scale={0.6} seed={1.1} />
      <Rock position={[-4.5, GROUND_Y + 0.15, 2]} scale={0.5} seed={1.7} />
      <Rock position={[4.8, GROUND_Y + 0.25, 1.8]} scale={0.7} seed={2.3} />
      <Rock position={[-2.2, GROUND_Y + 0.12, 3.5]} scale={0.4} seed={2.9} />
      {/* Path stones leading to the porch */}
      {Array.from({ length: 5 }).map((_, i) => (
        <PathStone
          key={i}
          position={[2.4, GROUND_Y + 0.015, -2.2 - i * 0.55]}
          rotation={i * 0.31}
        />
      ))}

      {/* ==================== UNDERGLOW & LOCATOR RINGS ==================== */}
      <mesh
        ref={underglowRef}
        position={[0, GROUND_Y + 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[L / 2, L / 2 + 0.1, 96]} />
        <meshBasicMaterial
          color={COLORS.cyan}
          transparent
          opacity={0.35}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, GROUND_Y + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.22, 64]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.45} toneMapped={false} />
      </mesh>
      <mesh position={[0, GROUND_Y + 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.02, 64]} />
        <meshBasicMaterial
          color={COLORS.violet}
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, GROUND_Y + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.0, 3.015, 96]} />
        <meshBasicMaterial
          color={COLORS.cyan}
          transparent
          opacity={0.18}
          toneMapped={false}
        />
      </mesh>

      {/* ==================== GROUND DISC ==================== */}
      <mesh position={[0, GROUND_Y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[L * 1.6, 96]} />
        <meshStandardMaterial map={grass} color="#0d1410" roughness={1} metalness={0} />
      </mesh>

      {/* Outer fade ring so the plot reads as a platform */}
      <mesh position={[0, GROUND_Y - 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[L * 1.6, L * 1.8, 96]} />
        <meshBasicMaterial
          color="#1a2030"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

    </group>
  )
}
