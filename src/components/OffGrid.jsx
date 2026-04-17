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
    title: 'Photovoltaïque 1,2 kWc',
    desc: "Six panneaux monocristallins haut rendement intégrés au toit. Production annuelle estimée à 1 400 kWh — largement suffisant pour une personne.",
    stats: [
      ['Puissance crête', '1,2 kWc'],
      ['Surface active', '6,8 m²'],
    ],
  },
  {
    icon: <WaterIcon />,
    title: 'Récupération d’eau',
    desc: "La toiture collecte l’eau de pluie dans une cuve de 300 L. Une filtration UV + osmose inverse produit une eau potable aux standards européens.",
    stats: [
      ['Cuve principale', '300 L'],
      ['Filtration', 'UV + RO'],
    ],
  },
  {
    icon: <BatteryIcon />,
    title: 'Batterie LiFePO₄ 10 kWh',
    desc: "Un pack lithium-fer-phosphate longue durée (>6 000 cycles) alimente l’ensemble de la maison. Autonomie 5 jours sans soleil.",
    stats: [
      ['Capacité', '10 kWh'],
      ['Autonomie', '~5 jours'],
    ],
  },
]

export default function OffGrid() {
  return (
    <section id="offgrid" className="section offgrid">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— SYSTÈMES OFF-GRID</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          100% autonome.<br />
          <em>0% compromis.</em>
        </Reveal>

        <Reveal className="section__kicker">
          <p>
            Kenolu produit, stocke et régénère toutes ses ressources. Aucun raccordement
            nécessaire : posez-la en bord de forêt, en montagne ou face à la mer, elle
            fonctionne dès le premier jour.
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
