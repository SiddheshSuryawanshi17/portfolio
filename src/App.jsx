import { useEffect, useState } from 'react'
import { initScroll, gsap, ScrollTrigger, reducedMotion } from './lib/scroll'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Manifesto from './components/Manifesto'
import About from './components/About'
import Work from './components/Work'
import Experience from './components/Experience'
import Gallery from './components/Gallery'
import Contact from './components/Contact'

const THEMES = {
  dark: { '--bg': '#0a0a0b', '--bg-2': '#121214', '--fg': '#ecebe6', '--fg-2': '#c9c8c2', '--muted': '#8b8a85', '--line': 'rgba(236,235,230,0.12)', '--accent-text': '#c6ff3d' },
  light: { '--bg': '#efeee8', '--bg-2': '#e4e3dc', '--fg': '#0e0e0f', '--fg-2': '#3a3a37', '--muted': '#5f5e59', '--line': 'rgba(14,14,15,0.14)', '--accent-text': '#4a6a00' },
}
let current = 'dark'
function setTheme(name) {
  if (name === current) return
  current = name
  gsap.to(document.documentElement, { ...THEMES[name], duration: 0.7, ease: 'power2.out', overwrite: 'auto' })
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEMES[name]['--bg'])
}

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
      // background flips between dark and cream as sections pass the middle of the screen
      gsap.utils.toArray('[data-theme]').forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => self.isActive && setTheme(sec.dataset.theme),
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
      <Preloader onDone={() => setReady(true)} />
      <div className="progress" aria-hidden="true" />
      <Cursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Manifesto />
        <About />
        <Work />
        <Experience />
        <Gallery />
        <Contact />
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  )
}
