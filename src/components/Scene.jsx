import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import TinyHouse3D from './TinyHouse3D'

/** Fixed full-viewport R3F canvas. Reads a ref that holds scroll progress 0→1. */
export default function Scene({ progressRef }) {
  return (
    <div className="scene-canvas">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 1.5, 12], fov: 38 }}
      >
        <color attach="background" args={['#05050a']} />
        <fog attach="fog" args={['#05050a', 16, 36]} />

        {/* Lighting rig */}
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[6, 8, 5]}
          intensity={0.9}
          color="#eaf4ff"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-far={25}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-6, 2, -3]} intensity={1.2} color="#6a5cff" distance={20} />
        <pointLight position={[6, 1.5, -4]} intensity={1.4} color="#00e5ff" distance={20} />
        <pointLight position={[0, -2, 3]} intensity={0.5} color="#00e5ff" distance={10} />

        <Suspense fallback={null}>
          <CameraRig progressRef={progressRef}>
            <TinyHouse3D progressRef={progressRef} />
          </CameraRig>

          <ContactShadows
            position={[0, -2.2, 0]}
            opacity={0.55}
            scale={18}
            blur={3.2}
            far={5}
            color="#00e5ff"
          />

          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  )
}

function CameraRig({ progressRef, children }) {
  const cam = useRef()

  useFrame((state) => {
    if (!cam.current) return
    const p = progressRef?.current ?? 0
    const targetZ = 13 - p * 4
    const targetY = 1.2 + p * 2.2
    const mouseX = (state.mouse.x || 0) * 0.6
    const mouseY = (state.mouse.y || 0) * 0.3
    cam.current.position.x += (mouseX - cam.current.position.x) * 0.03
    cam.current.position.y += (targetY + mouseY - cam.current.position.y) * 0.04
    cam.current.position.z += (targetZ - cam.current.position.z) * 0.04
    cam.current.lookAt(0, 0.2 + p * 0.6, 0)
  })

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={38} position={[0, 1.5, 13]} />
      {children}
    </>
  )
}
