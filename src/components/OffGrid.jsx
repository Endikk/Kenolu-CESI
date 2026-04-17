import Reveal from './Reveal'

const SolarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

const WaterIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z" />
  </svg>
)

const BatteryIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="16" height="10" rx="2" />
    <path d="M22 11v2" />
    <path d="M7 10l3 4h-4l3 4" fill="currentColor" />
  </svg>
)

const systems = [
  {
    icon: <SolarIcon />,
    title: '1.2 kWp photovoltaic',
    desc: "Six high-efficiency monocrystalline panels integrated into the roof. Estimated annual yield of 1,400 kWh — comfortably enough for one person.",
    stats: [
      ['Peak power', '1.2 kWp'],
      ['Active area', '6.8 m²'],
    ],
  },
  {
    icon: <WaterIcon />,
    title: 'Rainwater harvesting',
    desc: "The roof collects rainwater into a 300 L tank. UV filtration plus reverse osmosis delivers drinking water that meets European standards.",
    stats: [
      ['Main tank', '300 L'],
      ['Filtration', 'UV + RO'],
    ],
  },
  {
    icon: <BatteryIcon />,
    title: '10 kWh LiFePO₄ battery',
    desc: "A long-life lithium-iron-phosphate pack (>6,000 cycles) powers the whole house. Five days of autonomy without sun.",
    stats: [
      ['Capacity', '10 kWh'],
      ['Autonomy', '~5 days'],
    ],
  },
]

export default function OffGrid() {
  return (
    <section id="offgrid" className="section offgrid">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— OFF-GRID SYSTEMS</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          100% autonomous.<br />
          <em>0% compromise.</em>
        </Reveal>

        <Reveal className="section__kicker">
          <p>
            Kenolu produces, stores and regenerates every resource it needs.
            No hookup required: drop it at the edge of a forest, in the
            mountains, or facing the sea — it runs from day one.
          </p>
        </Reveal>

        <Reveal className="offgrid__grid reveal-stagger" stagger>
          {systems.map((s) => (
            <article key={s.title} className="system-card">
              <div className="system-card__icon">{s.icon}</div>
              <h3 className="system-card__title">{s.title}</h3>
              <p className="system-card__desc">{s.desc}</p>
              {s.stats.map(([k, v]) => (
                <div key={k} className="system-card__stat">
                  <span>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
