import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/scroll'
import { projects } from '../data/content'

function Media({ p }) {
  if (p.image)
    return (
      <img
        src={p.image}
        srcSet={`${p.image.replace('.webp', '-800.webp')} 800w, ${p.image} 1400w`}
        sizes="(max-width: 860px) 95vw, 60vw"
        width="1400"
        height="875"
        alt={`${p.title} screenshot`}
        loading="lazy"
        style={{ objectPosition: p.imagePosition || 'center' }}
      />
    )
  return (
    <div className="cover" aria-hidden="true">
      <div className="cover__glyph" />
      <div className="cover__word">{p.title.split(' ')[0]}</div>
    </div>
  )
}

export default function Work() {
  const root = useRef(null)

  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.card')
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) return
        gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, {
          scale: 0.9,
          filter: 'brightness(0.45)',
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 15%', scrub: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section" id="work" ref={root} data-theme="dark">
      <div className="section-head mono">
        <span>(02) Selected work</span>
        <span className="muted">{projects.length} projects</span>
      </div>
      <h2 className="work__title">
        <span className="line-mask" data-lines>
          <span>Things I’ve</span>
        </span>
        <span className="line-mask" data-lines>
          <span>
            <span className="serif">built</span> lately
          </span>
        </span>
      </h2>

      <div className="cards">
        {projects.map((p, i) => (
          <article className="card" key={p.title} style={{ '--card-color': p.color === 'accent' ? 'var(--accent)' : p.color }}>
            <div className="card__info">
              <div>
                <div className="card__top mono">
                  <span>({String(i + 1).padStart(2, '0')})</span>
                  <span className="muted">
                    {p.tag} · {p.year}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="card__title">{p.title}</h3>
                {p.award && <div className="card__award mono">★ {p.award}</div>}
              </div>
              <div>
                <p className="card__blurb">{p.blurb}</p>
                <div className="chips">
                  {p.stack.map((s) => (
                    <span className="chip" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <a className="pill card__link" href={p.link} target="_blank" rel="noreferrer">
                View on GitHub ↗
              </a>
            </div>
            <a className="card__media" href={p.link} target="_blank" rel="noreferrer" data-cursor="View" tabIndex={-1} aria-hidden="true">
              <Media p={p} />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
