import Reveal from './Reveal'

const team = [
  {
    initials: 'AE',
    name: 'Alex Émery',
    role: 'Architecture & volumes',
    bio: 'Conception spatiale, plans 3D, intégration paysagère. Pilote la vision d’ensemble du projet Kenolu.',
  },
  {
    initials: 'NC',
    name: 'Naïm Costa',
    role: 'Ingénierie off-grid',
    bio: 'Dimensionnement électrique, plomberie, autonomie énergétique. Veille à ce que la maison ne dépende de rien.',
  },
  {
    initials: 'LV',
    name: 'Léa Volt',
    role: 'Direction artistique',
    bio: 'Matériaux, textures, éclairage LED, identité visuelle. Donne à Kenolu son ambiance nocturne et apaisante.',
  },
]

export default function Team() {
  return (
    <section id="team" className="section">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— ÉQUIPE</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          Trois regards,<br />
          <em>un manifeste.</em>
        </Reveal>

        <Reveal className="team__grid reveal-stagger" stagger>
          {team.map((t) => (
            <article key={t.name} className="team-card">
              <div className="team-card__avatar">{t.initials}</div>
              <div className="team-card__name">{t.name}</div>
              <div className="team-card__role">{t.role}</div>
              <p className="team-card__bio">{t.bio}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
