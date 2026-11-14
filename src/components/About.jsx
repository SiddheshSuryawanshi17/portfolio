import { useEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../lib/scroll'
import { about, profile } from '../data/content'

export default function About() {
  const root = useRef(null)
  const [hasPhoto, setHasPhoto] = useState(true)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.about__statement .w', { opacity: 1 })
        return
      }
      gsap.to('.about__statement .w', {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: '.about__statement', start: 'top 80%', end: 'bottom 45%', scrub: true },
      })
      gsap.fromTo(
        '.portrait',
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.4,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: '.portrait', start: 'top 85%' },
        },
      )
      gsap.fromTo(
        '.portrait img',
        { yPercent: -12 },
        { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.portrait', scrub: true } },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section" id="about" ref={root}>
      <div className="section-head mono">
        <span>(01) About</span>
        <span className="muted">Who I am</span>
      </div>

      <p className="about__statement">
        {about.statement.split(' ').map((w, i) => (
          <span className="w" key={i}>
            {w}
          </span>
        ))}
      </p>

      <div className="about__grid">
        <figure className="portrait" data-cursor="Hi!">
          {hasPhoto ? (
            <img src={profile.portrait} alt={`Portrait of ${profile.firstName} ${profile.lastName}`} onError={() => setHasPhoto(false)} />
          ) : (
            <div className="portrait__placeholder">
              <span>{profile.initials}</span>
            </div>
          )}
          <figcaption className="portrait__cap mono">
            <span>{profile.firstName}</span>
            <span>{profile.location.split(',')[0]}, IN</span>
          </figcaption>
        </figure>

        <div className="about__copy">
          {about.paragraphs.map((p, i) => (
            <p key={i} data-reveal>
              {p}
            </p>
          ))}
          <div className="stats">
            {about.stats.map((s) => (
              <div className="stat" key={s.label} data-reveal>
                <div className="stat__v">{s.value}</div>
                <div className="stat__l mono">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="about__ctas" data-reveal>
            <a className="pill pill--accent" href={profile.resume} target="_blank" rel="noreferrer">
              Download résumé ↓
            </a>
            <a className="pill" href={`mailto:${profile.email}`}>
              Say hello →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
