import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/scroll'
import { gallery } from '../data/content'

function Intro({ className = '' }) {
  return (
    <div className={`gallery__intro ${className}`}>
      <div className="mono muted" style={{ marginBottom: 24 }}>
        (05) Life
      </div>
      <h2 className="gallery__title">
        Off the <span className="serif">clock</span>
      </h2>
      <p>{gallery.intro}</p>
    </div>
  )
}

// Pinned section that scrolls sideways through photos on desktop;
// a swipeable strip on phones.
export default function Gallery() {
  const root = useRef(null)
  const track = useRef(null)

  useEffect(() => {
    if (reducedMotion) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 761px)', () => {
      const distance = () => track.current.scrollWidth - window.innerWidth
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
      // each photo drifts inside its frame for a parallax feel
      gsap.utils.toArray('.shot img').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="gallery" id="life" ref={root} data-theme="dark">
      <Intro className="gallery__intro--mobile" />
      <div className="gallery__track" ref={track}>
        <Intro />
        {gallery.photos.map((src, i) => (
          <figure className="shot" key={src}>
            <img
              src={src}
              srcSet={`${src.replace('.webp', '-640.webp')} 640w, ${src} 1040w`}
              sizes="(max-width: 760px) 74vw, 40vw"
              width="1040"
              height="1300"
              alt={`Siddhesh, photo ${i + 1}`}
              loading="lazy"
            />
            <figcaption className="shot__n mono">{String(i + 1).padStart(2, '0')}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
