# PhishShield AI

A frontend-only phishing detector for websites, emails and SMS. React + Vite. No backend, no APIs, no keys.
All analysis runs locally in your browser using transparent heuristics (`src/utils/phishingDetector.js`).

## Run

```bash
npm install
npm run dev
```

## Your logo

Put your official logo file at **`public/logo.png`**. It is used as-is in the navbar, intro, scan animation, footer and favicon.
The app never draws or replaces a logo. If the file is missing, the logo spots simply stay empty.

## Risk bands

| Score | Result |
|-------|--------|
| 0-29 | LEGITIMATE |
| 30-69 | SUSPICIOUS |
| 70-100 | PHISHING |

Detection is heuristic and meant for awareness, not as a guarantee of safety.
