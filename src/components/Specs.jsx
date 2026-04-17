import Reveal from './Reveal'
import CountUp from './CountUp'

const specs = [
  { label: 'Living area', value: 28, decimals: 0, unit: 'm²' },
  { label: 'Length', value: 7.2, decimals: 1, unit: 'm' },
  { label: 'Width', value: 2.5, decimals: 1, unit: 'm' },
  { label: 'Height', value: 3.8, decimals: 1, unit: 'm' },
  { label: 'GVWR', value: 3.5, decimals: 1, unit: 'T' },
  { label: 'Capacity', raw: '1+1', unit: 'person/dog' },
  { label: 'R-value', value: 7, decimals: 0, unit: 'm²K/W' },
  { label: 'Autonomy', value: 100, decimals: 0, unit: '%' },
]

export default function Specs() {
  return (
    <section id="specs" className="section">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— SPECIFICATIONS</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          Dimensions<br />
          <em>measured</em> to the millimetre.
        </Reveal>

        <Reveal className="section__kicker">
          <p>
            Designed to travel European roads without a special convoy.
            The galvanised tandem chassis and lightweight Sigma steel frame
            guarantee rigidity and safety at 110&nbsp;km/h.
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
