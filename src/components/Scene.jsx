import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Sparkles,
  Grid,
  Float,
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
} from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  SMAA,
} from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'
import TinyHouse3D from './TinyHouse3D'

/**
 * Fixed full-viewport R3F canvas.
 * - `progressRef.current` (0→1) drives house exploded view + camera arc.
 * - `pointerRef.current` holds normalised pointer (-1..1) for parallax.
 */
export default function Scene({ progressRef }) {
  const pointerRef = useRef({ x: 0, y: 0 })
  // Upper DPR cap starts at 1.5 (retina caps at 2× → 4× pixels, way too
  // expensive for most laptops running this in the background). If the
  // PerformanceMonitor reports sustained lag, we bump it down further.
  const [dprCap, setDprCap] = useState(1.5)

  return (
    <div
      className="scene-canvas"
      onMouseMove={(e) => {
        pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
        pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
      }}
    >
      <Canvas
        shadows="soft"
        dpr={[0.9, dprCap]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          // PCF (not PCFSoft) is faster and also silences the
          // deprecation warning from three 0.183.
          shadowMapType: THREE.PCFShadowMap,
        }}
        camera={{ position: [0, 2.2, 16], fov: 42 }}
      >
        {/* Auto-downgrade DPR / disable events when FPS drops. */}
        <PerformanceMonitor
          onDecline={() => setDprCap(1)}
          onFallback={() => setDprCap(0.85)}
          flipflops={3}
        />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <color attach="background" args={['#1c2740']} />
        <fog attach="fog" args={['#1c2740', 26, 62]} />

        <ambientLight intensity={0.9} />
        <hemisphereLight args={['#cfe0ff', '#3a2a1a', 1.1]} />
        <directionalLight
          position={[8, 14, 8]}
          intensity={2.2}
          color="#fff2d8"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0004}
          shadow-camera-far={45}
          shadow-camera-left={-16}
          shadow-camera-right={16}
          shadow-camera-top={16}
          shadow-camera-bottom={-16}
        />
        {/* Fill + rim lights (cool to counter the warm key) */}
        <directionalLight position={[-10, 6, -4]} intensity={0.7} color="#8fb0ff" />
        <pointLight position={[-7, 3, -3]} intensity={1.8} color="#6a5cff" distance={28} />
        <pointLight position={[7, 2, -4]} intensity={1.8} color="#00e5ff" distance={28} />
        <pointLight position={[0, -1.5, 4]} intensity={0.6} color="#00e5ff" distance={16} />
        <spotLight
          position={[0, 10, 8]}
          intensity={1.4}
          angle={0.7}
          penumbra={0.8}
          color="#ffcf7a"
          distance={28}
          decay={1.5}
        />

        <Suspense fallback={null}>
          <CameraRig progressRef={progressRef} pointerRef={pointerRef}>
            <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.12}>
              <TinyHouse3D progressRef={progressRef} />
            </Float>
          </CameraRig>

          {/* Floating particles — halved counts; each Sparkles runs a
              custom shader, so fewer instances = fewer draw calls. */}
          <Sparkles
            count={40}
            size={2.4}
            speed={0.25}
            noise={0.7}
            scale={[18, 8, 18]}
            position={[0, 1.5, 0]}
            color="#00e5ff"
          />
          <Sparkles
            count={20}
            size={1.8}
            speed={0.15}
            noise={0.5}
            scale={[22, 4, 22]}
            position={[0, -1, 0]}
            color="#6a5cff"
          />

          {/* Tech grid ground */}
          <Grid
            position={[0, -3.0, 0]}
            args={[60, 60]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#2a3550"
            sectionSize={3}
            sectionThickness={1}
            sectionColor="#00e5ff"
            fadeDistance={30}
            fadeStrength={1.2}
            infiniteGrid
          />

          {/* `frames={60}` bakes the contact shadow over the first 60
              frames, then stops re-rendering it — huge win since this
              used to re-render a depth map every single frame. */}
          <ContactShadows
            position={[0, -2.9, 0]}
            opacity={0.6}
            scale={22}
            blur={3}
            far={6}
            color="#0a1020"
            frames={60}
          />

          <Environment preset="sunset" />

          {/* Lighter postprocessing: MEDIUM Bloom kernel, dropped the
              Noise pass (cheap but cumulative), reduced aberration. */}
          <EffectComposer multisampling={0}>
            <SMAA />
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.45}
              luminanceSmoothing={0.9}
              mipmapBlur
              kernelSize={KernelSize.MEDIUM}
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0002, 0.0003]}
            />
            <Vignette eskil={false} offset={0.3} darkness={0.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}

function CameraRig({ progressRef, pointerRef, children }) {
  const cam = useRef()
  const target = useRef(new THREE.Vector3(0, 0.2, 0))

  useFrame(() => {
    if (!cam.current) return
    const p = progressRef?.current ?? 0
    const px = pointerRef?.current?.x ?? 0
    const py = pointerRef?.current?.y ?? 0

    // Cinematic camera arc driven by scroll progress.
    const targetZ = 16 - p * 5.0
    const targetY = 1.8 + p * 3.0
    const pushX = px * 1.1
    const pushY = -py * 0.4

    cam.current.position.x += (pushX - cam.current.position.x) * 0.04
    cam.current.position.y += (targetY + pushY - cam.current.position.y) * 0.045
    cam.current.position.z += (targetZ - cam.current.position.z) * 0.045

    target.current.set(0, 0.2 + p * 0.9, 0)
    cam.current.lookAt(target.current)
  })

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={38} position={[0, 1.5, 13]} />
      {children}
    </>
  )
}
