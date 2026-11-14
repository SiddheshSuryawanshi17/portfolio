import { lazy, Suspense, useRef, useState } from 'react'
import { profile, socials } from '../data/content'
import { scrollTo } from '../lib/scroll'
import useMagnet from '../hooks/useMagnet'
import useLocalTime from '../hooks/useLocalTime'

const NeuralField = lazy(() => import('./NeuralField'))

export default function Contact() {
  const magnet = useRef(null)
  useMagnet(magnet, 0.4)
  const time = useLocalTime(profile.timezone)
  const [toast, setToast] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setToast(true)
      setTimeout(() => setToast(false), 2200)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section className="contact" id="contact" data-theme="dark">
      <Suspense fallback={null}>
        <NeuralField scrollLinked={false} className="contact__field" />
      </Suspense>
      <div className="section-head mono" style={{ marginBottom: 0 }}>
        <span>(06) Contact</span>
        <span className="muted">Let’s talk</span>
      </div>

      <div>
        <h2 className="contact__big">
          <span className="line-mask" data-lines>
            <span>Let’s build</span>
          </span>
          <span className="line-mask" data-lines>
            <span>
              something <span className="serif">smart</span>
            </span>
          </span>
        </h2>

        <div className="contact__mid">
          <a className="email-btn" href={`mailto:${profile.email}`}>
            {profile.email} <span aria-hidden="true">↗</span>
          </a>
          <button className="magnet" ref={magnet} onClick={copy} data-cursor="Copy">
            Copy
            <br />
            email
          </button>
        </div>
      </div>

      <footer className="footer mono">
        <div className="footer__socials">
          {socials.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noreferrer">
              {s.label} ↗
            </a>
          ))}
        </div>
        <div className="muted">
          Local time · {time} IST
          <br />© {new Date().getFullYear()} {profile.firstName} {profile.lastName}
        </div>
        <div className="footer__right">
          <button onClick={() => scrollTo('#top')}>Back to top ↑</button>
        </div>
      </footer>

      <div className={`toast mono ${toast ? 'is-on' : ''}`} role="status">
        {toast ? 'Email copied ✓' : ''}
      </div>
    </section>
  )
}
