const words = [
  { text: 'OFF-GRID', outlined: false },
  { text: '28 M²', outlined: true },
  { text: 'SOLAR', outlined: false },
  { text: 'AUTONOMOUS', outlined: true },
  { text: 'MOBILE', outlined: false },
  { text: 'CARBON-LOW', outlined: true },
  { text: 'LiFePO₄ 10 kWh', outlined: false },
  { text: '3,5 T', outlined: true },
  { text: 'SHOU SUGI BAN', outlined: false },
]

export default function Marquee() {
  const list = [...words, ...words] // duplicate for seamless loop
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee__track">
        {list.map((w, i) => (
          <span key={i} className={`marquee__item ${w.outlined ? 'marquee__item--muted' : ''}`}>
            {w.text}
          </span>
        ))}
      </div>
    </div>
  )
}
