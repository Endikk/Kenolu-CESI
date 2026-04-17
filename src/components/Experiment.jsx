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

/** Extract the 11-character YouTube video ID from any common URL form
    (or pass through if the user already pasted a bare ID). Returns null
    when nothing valid is found. */
function parseYouTubeId(raw) {
  if (!raw) return null
  const url = raw.trim()
  const patterns = [
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url
  return null
}

/**
 * Standalone viewer. The TinyHouse sits on a white studio background;
 * user controls the camera with OrbitControls:
 *   - left-drag  → orbit (up/down/left/right)
 *   - wheel      → zoom in/out
 *   - right-drag → pan
 * A slider on the HUD also drives the explode-view progress (0 → 1).
 * A URL input lets the user cast any YouTube video onto the 3D TV screen.
 */
export default function Experiment() {
  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoId, setVideoId] = useState(null)
  const [videoError, setVideoError] = useState(false)

  const onProgressChange = (e) => {
    const v = Number(e.target.value)
    setProgress(v)
    progressRef.current = v
  }

  const onSubmitVideo = (e) => {
    e.preventDefault()
    const id = parseYouTubeId(videoUrl)
    if (id) {
      setVideoId(id)
      setVideoError(false)
    } else {
      setVideoError(true)
    }
  }

  const onStopVideo = () => {
    setVideoId(null)
    setVideoUrl('')
    setVideoError(false)
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
          <TinyHouse3D
            progressRef={progressRef}
            disableAutoRotate
            videoId={videoId}
          />

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
        <a
          href={import.meta.env.BASE_URL}
          className="experiment__back"
          aria-label="Back"
        >
          ← Back
        </a>
        <div className="experiment__title">
          <span className="experiment__brand">KENOLU</span>
          <span className="experiment__eyebrow">// EXPERIMENT — FREE 3D VIEW</span>
        </div>
      </header>

      <aside className="experiment__hud-side">
        <div className="experiment__chip">
          <span className="experiment__chip-num">01</span>
          Click-drag → orbit
        </div>
        <div className="experiment__chip">
          <span className="experiment__chip-num">02</span>
          Wheel → zoom
        </div>
        <div className="experiment__chip">
          <span className="experiment__chip-num">03</span>
          Right-click → pan
        </div>
      </aside>

      {/* URL form pinned to the right edge. The pasted YouTube URL is
          parsed to an 11-char video ID and the video plays ONLY on the
          3D TV screen inside the tiny house — no modal, no overlay. */}
      <aside className="experiment__hud-right">
        <form
          className="experiment__video-form"
          onSubmit={onSubmitVideo}
        >
          <div className="experiment__video-head">
            <span className="experiment__video-dot" aria-hidden />
            <span className="experiment__video-title">BUILT-IN TV</span>
          </div>
          <label className="experiment__video-field">
            <span>YouTube URL</span>
            <input
              type="text"
              inputMode="url"
              placeholder="https://youtu.be/…"
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value)
                if (videoError) setVideoError(false)
              }}
            />
          </label>
          {videoError && (
            <span className="experiment__video-error">
              Invalid URL. Paste a YouTube link.
            </span>
          )}
          <div className="experiment__video-actions">
            <button type="submit" className="experiment__video-play-btn">
              ▶ Play
            </button>
            {videoId && (
              <button
                type="button"
                className="experiment__video-stop-btn"
                onClick={onStopVideo}
              >
                ■ Stop
              </button>
            )}
          </div>
          {videoId && (
            <span className="experiment__video-status">
              Playing on the TV · ID {videoId}
            </span>
          )}
        </form>
      </aside>

      <footer className="experiment__hud-bottom">
        <label className="experiment__slider">
          <span className="experiment__slider-label">
            Exploded view
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
