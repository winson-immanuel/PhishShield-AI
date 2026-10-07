import { useEffect, useState } from 'react'
import Logo from './Logo.jsx'
const LINKS = [['home', 'Home'], ['website', 'Website'], ['email', 'Email'], ['sms', 'SMS']]
export default function Navbar({ page, go }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <nav className="nav__inner" aria-label="Main">
        <button className="nav__brand" onClick={() => go('home')} aria-label="PhishShield AI home">
          <Logo className="nav__logo" />
          <span className="nav__name">PHISHSHIELD AI</span>
        </button>
        <ul className="nav__links">
          {LINKS.map(([id, label]) => (
            <li key={id}>
              <button className={`nav__link ${page === id ? 'is-active' : ''}`} aria-current={page === id ? 'page' : undefined} onClick={() => go(id)}>
                {label}
                <span className="nav__dot" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
