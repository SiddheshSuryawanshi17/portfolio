import { useState } from 'react'
import { profile, socials } from '../data/content'
import { scrollTo, lockScroll } from '../lib/scroll'
import useLocalTime from '../hooks/useLocalTime'

const links = [
  ['Work', '#work'],
  ['About', '#about'],
  ['Experience', '#experience'],
  ['Contact', '#contact'],
]

export default function Nav() {
  const time = useLocalTime(profile.timezone)
  const [open, setOpen] = useState(false)

  const go = (e, href) => {
    e.preventDefault()
    if (open) toggle(false)
    scrollTo(href)
  }
  const toggle = (v) => {
    setOpen(v)
    lockScroll(v)
  }

  return (
    <>
      <header className={`nav ${open ? 'menu-open' : ''}`}>
        <a href="#top" className="nav__logo" onClick={(e) => go(e, '#top')}>
          {profile.initials}
          <sup>©</sup>
          <span className="sr-only"> {profile.firstName} {profile.lastName}, back to top</span>
        </a>
        <div className="nav__time mono">
          {profile.location.split(',')[0]} · {time} IST
        </div>
        <nav className="nav__links mono" aria-label="Main">
          {links.map(([l, h]) => (
            <a key={h} href={h} onClick={(e) => go(e, h)}>
              {l}
            </a>
          ))}
        </nav>
        <button className="nav__burger mono" onClick={() => toggle(!open)} aria-expanded={open} aria-controls="menu">
          {open ? 'Close' : 'Menu'}
        </button>
      </header>
      <div className={`menu-backdrop ${open ? 'is-open' : ''}`} onClick={() => toggle(false)} aria-hidden="true" />
      <div id="menu" className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        {links.map(([l, h]) => (
          <a key={h} className="menu__big" href={h} onClick={(e) => go(e, h)} tabIndex={open ? 0 : -1}>
            {l}
          </a>
        ))}
        <div className="menu__socials mono">
          {socials.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
              {s.label} ↗
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
