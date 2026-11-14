import { useEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../lib/scroll'
import { about, profile } from '../data/content'

export default function About() {
  const root = useRef(null)
  const [hasPhoto, setHasPhoto] = useState(true)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.about__statement .w', { color: '#0e0e0f' })
        return
      }
      gsap.to('.about__statement .w', {
        color: '#0e0e0f',
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
      // numbers count up when they come into view
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const m = el.dataset.count.match(/^(\d+)(.*)$/)
        if (!m) return
        const end = +m[1]
        const o = { v: end > 1000 ? end - 30 : 0 }
        gsap.to(o, {
          v: end,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => (el.textContent = Math.round(o.v) + m[2]),
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section" id="about" ref={root} data-theme="light">
      <div className="section-head mono">
        <h2>(01) About</h2>
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
            <>
              <img
                src={profile.portrait}
                srcSet={`${profile.portrait.replace('.webp', '-640.webp')} 640w, ${profile.portrait.replace('.webp', '-720.webp')} 720w, ${profile.portrait} 1000w`}
                sizes="(max-width: 860px) min(90vw, 420px), 38vw"
                width="1000"
                height="1250"
                loading="lazy"
                alt={`Portrait of ${profile.firstName} ${profile.lastName}`}
                onError={() => setHasPhoto(false)}
              />
              {profile.portraitAlt && (
                <img
                  className="portrait__alt"
                  src={profile.portraitAlt}
                  srcSet={`${profile.portraitAlt.replace('.webp', '-640.webp')} 640w, ${profile.portraitAlt.replace('.webp', '-720.webp')} 720w, ${profile.portraitAlt} 1000w`}
                  sizes="(max-width: 860px) min(90vw, 420px), 38vw"
                  width="1000"
                  height="1250"
                  alt=""
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <div className="portrait__placeholder">
              <span>{profile.initials}</span>
            </div>
          )}
          <figcaption className="portrait__cap mono">
            <span className="portrait__swap">
              <span>At work</span>
              <span>Off the clock</span>
            </span>
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
                <div className="stat__v" data-count={s.value}>
                  {s.value}
                </div>
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
