import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/scroll'
import { manifesto, profile } from '../data/content'

// Big centred statement. Words wrapped in *asterisks* in content.js
// become serif-italic accent words. A signature draws itself underneath.
function Words({ text }) {
  return text.split(' ').map((w, i) => {
    const accent = w.startsWith('*')
    const clean = w.replace(/\*/g, '')
    return (
      <span className="line-mask mf__w" key={i}>
        <span className={accent ? 'serif accent-text' : ''}>{clean}</span>
      </span>
    )
  })
}

export default function Manifesto() {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sig = root.current.querySelector('.sig text')
      const len = 2600
      gsap.set(sig, { strokeDasharray: len, strokeDashoffset: reducedMotion ? 0 : len, fillOpacity: reducedMotion ? 1 : 0 })
      if (reducedMotion) return
      gsap.from('.mf__w > span', {
        yPercent: 110,
        stagger: 0.025,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.mf__text', start: 'top 75%' },
      })
      gsap
        .timeline({ scrollTrigger: { trigger: '.sig', start: 'top 85%', end: 'bottom 45%', scrub: 1 } })
        .to(sig, { strokeDashoffset: 0, ease: 'none', duration: 1 })
        .to(sig, { fillOpacity: 1, duration: 0.25 }, '-=0.15')
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section mf" ref={root} data-theme="dark" aria-label="What I believe">
      <div className="mf__label mono">
        <span className="dot" /> What I believe
      </div>
      <p className="mf__text">
        <Words text={manifesto} />
      </p>
      <svg className="sig" viewBox="0 0 900 260" role="img" aria-label={`Signature: ${profile.firstName}`}>
        <text x="50%" y="62%" textAnchor="middle">
          {profile.firstName}
        </text>
      </svg>
    </section>
  )
}
