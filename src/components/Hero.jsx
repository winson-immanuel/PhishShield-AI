import SecurityVisual from './SecurityVisual.jsx'
export default function Hero({ onTry, ready }) {
  return (
    <section className={`hero ${ready ? 'hero--in' : ''}`}>
      <div className="hero__copy">
        <h1 className="hero__title">
          <span className="line line--1"><span>Detect phishing.</span></span>
          <span className="line line--2"><span className="grad-text">Before it hurts.</span></span>
        </h1>
        <p className="hero__sub">Stay one step ahead of scams with intelligent phishing detection for websites, emails and SMS.</p>
        <button className="btn btn--hero" onClick={onTry}>
          <span className="btn__label">LET'S TRY</span>
          <span className="btn__arrow" aria-hidden="true">→</span>
          <span className="btn__shine" aria-hidden="true" />
        </button>
        <ul className="hero__stats" aria-label="Highlights">
          <li><strong>3</strong> scanners</li><li><strong>100%</strong> in your browser</li><li><strong>0</strong> data sent out</li>
        </ul>
      </div>
      <div className="hero__visual"><SecurityVisual /></div>
    </section>
  )
}
