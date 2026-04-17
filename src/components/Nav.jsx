export default function Nav() {
  return (
    <nav className="nav">
      <a href="#top" className="nav__logo">
        <span className="nav__logo-mark" aria-hidden />
        KENOLU
      </a>
      <div className="nav__links">
        <a href="#concept">concept</a>
        <a href="#specs">specs</a>
        <a href="#modules">modules</a>
        <a href="#offgrid">off-grid</a>
        <a href="#cost">coût</a>
        <a href="#team">équipe</a>
      </div>
      <a href="#cta" className="nav__cta">Réserver une démo</a>
    </nav>
  )
}
