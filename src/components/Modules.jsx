import Reveal from './Reveal'

const modules = [
  {
    tag: 'MODULE 01',
    title: 'Salon / bureau',
    area: '7 m²',
    desc: "Un canapé-convertible en L, table rabattable, parois vitrées sol-plafond. Le module s'ouvre sur l'extérieur via une baie coulissante de 2,2 m.",
    items: [
      'Canapé modulaire 2 places',
      'Baie vitrée triple-vitrage 2,2 m',
      'Banquette-rangement intégrée',
      'Station de travail pivotante',
    ],
  },
  {
    tag: 'MODULE 02',
    title: 'Cuisine compacte',
    area: '4 m²',
    desc: "Plan de travail en inox brossé, plaque induction 2 feux alimentée par la batterie, évier mono-cuve et réfrigérateur 12V ultra-basse conso.",
    items: [
      'Plaque induction 2 zones',
      'Réfrigérateur 12V 90 L',
      'Hotte recyclage silencieuse',
      'Rangements magnétiques',
    ],
  },
  {
    tag: 'MODULE 03',
    title: 'Couchage en mezzanine',
    area: '6 m²',
    desc: "Plateforme suspendue accessible par échelle en acier noir. Matelas queen-size, velux panoramique sur le ciel, rangements muraux en bois noirci.",
    items: [
      'Lit queen 160 × 200',
      'Velux électrique sur toit',
      'Éclairage indirect LED 2700K',
      'Penderie escamotable',
    ],
  },
  {
    tag: 'MODULE 04',
    title: 'Salle d’eau',
    area: '3 m²',
    desc: "Douche à l'italienne avec paroi verre, toilettes sèches sans eau, lavabo céramique noir. Ventilation à récupération de chaleur.",
    items: [
      'Douche italienne 90 × 90',
      'Toilettes sèches (zéro eau)',
      'VMC double-flux',
      'Chauffe-eau solaire 80 L',
    ],
  },
]

export default function Modules() {
  return (
    <section id="modules" className="section">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— MODULES DE VIE</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          Quatre modules.<br />
          <em>Une vie entière.</em>
        </Reveal>

        <Reveal className="section__kicker">
          <p>
            Chaque mètre carré a été étudié pour remplir plusieurs fonctions.
            L’espace se réorganise selon l’heure : bureau le matin, salon le soir,
            chambre la nuit. Même la salle d’eau disparaît derrière un panneau pivotant.
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
