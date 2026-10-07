import { useCallback, useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import FeatureCards from './components/FeatureCards.jsx'
import Scanner from './components/Scanner.jsx'
import Footer from './components/Footer.jsx'
import Logo from './components/Logo.jsx'

function Background() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let w, h, raf, ps = []
    const init = () => {
      w = cv.width = innerWidth; h = cv.height = innerHeight
      const n = w < 700 ? 22 : 60
      ps = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.4, vx: (Math.random() - 0.5) * 0.18, vy: -Math.random() * 0.25 - 0.05, a: Math.random() * 0.5 + 0.2 }))
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w }
        if (p.x < -5) p.x = w + 5
        if (p.x > w + 5) p.x = -5
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283)
        ctx.fillStyle = `rgba(0,207,255,${p.a})`; ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    init(); draw(); addEventListener('resize', init)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', init) }
  }, [])
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__blob bg__blob--1" /><div className="bg__blob bg__blob--2" /><div className="bg__blob bg__blob--3" />
      <div className="bg__grid" /><div className="bg__glow" /><div className="bg__scan" />
      <canvas ref={ref} className="bg__canvas" />
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('home')
  const [sweep, setSweep] = useState(false)
  const [intro, setIntro] = useState(true)
  const [ready, setReady] = useState(false)
  const busy = useRef(false)

  useEffect(() => {
    const t1 = setTimeout(() => setReady(true), 1250)
    const t2 = setTimeout(() => setIntro(false), 1900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const go = useCallback((next) => {
    if (busy.current || next === page) return
    busy.current = true; setSweep(true)
    setTimeout(() => { setPage(next); window.scrollTo({ top: 0 }) }, 320)
    setTimeout(() => { setSweep(false); busy.current = false }, 780)
  }, [page])

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.15 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [page])

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const g = document.getElementById('cursor')
    const move = (e) => { g.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; g.classList.add('on'); g.classList.toggle('big', !!e.target.closest('button, a, input, textarea')) }
    addEventListener('mousemove', move)
    return () => removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Background />
      <div id="cursor" className="cursor" aria-hidden="true" />
      {intro && (
        <div className={`intro ${ready ? 'intro--out' : ''}`} aria-hidden="true">
          <div className="intro__glow" /><Logo className="intro__logo" />
        </div>
      )}
      <div className={`sweep ${sweep ? 'sweep--on' : ''}`} aria-hidden="true" />
      <Navbar page={page} go={go} />
      <main id="main" className="page" key={page}>
        {page === 'home' ? (
          <>
            <Hero ready={ready} onTry={() => document.getElementById('scanners')?.scrollIntoView({ behavior: 'smooth' })} />
            <FeatureCards go={go} />
          </>
        ) : <Scanner kind={page} />}
      </main>
      <Footer />
    </>
  )
}
