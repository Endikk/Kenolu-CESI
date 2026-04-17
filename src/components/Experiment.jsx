import { Canvas } from '@react-three/fiber'
import {
  Environment,
  ContactShadows,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'
import TinyHouse3D from './TinyHouse3D'

/**
 * Standalone viewer. The TinyHouse sits on a white studio background;
 * user controls the camera with OrbitControls:
 *   - left-drag  → orbit (up/down/left/right)
 *   - wheel      → zoom in/out
 *   - right-drag → pan
 * A slider on the HUD also drives the explode-view progress (0 → 1).
 */
export default function Experiment() {
  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)

  const onProgressChange = (e) => {
    const v = Number(e.target.value)
    setProgress(v)
    progressRef.current = v
  }

  return (
    <div className="experiment">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <color attach="background" args={['#f4f4f2']} />

        {/* Positioned to see the porch + door side (front wall is at -Z). */}
        <PerspectiveCamera makeDefault fov={42} position={[10, 5, -10]} />

        <ambientLight intensity={1.1} />
        <hemisphereLight args={['#ffffff', '#c9c1b4', 1.0]} />
        <directionalLight
          position={[10, 16, 10]}
          intensity={2.6}
          color="#fff3de"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-camera-far={50}
          shadow-camera-left={-18}
          shadow-camera-right={18}
          shadow-camera-top={18}
          shadow-camera-bottom={-18}
        />
        <directionalLight position={[-10, 8, -4]} intensity={0.8} color="#cfe0ff" />
        <spotLight
          position={[-6, 10, 6]}
          intensity={0.8}
          angle={0.7}
          penumbra={1}
          color="#ffe4b8"
          distance={30}
          decay={1.5}
        />

        <Suspense fallback={null}>
          <TinyHouse3D progressRef={progressRef} disableAutoRotate />

          <ContactShadows
            position={[0, -2.9, 0]}
            opacity={0.55}
            scale={26}
            blur={2.6}
            far={6}
            color="#1a1410"
          />

          <Environment preset="studio" />
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          target={[0, -0.5, 0]}
          minDistance={5}
          maxDistance={40}
          makeDefault
        />
      </Canvas>

      <header className="experiment__hud-top">
        <a href="/" className="experiment__back" aria-label="Retour">
          ← Retour
        </a>
        <div className="experiment__title">
          <span className="experiment__brand">KENOLU</span>
          <span className="experiment__eyebrow">// EXPÉRIMENTATION — VUE 3D LIBRE</span>
        </div>
      </header>

      <aside className="experiment__hud-side">
        <div className="experiment__chip">
          <span className="experiment__chip-num">01</span>
          Clic-glisser → orbiter
        </div>
        <div className="experiment__chip">
          <span className="experiment__chip-num">02</span>
          Molette → zoom
        </div>
        <div className="experiment__chip">
          <span className="experiment__chip-num">03</span>
          Clic droit → translation
        </div>
      </aside>

      <footer className="experiment__hud-bottom">
        <label className="experiment__slider">
          <span className="experiment__slider-label">
            Vue éclatée
            <span className="experiment__slider-value">
              {Math.round(progress * 100)}%
            </span>
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={onProgressChange}
            style={{ '--p': progress }}
          />
        </label>
      </footer>
    </div>
  )
}
