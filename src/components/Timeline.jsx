import Reveal from './Reveal'

const phases = [
  { week: 'Semaine 01–02', title: 'Études & plans', desc: 'Conception 3D, plans techniques, calculs de charge, validation réglementaire du châssis homologué 3,5 T.', meta: ['80 h', 'CAD · BIM'] },
  { week: 'Semaine 03', title: 'Châssis & structure', desc: 'Réception du châssis galvanisé, soudure des profils Sigma, traitement anticorrosion bi-composant.', meta: ['60 h', 'Acier S355'] },
  { week: 'Semaine 04–05', title: 'Ossature bois', desc: 'Montage des murs CLT, pose de la membrane pare-pluie, charpente plate pour accueil des panneaux solaires.', meta: ['120 h', 'Épicéa PEFC'] },
  { week: 'Semaine 06', title: 'Isolation & étanchéité', desc: 'Laine de bois dense 180 mm soufflée, frein-vapeur intérieur, mise hors-d’eau hors-d’air.', meta: ['70 h', 'R = 7'] },
  { week: 'Semaine 07', title: 'Menuiseries & bardage', desc: 'Baies triple-vitrage, bardage mélèze traité Shou Sugi Ban, joints silicone neutre.', meta: ['85 h', 'Ug = 0,5'] },
  { week: 'Semaine 08–09', title: 'Systèmes off-grid', desc: 'Panneaux photovoltaïques, onduleur hybride, batterie LiFePO₄, plomberie eau de pluie, VMC double-flux.', meta: ['110 h', '1,2 kWc'] },
  { week: 'Semaine 10', title: 'Aménagement intérieur', desc: 'Cuisine sur-mesure, salle d’eau, mezzanine, mobilier intégré mélèze + métal noirci.', meta: ['95 h', 'Sur-mesure'] },
  { week: 'Semaine 11', title: 'Livraison & mise en service', desc: 'Contrôle qualité 128 points, test autonomie 72 h, livraison sur site choisi, accompagnement 1 mois.', meta: ['20 h', 'Clé en main'] },
]

export default function Timeline() {
  return (
    <section id="timeline" className="section timeline">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— PRODUCTION · 11 SEMAINES</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          De la feuille blanche<br />
          <em>à la clé sur la porte.</em>
        </Reveal>

        <Reveal className="section__kicker">
          <p>
            Le calendrier type d’une Kenolu, de la première esquisse à la livraison.
            Construction intégrale en atelier abrité, zéro dépendance météo, contrôle
            qualité sur 128 points avant départ.
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
