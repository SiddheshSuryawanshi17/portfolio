import { useEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../lib/scroll'
import { profile } from '../data/content'

export default function Preloader({ onDone }) {
  const root = useRef(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    document.body.classList.add('is-loading')
    const counter = { v: 0 }
    const finish = () => {
      document.body.classList.remove('is-loading')
      onDone()
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.to(counter, {
        v: 100,
        duration: reducedMotion ? 0.2 : 2.1,
        ease: 'power3.inOut',
        onUpdate: () => setN(Math.round(counter.v)),
      })
        .to('.preloader__bar', { scaleX: 1, duration: reducedMotion ? 0.2 : 2.1, ease: 'power3.inOut' }, 0)
        // wait for fonts so the hero never flashes in a fallback font
        .add(() => {
          tl.pause()
          document.fonts.ready.then(() => tl.resume())
        })
        .to('.preloader__inner', { yPercent: -30, opacity: 0, duration: 0.6, ease: 'power2.in' })
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '-=0.25')
        .add(finish, '-=0.55')
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="preloader" ref={root} style={{ clipPath: 'inset(0 0 0% 0)' }} aria-hidden="true">
      <div className="preloader__inner">
        <div className="preloader__top mono">
          <span>{profile.firstName} {profile.lastName}</span>
          <span className="muted">Portfolio ©{new Date().getFullYear()}</span>
        </div>
        <div className="preloader__count">{String(n).padStart(3, '0')}</div>
      </div>
      <div className="preloader__bar" />
    </div>
  )
}
