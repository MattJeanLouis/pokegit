import { useEffect, useRef, useState } from 'react'

interface BattleLogProps {
  log: string[]
}

export function BattleLog({ log }: BattleLogProps) {
  const lastMsg = log[log.length - 1] ?? ''
  const prevMsg = log[log.length - 2] ?? ''
  const [displayed, setDisplayed] = useState('')
  const [showArrow, setShowArrow] = useState(false)
  const [arrowBlink, setArrowBlink] = useState(true)
  const prevLastMsg = useRef('')

  // Typewriter effect on new message
  useEffect(() => {
    if (lastMsg === prevLastMsg.current) return
    prevLastMsg.current = lastMsg
    setShowArrow(false)
    setDisplayed('')
    let i = 0
    const chars = lastMsg.split('')
    const interval = setInterval(() => {
      i++
      setDisplayed(chars.slice(0, i).join(''))
      if (i >= chars.length) {
        clearInterval(interval)
        setShowArrow(true)
      }
    }, 22)
    return () => clearInterval(interval)
  }, [lastMsg])

  // Arrow blink
  useEffect(() => {
    const t = setInterval(() => setArrowBlink(b => !b), 450)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      background: '#f0f0d0',
      border: '4px solid #181818',
      borderTop: '3px solid #181818',
      position: 'relative',
      minHeight: '72px',
      padding: '8px 14px 10px',
      boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -2px 0 rgba(0,0,0,0.1)',
    }}>
      {/* Corner decorations (GBA style) */}
      <div style={{ position: 'absolute', top: 2, left: 2, width: '6px', height: '6px', background: '#181818', borderRadius: '0 0 3px 0' }} />
      <div style={{ position: 'absolute', top: 2, right: 2, width: '6px', height: '6px', background: '#181818', borderRadius: '0 0 0 3px' }} />

      {/* Previous line (faded) */}
      {prevMsg && (
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '8px',
          color: '#787860',
          lineHeight: '1.7',
          marginBottom: '2px',
          letterSpacing: '0.3px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}>
          {prevMsg}
        </div>
      )}

      {/* Current line with typewriter */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '8px',
        color: '#181818',
        lineHeight: '1.7',
        letterSpacing: '0.3px',
        minHeight: '14px',
      }}>
        {displayed}
        {/* Cursor blinking while typing */}
        {displayed.length < lastMsg.length && displayed.length > 0 && (
          <span style={{ opacity: arrowBlink ? 1 : 0 }}>▋</span>
        )}
      </div>

      {/* Arrow indicator when done typing */}
      {showArrow && (
        <div style={{
          position: 'absolute', bottom: '7px', right: '10px',
          fontSize: '10px',
          opacity: arrowBlink ? 1 : 0,
          color: '#181818',
          transition: 'opacity 0.1s',
        }}>▼</div>
      )}
    </div>
  )
}
