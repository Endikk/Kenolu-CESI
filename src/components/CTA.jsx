import Reveal from './Reveal'

export default function CTA() {
  return (
    <section id="cta" className="section cta">
      <div className="container">
        <Reveal>
          <h2 className="cta__title">Prêt·e à<br />vous installer ?</h2>
        </Reveal>
        <Reveal>
          <a href="mailto:hello@kenolu.studio" className="cta__btn">
            Réserver une démonstration
          </a>
        </Reveal>
      </div>

      <footer className="footer container">
        <div>© 2026 Kenolu Studio — Tiny House Off-Grid</div>
        <div className="footer__right">
          <a href="#top">Haut de page</a>
          <a href="#">Mentions légales</a>
          <a href="#">Instagram</a>
        </div>
      </footer>
    </section>
  )
}
