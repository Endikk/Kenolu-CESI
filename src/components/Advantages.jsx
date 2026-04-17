import Reveal from './Reveal'

const Icon = ({ d }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const advantages = [
  {
    icon: 'M3 21h18 M5 21V8l7-5 7 5v13 M9 12h6 M9 16h6',
    title: 'Libre partout, propriétaire nulle part',
    desc: 'Le statut de résidence mobile contourne les contraintes de permis de construire. Kenolu s’installe en zone agricole, loisirs, ou sur terrain privé.',
  },
  {
    icon: 'M12 2v6 M12 22v-6 M4.93 4.93l4.24 4.24 M14.83 14.83l4.24 4.24 M2 12h6 M16 12h6 M4.93 19.07l4.24-4.24 M14.83 9.17l4.24-4.24',
    title: 'Zéro facture d’énergie',
    desc: 'La production photovoltaïque + batterie LiFePO₄ couvre 100 % des besoins annuels. Aucun abonnement, aucune coupure possible.',
  },
  {
    icon: 'M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z',
    title: 'Eau potable depuis le ciel',
    desc: 'Une cuve 300 L + filtration UV + osmose produit une eau conforme aux standards européens directement depuis la toiture.',
  },
  {
    icon: 'M20 10V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3 M14 12h6 M20 12l-3-3 M20 12l-3 3',
    title: 'Construite en 11 semaines',
    desc: 'Fabrication en atelier, hors-site, livraison prête à habiter. Aucune nuisance de chantier, aucune dépendance météo.',
  },
  {
    icon: 'M3 12h18 M3 6h18 M3 18h18',
    title: 'Empreinte carbone divisée par 4',
    desc: 'Vs un logement traditionnel équivalent. Matériaux biosourcés, faible consommation, recyclabilité à 85 % en fin de vie.',
  },
  {
    icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
    title: 'Revente & mobilité garanties',
    desc: 'Homologuée route 3,5 T, Kenolu se revend ou se tracte partout en Europe. Valeur résiduelle supérieure à 70 % après 10 ans.',
  },
]

export default function Advantages() {
  return (
    <section id="advantages" className="section">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— AVANTAGES</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          Pourquoi choisir<br />
          <em>Kenolu ?</em>
        </Reveal>

        <Reveal className="section__kicker">
          <p>
            Six arguments qui résistent au doute : réglementation, énergie, eau,
            rapidité de construction, impact carbone et valeur patrimoniale.
          </p>
        </Reveal>

        <Reveal className="advantages__grid" stagger>
          {advantages.map((a) => (
            <article key={a.title} className="advantage-row">
              <div className="advantage-row__icon">
                <Icon d={a.icon} />
              </div>
              <div>
                <h3 className="advantage-row__title">{a.title}</h3>
                <p className="advantage-row__desc">{a.desc}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
