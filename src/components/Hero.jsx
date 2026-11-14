import { lazy, Suspense, useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/scroll'
import { profile } from '../data/content'
const NeuralField = lazy(() => import('./NeuralField'))

const chars = (word) =>
  [...word].map((c, i) => (
    <span className="char" key={i}>
      {c}
    </span>
  ))

export default function Hero({ ready }) {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero__name .char', { yPercent: 115 })
      gsap.set('.hero [data-fade]', { opacity: 0, y: 16 })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to('.hero__name .char', { yPercent: 0, duration: reducedMotion ? 0.01 : 1.4, stagger: 0.035 })
        .to('.hero [data-fade]', { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, '-=1.0')

      if (!reducedMotion) {
        gsap.to('.hero__content', {
          yPercent: -18,
          opacity: 0.2,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      }
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section className="hero" id="top" ref={root}>
      <Suspense fallback={<div className="hero__canvas" />}>
        <NeuralField />
      </Suspense>
      <div className="hero__vignette" />
      <div className="hero__content">
        <div className="hero__meta">
          <p className="hero__line" data-fade>
            {profile.heroLine}
          </p>
          <div className="hero__status mono" data-fade>
            {profile.available && <span className="dot" />}
            <span>{profile.availableText}</span>
          </div>
        </div>
        <h1 className="hero__name" aria-label={`${profile.firstName} ${profile.lastName}, ${profile.role}`}>
          <span className="row-1" aria-hidden="true">
            <span className="line-mask">
              <span>{chars(profile.firstName)}</span>
            </span>
            <span className="hero__role" data-fade>
              {profile.role}
            </span>
          </span>
          <span className="line-mask" aria-hidden="true">
            <span>{chars(profile.lastName)}</span>
          </span>
        </h1>
        <div className="hero__bottom mono" data-fade>
          <span>{profile.location}</span>
          <span className="muted">Scroll ↓</span>
        </div>
      </div>
    </section>
  )
}
