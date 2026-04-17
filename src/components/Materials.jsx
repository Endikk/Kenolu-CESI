import Reveal from './Reveal'

const materials = [
  { num: '001', name: 'Acier noir brossé', desc: 'Ossature secondaire et encadrements — recyclé à 85 %, traitement antifingerprint.', tag: 'Structure' },
  { num: '002', name: 'Bois de mélèze noirci', desc: 'Bardage extérieur traité selon la technique japonaise Shou Sugi Ban — ignifuge, sans entretien.', tag: 'Façade' },
  { num: '003', name: 'Aluminium anodisé', desc: 'Menuiseries et profilés. Rupture de pont thermique, teinte RAL 9005 satiné.', tag: 'Menuiserie' },
  { num: '004', name: 'Verre triple-vitrage', desc: 'Ug = 0,5 W/m²K. Contrôle solaire intégré, facteur solaire 0,35.', tag: 'Ouvertures' },
  { num: '005', name: 'Laine de bois dense', desc: '180 mm — R = 7 m²K/W. Déphasage thermique 12 h, biosourcée.', tag: 'Isolation' },
  { num: '006', name: 'Microbéton ciré graphite', desc: 'Sol intérieur 8 mm. Chauffant par le dessous, apaisant, résistant à l’humidité.', tag: 'Sol' },
]

export default function Materials() {
  return (
    <section id="materials" className="section">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— MATÉRIAUX</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          Peu de matières.<br />
          <em>Beaucoup de soin.</em>
        </Reveal>

        <Reveal className="section__kicker">
          <p>
            Six matériaux pour toute la maison. Chacun choisi pour sa durabilité, son
            impact carbone mesuré et son vieillissement esthétique. Zéro PVC, zéro colle
            toxique, traçabilité européenne.
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
