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
      if (local < 0.2) setStage(0)
      else if (local < 0.45) setStage(1)
      else if (local < 0.7) setStage(2)
      else setStage(3)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const labels = [
    { num: '01', text: 'Structure acier-bois',            top: '8%',  left: '2%',  side: 'left',  stage: 0 },
    { num: '02', text: 'Toit photovoltaïque 1,2 kWc',     top: '18%', left: '68%', side: 'right', stage: 1 },
    { num: '03', text: 'Murs triple-isolés 180 mm',       top: '52%', left: '3%',  side: 'left',  stage: 1 },
    { num: '04', text: 'Récupération d’eau de pluie',     top: '62%', left: '72%', side: 'right', stage: 2 },
    { num: '05', text: 'Modules de vie déployables',      top: '88%', left: '30%', side: 'left',  stage: 2 },
    { num: '06', text: 'Batterie LiFePO₄ 10 kWh',         top: '95%', left: '62%', side: 'right', stage: 3 },
  ]

  return (
    <section className="pin-scene" ref={wrapRef}>
      <div className="pin-scene__sticky container">
        <div className="pin-scene__header">
          <div className="section__eyebrow" style={{ justifyContent: 'center' }}>
            <span>COUPE TECHNIQUE · VUE DÉPLOYÉE</span>
          </div>
          <h2 className="section__title" style={{ margin: '0 auto' }}>
            Déroulez pour <em>ouvrir la maison.</em>
          </h2>
        </div>

        <div className="pin-scene__labels">
          {labels.map((l) => (
            <div
              key={l.num}
              className={`reveal-label ${l.side === 'right' ? 'reveal-label--right' : ''} ${stage >= l.stage ? 'is-active' : ''}`}
              style={{ top: l.top, left: l.left }}
            >
              <span className="reveal-label__num">{l.num}</span>
              {l.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
