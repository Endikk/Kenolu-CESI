import Reveal from './Reveal'

/** Top-down schematic of Kenolu — dimensions in centimetres. */
export default function Plan() {
  return (
    <section id="plan" className="section plan">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— PLAN TECHNIQUE · VUE DU DESSUS</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          La coupe,<br />
          <em>à l’échelle.</em>
        </Reveal>

        <Reveal className="section__kicker">
          <p>
            Un plan orthographique exact (échelle 1:50) des 7,2 × 2,5 m habitables.
            Quatre zones fonctionnelles se succèdent sans cloisons superflues — la
            lumière traverse la maison de part en part.
          </p>
        </Reveal>

        <Reveal className="plan__wrap">
          <span className="plan__coord">45°44'31"N · 4°50'58"E</span>

          <svg
            className="plan__svg"
            viewBox="0 0 720 280"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Plan schématique de la tiny house Kenolu"
          >
            <defs>
              <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </pattern>
              <linearGradient id="bedGlow" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="rgba(106,92,255,0.15)" />
                <stop offset="1" stopColor="rgba(106,92,255,0.03)" />
              </linearGradient>
              <linearGradient id="kitchenGlow" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="rgba(0,229,255,0.15)" />
                <stop offset="1" stopColor="rgba(0,229,255,0.03)" />
              </linearGradient>
            </defs>

            {/* Background hatch */}
            <rect x="0" y="0" width="720" height="280" fill="url(#hatch)" />

            {/* Outer walls */}
            <rect x="30" y="40" width="660" height="200" className="plan-room" rx="2" />

            {/* Kitchen */}
            <rect x="40" y="50" width="180" height="180" className="plan-room" rx="1" fill="url(#kitchenGlow)" />
            <text x="130" y="140" textAnchor="middle" className="plan-label">CUISINE</text>
            <text x="130" y="160" textAnchor="middle" className="plan-label" style={{ fontSize: 9, fill: 'var(--text-muted)' }}>4 m²</text>

            {/* Salon / bureau */}
            <rect x="220" y="50" width="220" height="180" className="plan-room" rx="1" />
            <text x="330" y="130" textAnchor="middle" className="plan-label">SALON / BUREAU</text>
            <text x="330" y="150" textAnchor="middle" className="plan-label" style={{ fontSize: 9, fill: 'var(--text-muted)' }}>7 m²</text>

            {/* Bed platform under mezzanine */}
            <rect x="440" y="50" width="240" height="180" className="plan-room" rx="1" fill="url(#bedGlow)" />
            <text x="560" y="130" textAnchor="middle" className="plan-label">COUCHAGE</text>
            <text x="560" y="150" textAnchor="middle" className="plan-label" style={{ fontSize: 9, fill: 'var(--text-muted)' }}>6 m²</text>

            {/* Bathroom */}
            <rect x="320" y="140" width="120" height="90" className="plan-room plan-room--accent" rx="1" />
            <text x="380" y="185" textAnchor="middle" className="plan-label">SDB</text>
            <text x="380" y="200" textAnchor="middle" className="plan-label" style={{ fontSize: 9, fill: 'var(--text-muted)' }}>3 m²</text>

            {/* Walls (bold) */}
            <rect x="30" y="40" width="660" height="200" className="plan-wall" />

            {/* Door */}
            <path d="M 620 40 A 40 40 0 0 1 660 80" className="plan-dim" />
            <rect x="619" y="38" width="42" height="4" fill="#c8cdd4" />

            {/* Window slit long side */}
            <line x1="70" y1="40" x2="260" y2="40" stroke="#00e5ff" strokeWidth="3" opacity="0.7" />
            <line x1="320" y1="40" x2="480" y2="40" stroke="#00e5ff" strokeWidth="3" opacity="0.7" />

            {/* Dimensions */}
            <line x1="30" y1="262" x2="690" y2="262" className="plan-dim" />
            <text x="360" y="276" textAnchor="middle" className="plan-dim-text">720 cm</text>

            <line x1="706" y1="40" x2="706" y2="240" className="plan-dim" />
            <text x="706" y="144" className="plan-dim-text" textAnchor="middle" transform="rotate(90 706 144)">250 cm</text>

            {/* North arrow */}
            <g transform="translate(680, 20)">
              <circle cx="0" cy="0" r="10" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
              <path d="M 0 -7 L 3 3 L 0 1 L -3 3 Z" fill="#00e5ff" />
              <text x="0" y="-14" textAnchor="middle" className="plan-dim-text" style={{ fontSize: 9 }}>N</text>
            </g>

            {/* Cuisine fixtures */}
            <rect x="50" y="60" width="160" height="28" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.4" />
            <circle cx="90" cy="74" r="6" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
            <circle cx="130" cy="74" r="6" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
            <rect x="160" y="66" width="40" height="16" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />

            {/* Bed rectangle */}
            <rect x="460" y="70" width="200" height="140" fill="none" stroke="#6a5cff" strokeWidth="1" opacity="0.5" rx="3" />
            <text x="560" y="220" textAnchor="middle" className="plan-dim-text" style={{ fill: '#6a5cff' }}>160 × 200</text>

            {/* Sofa */}
            <rect x="240" y="180" width="170" height="40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" rx="3" />

            {/* SDB fixtures */}
            <rect x="330" y="150" width="40" height="40" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.5" rx="2" />
            <circle cx="410" cy="170" r="10" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
          </svg>

          <div className="plan__legend">
            <div className="plan__legend-item">
              <span className="plan__legend-swatch" style={{ background: 'rgba(0,229,255,0.2)' }} />
              Cuisine · 4 m²
            </div>
            <div className="plan__legend-item">
              <span className="plan__legend-swatch" style={{ background: 'transparent' }} />
              Salon / bureau · 7 m²
            </div>
            <div className="plan__legend-item">
              <span className="plan__legend-swatch" style={{ background: 'rgba(106,92,255,0.2)' }} />
              Couchage · 6 m²
            </div>
            <div className="plan__legend-item">
              <span className="plan__legend-swatch" style={{ background: 'rgba(0,229,255,0.08)', borderColor: 'var(--led)' }} />
              Salle d’eau · 3 m²
            </div>
            <div className="plan__legend-item">
              <span className="plan__legend-swatch" style={{ background: 'transparent', borderStyle: 'dashed', borderColor: 'var(--led)' }} />
              Cotes (cm)
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
