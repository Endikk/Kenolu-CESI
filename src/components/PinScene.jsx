import { useEffect, useRef, useState } from 'react'

/**
 * A tall section that "pins" the 3D canvas in place while user scrolls.
 * Shows staggered labels that fade in at specific scroll thresholds.
 */
export default function PinScene() {
  const wrapRef = useRef(null)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const local = Math.min(Math.max(-rect.top / Math.max(total, 1), 0), 1)
      // Six evenly spaced thresholds — one stage per label so the
      // reveal progresses smoothly across the whole pin section.
      setStage(Math.min(5, Math.floor(local * 6)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Simple vertical list — each label reveals on its own stage, alternating
  // left/right. No absolute positioning, so no overlap is possible.
  const labels = [
    { num: '01', text: 'Steel-and-wood structure',         side: 'left',  stage: 0 },
    { num: '02', text: '1.2 kWp photovoltaic roof',        side: 'right', stage: 1 },
    { num: '03', text: 'Triple-insulated walls · 180 mm',  side: 'left',  stage: 2 },
    { num: '04', text: 'Rainwater harvesting system',      side: 'right', stage: 3 },
    { num: '05', text: 'Deployable living modules',        side: 'left',  stage: 4 },
    { num: '06', text: '10 kWh LiFePO₄ battery',           side: 'right', stage: 5 },
  ]

  return (
    <section className="pin-scene" ref={wrapRef}>
      <div className="pin-scene__sticky container">
        <div className="pin-scene__header">
          <div className="section__eyebrow" style={{ justifyContent: 'center' }}>
            <span>TECHNICAL CROSS-SECTION · EXPLODED VIEW</span>
          </div>
          <h2 className="section__title" style={{ margin: '0 auto' }}>
            Scroll to <em>open the house.</em>
          </h2>
        </div>

        <ul className="pin-scene__labels">
          {labels.map((l) => (
            <li
              key={l.num}
              className={`reveal-label ${l.side === 'right' ? 'reveal-label--right' : ''} ${stage >= l.stage ? 'is-active' : ''}`}
            >
              <span className="reveal-label__num">{l.num}</span>
              {l.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
