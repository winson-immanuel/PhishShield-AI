const CARDS = [
  { id: 'website', icon: '🌐', title: 'Website Scanner', text: 'Analyze suspicious URLs' },
  { id: 'email', icon: '✉️', title: 'Email Scanner', text: 'Detect phishing emails' },
  { id: 'sms', icon: '💬', title: 'SMS Scanner', text: 'Check suspicious messages' },
]
function tilt(e) {
  const el = e.currentTarget, r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
  el.style.setProperty('--rx', `${(0.5 - y) * 8}deg`)
  el.style.setProperty('--ry', `${(x - 0.5) * 10}deg`)
  el.style.setProperty('--mx', `${x * 100}%`)
  el.style.setProperty('--my', `${y * 100}%`)
}
const untilt = (e) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg') }
export default function FeatureCards({ go }) {
  return (
    <section id="scanners" className="cards" aria-labelledby="cards-h">
      <div className="section-head reveal">
        <h2 id="cards-h">Choose what to check</h2>
        <p>Paste it in. Get a clear risk score and the reasons behind it.</p>
      </div>
      <div className="cards__grid">
        {CARDS.map((c, i) => (
          <div key={c.id} className="card-wrap reveal" style={{ '--i': i }}>
            <button className="card" onClick={() => go(c.id)} onMouseMove={tilt} onMouseLeave={untilt} style={{ '--f': `${i * -1.4}s` }}>
              <span className="card__spot" aria-hidden="true" />
              <span className="card__icon" aria-hidden="true">{c.icon}</span>
              <span className="card__title">{c.title}</span>
              <span className="card__text">{c.text}</span>
              <span className="card__arrow" aria-hidden="true">→</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
