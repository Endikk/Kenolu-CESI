import Reveal from './Reveal'
import MagneticButton from './MagneticButton'

export default function CTA() {
  return (
    <section id="cta" className="section cta">
      <div className="container">
        <Reveal>
          <h2 className="cta__title">Ready to<br />move in?</h2>
        </Reveal>
        <Reveal>
          <div style={{ marginTop: 40 }}>
            <MagneticButton href="mailto:hello@kenolu.studio" strength={0.3}>
              Book a demonstration
            </MagneticButton>
          </div>
        </Reveal>
      </div>

      <footer className="footer container">
        <div>© 2026 Kenolu Studio — Off-Grid Tiny House</div>
        <div className="footer__right">
          <a href="#top">Back to top</a>
          <a href="#">Legal</a>
          <a href="#">Instagram</a>
        </div>
      </footer>
    </section>
  )
}
