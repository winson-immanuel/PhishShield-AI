import { useEffect, useState } from 'react'
const TONE = { LEGITIMATE: { c: 'safe', icon: '🟢' }, SUSPICIOUS: { c: 'warn', icon: '🟠' }, PHISHING: { c: 'danger', icon: '🔴' } }
export default function ResultCard({ result, onAgain, againLabel }) {
  const tone = TONE[result.classification]
  const [n, setN] = useState(0)
  const [go, setGo] = useState(false)
  useEffect(() => {
    let raf; const start = performance.now() + 250, dur = 1500
    const tick = (t) => {
      const x = Math.max(0, Math.min(1, (t - start) / dur))
      setN(Math.round((1 - Math.pow(1 - x, 3)) * result.riskScore))
      if (x < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const t = setTimeout(() => setGo(true), 80)
    return () => { cancelAnimationFrame(raf); clearTimeout(t) }
  }, [result])
  const C = 2 * Math.PI * 84
  return (
    <div className={`result result--${tone.c}`}>
      <div className="result__card">
        <span className="result__badge"><span aria-hidden="true">{tone.icon}</span> {result.classification}</span>
        <div className="meter" role="img" aria-label={`Risk score ${result.riskScore} out of 100`}>
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="84" className="meter__track" />
            <circle cx="100" cy="100" r="84" className="meter__fill" strokeDasharray={C} strokeDashoffset={go ? C * (1 - result.riskScore / 100) : C} />
          </svg>
          <div className="meter__num"><strong>{n}</strong><span>/100</span></div>
        </div>
        <p className="result__label">RISK SCORE</p>
        <div className="bar" aria-hidden="true"><span style={{ width: go ? `${result.riskScore}%` : '0%' }} /></div>
        <p className="result__summary">{result.summary}</p>
      </div>
      <section className="why" aria-labelledby="why-h">
        <h3 id="why-h">WHY THIS RESULT?</h3>
        <ul>
          {result.reasons.map((r, i) => (
            <li key={r} style={{ '--i': i }}><span className="why__ic" aria-hidden="true">{result.classification === 'LEGITIMATE' ? '✓' : '!'}</span>{r}</li>
          ))}
        </ul>
      </section>
      <button className="btn btn--ghost" onClick={onAgain}><span className="btn__label">{againLabel}</span><span className="btn__shine" aria-hidden="true" /></button>
    </div>
  )
}
