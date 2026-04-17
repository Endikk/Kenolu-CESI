import { useEffect, useRef } from 'react'

/**
 * A button that gently follows the pointer when hovered.
 */
export default function MagneticButton({ children, href = '#', className = '', strength = 0.25 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let rect = el.getBoundingClientRect()
    const refresh = () => { rect = el.getBoundingClientRect() }

    const onMove = (e) => {
      rect = el.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    }
    const onLeave = () => {
      el.style.transform = 'translate(0, 0)'
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    window.addEventListener('scroll', refresh, { passive: true })
    window.addEventListener('resize', refresh)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('scroll', refresh)
      window.removeEventListener('resize', refresh)
    }
  }, [strength])

  return (
    <a ref={ref} href={href} className={`magnetic-btn ${className}`}>
      {children}
      <span className="magnetic-btn__arrow">↗</span>
    </a>
  )
}
