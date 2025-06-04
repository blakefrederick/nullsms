'use client'

import { useState } from 'react'

const fontStyle = {
  fontFamily:
    '"IBM Plex Mono", "Monaco", "Menlo", "Consolas", "Liberation Mono", "Courier New", monospace',
  fontSize: '1.1rem',
  letterSpacing: '0.02em',
  fontWeight: 500,
  textShadow: '0 1px 0 #fff, 0 0px 1px #000, 0 0 2px #0008',
}

const asciiWhatever = `
  .ed"""" """$$$$be.
-"           ^"$$$E  .
-     .      $$$$F  .
-    /$\     $$$$   .
-   /$$$\   z$$$"  .
-  /$$$$$\ $$$$"  .
- /$$$$$$$\$$$"  .
- $$$$$$$$$$$"  .
- $$$$$$$$$$"  .
- $$$$$$$$$"  .
- $$$$$$$$"  .
- $$$$$$$"  .
- $$$$$$"  .
- $$$$$"  .
- $$$$"  .
- $$$"  .
- $$"  .
- $"  .
- .
`

const ENCODERS = [
  { label: 'ZWSP', char: '\u200B', value: 'zwsp' },
  { label: 'ZWNJ', char: '\u200C', value: 'zwnj' },
  { label: 'U+2800', char: '\u2800', value: 'braille' },
]

