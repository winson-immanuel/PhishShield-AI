import { useState } from 'react'
// Always renders the user's own /logo.png. If the file is missing it simply hides (nothing is substituted).
export default function Logo({ className = '', alt = 'PhishShield AI logo' }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return <img src="/logo.png" alt={alt} className={className} onError={() => setOk(false)} draggable="false" />
}
