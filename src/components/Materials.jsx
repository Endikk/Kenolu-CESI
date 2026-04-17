import Reveal from './Reveal'

const materials = [
  { num: '001', name: 'Brushed black steel', desc: 'Secondary frame and surrounds — 85% recycled, anti-fingerprint finish.', tag: 'Structure' },
  { num: '002', name: 'Charred larch wood', desc: 'Exterior cladding treated with the Japanese Shou Sugi Ban technique — fireproof, maintenance-free.', tag: 'Cladding' },
  { num: '003', name: 'Anodised aluminium', desc: 'Joinery and profiles. Thermal break, satin RAL 9005 finish.', tag: 'Joinery' },
  { num: '004', name: 'Triple-glazed glass', desc: 'Ug = 0.5 W/m²K. Integrated solar control, g-value 0.35.', tag: 'Openings' },
  { num: '005', name: 'Dense wood-fibre wool', desc: '180 mm — R = 7 m²K/W. 12 h thermal lag, bio-sourced.', tag: 'Insulation' },
  { num: '006', name: 'Waxed graphite microconcrete', desc: 'Interior floor, 8 mm. Underfloor heating, calming, moisture-resistant.', tag: 'Floor' },
]

export default function Materials() {
  return (
    <section id="materials" className="section">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— MATERIALS</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          Few materials.<br />
          <em>Lots of care.</em>
        </Reveal>

        <Reveal className="section__kicker">
          <p>
            Six materials for the whole house. Each chosen for its
            durability, measured carbon footprint and graceful ageing.
            Zero PVC, zero toxic glue, fully European-traced.
          </p>
        </Reveal>

        <Reveal className="materials__list">
          {materials.map((m) => (
            <div key={m.num} className="material-row">
              <div className="material-row__num">/{m.num}</div>
              <div className="material-row__name">{m.name}</div>
              <div className="material-row__desc">{m.desc}</div>
              <div className="material-row__tag">{m.tag}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
