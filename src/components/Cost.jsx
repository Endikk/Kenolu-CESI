import Reveal from './Reveal'

const costs = [
  { name: 'Châssis homologué + roues', sub: 'Acier galvanisé tandem', price: '8 200 €' },
  { name: 'Structure & ossature bois/acier', sub: 'Sigma + CLT', price: '14 500 €' },
  { name: 'Isolation biosourcée', sub: 'Laine de bois 180 mm', price: '4 800 €' },
  { name: 'Bardage + menuiseries', sub: 'Shou Sugi Ban + alu anodisé', price: '11 200 €' },
  { name: 'Toiture photovoltaïque', sub: '1,2 kWc intégré', price: '6 400 €' },
  { name: 'Batterie LiFePO₄ 10 kWh', sub: 'Onduleur hybride inclus', price: '7 900 €' },
  { name: 'Plomberie + filtration eau', sub: 'Cuve 300 L, UV, osmose', price: '3 600 €' },
  { name: 'Cuisine + électroménager', sub: 'Induction, frigo 12V', price: '5 400 €' },
  { name: 'Salle d’eau complète', sub: 'Douche, toilettes sèches, VMC DF', price: '4 100 €' },
  { name: 'Mobilier intégré sur-mesure', sub: 'Mélèze, métal, stratifié', price: '7 800 €' },
  { name: 'Éclairage LED + domotique', sub: 'KNX + app mobile', price: '2 900 €' },
  { name: 'Main d’œuvre & assemblage', sub: '640 h réparties sur 11 semaines', price: '18 200 €' },
]

export default function Cost() {
  return (
    <section id="cost" className="section">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— COÛT DE FABRICATION</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          Un investissement<br />
          <em>transparent.</em>
        </Reveal>

        <Reveal className="section__kicker">
          <p>
            Ci-dessous le détail complet du coût de production. Ce tarif correspond à
            une unité pilote — il diminue de 18 % à partir de la deuxième fabrication
            grâce aux économies de série.
          </p>
        </Reveal>

        <Reveal className="cost__wrap">
          <div className="cost__table">
            {costs.map((c) => (
              <div key={c.name} className="cost__row">
                <div className="cost__row-label">
                  <div className="cost__row-name">{c.name}</div>
                  <div className="cost__row-sub">{c.sub}</div>
                </div>
                <div className="cost__row-price">{c.price}</div>
              </div>
            ))}
          </div>

          <aside className="cost__total">
            <div className="cost__total-label">Total — unité pilote</div>
            <div className="cost__total-value">95 000&nbsp;€</div>
            <p className="cost__total-note">
              Inclut matériaux certifiés, main d’œuvre, finitions, systèmes off-grid
              complets et mise en service. Garantie structure 20 ans.
              Éligible au crédit habitat mobile.
            </p>
          </aside>
        </Reveal>
      </div>
    </section>
  )
}
