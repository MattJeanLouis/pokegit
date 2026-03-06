import { useState, useEffect } from 'react'
import type { GameState } from '../types'
import { ZONE_INFO, getAnimatedSpriteUrl } from '../gameLogic'
import { AttackAnimation } from './AttackAnimation'

interface BattleArenaProps {
  state: GameState
  attackFlash?: { color: string; emoji: string; moveType: string } | null
}

function HpBar({ hp, maxHp, small }: { hp: number; maxHp: number; small?: boolean }) {
  const pct = maxHp > 0 ? Math.max(0, (hp / maxHp)) * 100 : 0
  const color = pct > 50 ? '#30e030' : pct > 20 ? '#f8c000' : '#e03030'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#888', minWidth: small ? '14px' : '16px' }}>PV</span>
      <div style={{ flex: 1, height: small ? '5px' : '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', background: color, width: `${pct}%`,
          transition: 'width 0.3s ease, background 0.3s',
          boxShadow: `0 0 4px ${color}88`,
        }} />
      </div>
    </div>
  )
}

function XpBar({ xp, xpToNext }: { xp: number; xpToNext: number }) {
  const pct = xpToNext > 0 ? Math.min(100, (xp / xpToNext) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#666', minWidth: '16px' }}>EXP</span>
      <div style={{ flex: 1, height: '4px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', background: '#4080ff',
          width: `${pct}%`, transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  )
}

// Pixel-art walking trainer made of CSS (2 frames)
function WalkingTrainer({ frame }: { frame: number }) {
  const bodyColor = '#e84393'
  return (
    <div style={{ position: 'relative', width: '32px', height: '40px', fontFamily: 'monospace' }}>
      {/* Simple pixel trainer using divs */}
      {/* Head */}
      <div style={{ position: 'absolute', top: 0, left: '8px', width: '16px', height: '12px', background: '#f0c080', border: '1px solid #000', borderRadius: '3px' }} />
      {/* Body */}
      <div style={{ position: 'absolute', top: '12px', left: '6px', width: '20px', height: '16px', background: bodyColor, border: '1px solid #000' }} />
      {/* Left leg */}
      <div style={{
        position: 'absolute', top: '28px', left: '8px', width: '6px', height: '12px',
        background: '#2060d0', border: '1px solid #000',
        transform: frame === 0 ? 'rotate(10deg)' : 'rotate(-10deg)',
        transformOrigin: 'top center',
        transition: 'transform 0.2s',
      }} />
      {/* Right leg */}
      <div style={{
        position: 'absolute', top: '28px', left: '18px', width: '6px', height: '12px',
        background: '#2060d0', border: '1px solid #000',
        transform: frame === 0 ? 'rotate(-10deg)' : 'rotate(10deg)',
        transformOrigin: 'top center',
        transition: 'transform 0.2s',
      }} />
      {/* Cap */}
      <div style={{ position: 'absolute', top: '-4px', left: '6px', width: '20px', height: '6px', background: '#e84393', border: '1px solid #000', borderRadius: '2px 2px 0 0' }} />
    </div>
  )
}

export function BattleArena({ state, attackFlash }: BattleArenaProps) {
  const { wildPokemon, team, battleState, currentZone, isLoading, shakingWild, shakingPlayer, idleTimer } = state
  const zoneInfo = ZONE_INFO.find(z => z.id === currentZone)!
  const playerPokemon = team[0] ?? null
  const [walkFrame, setWalkFrame] = useState(0)
  const [trainerX, setTrainerX] = useState(0)
  const [trainerDir, setTrainerDir] = useState(1)

  // Walking animation in idle
  useEffect(() => {
    if (battleState !== 'idle') return
    const frameInterval = setInterval(() => {
      setWalkFrame(f => 1 - f)
    }, 350)
    const moveInterval = setInterval(() => {
      setTrainerX(x => {
        const next = x + trainerDir * 2
        if (next > 60) setTrainerDir(-1)
        if (next < -20) setTrainerDir(1)
        return next
      })
    }, 100)
    return () => { clearInterval(frameInterval); clearInterval(moveInterval) }
  }, [battleState, trainerDir])

  // Get animated sprite URLs (Gen5 GIF)
  const wildAnimUrl = wildPokemon ? getAnimatedSpriteUrl(wildPokemon.id, false) : ''
  const playerAnimUrl = playerPokemon ? getAnimatedSpriteUrl(playerPokemon.id, true) : ''

  // Zone background colors
  const zoneBg: Record<number, string> = {
    1: 'linear-gradient(180deg, #90d8f0 0%, #a0e0a0 60%, #70b870 100%)',
    2: 'linear-gradient(180deg, #607080 0%, #504040 60%, #403030 100%)',
    3: 'linear-gradient(180deg, #1a1a3a 0%, #2a1a4a 50%, #1a0a2a 100%)',
    4: 'linear-gradient(180deg, #0a1a0a 0%, #102010 60%, #081008 100%)',
    5: 'linear-gradient(180deg, #1a0a2a 0%, #2a1040 60%, #3a2050 100%)',
    6: 'linear-gradient(180deg, #000010 0%, #001030 60%, #002050 100%)',
  }
  const groundColors: Record<number, string> = {
    1: '#7ab870', 2: '#6a5a4a', 3: '#3a2a4a',
    4: '#2a3a2a', 5: '#2a1a3a', 6: '#0a0a2a',
  }

  return (
    <div style={{
      position: 'relative', height: '220px', overflow: 'hidden',
      background: zoneBg[currentZone] ?? zoneBg[1],
    }}>
      {/* Attack animation overlay */}
      {attackFlash && (
        <AttackAnimation
          moveType={attackFlash.moveType}
          emoji={attackFlash.emoji}
          color={attackFlash.color}
        />
      )}

      {/* Ground */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px',
        background: groundColors[currentZone] ?? groundColors[1],
        borderTop: '3px solid rgba(0,0,0,0.3)',
      }} />

      {/* Timer bar (top) */}
      {battleState === 'idle' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#1a1a1a' }}>
          <div style={{
            height: '100%', background: '#00ff41',
            width: `${(idleTimer / 30) * 100}%`,
            transition: 'width 1s linear',
            boxShadow: '0 0 6px #00ff41',
          }} />
        </div>
      )}

      {/* Zone label */}
      <div style={{
        position: 'absolute', top: '6px', left: '8px',
        fontFamily: "'Press Start 2P', monospace", fontSize: '6px',
        color: '#fff', background: 'rgba(0,0,0,0.5)',
        padding: '2px 5px', borderRadius: '2px',
      }}>
        {zoneInfo.name}
      </div>

      {/* ─── ENEMY SECTION (top-left info box + top-right sprite) ─── */}
      {wildPokemon && !isLoading && (
        <>
          {/* Enemy info box (top-left) */}
          <div style={{
            position: 'absolute', top: '8px', left: '8px',
            background: 'rgba(10,10,20,0.85)', border: '2px solid #444',
            borderRadius: '6px', padding: '6px 10px', minWidth: '140px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: '#fff' }}>
                {wildPokemon.name.toUpperCase()}
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#888' }}>
                Nv.{wildPokemon.level}
              </div>
            </div>
            <div style={{ marginTop: '4px' }}>
              <HpBar hp={wildPokemon.hp} maxHp={wildPokemon.maxHp} small />
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#666', textAlign: 'right', marginTop: '2px' }}>
                {wildPokemon.hp}/{wildPokemon.maxHp}
              </div>
            </div>
          </div>

          {/* Enemy sprite (top-right) */}
          <div style={{ position: 'absolute', top: '15px', right: '20px' }}>
            <img
              src={wildAnimUrl}
              alt={wildPokemon.name}
              style={{
                width: '80px', height: '80px', imageRendering: 'pixelated',
                transform: shakingWild ? 'translateX(6px)' : 'none',
                transition: 'transform 0.1s',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))',
              }}
              onError={e => {
                const t = e.target as HTMLImageElement
                if (!t.src.includes('generation-v')) return
                t.src = wildPokemon.spriteUrl
              }}
            />
          </div>
        </>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <div style={{
          position: 'absolute', top: '50px', right: '40px',
          fontFamily: "'Press Start 2P', monospace", fontSize: '8px',
          color: '#fff', textShadow: '1px 1px 0 #000',
          animation: 'blink 0.8s infinite',
        }}>
          ···
        </div>
      )}

      {/* Idle: trainer walking */}
      {battleState === 'idle' && !isLoading && (
        <div style={{
          position: 'absolute', bottom: '50px', left: `calc(50% + ${trainerX}px)`,
          transform: `scaleX(${trainerDir < 0 ? -1 : 1})`,
          transition: 'left 0.1s',
        }}>
          {playerPokemon ? (
            <img
              src={getAnimatedSpriteUrl(playerPokemon.id, false)}
              alt={playerPokemon.name}
              style={{ width: '48px', height: '48px', imageRendering: 'pixelated' }}
              onError={e => { (e.target as HTMLImageElement).src = playerPokemon.spriteUrl }}
            />
          ) : (
            <WalkingTrainer frame={walkFrame} />
          )}
        </div>
      )}

      {/* Idle countdown */}
      {battleState === 'idle' && !isLoading && (
        <div style={{
          position: 'absolute', bottom: '8px', right: '8px',
          fontFamily: "'Press Start 2P', monospace", fontSize: '7px',
          color: 'rgba(255,255,255,0.6)',
        }}>
          {idleTimer}s
        </div>
      )}

      {/* ─── PLAYER SECTION (bottom-right info box + bottom-left sprite) ─── */}
      {playerPokemon && battleState !== 'idle' && (
        <>
          {/* Player sprite (bottom-left) */}
          <div style={{ position: 'absolute', bottom: '45px', left: '15px' }}>
            <img
              src={playerAnimUrl}
              alt={playerPokemon.name}
              style={{
                width: '80px', height: '80px', imageRendering: 'pixelated',
                transform: shakingPlayer ? 'translateX(-6px)' : 'none',
                transition: 'transform 0.1s',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))',
              }}
              onError={e => {
                const t = e.target as HTMLImageElement
                if (!t.src.includes('generation-v')) return
                t.src = playerPokemon.backSpriteUrl
              }}
            />
          </div>

          {/* Player info box (bottom-right) */}
          <div style={{
            position: 'absolute', bottom: '8px', right: '8px',
            background: 'rgba(10,10,20,0.85)', border: '2px solid #444',
            borderRadius: '6px', padding: '6px 10px', minWidth: '150px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: '#fff' }}>
                {playerPokemon.name.toUpperCase()}
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#888' }}>
                Nv.{playerPokemon.level}
              </div>
            </div>
            <div style={{ marginTop: '4px' }}>
              <HpBar hp={playerPokemon.hp} maxHp={playerPokemon.maxHp} small />
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#666', textAlign: 'right', marginTop: '1px' }}>
                {playerPokemon.hp}/{playerPokemon.maxHp}
              </div>
              <XpBar xp={playerPokemon.xp} xpToNext={playerPokemon.xpToNext} />
            </div>
          </div>
        </>
      )}

      {/* Caught overlay */}
      {battleState === 'caught' && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Press Start 2P', monospace", gap: '8px',
        }}>
          <div style={{ fontSize: '16px' }}>Gotcha !</div>
          <div style={{ fontSize: '9px', color: '#207020' }}>Pokémon capturé !</div>
          <div style={{ fontSize: '7px', color: '#555', animation: 'blink 1s infinite' }}>
            Appuyer pour continuer...
          </div>
        </div>
      )}
    </div>
  )
}
