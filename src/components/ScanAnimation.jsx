import { useEffect, useRef, useState } from 'react'
import Logo from './Logo.jsx'
const ease = (x) => 1 - Math.pow(1 - x, 2.2)
export default function ScanAnimation({ steps, onDone, duration = 2200 }) {
  const [p, setP] = useState(0)
  const done = useRef(onDone); done.current = onDone
  useEffect(() => {
    let raf, to; const start = performance.now()
    const tick = (t) => {
      const x = Math.min(1, (t - start) / duration); setP(x)
      if (x < 1) raf = requestAnimationFrame(tick); else to = setTimeout(() => done.current(), 350)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); clearTimeout(to) }
  }, [duration])
  const pct = Math.round(ease(p) * 100)
  const active = Math.min(steps.length - 1, Math.floor(p * steps.length))
  const C = 2 * Math.PI * 92
  return (
    <div className="scan stage-in" role="status" aria-live="polite">
      <div className="scan__core">
        <svg viewBox="0 0 220 220" className="scan__svg" aria-hidden="true">
          <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#00CFFF" /><stop offset="1" stopColor="#0759D9" /></linearGradient></defs>
          <circle cx="110" cy="110" r="104" className="scan__dash" />
          <circle cx="110" cy="110" r="92" className="scan__track" />
          <circle cx="110" cy="110" r="92" className="scan__prog" strokeDasharray={C} strokeDashoffset={C * (1 - ease(p))} />
        </svg>
        <div className="scan__sweep" aria-hidden="true" />
        <div className="scan__logo"><Logo /></div>
        <span className="scan__line" aria-hidden="true" />
      </div>
      <p className="scan__title">ANALYZING</p>
      <ul className="scan__steps">
        {steps.map((s, i) => (
          <li key={s} className={i < active ? 'is-done' : i === active ? 'is-active' : ''}><span className="tick" aria-hidden="true">{i < active ? '✓' : ''}</span>{s}</li>
        ))}
      </ul>
      <div className="scan__bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></div>
      <p className="scan__pct">{pct}%</p>
    </div>
  )
}
