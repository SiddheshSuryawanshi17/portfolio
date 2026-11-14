import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/scroll'
import { profile } from '../data/content'
import { scrollTo } from '../lib/scroll'

// "Hello, recruiter" collage. Starts as a small card and grows to full width
// as you scroll it into view.
export default function Hello() {
  const root = useRef(null)

  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hello__frame',
        { clipPath: 'inset(14% 22% 14% 22% round 20px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          ease: 'none',
          scrollTrigger: { trigger: '.hello__frame', start: 'top 85%', end: 'center 55%', scrub: true },
        },
      )
      gsap.fromTo(
        '.hello__frame img',
        { scale: 1.25 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: '.hello__frame', start: 'top 85%', end: 'center 55%', scrub: true } },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hello" ref={root} data-theme="light" aria-labelledby="hello-title">
      <h2 id="hello-title" className="sr-only">
        Hello, recruiter
      </h2>
      <figure className="hello__frame">
        <img
          src="/images/me/hello-recruiter.webp"
          srcSet="/images/me/hello-recruiter-900.webp 900w, /images/me/hello-recruiter.webp 1672w"
          sizes="100vw"
          width="1672"
          height="941"
          loading="lazy"
          alt={`Collage: "Hello recruiter, meet ${profile.firstName}. An engineer who teaches machines to think."`}
        />
      </figure>
      <div className="hello__row" data-reveal>
        <p className="mono">&gt;&gt;&gt; hello_recruiter()</p>
        <p className="hello__text">
          Hiring for AI/ML or software roles? I’d love to hear about it.
        </p>
        <button className="pill pill--accent" onClick={() => scrollTo('#contact')}>
          Let’s talk →
        </button>
      </div>
    </section>
  )
}
