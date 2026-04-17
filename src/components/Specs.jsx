import Reveal from './Reveal'
import CountUp from './CountUp'

const specs = [
  { label: 'Surface habitable', value: 28, decimals: 0, unit: 'm²' },
  { label: 'Longueur', value: 7.2, decimals: 1, unit: 'm' },
  { label: 'Largeur', value: 2.5, decimals: 1, unit: 'm' },
  { label: 'Hauteur', value: 3.8, decimals: 1, unit: 'm' },
  { label: 'PTAC', value: 3.5, decimals: 1, unit: 'T' },
  { label: 'Capacité', raw: '1+1', unit: 'pers./chien' },
  { label: 'Isolation R', value: 7, decimals: 0, unit: 'm²K/W' },
  { label: 'Autonomie', value: 100, decimals: 0, unit: '%' },
]

export default function Specs() {
  return (
    <section id="specs" className="section">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— SPÉCIFICATIONS</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          Dimensions<br />
          <em>mesurées</em> au millimètre.
        </Reveal>

        <Reveal className="section__kicker">
          <p>
            Pensée pour circuler sur route européenne sans convoi spécial.
            Le châssis tandem galvanisé et la structure en acier léger Sigma garantissent
            rigidité et sécurité à 110&nbsp;km/h.
          </p>
        </Reveal>

        <Reveal className="specs__row" stagger>
          {specs.slice(0, 4).map((s) => (
            <div key={s.label} className="specs__cell">
              <div className="specs__label">{s.label}</div>
              <div className="specs__value">
                {s.raw ? s.raw : <CountUp to={s.value} decimals={s.decimals} />}
                <span className="specs__value-unit">{s.unit}</span>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal className="specs__row" stagger style={{ borderTop: 'none', marginTop: 0 }}>
          {specs.slice(4).map((s) => (
            <div key={s.label} className="specs__cell">
              <div className="specs__label">{s.label}</div>
              <div className="specs__value">
                {s.raw ? s.raw : <CountUp to={s.value} decimals={s.decimals} />}
                <span className="specs__value-unit">{s.unit}</span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
