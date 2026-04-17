import Reveal from './Reveal'

const team = [
  {
    initials: 'LL',
    name: 'Lucas',
    role: 'Architecture & volumes',
    bio: 'Spatial design, 3D drawings, landscape integration. Drives the overall vision of the Kenolu project.',
  },
  {
    initials: 'NP',
    name: 'Noah',
    role: 'Off-grid engineering',
    bio: 'Electrical sizing, plumbing, energy autonomy. Makes sure the house depends on nothing.',
  },
  {
    initials: 'KM',
    name: 'Kevin',
    role: 'Art direction',
    bio: 'Materials, textures, LED lighting, visual identity. Gives Kenolu its calm, nocturnal atmosphere.',
  },
]

export default function Team() {
  return (
    <section id="team" className="section">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— TEAM</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          Three viewpoints,<br />
          <em>one manifesto.</em>
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
