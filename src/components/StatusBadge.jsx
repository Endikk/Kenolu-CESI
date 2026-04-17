import { useEffect, useState } from 'react'

/** A tiny "LIVE" badge with Paris time. */
export default function StatusBadge() {
  const [time, setTime] = useState(() => fmt())

  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="status-badge" aria-hidden>
      <span className="status-badge__dot" />
      <span>STUDIO · PARIS</span>
      <span className="status-badge__time">{time}</span>
    </div>
  )
}

function fmt() {
  const d = new Date()
  return d.toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Paris',
  })
}
