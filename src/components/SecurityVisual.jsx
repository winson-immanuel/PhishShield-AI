export default function SecurityVisual() {
  const dots = Array.from({ length: 8 }, (_, i) => i)
  const shield = 'M200 92 L286 124 V206 C286 256 250 288 200 310 C150 288 114 256 114 206 V124 Z'
  return (
    <div className="visual" role="img" aria-label="Animated shield scanner showing a secure status">
      <div className="visual__halo" />
      <svg viewBox="0 0 400 400" className="visual__svg">
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#00CFFF" /><stop offset="1" stopColor="#0759D9" /></linearGradient>
          <linearGradient id="sf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#008CFF" stopOpacity=".35" /><stop offset="1" stopColor="#06183D" stopOpacity=".85" /></linearGradient>
          <clipPath id="shieldClip"><path d={shield} /></clipPath>
          <filter id="glow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <g className="ring ring--a"><circle cx="200" cy="200" r="186" fill="none" stroke="#00CFFF" strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="4 12" /></g>
        <g className="ring ring--b"><circle cx="200" cy="200" r="160" fill="none" stroke="url(#sg)" strokeWidth="2" strokeDasharray="90 40 20 40" strokeLinecap="round" filter="url(#glow)" /></g>
        <g className="ring ring--c"><circle cx="200" cy="200" r="134" fill="none" stroke="#8DD9FF" strokeOpacity=".4" strokeWidth="1" strokeDasharray="2 8" /></g>
        <g className="shield">
          <path d={shield} fill="url(#sf)" stroke="url(#sg)" strokeWidth="3" filter="url(#glow)" />
          <g clipPath="url(#shieldClip)"><rect className="scanglow" x="100" y="60" width="200" height="40" fill="url(#sg)" opacity=".25" /><rect className="scanline" x="100" y="90" width="200" height="3" fill="#00CFFF" /></g>
          <path className="check" d="M168 196 L192 220 L236 170" fill="none" stroke="#F2F9FF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
          <text x="200" y="266" textAnchor="middle" className="secure-text">SECURE</text>
        </g>
      </svg>
      {dots.map((i) => <span key={i} className="orb" style={{ '--a': `${i * 45}deg`, '--d': `${i * -0.9}s`, '--r': `${150 + (i % 3) * 18}px` }} />)}
      <div className="visual__tag visual__tag--1"><i /> URL checked</div>
      <div className="visual__tag visual__tag--2"><i /> Email scanned</div>
    </div>
  )
}
