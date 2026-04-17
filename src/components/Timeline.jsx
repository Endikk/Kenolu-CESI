import Reveal from './Reveal'

const phases = [
  { week: 'Week 01–02', title: 'Studies & plans', desc: '3D design, technical drawings, load calculations, regulatory validation of the 3.5 T road-certified chassis.', meta: ['80 h', 'CAD · BIM'] },
  { week: 'Week 03', title: 'Chassis & structure', desc: 'Galvanised chassis received, Sigma profiles welded, two-component anti-corrosion treatment applied.', meta: ['60 h', 'S355 steel'] },
  { week: 'Week 04–05', title: 'Timber frame', desc: 'CLT wall panels assembled, rain barrier membrane fitted, flat frame prepared to host the solar array.', meta: ['120 h', 'PEFC spruce'] },
  { week: 'Week 06', title: 'Insulation & envelope', desc: 'Dense wood-fibre wool blown at 180 mm, interior vapour brake, weathertight envelope.', meta: ['70 h', 'R = 7'] },
  { week: 'Week 07', title: 'Joinery & cladding', desc: 'Triple-glazed bays, Shou Sugi Ban larch cladding, neutral-silicone seals.', meta: ['85 h', 'Ug = 0.5'] },
  { week: 'Week 08–09', title: 'Off-grid systems', desc: 'Photovoltaic panels, hybrid inverter, LiFePO₄ battery, rainwater plumbing, dual-flow HRV.', meta: ['110 h', '1.2 kWp'] },
  { week: 'Week 10', title: 'Interior fit-out', desc: 'Custom kitchen, bathroom, mezzanine, integrated furniture in larch + blackened steel.', meta: ['95 h', 'Bespoke'] },
  { week: 'Week 11', title: 'Delivery & commissioning', desc: '128-point quality check, 72 h autonomy test, delivery to the chosen site, 1-month hand-over support.', meta: ['20 h', 'Turnkey'] },
]

export default function Timeline() {
  return (
    <section id="timeline" className="section timeline">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— PRODUCTION · 11 WEEKS</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          From blank page<br />
          <em>to key in the door.</em>
        </Reveal>

        <Reveal className="section__kicker">
          <p>
            The typical Kenolu schedule, from first sketch to delivery.
            Entirely built in a sheltered workshop — zero weather
            dependency, 128-point QC before departure.
          </p>
        </Reveal>

        <Reveal className="timeline__track">
          {phases.map((p) => (
            <div key={p.week} className="timeline__item">
              <div className="timeline__week">{p.week}</div>
              <div className="timeline__title">{p.title}</div>
              <div className="timeline__desc">{p.desc}</div>
              <div className="timeline__meta">
                {p.meta.map((m) => (<span key={m}>{m}</span>))}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
