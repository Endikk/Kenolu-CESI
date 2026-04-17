import Reveal from './Reveal'

const pillars = [
  {
    num: '01 / MANIFESTO',
    title: 'Less, but better.',
    desc: "28 m² that answer every daily gesture. Nothing superfluous, nothing missing. A dense-less shelter where every cubic centimetre has intent."
  },
  {
    num: '02 / AUTONOMY',
    title: 'Live off-grid, no compromise.',
    desc: "Solar, rainwater, LiFePO₄ battery, biomass heating. Kenolu depends on nothing. You pick the landscape — it handles the rest."
  },
  {
    num: '03 / MOVEMENT',
    title: 'Mobile, discreet, ready to leave.',
    desc: "On a road-legal 3.5 T chassis, Kenolu tows with an SUV. It sleeps in the Alps and wakes up facing the ocean."
  },
]

export default function Concept() {
  return (
    <section id="concept" className="section concept">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— CONCEPT</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          A home <em>crafted</em><br />for a cleared life.
        </Reveal>

        <Reveal>
          <p className="concept__quote">
            “Build small,<br />
            <em>live large</em>.”
          </p>
        </Reveal>

        <Reveal className="concept__grid" stagger>
          {pillars.map((p) => (
            <article key={p.num} className="card">
              <div className="card__num">{p.num}</div>
              <h3 className="card__title">{p.title}</h3>
              <p className="card__desc">{p.desc}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
