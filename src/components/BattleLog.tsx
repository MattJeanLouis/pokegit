import { useEffect, useRef } from 'react'

interface BattleLogProps {
  log: string[]
}

export function BattleLog({ log }: BattleLogProps) {
  const lastThree = log.slice(-3)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [log])

  return (
    <div
      className="gba-panel"
      style={{
        padding: '8px 12px',
        minHeight: '64px',
        background: '#e8f0c8',
        position: 'relative',
      }}
    >
      <div className="battle-log">
        {lastThree.map((line, i) => (
          <div
            key={i}
            style={{
              opacity: i === 0 ? 0.5 : i === 1 ? 0.75 : 1,
            }}
          >
            {i === lastThree.length - 1 ? '> ' : '  '}
            {line}
          </div>
        ))}
      </div>
      <div ref={endRef} />
    </div>
  )
}
