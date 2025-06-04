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

export default function Decode() {
  const [input, setInput] = useState('')
  const [decoded, setDecoded] = useState('')

  function decodeInvisibleInk(zeroWidth, encoderType = 'zwsp') {
    let zero0 = '\u200B',
      zero1 = '\u200C'
    const bytes = zeroWidth.match(new RegExp(`[${zero0}${zero1}]{8}`, 'g'))
    if (!bytes) return ''
    return bytes
      .map((byte) =>
        String.fromCharCode(
          parseInt(
            byte
              .split('')
              .map((ch) => (ch === zero0 ? '0' : '1'))
              .join(''),
            2,
          ),
        ),
      )
      .join('')
  }

  const handleDecode = (e) => {
    e.preventDefault()
    setDecoded(decodeInvisibleInk(input))
  }

  return (
    <div
      style={{
        background: '#2a1831',
        minHeight: '100vh',
        padding: 0,
        ...fontStyle,
      }}
    >
      <div
        style={{
          maxWidth: 540,
          margin: '0 auto',
          border: '4px solid #fff',
          borderRadius: 8,
          boxShadow: '0 0 32px #c0f4, 0 0 2px #000',
          background: '#3a234a',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#111',
            color: '#f0f',
            borderBottom: '2px solid #fff',
            padding: '0.5em 1em',
            fontFamily: 'Chicago, Monaco, monospace',
            fontSize: 18,
            letterSpacing: 2,
          }}
        >
          <span
            style={{
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            NullSMS ▞▚▞▚▞▚
          </span>
          <span style={{ flex: 1 }}></span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 24,
            background: '#222',
            color: '#fff',
            borderBottom: '2px solid #f0f',
            padding: '0.3em 1em',
            fontFamily: 'Chicago, Monaco, monospace',
            fontSize: 15,
          }}
        >
          <a
            href="/"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            🗀 FILE
          </a>
          <a
            href="/"
            style={{
              color: '#f0f',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            NullSMS
          </a>
          <a
            href="/decode"
            style={{
              color: '#0ff',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Decode
          </a>
          <a
            href="/"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            MODE
          </a>
        </div>
        <form
          onSubmit={handleDecode}
          style={{
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <h1
            style={{
              color: '#0ff',
              fontWeight: 900,
              fontSize: 22,
              textAlign: 'center',
              marginBottom: 8,
              fontFamily: 'Chicago, Monaco, monospace',
            }}
          >
            Decode Invisible Ink SMS
          </h1>
          <label
            style={{
              fontWeight: 700,
              color: '#fff',
            }}
          >
            Paste blank/invisible message:
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
              placeholder="Paste the blank SMS here"
              rows={4}
            />
          </label>
          <button
            type="submit"
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
            Decode
          </button>
          {decoded && (
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
                marginTop: 8,
              }}
            >
              <span style={{ fontWeight: 700 }}>Decoded:</span>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  margin: 0,
                  color: '#fff',
                  background: 'none',
                  fontSize: 16,
                  padding: 0,
                }}
              >
                {decoded}
              </pre>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
