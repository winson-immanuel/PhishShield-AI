// Transparent, rule-based heuristics. Runs 100% in the browser: no API, no backend.
const classify = (s) => (s >= 70 ? 'PHISHING' : s >= 30 ? 'SUSPICIOUS' : 'LEGITIMATE')
const SUMMARY = {
  PHISHING: 'High-risk phishing indicators were detected.',
  SUSPICIOUS: 'Some suspicious patterns were found. Proceed with caution.',
  LEGITIMATE: 'No major phishing indicators were found.',
}
function finish(score, reasons) {
  const riskScore = Math.max(0, Math.min(100, Math.round(score)))
  const classification = classify(riskScore)
  return {
    classification,
    riskScore,
    summary: SUMMARY[classification],
    reasons: reasons.length ? reasons : ['No common phishing patterns were found'],
  }
}

const URL_WORDS = ['login', 'verify', 'account', 'secure', 'password', 'signin', 'confirm', 'claim', 'wallet', 'update', 'bank', 'billing', 'support', 'recover']
const BRANDS = ['paypal', 'google', 'microsoft', 'apple', 'amazon', 'netflix', 'facebook', 'instagram', 'whatsapp', 'paytm', 'hdfc', 'icici', 'sbi']
const RISKY_TLDS = ['xyz', 'top', 'tk', 'ml', 'ga', 'cf', 'gq', 'click', 'work', 'zip', 'icu', 'buzz']

export function analyzeURL(url) {
  const raw = (url || '').trim()
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw)
  let u
  try { u = new URL(hasScheme ? raw : 'http://' + raw) } catch { return finish(60, ['This does not look like a valid URL']) }
  const host = u.hostname.toLowerCase()
  const lower = raw.toLowerCase()
  let score = 0
  const reasons = []
  const add = (w, t) => { score += w; reasons.push(t) }

  if (/^http:\/\//i.test(raw)) add(15, 'Uses HTTP instead of HTTPS, so the connection is not encrypted')
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) add(30, 'Uses an IP address instead of a domain name')
  if (raw.includes('@')) add(25, 'Contains an @ symbol that can hide the real destination')
  if (raw.length > 75) add(12, 'URL is unusually long')
  if (host.split('.').length > 4) add(15, 'Unusual domain structure with too many subdomains')
  const hyphens = (host.match(/-/g) || []).length
  if (hyphens >= 3) add(15, 'Excessive hyphens in the domain name')
  else if (hyphens === 2) add(8, 'Several hyphens in the domain name')
  const found = URL_WORDS.filter((w) => lower.includes(w))
  if (found.length) add(Math.min(36, 14 + (found.length - 1) * 8), `Suspicious verification keyword: ${found.join(', ')}`)
  if (found.length >= 3) add(6, 'Multiple security-related terms in one URL')
  for (const b of BRANDS) {
    if (host.includes(b) && !new RegExp(`(^|\\.)${b}\\.(com|in|net|org|co\\.in)$`).test(host)) { add(25, `Imitates the well-known brand "${b}"`); break }
  }
  if (RISKY_TLDS.includes(host.split('.').pop())) add(12, 'Uses a domain ending often seen in scam sites')
  if (/%[0-9a-f]{2}/i.test(raw)) add(10, 'Contains encoded characters')
  if (/[^\x00-\x7F]/.test(host) || host.includes('xn--')) add(25, 'Contains look-alike or unusual characters in the domain')
  else if (/[!$*'(),;{}|\\^~[\]`<>]/.test(raw)) add(8, 'Contains unusual characters')
  return finish(score, reasons)
}

const TEXT_RULES = [
  [/urgent|immediately|act now|act immediately|right away|within \d+ (hours?|minutes?)|expires? (today|soon)|last chance/i, 16, 'Creates urgency to rush your decision'],
  [/click (here|now|below)|tap (here|now)|follow (this|the) link/i, 14, 'Pressures you to click a link ("click now")'],
  [/suspend|suspended|deactivat|blocked|locked|terminat|restricted|closed permanently/i, 18, 'Threatens account suspension or restriction'],
  [/legal action|arrest|penalty|fine of|police|court/i, 14, 'Uses threats or legal pressure'],
  [/password|passcode|login details|credentials/i, 20, 'Asks for or mentions your password'],
  [/\botp\b|one[- ]time (password|code)|verification code/i, 22, 'Mentions an OTP or verification code'],
  [/\bpin\b|cvv|cvc/i, 20, 'Asks for a PIN or card security code'],
  [/bank (account|details)|account number|ifsc|routing number|card (number|details)|credit card|debit card/i, 20, 'Requests bank or card details'],
  [/verify|verification|re-?confirm|validate your/i, 12, 'Asks you to verify your details'],
  [/\bkyc\b|know your customer|aadhaar|pan card/i, 18, 'Mentions KYC or identity document updates'],
  [/payment (failed|pending|due|declined)|refund|invoice|unpaid|overdue/i, 12, 'Uses payment or refund pressure'],
  [/winner|you (have )?won|prize|reward|lottery|congratulations|free gift|cashback|claim your/i, 18, 'Offers rewards or prizes'],
  [/dear (customer|user|member|account holder)/i, 8, 'Uses a generic greeting instead of your name'],
]
const SHORTENERS = /(bit\.ly|tinyurl\.com|t\.co|goo\.gl|cutt\.ly|rb\.gy|is\.gd|shorturl)/i

function analyzeText(text, label) {
  const t = (text || '').trim()
  if (!t) return finish(0, [])
  let score = 0
  const reasons = []
  for (const [re, w, msg] of TEXT_RULES) if (re.test(t)) { score += w; reasons.push(msg) }
  const links = t.match(/(https?:\/\/|www\.)\S+/gi) || []
  if (links.length) {
    score += 14; reasons.push(`Contains ${links.length > 1 ? 'multiple links' : 'a link'} you are asked to open`)
  }
  if (SHORTENERS.test(t)) { score += 14; reasons.push('Uses a shortened link that hides the destination') }
  if (links.some((l) => analyzeURL(l).riskScore >= 40)) { score += 18; reasons.push('A link in this message looks suspicious') }
  if (/[A-Z]{6,}.*[A-Z]{6,}/.test(t) || /!{2,}/.test(t)) { score += 6; reasons.push('Excessive capital letters or exclamation marks') }
  if (reasons.length >= 4) score += 8
  const res = finish(score, reasons)
  if (!reasons.length) res.reasons = [`No common phishing patterns were found in this ${label}`]
  return res
}

export const analyzeEmail = (text) => analyzeText(text, 'email')
export const analyzeSMS = (text) => analyzeText(text, 'SMS')
