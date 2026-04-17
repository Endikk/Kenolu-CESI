import Reveal from './Reveal'
import MagneticButton from './MagneticButton'

const TITLE = 'KENOLU'

export default function Hero() {
  return (
    <section id="top" className="section section--hero">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>ÉDITION 01 — 2026 · LYON, FR</span>
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
              Une tiny house <em style={{ color: 'var(--led)', fontStyle: 'normal' }}>autonome</em>, pensée
              pour 1 personne <span>&amp; son compagnon — 28&nbsp;m² d’ingénierie
              silencieuse, posée où vous voulez.</span>
            </p>
            <div style={{ marginTop: 28 }}>
              <MagneticButton href="#concept">Découvrir le manifeste</MagneticButton>
            </div>
          </Reveal>

          <Reveal className="hero__meta" stagger>
            <div className="hero__meta-item">
              <div className="hero__meta-label">Surface</div>
              <div className="hero__meta-value">28&nbsp;m²</div>
            </div>
            <div className="hero__meta-item">
              <div className="hero__meta-label">Autonomie</div>
              <div className="hero__meta-value">100%</div>
            </div>
            <div className="hero__meta-item">
              <div className="hero__meta-label">Mobilité</div>
              <div className="hero__meta-value">4 roues</div>
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
