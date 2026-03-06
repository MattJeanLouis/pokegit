import { useEffect, useState } from 'react'

interface AttackAnimationProps {
  moveType: string
  emoji: string
  color: string
  onDone?: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  dx: number
  dy: number
  rotate: number
  delay: number
  size: number
  opacity: number
}

function getParticles(moveType: string): Particle[] {
  const rnd = (a: number, b: number) => Math.random() * (b - a) + a
  const count = 7

  switch (moveType) {
    case 'fire':
      return Array.from({ length: count }, (_, i) => ({
        id: i, x: rnd(30, 70), y: rnd(60, 80), dx: rnd(-15, 15), dy: rnd(-70, -40),
        rotate: rnd(-30, 30), delay: i * 60, size: rnd(20, 32), opacity: 1,
      }))
    case 'water':
      return Array.from({ length: count }, (_, i) => ({
        id: i, x: 15 + i * 8, y: rnd(30, 60), dx: rnd(30, 60), dy: rnd(-15, 15),
        rotate: 0, delay: i * 50, size: rnd(16, 26), opacity: 1,
      }))
    case 'electric':
      return Array.from({ length: 5 }, (_, i) => ({
        id: i, x: 10 + i * 18, y: rnd(20, 70), dx: rnd(-5, 5), dy: rnd(-10, 10),
        rotate: rnd(-20, 20), delay: i * 80, size: rnd(24, 36), opacity: 1,
      }))
    case 'grass':
      return Array.from({ length: count }, (_, i) => ({
        id: i, x: rnd(20, 80), y: rnd(40, 80), dx: rnd(-25, 25), dy: rnd(-50, -20),
        rotate: rnd(-180, 180), delay: i * 55, size: rnd(18, 28), opacity: 1,
      }))
    case 'ice':
      return Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * 360
        const rad = (angle * Math.PI) / 180
        return {
          id: i, x: 50, y: 50, dx: Math.cos(rad) * 40, dy: Math.sin(rad) * 30,
          rotate: angle, delay: i * 30, size: rnd(16, 24), opacity: 1,
        }
      })
    case 'psychic':
      return Array.from({ length: 5 }, (_, i) => ({
        id: i, x: 50, y: 50, dx: rnd(-30, 30), dy: rnd(-30, 30),
        rotate: i * 72, delay: i * 70, size: rnd(20, 30), opacity: 1,
      }))
    case 'ghost':
      return Array.from({ length: 5 }, (_, i) => ({
        id: i, x: rnd(30, 70), y: rnd(50, 80), dx: rnd(-10, 10), dy: rnd(-60, -30),
        rotate: rnd(-20, 20), delay: i * 100, size: rnd(20, 32), opacity: 1,
      }))
    case 'rock':
      return Array.from({ length: 6 }, (_, i) => ({
        id: i, x: rnd(20, 80), y: -5, dx: rnd(-10, 10), dy: rnd(50, 80),
        rotate: rnd(-90, 90), delay: i * 60, size: rnd(18, 28), opacity: 1,
      }))
    case 'poison':
      return Array.from({ length: 6 }, (_, i) => ({
        id: i, x: rnd(25, 75), y: rnd(60, 90), dx: rnd(-8, 8), dy: rnd(-55, -30),
        rotate: 0, delay: i * 70, size: rnd(16, 26), opacity: 1,
      }))
    case 'dark':
      return Array.from({ length: 4 }, (_, i) => ({
        id: i, x: rnd(20, 80), y: rnd(20, 80), dx: rnd(-20, 20), dy: rnd(-20, 20),
        rotate: rnd(-45, 45), delay: i * 80, size: rnd(24, 38), opacity: 1,
      }))
    case 'fight':
      return Array.from({ length: 5 }, (_, i) => ({
        id: i, x: 50, y: 50, dx: rnd(-35, 35), dy: rnd(-35, 35),
        rotate: i * 72, delay: i * 50, size: rnd(22, 32), opacity: 1,
      }))
    case 'flying':
      return Array.from({ length: 6 }, (_, i) => ({
        id: i, x: -5, y: rnd(20, 80), dx: rnd(80, 110), dy: rnd(-10, 10),
        rotate: 0, delay: i * 55, size: rnd(18, 28), opacity: 1,
      }))
    case 'dragon':
      return Array.from({ length: 6 }, (_, i) => ({
        id: i, x: 5 + i * 12, y: 50, dx: rnd(20, 50), dy: rnd(-15, 15),
        rotate: rnd(-15, 15), delay: i * 40, size: rnd(22, 34), opacity: 1,
      }))
    case 'steel':
      return Array.from({ length: 6 }, (_, i) => ({
        id: i, x: rnd(20, 80), y: rnd(20, 80), dx: rnd(-15, 15), dy: rnd(-15, 15),
        rotate: i * 60, delay: i * 55, size: rnd(18, 28), opacity: 1,
      }))
    case 'ground':
      return Array.from({ length: 7 }, (_, i) => ({
        id: i, x: 10 + i * 13, y: 95, dx: rnd(-5, 5), dy: rnd(-50, -25),
        rotate: rnd(-30, 30), delay: i * 40, size: rnd(18, 28), opacity: 1,
      }))
    case 'bug':
      return Array.from({ length: 5 }, (_, i) => ({
        id: i, x: rnd(20, 80), y: rnd(20, 80), dx: rnd(-25, 25), dy: rnd(-25, 25),
        rotate: rnd(-90, 90), delay: i * 60, size: rnd(16, 26), opacity: 1,
      }))
    default: // normal
      return Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * 360
        const rad = (angle * Math.PI) / 180
        return {
          id: i, x: 50, y: 50, dx: Math.cos(rad) * 35, dy: Math.sin(rad) * 25,
          rotate: angle, delay: i * 40, size: rnd(16, 26), opacity: 1,
        }
      })
  }
}

export function AttackAnimation({ moveType, emoji, color, onDone }: AttackAnimationProps) {
  const [particles] = useState(() => getParticles(moveType))
  const [active, setActive] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setActive(false)
      onDone?.()
    }, 600)
    return () => clearTimeout(t)
  }, [onDone])

  if (!active) return null

  // Bg flash
  const bgAnim = `attackFlash 0.5s ease-out forwards`

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', overflow: 'hidden',
    }}>
      {/* Background flash */}
      <div style={{
        position: 'absolute', inset: 0,
        background: color,
        animation: bgAnim,
      }} />

      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            lineHeight: 1,
            transform: `translate(-50%, -50%) rotate(${p.rotate}deg)`,
            animation: `particle-${moveType} 0.55s ease-out ${p.delay}ms both`,
            // For types where particle direction is needed, use CSS variables
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
          } as React.CSSProperties}
        >
          {emoji}
        </div>
      ))}
    </div>
  )
}
