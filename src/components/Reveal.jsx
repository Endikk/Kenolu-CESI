import { useEffect, useRef } from 'react'

/**
 * Adds `.is-in` class when the element scrolls into view.
 * Triggers once. Respects prefers-reduced-motion.
 */
export default function Reveal({ as: Tag = 'div', className = '', stagger = false, children, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.classList.add('is-in')
      return
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-in')
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const base = stagger ? 'reveal-stagger' : 'reveal'
  const existing = String(className || '').split(/\s+/).filter(Boolean)
  const merged = [base, ...existing.filter((c) => c !== base)].join(' ')

  return (
    <Tag ref={ref} className={merged} {...rest}>
      {children}
    </Tag>
  )
}
