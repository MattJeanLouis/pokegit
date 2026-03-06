import { useState, useEffect } from 'react'
import type { GameState } from '../types'
import { ZONE_INFO, getAnimatedSpriteUrl } from '../gameLogic'
import { AttackAnimation } from './AttackAnimation'

interface BattleArenaProps {
  state: GameState
  attackFlash?: { color: string; emoji: string; moveType: string } | null
}

// ─── GBA-style HP bar ───────────────────────────────────────────────────────
function GBAHpBar({
  hp, maxHp, name, level, xp, xpToNext, isPlayer,
}: {
  hp: number; maxHp: number; name: string; level: number;
  xp?: number; xpToNext?: number; isPlayer?: boolean;
}) {
  const pct = maxHp > 0 ? Math.max(0, Math.min(1, hp / maxHp)) : 0
  const color = pct > 0.5 ? '#58d858' : pct > 0.2 ? '#f8c800' : '#f83830'
  const xpPct = xpToNext && xpToNext > 0 ? Math.min(1, (xp ?? 0) / xpToNext) : 0

  return (
    <div style={{
      background: '#f0f0c8',
      border: '3px solid #181818',
      borderRadius: '4px',
      padding: isPlayer ? '5px 10px 5px' : '4px 10px 3px',
      minWidth: isPlayer ? '170px' : '155px',
      fontFamily: "'Press Start 2P', monospace",
      boxShadow: '3px 3px 0 #606060',
    }}>
      {/* Name + Level */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
        <span style={{ fontSize: '7px', color: '#181818', letterSpacing: '0.3px' }}>
          {name.toUpperCase().slice(0, 11)}
        </span>
        <span style={{ fontSize: '6px', color: '#484848' }}>Lv{level}</span>
      </div>

      {/* HP label + bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '5px', color: color, minWidth: '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>HP</span>
        <div style={{ flex: 1, height: '8px', background: '#282828', border: '1px solid #181818', borderRadius: '1px', overflow: 'hidden', position: 'relative' }}>
          {/* top shine */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.2)', zIndex: 1 }} />
          <div style={{
            height: '100%', width: `${pct * 100}%`,
            background: color,
            transition: 'width 0.35s ease, background 0.35s',
            position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.5)' }} />
          </div>
        </div>
      </div>

      {/* Numeric HP (player only) */}
      {isPlayer && (
        <div style={{ textAlign: 'right', fontSize: '6px', color: '#484848', marginTop: '2px' }}>
          {hp}<span style={{ color: '#888' }}>/{maxHp}</span>
        </div>
      )}

      {/* EXP bar (player only) */}
      {isPlayer && xpToNext !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', borderTop: '1px solid #d0d0a8', paddingTop: '3px' }}>
          <span style={{ fontSize: '5px', color: '#4878e8', minWidth: '13px' }}>EXP</span>
          <div style={{ flex: 1, height: '4px', background: '#282828', border: '1px solid #181818', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${xpPct * 100}%`, background: '#4878e8', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Walking pixel trainer ──────────────────────────────────────────────────
function WalkingTrainer({ frame }: { frame: number }) {
  return (
    <div style={{ position: 'relative', width: '32px', height: '40px' }}>
      <div style={{ position: 'absolute', top: 0, left: '8px', width: '16px', height: '12px', background: '#f0c080', border: '1px solid #000', borderRadius: '3px' }} />
      <div style={{ position: 'absolute', top: '12px', left: '6px', width: '20px', height: '16px', background: '#e84393', border: '1px solid #000' }} />
      <div style={{ position: 'absolute', top: '28px', left: '8px', width: '6px', height: '12px', background: '#2060d0', border: '1px solid #000', transform: frame === 0 ? 'rotate(10deg)' : 'rotate(-10deg)', transformOrigin: 'top center', transition: 'transform 0.2s' }} />
      <div style={{ position: 'absolute', top: '28px', left: '18px', width: '6px', height: '12px', background: '#2060d0', border: '1px solid #000', transform: frame === 0 ? 'rotate(-10deg)' : 'rotate(10deg)', transformOrigin: 'top center', transition: 'transform 0.2s' }} />
      <div style={{ position: 'absolute', top: '-4px', left: '6px', width: '20px', height: '6px', background: '#e84393', border: '1px solid #000', borderRadius: '2px 2px 0 0' }} />
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────
export function BattleArena({ state, attackFlash }: BattleArenaProps) {
  const { wildPokemon, team, battleState, currentZone, isLoading, shakingWild, shakingPlayer, idleTimer } = state
  const zoneInfo = ZONE_INFO.find(z => z.id === currentZone)!
  const playerPokemon = team[0] ?? null
  const [walkFrame, setWalkFrame] = useState(0)
  const [trainerX, setTrainerX] = useState(0)
  const [trainerDir, setTrainerDir] = useState(1)

  useEffect(() => {
    if (battleState !== 'idle') return
    const fi = setInterval(() => setWalkFrame(f => 1 - f), 350)
    const mi = setInterval(() => {
      setTrainerX(x => {
        const next = x + trainerDir * 2
        if (next > 60) setTrainerDir(-1)
        if (next < -20) setTrainerDir(1)
        return next
      })
    }, 100)
    return () => { clearInterval(fi); clearInterval(mi) }
  }, [battleState, trainerDir])

  const wildAnimUrl = wildPokemon ? getAnimatedSpriteUrl(wildPokemon.id, false) : ''
  const playerAnimUrl = playerPokemon ? getAnimatedSpriteUrl(playerPokemon.id, true) : ''

  // Zone-specific colors
  const configs: Record<number, { sky: string; ground: string; platE: string; platP: string }> = {
    1: { sky: '#78c8f0', ground: '#50981a', platE: '#68c028', platP: '#80d840' },
    2: { sky: '#708898', ground: '#5a4838', platE: '#7a6848', platP: '#907858' },
    3: { sky: '#1a1a4a', ground: '#2a204a', platE: '#483870', platP: '#584888' },
    4: { sky: '#0a1808', ground: '#182810', platE: '#204020', platP: '#305030' },
    5: { sky: '#180a28', ground: '#281040', platE: '#402060', platP: '#503070' },
    6: { sky: '#000010', ground: '#08082a', platE: '#101838', platP: '#181848' },
  }
  const cfg = configs[currentZone] ?? configs[1]

  return (
    <div style={{ position: 'relative', height: '235px', overflow: 'hidden', background: cfg.sky }}>

      {/* Attack animation */}
      {attackFlash && (
        <AttackAnimation moveType={attackFlash.moveType} emoji={attackFlash.emoji} color={attackFlash.color} />
      )}

      {/* Far ground strip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '115px',
        background: cfg.ground,
      }} />
      {/* Horizon line */}
      <div style={{
        position: 'absolute', bottom: '113px', left: 0, right: 0, height: '2px',
        background: 'rgba(0,0,0,0.4)',
      }} />
      {/* Near ground shadow */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.25) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Timer bar */}
      {battleState === 'idle' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#1a1a1a' }}>
          <div style={{ height: '100%', background: '#00ff41', width: `${(idleTimer / 30) * 100}%`, transition: 'width 1s linear', boxShadow: '0 0 6px #00ff41' }} />
        </div>
      )}

      {/* Zone label */}
      <div style={{
        position: 'absolute', top: '7px', left: '8px',
        fontFamily: "'Press Start 2P', monospace", fontSize: '6px',
        color: '#fff', background: 'rgba(0,0,0,0.55)',
        padding: '2px 6px', borderRadius: '2px',
        border: '1px solid rgba(255,255,255,0.15)',
      }}>{zoneInfo.name}</div>

      {/* ══ ENEMY SIDE ══ */}
      {wildPokemon && !isLoading && (
        <>
          {/* Enemy platform oval */}
          <div style={{
            position: 'absolute', top: '103px', right: '22px',
            width: '95px', height: '20px',
            background: cfg.platE,
            borderRadius: '50%',
            boxShadow: '0 5px 0 rgba(0,0,0,0.35)',
            border: '1px solid rgba(0,0,0,0.25)',
          }} />
          {/* Enemy sprite */}
          <div style={{ position: 'absolute', top: '15px', right: '25px' }}>
            <img
              src={wildAnimUrl} alt={wildPokemon.name}
              style={{
                width: '90px', height: '90px', imageRendering: 'pixelated',
                transform: shakingWild ? 'translateX(8px)' : 'none',
                transition: 'transform 0.07s',
                filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.5))',
              }}
              onError={e => {
                const t = e.target as HTMLImageElement
                if (!t.src.includes('generation-v')) return
                t.src = wildPokemon.spriteUrl
              }}
            />
          </div>
          {/* Enemy HP box */}
          <div style={{ position: 'absolute', top: '10px', left: '6px' }}>
            <GBAHpBar hp={wildPokemon.hp} maxHp={wildPokemon.maxHp} name={wildPokemon.name} level={wildPokemon.level} />
          </div>
        </>
      )}

      {/* Loading */}
      {isLoading && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          fontFamily: "'Press Start 2P', monospace", fontSize: '10px',
          color: '#fff', textShadow: '1px 1px 0 #000',
          animation: 'blink 0.8s infinite',
        }}>···</div>
      )}

      {/* Idle: walking sprite */}
      {battleState === 'idle' && !isLoading && (
        <div style={{
          position: 'absolute', bottom: '58px', left: `calc(32% + ${trainerX}px)`,
          transform: `scaleX(${trainerDir < 0 ? -1 : 1})`, transition: 'left 0.1s',
        }}>
          {playerPokemon ? (
            <img
              src={getAnimatedSpriteUrl(playerPokemon.id, false)} alt={playerPokemon.name}
              style={{ width: '52px', height: '52px', imageRendering: 'pixelated' }}
              onError={e => { (e.target as HTMLImageElement).src = playerPokemon.spriteUrl }}
            />
          ) : <WalkingTrainer frame={walkFrame} />}
        </div>
      )}
      {battleState === 'idle' && !isLoading && (
        <div style={{ position: 'absolute', bottom: '8px', right: '8px', fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: 'rgba(255,255,255,0.5)' }}>
          {idleTimer}s
        </div>
      )}

      {/* ══ PLAYER SIDE ══ */}
      {playerPokemon && battleState !== 'idle' && (
        <>
          {/* Player platform oval */}
          <div style={{
            position: 'absolute', bottom: '47px', left: '12px',
            width: '105px', height: '22px',
            background: cfg.platP,
            borderRadius: '50%',
            boxShadow: '0 5px 0 rgba(0,0,0,0.35)',
            border: '1px solid rgba(0,0,0,0.25)',
          }} />
          {/* Player sprite */}
          <div style={{ position: 'absolute', bottom: '42px', left: '12px', width: '105px', display: 'flex', justifyContent: 'center' }}>
            <img
              src={playerAnimUrl} alt={playerPokemon.name}
              style={{
                width: '90px', height: '90px', imageRendering: 'pixelated',
                transform: shakingPlayer ? 'translateX(-8px)' : 'none',
                transition: 'transform 0.07s',
                filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.5))',
              }}
              onError={e => {
                const t = e.target as HTMLImageElement
                if (!t.src.includes('generation-v')) return
                t.src = playerPokemon.backSpriteUrl
              }}
            />
          </div>
          {/* Player HP box */}
          <div style={{ position: 'absolute', bottom: '6px', right: '5px' }}>
            <GBAHpBar
              hp={playerPokemon.hp} maxHp={playerPokemon.maxHp}
              name={playerPokemon.name} level={playerPokemon.level}
              xp={playerPokemon.xp} xpToNext={playerPokemon.xpToNext}
              isPlayer
            />
          </div>
        </>
      )}

      {/* Caught overlay */}
      {battleState === 'caught' && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.88)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Press Start 2P', monospace", gap: '8px',
        }}>
          <div style={{ fontSize: '16px' }}>Gotcha !</div>
          <div style={{ fontSize: '9px', color: '#207020' }}>Pokémon capturé !</div>
          <div style={{ fontSize: '7px', color: '#555', animation: 'blink 1s infinite' }}>Appuyer pour continuer...</div>
        </div>
      )}
    </div>
  )
}
