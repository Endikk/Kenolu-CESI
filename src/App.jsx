import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

import Nav from './components/Nav'
import Scene from './components/Scene'
import ScrollProgress from './components/ScrollProgress'
import StatusBadge from './components/StatusBadge'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import PinScene from './components/PinScene'
import Concept from './components/Concept'
import Specs from './components/Specs'
import Plan from './components/Plan'
import Modules from './components/Modules'
import OffGrid from './components/OffGrid'
import Materials from './components/Materials'
import Advantages from './components/Advantages'
import Timeline from './components/Timeline'
import Cost from './components/Cost'
import Team from './components/Team'
import CTA from './components/CTA'

export default function App() {
  const progressRef = useRef(0)
  const [loaded, setLoaded] = useState(false)

  // Smooth-scroll + shared progress ref — StrictMode-safe.
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    })

    let raf = 0
    let cancelled = false

    const loop = (time) => {
      if (cancelled) return
      lenis.raf(time)
      const max = document.documentElement.scrollHeight - window.innerHeight
      progressRef.current = max > 0 ? window.scrollY / max : 0
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  // Dismiss the loader after first mount.
  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 1100)
    return () => clearTimeout(id)
  }, [])

  // Card hover spotlight tracks the cursor.
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

      <ScrollProgress />
      <StatusBadge />

      <div className="grid-overlay" aria-hidden />
      <Scene progressRef={progressRef} />

      <div className="app">
        <Nav />
        <Hero />
        <Marquee />
        <PinScene />
        <Concept />
        <Specs />
        <Plan />
        <Modules />
        <OffGrid />
        <Materials />
        <Advantages />
        <Timeline />
        <Cost />
        <Team />
        <CTA />
      </div>

      <div className="noise-overlay" aria-hidden />
    </>
  )
}
