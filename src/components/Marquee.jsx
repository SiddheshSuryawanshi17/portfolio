import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/scroll'
import { marquee } from '../data/content'

// Endless strip whose speed and direction follow your scrolling.
export default function Marquee() {
  const track = useRef(null)

  useEffect(() => {
    if (reducedMotion) return
    const el = track.current
    let x = 0
    let dir = -1
    let boost = 0
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        dir = self.direction === 1 ? -1 : 1
        boost = Math.min(Math.abs(self.getVelocity()) / 220, 14)
      },
    })
    const tick = (_, delta) => {
      const half = el.scrollWidth / 2
      boost *= 0.92
      x += dir * (0.05 + boost * 0.05) * delta
      if (x <= -half) x += half
      if (x > 0) x -= half
      gsap.set(el, { x })
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      st.kill()
    }
  }, [])

  const items = [...marquee, ...marquee]
  return (
    <div className="marquee">
      <p className="sr-only">Focus areas: {marquee.join(', ')}</p>
      <div className="marquee__track" ref={track} aria-hidden="true">
        {items.map((t, i) => (
          <span className="marquee__item" key={i}>
            {t}
            <span className="marquee__star">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
