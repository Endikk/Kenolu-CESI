import Reveal from './Reveal'

const modules = [
  {
    tag: 'MODULE 01',
    title: 'Living / desk',
    area: '7 m²',
    desc: "An L-shaped convertible sofa, a fold-down table, floor-to-ceiling glass. The module opens onto the outside via a 2.2 m sliding bay window.",
    items: [
      '2-seater modular sofa',
      '2.2 m triple-glazed bay window',
      'Built-in storage bench',
      'Pivoting workstation',
    ],
  },
  {
    tag: 'MODULE 02',
    title: 'Compact kitchen',
    area: '4 m²',
    desc: "Brushed-stainless worktop, 2-burner induction hob powered by the battery, single-bowl sink and an ultra-low-consumption 12V fridge.",
    items: [
      '2-zone induction hob',
      '90 L · 12V fridge',
      'Silent recirculating hood',
      'Magnetic storage rails',
    ],
  },
  {
    tag: 'MODULE 03',
    title: 'Mezzanine bed',
    area: '6 m²',
    desc: "Suspended platform reached by a black-steel ladder. Queen-size mattress, panoramic roof skylight and blackened-wood wall storage.",
    items: [
      'Queen bed · 160 × 200',
      'Electric rooftop skylight',
      'Indirect 2700K LED lighting',
      'Retractable wardrobe',
    ],
  },
  {
    tag: 'MODULE 04',
    title: 'Bathroom',
    area: '3 m²',
    desc: "Walk-in shower with a glass panel, waterless dry toilet, black ceramic basin. Heat-recovery ventilation keeps everything dry and warm.",
    items: [
      '90 × 90 walk-in shower',
      'Dry toilet (zero water)',
      'Dual-flow heat-recovery vent',
      '80 L solar water heater',
    ],
  },
]

export default function Modules() {
  return (
    <section id="modules" className="section">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— LIVING MODULES</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          Four modules.<br />
          <em>A whole life.</em>
        </Reveal>

        <Reveal className="section__kicker">
          <p>
            Every square metre pulls multiple duties. The space reshuffles
            with the hour — desk in the morning, living room at night,
            bedroom later. Even the bathroom disappears behind a pivoting
            panel.
          </p>
        </Reveal>

        <Reveal className="modules__grid reveal-stagger" stagger>
          {modules.map((m) => (
            <article key={m.tag} className="module-card">
              <div className="module-card__header">
                <span className="module-card__tag">{m.tag}</span>
                <span className="module-card__area">{m.area}</span>
              </div>
              <h3 className="module-card__title">{m.title}</h3>
              <p className="module-card__desc">{m.desc}</p>
              <ul className="module-card__list">
                {m.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <div className="module-card__glow" aria-hidden />
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
