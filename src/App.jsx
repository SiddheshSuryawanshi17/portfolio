import { useEffect, useState } from 'react'
import { initScroll, gsap, ScrollTrigger, reducedMotion } from './lib/scroll'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Work from './components/Work'
import Experience from './components/Experience'
import Contact from './components/Contact'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    initScroll()
  }, [])

  // generic reveals for anything outside the hero
  useEffect(() => {
    if (!ready || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-lines]').forEach((mask) => {
        gsap.from(mask.firstElementChild, {
          yPercent: 110,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: mask, start: 'top 90%' },
        })
      })
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 92%' },
        })
      })
      gsap.to('.progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      })
    })
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [ready])

  return (
    <>
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <div className="progress" aria-hidden="true" />
      <Cursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Work />
        <Experience />
        <Contact />
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  )
}
