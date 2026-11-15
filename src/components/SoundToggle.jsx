import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/scroll'

// Background music: "Showreel" by Monume, from Pixabay
// (pixabay.com/music/ambient-showreel-629836, Pixabay Content License:
// free to use, no credit required).
//
// Browsers block sound until the visitor interacts with the page, so the music
// tries to start on load and, when that is refused, starts on the first click,
// tap or key press instead. The bars button turns it off and on. Turning it
// off is remembered in that browser, so the next visit stays quiet.
const SRC = '/audio/showreel.mp3'
const VOLUME = 0.6
const GESTURES = ['pointerdown', 'mousedown', 'touchend', 'click', 'keydown']

const pref = {
  get() {
    try {
      return localStorage.getItem('sound')
    } catch {
      return null
    }
  },
  set(value) {
    try {
      localStorage.setItem('sound', value)
    } catch {
      // storage blocked (private mode etc.): the choice just isn't remembered
    }
  },
}

export default function SoundToggle() {
  const btn = useRef(null)
  const toggleRef = useRef(() => {})
  const [on, setOn] = useState(false)

  useEffect(() => {
    const audio = new Audio(SRC)
    audio.loop = true
    audio.preload = 'auto'
    let wanted = false // should be playing (stays true while the tab is hidden)
    let pending = null
    let fade

    const fadeTo = (to, duration, done) => {
      fade?.kill()
      const v = { v: audio.volume }
      fade = gsap.to(v, {
        v: to,
        duration,
        ease: 'sine.inOut',
        onUpdate: () => (audio.volume = v.v),
        onComplete: done,
      })
    }

    const play = () => {
      if (pending) return pending
      if (wanted && !audio.paused) return Promise.resolve()
      fade?.kill()
      audio.volume = 0 // iPhones ignore volume, so there it simply starts
      pending = audio.play().then(
        () => {
          pending = null
          wanted = true
          setOn(true)
          fadeTo(VOLUME, 1.8)
        },
        (err) => {
          pending = null
          throw err
        },
      )
      return pending
    }

    const stop = () => {
      wanted = false
      setOn(false)
      fadeTo(0, 0.6, () => audio.pause())
    }

    const unlisten = () => GESTURES.forEach((t) => window.removeEventListener(t, onGesture, true))
    function onGesture(e) {
      if (btn.current?.contains(e.target)) return // the button handles its own clicks
      play().then(unlisten, () => {}) // still blocked: wait for the next gesture
    }

    toggleRef.current = () => {
      unlisten()
      if (wanted) {
        stop()
        pref.set('off')
      } else {
        play().catch(() => {})
        pref.set('on')
      }
    }

    // pause while the tab is in the background, pick up again on return
    const onVisibility = () => {
      if (!wanted) return
      if (document.hidden) {
        fade?.kill()
        audio.pause()
      } else {
        audio.volume = 0
        audio.play().then(() => fadeTo(VOLUME, 1), () => {})
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    // no autoplay for visitors who muted it before or have data saver on
    if (pref.get() !== 'off' && !navigator.connection?.saveData) {
      play().catch(() => GESTURES.forEach((t) => window.addEventListener(t, onGesture, true)))
    }

    return () => {
      unlisten()
      document.removeEventListener('visibilitychange', onVisibility)
      fade?.kill()
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
  }, [])

  return (
    <button
      ref={btn}
      type="button"
      className={`sound ${on ? 'is-on' : ''}`}
      onClick={() => toggleRef.current()}
      aria-pressed={on}
      aria-label="Background music"
    >
      <i />
      <i />
      <i />
      <i />
    </button>
  )
}
