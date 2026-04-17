import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

import Nav from './components/Nav'
import Scene from './components/Scene'
import Hero from './components/Hero'
import PinScene from './components/PinScene'
import Concept from './components/Concept'
import Specs from './components/Specs'
import Modules from './components/Modules'
import OffGrid from './components/OffGrid'
import Materials from './components/Materials'
import Cost from './components/Cost'
import Team from './components/Team'
import CTA from './components/CTA'

export default function App() {
  // Shared scroll-progress ref read by the R3F scene.
  const progressRef = useRef(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let raf = 0
    const loop = (time) => {
      lenis.raf(time)
      // Update shared progress from window scroll.
      const max = document.documentElement.scrollHeight - window.innerHeight
      progressRef.current = max > 0 ? window.scrollY / max : 0
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const loaderTimer = setTimeout(() => setLoaded(true), 900)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      clearTimeout(loaderTimer)
    }
  }, [])

  // Cursor-tracking glow on .card elements.
  useEffect(() => {
    const handler = (e) => {
      const card = e.target.closest('.card')
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      card.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }
    document.addEventListener('mousemove', handler)
    return () => document.removeEventListener('mousemove', handler)
  }, [])

  return (
    <>
      <div className={`loader ${loaded ? 'is-done' : ''}`}>
        <div className="loader__logo">KENOLU</div>
        <div className="loader__bar" />
        <div className="loader__text">Calibration des systèmes…</div>
      </div>

      <div className="grid-overlay" aria-hidden />
      <Scene progressRef={progressRef} />

      <div className="app">
        <Nav />
        <Hero />
        <PinScene />
        <Concept />
        <Specs />
        <Modules />
        <OffGrid />
        <Materials />
        <Cost />
        <Team />
        <CTA />
      </div>

      <div className="noise-overlay" aria-hidden />
    </>
  )
}
