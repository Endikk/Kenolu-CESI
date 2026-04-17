import Reveal from './Reveal'

const pillars = [
  {
    num: '01 / MANIFESTE',
    title: 'Moins, mais mieux.',
    desc: "28 m² résolvent chaque geste du quotidien. Rien de superflu, rien ne manque. Un habitat dédensifié où chaque cm³ a une intention."
  },
  {
    num: '02 / AUTONOMIE',
    title: 'Vivre hors-réseau, sans compromis.',
    desc: "Solaire, pluie, batterie LiFePO₄, chauffage biomasse. Kenolu ne dépend de rien. Vous choisissez le paysage, elle s’occupe du reste."
  },
  {
    num: '03 / MOUVEMENT',
    title: 'Mobile, discrète, prête à partir.',
    desc: "Sur châssis homologué 3,5 T, Kenolu se tracte avec un SUV. Elle dort dans les Alpes, se réveille face à l’océan."
  },
]

export default function Concept() {
  return (
    <section id="concept" className="section concept">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— CONCEPT</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          Un habitat <em>taillé</em><br />pour une vie dégagée.
        </Reveal>

        <Reveal>
          <p className="concept__quote">
            «&nbsp;Construire petit,<br />
            c’est <em>vivre grand</em>.&nbsp;»
          </p>
        </Reveal>

        <Reveal className="concept__grid" stagger>
          {pillars.map((p) => (
            <article key={p.num} className="card">
              <div className="card__num">{p.num}</div>
              <h3 className="card__title">{p.title}</h3>
              <p className="card__desc">{p.desc}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
