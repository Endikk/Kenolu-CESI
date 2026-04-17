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
        <a href="#plan">plan</a>
        <a href="#modules">modules</a>
        <a href="#offgrid">off-grid</a>
        <a href="#advantages">advantages</a>
        <a href="#cost">cost</a>
        <a href={`${import.meta.env.BASE_URL}experimentation`}>3D view</a>
      </div>
      <a href="#cta" className="nav__cta">Book a demo</a>
    </nav>
  )
}
