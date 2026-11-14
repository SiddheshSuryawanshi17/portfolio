import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/scroll'

// Small dot that grows over links. Elements with data-cursor="Label"
// show a lime bubble with that label instead.
export default function Cursor() {
  const wrap = useRef(null)
  const bubble = useRef(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const xs = [gsap.quickTo(wrap.current, 'x', { duration: 0.18, ease: 'power3' }), gsap.quickTo(bubble.current, 'x', { duration: 0.5, ease: 'power3' })]
    const ys = [gsap.quickTo(wrap.current, 'y', { duration: 0.18, ease: 'power3' }), gsap.quickTo(bubble.current, 'y', { duration: 0.5, ease: 'power3' })]
    const move = (e) => {
      wrap.current.classList.add('is-on')
      xs.forEach((f) => f(e.clientX))
      ys.forEach((f) => f(e.clientY))
    }
    const over = (e) => {
      const labelled = e.target.closest('[data-cursor]')
      const interactive = e.target.closest('a, button')
      wrap.current.classList.toggle('is-hover', !!interactive && !labelled)
      wrap.current.classList.toggle('is-label', !!labelled)
      setLabel(labelled ? labelled.dataset.cursor : '')
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  }, [])

  return (
    <>
      <div className="cursor" ref={wrap} aria-hidden="true">
        <div className="cursor__dot" />
      </div>
      <div className={`cursor__label ${label ? 'is-on' : ''}`} ref={bubble} aria-hidden="true">
        {label}
      </div>
    </>
  )
}
