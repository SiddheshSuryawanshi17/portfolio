import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

export function initScroll() {
  if (reducedMotion || lenis) return lenis
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function scrollTo(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (lenis) lenis.scrollTo(el ?? 0, { duration: 1.6 })
  else if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
  else window.scrollTo({ top: 0 })
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start()
  document.body.style.overflow = locked ? 'hidden' : ''
}

export { gsap, ScrollTrigger }
