import { useId, useState } from 'react'
import ScanAnimation from './ScanAnimation.jsx'
import ResultCard from './ResultCard.jsx'
import { analyzeURL, analyzeEmail, analyzeSMS } from '../utils/phishingDetector.js'

const CFG = {
  website: { title: 'Scan a Website', sub: 'Enter a URL and discover suspicious phishing indicators.', field: 'Website URL', placeholder: 'https://example.com', btn: 'SCAN WEBSITE', again: 'SCAN ANOTHER WEBSITE', fn: analyzeURL, multi: false,
    sample: 'http://secure-login.paypal-verify-account.com/signin?confirm=1', steps: ['Scanning URL...', 'Checking domain structure...', 'Checking suspicious patterns...', 'Calculating risk...'] },
  email: { title: 'Analyze an Email', sub: 'Paste the message and see which phishing signals it contains.', field: 'Email text', placeholder: 'Paste the suspicious email here...', btn: 'ANALYZE EMAIL', again: 'ANALYZE ANOTHER EMAIL', fn: analyzeEmail, multi: true,
    sample: 'Dear customer, your account has been suspended. Verify your password and bank details immediately: http://bit.ly/secure-verify. Act now to avoid legal action.', steps: ['Reading message...', 'Detecting suspicious language...', 'Checking phishing patterns...', 'Calculating risk...'] },
  sms: { title: 'Analyze an SMS', sub: 'Paste a text message to check it for scam patterns.', field: 'SMS text', placeholder: 'Paste the suspicious SMS here...', btn: 'ANALYZE SMS', again: 'ANALYZE ANOTHER SMS', fn: analyzeSMS, multi: true,
    sample: 'SBI KYC expired! Your account will be blocked today. Update now: bit.ly/sbi-kyc-up and share the OTP.', steps: ['Reading message...', 'Detecting suspicious language...', 'Checking phishing patterns...', 'Calculating risk...'] },
}

export default function Scanner({ kind }) {
  const c = CFG[kind]
  const id = useId()
  const [phase, setPhase] = useState('input')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    if (!value.trim()) { setError(`Enter ${kind === 'website' ? 'a URL' : 'some text'} to analyze.`); return }
    setError(''); setResult(c.fn(value)); setPhase('scanning')
  }
  const again = () => { setValue(''); setResult(null); setPhase('input') }

  return (
    <section className="scanner" aria-labelledby={`${id}-h`}>
      {phase === 'input' && (
        <div className="scanner__panel stage-in">
          <h1 id={`${id}-h`}>{c.title}</h1>
          <p className="scanner__sub">{c.sub}</p>
          <form onSubmit={submit} noValidate className="scanner__form">
            <label htmlFor={id} className="sr-only">{c.field}</label>
            <div className={`field ${c.multi ? 'field--area' : ''} ${error ? 'field--err' : ''}`}>
              {c.multi
                ? <textarea id={id} rows="8" value={value} placeholder={c.placeholder} onChange={(e) => setValue(e.target.value)} aria-invalid={!!error} aria-describedby={`${id}-e`} />
                : <input id={id} type="text" inputMode="url" autoComplete="off" spellCheck="false" value={value} placeholder={c.placeholder} onChange={(e) => setValue(e.target.value)} aria-invalid={!!error} aria-describedby={`${id}-e`} />}
              <span className="field__line" aria-hidden="true" />
            </div>
            <p id={`${id}-e`} className="field__error" role="alert">{error}</p>
            <button type="submit" className="btn btn--hero btn--block"><span className="btn__label">{c.btn}</span><span className="btn__arrow" aria-hidden="true">→</span><span className="btn__shine" aria-hidden="true" /></button>
            <button type="button" className="link-btn" onClick={() => { setValue(c.sample); setError('') }}>Try a sample phishing {kind === 'website' ? 'URL' : 'message'}</button>
          </form>
        </div>
      )}
      {phase === 'scanning' && <ScanAnimation steps={c.steps} onDone={() => setPhase('result')} />}
      {phase === 'result' && result && <ResultCard result={result} onAgain={again} againLabel={c.again} />}
    </section>
  )
}
