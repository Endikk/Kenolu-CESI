import Reveal from './Reveal'
import MagneticButton from './MagneticButton'

const TITLE = 'KENOLU'

export default function Hero() {
  return (
    <section id="top" className="section section--hero">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>EDITION 01 — 2026 · ROUEN, FR</span>
        </Reveal>

        <div className="hero__title-row">
          <h1 className="hero__title">
            <span className="hero__title-wrap" aria-label={TITLE}>
              {TITLE.split('').map((ch, i) => (
                <span key={i} className="char" style={{ '--i': i }}>{ch}</span>
              ))}
            </span>
          </h1>
          <Reveal className="hero__tagline">
            OFF-GRID · MOBILE · MINIMAL
          </Reveal>
        </div>

        <div className="hero__grid">
          <Reveal className="hero__lead">
            <p>
              A <em style={{ color: 'var(--led)', fontStyle: 'normal' }}>self-sufficient</em> tiny house, designed
              for 1 person <span>&amp; their companion — 28&nbsp;m² of silent
              engineering, dropped wherever you want.</span>
            </p>
            <div style={{ marginTop: 28 }}>
              <MagneticButton href="#concept">Read the manifesto</MagneticButton>
            </div>
          </Reveal>

          <Reveal className="hero__meta" stagger>
            <div className="hero__meta-item">
              <div className="hero__meta-label">Area</div>
              <div className="hero__meta-value">28&nbsp;m²</div>
            </div>
            <div className="hero__meta-item">
              <div className="hero__meta-label">Autonomy</div>
              <div className="hero__meta-value">100%</div>
            </div>
            <div className="hero__meta-item">
              <div className="hero__meta-label">Mobility</div>
              <div className="hero__meta-value">4 wheels</div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="hero__scroll">
        <span>scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}
