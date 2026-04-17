import Reveal from './Reveal'

const costs = [
  { name: 'Road-certified chassis + wheels', sub: 'Galvanised tandem steel', price: '€8,200' },
  { name: 'Structure & wood/steel frame', sub: 'Sigma + CLT', price: '€14,500' },
  { name: 'Bio-sourced insulation', sub: '180 mm wood-fibre wool', price: '€4,800' },
  { name: 'Cladding + joinery', sub: 'Shou Sugi Ban + anodised aluminium', price: '€11,200' },
  { name: 'Photovoltaic roof', sub: 'Integrated 1.2 kWp', price: '€6,400' },
  { name: '10 kWh LiFePO₄ battery', sub: 'Hybrid inverter included', price: '€7,900' },
  { name: 'Plumbing + water filtration', sub: '300 L tank, UV, reverse osmosis', price: '€3,600' },
  { name: 'Kitchen + appliances', sub: 'Induction, 12V fridge', price: '€5,400' },
  { name: 'Full bathroom', sub: 'Shower, dry toilet, dual-flow HRV', price: '€4,100' },
  { name: 'Bespoke integrated furniture', sub: 'Larch, metal, laminate', price: '€7,800' },
  { name: 'LED lighting + smart home', sub: 'KNX + mobile app', price: '€2,900' },
  { name: 'Labour & assembly', sub: '640 h spread over 11 weeks', price: '€18,200' },
]

export default function Cost() {
  return (
    <section id="cost" className="section">
      <div className="container">
        <Reveal className="section__eyebrow">
          <span>— MANUFACTURING COST</span>
        </Reveal>

        <Reveal as="h2" className="section__title">
          A transparent<br />
          <em>investment.</em>
        </Reveal>

        <Reveal className="section__kicker">
          <p>
            Below is the full breakdown of the production cost. This
            pricing is for a pilot unit — it drops by 18% from the second
            build onward thanks to series economics.
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
            <div className="cost__total-label">Total — pilot unit</div>
            <div className="cost__total-value">€95,000</div>
            <p className="cost__total-note">
              Includes certified materials, labour, finishes, the full
              off-grid systems and commissioning. 20-year structural
              warranty. Eligible for mobile-dwelling financing.
            </p>
          </aside>
        </Reveal>
      </div>
    </section>
  )
}
