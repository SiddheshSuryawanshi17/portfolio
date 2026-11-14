import { useEffect } from 'react'
import { gsap, reducedMotion } from '../lib/scroll'

// The loading screen itself is plain HTML in index.html (#boot) so it shows
// instantly. This component only animates it: counts 000 → 100, waits for
// fonts, then wipes it away and tells the app to start.
export default function Preloader({ onDone }) {
  useEffect(() => {
    const boot = document.getElementById('boot')
    if (!boot) {
      onDone()
      return
    }
    const count = boot.querySelector('b')
    const bar = boot.querySelector('s')
    document.body.classList.add('is-loading')
    const counter = { v: 0 }
    const d = reducedMotion ? 0.2 : 1.1
    const tl = gsap.timeline()
    tl.to(counter, {
      v: 100,
      duration: d,
      ease: 'power3.inOut',
      onUpdate: () => (count.textContent = String(Math.round(counter.v)).padStart(3, '0')),
    })
      .to(bar, { scaleX: 1, duration: d, ease: 'power3.inOut' }, 0)
      // wait for fonts so the hero never flashes in a fallback font
      .add(() => {
        tl.pause()
        document.fonts.ready.then(() => tl.resume())
      })
      .to(boot.children, { yPercent: -30, opacity: 0, duration: 0.45, ease: 'power2.in', stagger: 0.03 })
      .to(boot, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.2')
      .add(() => {
        document.body.classList.remove('is-loading')
        onDone()
      }, '-=0.55')
      .add(() => boot.remove())
    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