export default function Home() {
  const [to, setTo] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('normal')
  const [encoder, setEncoder] = useState('zwsp')
  const [obfuscate, setObfuscate] = useState(false)
  const [salt, setSalt] = useState('')

  // --- Encoding Logic ---
  function encodeInvisibleInk(
    text,
    encoderType = 'zwsp',
    obfuscate = false,
    salt = '',
  ) {
    let zero0, zero1
    if (encoderType === 'zwsp') {
      zero0 = '\u200B'
      zero1 = '\u200C'
    } else if (encoderType === 'zwnj') {
      zero0 = '\u200C'
      zero1 = '\u200B'
    } else if (encoderType === 'braille') {
      zero0 = '\u2800'
      zero1 = '\u2801'
    } else {
      zero0 = '\u200B'
      zero1 = '\u200C'
    }
    let bits = text
      .split('')
      .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
      .join('')
    if (obfuscate && salt) {
      // XOR bits with salt (repeat salt as needed)
      let saltBits = salt
        .split('')
        .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
        .join('')
      bits = bits
        .split('')
        .map((b, i) => (b ^ (saltBits[i % saltBits.length] || 0)).toString())
        .join('')
    }
    return bits
      .split('')
      .map((b) => (b === '0' ? zero0 : zero1))
      .join('')
  }

  // --- UI Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    let outMsg = message
    let outMode = mode
    if (mode === 'invisible') {
      const saltVal = obfuscate ? salt || Date.now().toString() : ''
      outMsg = encodeInvisibleInk(message, encoder, obfuscate, saltVal)
      outMode = 'invisible'
    } else {
      outMode = 'normal'
    }
    try {
      const res = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message: outMsg, mode: outMode }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('SMS sent!')
        setMessage('')
        setTo('')
      } else {
        setStatus(data.error || 'Failed to send SMS')
      }
    } catch (err) {
      setStatus('Error sending SMS')
    }
    setLoading(false)
  }

  // --- UI ---
  return (
    <div
      style={{
        background: '#181a1b',
        minHeight: '100vh',
        padding: 0,
        ...fontStyle,
      }}
    >
      <div
        style={{
          maxWidth: 540,
          margin: '40px auto',
          border: '4px solid #fff',
          borderRadius: 8,
          boxShadow: '0 0 32px #0ff4, 0 0 2px #000',
          background: '#23272a',
          position: 'relative',
        }}
      >
        {/* Window Title Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#111',
            color: '#0ff',
            borderBottom: '2px solid #fff',
            padding: '0.5em 1em',
            fontFamily: 'Chicago, Monaco, monospace',
            fontSize: 18,
            letterSpacing: 2,
          }}
        >
          <span style={{ fontWeight: 700, letterSpacing: 2 }}>
            NullSMS ▞▚▞▚▞▚
          </span>
          <span style={{ flex: 1 }}></span>
          <button
            aria-label="Minimize"
            style={{
              background: 'none',
              border: 'none',
              color: '#f0f',
              fontWeight: 700,
              fontSize: 18,
              cursor: 'pointer',
              padding: 0,
            }}
            onClick={() => {
              const main = document.getElementById('nullsms-main')
              if (main)
                main.style.display = main.style.display === 'none' ? '' : 'none'
            }}
          >
            ☒
          </button>
        </div>
        {/* Menu Bar */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            background: '#222',
            color: '#fff',
            borderBottom: '2px solid #0ff',
            padding: '0.3em 1em',
            fontFamily: 'Chicago, Monaco, monospace',
            fontSize: 15,
          }}
        >
          <a
            href="/"
            style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}
          >
            🗀 FILE
          </a>
          <a
            href="/"
            style={{ color: '#0ff', textDecoration: 'none', fontWeight: 500 }}
          >
            NullSMS
          </a>
          <a
            href="/decode"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#f0f', textDecoration: 'none', fontWeight: 500 }}
          >
            Decode
          </a>
          <a
            href="/"
            style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}
          >
            MODE
          </a>
        </div>
        {/* ASCII */}
        <pre
          style={{
            color: '#0ff',
            background: 'none',
            margin: 0,
            padding: '0.5em 1em 0 1em',
            fontSize: 12,
            fontFamily: 'monospace',
            opacity: 0.7,
          }}
          id="nullsms-main-skull"
        >
          {asciiWhatever}
        </pre>
        {/* Main Content */}
        <div id="nullsms-main">
          <form
            onSubmit={handleSubmit}
            style={{
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontWeight: 700, color: '#fff' }}>
                To (phone number):
              </label>
              <input
                type="tel"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
                style={{
                  ...fontStyle,
                  width: '100%',
                  marginTop: 4,
                  padding: 8,
                  border: '2px solid #0ff',
                  borderRadius: 4,
                  background: '#181a1b',
                  color: '#0ff',
                }}
                placeholder="+1234567890"
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontWeight: 700, color: '#fff' }}>
                Compose NullSMS:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 256))}
                required
                maxLength={256}
                style={{
                  ...fontStyle,
                  width: '100%',
                  minHeight: 80,
                  marginTop: 4,
                  padding: 8,
                  border: '2px solid #0ff',
                  borderRadius: 4,
                  background: '#181a1b',
                  color: '#fff',
                  resize: 'vertical',
                }}
                placeholder="Type your invisible message..."
              />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8,
              }}
            >
              <span style={{ color: '#fff', fontWeight: 700 }}>
                [▣] Encode using ▾
              </span>
              {ENCODERS.map((enc) => (
                <label
                  key={enc.value}
                  style={{ color: '#0ff', fontWeight: 700, marginRight: 8 }}
                >
                  <input
                    type="radio"
                    name="encoder"
                    value={enc.value}
                    checked={encoder === enc.value}
                    onChange={() => setEncoder(enc.value)}
                    style={{ accentColor: '#0ff', marginRight: 2 }}
                  />
                  {enc.label}
                </label>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8,
              }}
            >
              <label style={{ color: '#fff', fontWeight: 500 }}>
                <input
                  type="checkbox"
                  checked={obfuscate}
                  onChange={(e) => setObfuscate(e.target.checked)}
                  style={{ accentColor: '#f0f', marginRight: 4 }}
                />
                <span style={{ marginRight: 4 }} title="Obfuscate with salt">
                  [✓]{' '}
                  Obfuscate sequence with <span role="img" aria-label="Salt">
                    🧂
                  </span>
                </span>
              </label>
              {obfuscate && (
                <input
                  type="text"
                  value={salt}
                  onChange={(e) => setSalt(e.target.value)}
                  placeholder="Enter salt or leave blank for random"
                  style={{
                    ...fontStyle,
                    width: 180,
                    padding: 4,
                    border: '1px solid #f0f',
                    borderRadius: 4,
                    background: '#23272a',
                    color: '#f0f',
                  }}
                />
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...fontStyle,
                  background: '#0ff',
                  color: '#111',
                  border: '2px solid #fff',
                  borderRadius: 4,
                  padding: '8px 18px',
                  fontWeight: 900,
                  fontSize: 18,
                  boxShadow: '0 0 8px #0ff8',
                }}
              >
                {loading ? 'Sending...' : 'Send SMS'}
              </button>
            </div>
            {/* Live Preview */}
            <div
              style={{
                background: '#111',
                color: '#0ff',
                border: '2px dashed #0ff',
                borderRadius: 4,
                padding: 12,
                fontSize: 15,
                fontFamily: 'monospace',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={{ fontWeight: 700, minWidth: 140 }}>
                Invisible Ink Preview:
              </span>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  margin: 0,
                  color: '#fff',
                  background: 'none',
                  flex: 1,
                  fontSize: 16,
                  padding: 0,
                }}
              >
                {message
                  ? encodeInvisibleInk(
                      message,
                      encoder,
                      obfuscate,
                      salt || Date.now().toString(),
                    )
                  : '(empty)'}
              </pre>
              <button
                type="button"
                style={{
                  ...fontStyle,
                  background: '#23272a',
                  color: '#0ff',
                  border: '2px solid #0ff',
                  borderRadius: 4,
                  padding: '6px 12px',
                  fontWeight: 900,
                  fontSize: 15,
                  boxShadow: '0 0 8px #0ff8',
                  marginLeft: 8,
                }}
                onClick={() => {
                  const text = encodeInvisibleInk(
                    message,
                    encoder,
                    obfuscate,
                    salt || Date.now().toString(),
                  )
                  if (navigator.clipboard && text) {
                    navigator.clipboard.writeText(text)
                  }
                }}
                disabled={!message}
                title="Copy invisible ink message"
              >
                Copy
              </button>
            </div>
            {/* Status/Feedback */}
            {status && (
              <div
                style={{
                  background: '#f0f',
                  color: '#111',
                  border: '2px solid #fff',
                  borderRadius: 4,
                  padding: 10,
                  fontWeight: 900,
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 8,
                }}
              >
                {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
