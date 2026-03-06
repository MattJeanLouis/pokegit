import { useState } from 'react'
import type { GameState, BallType, OwnedPokemon } from '../types'
import { getMoveInfo, STATUS_MOVES } from '../gameLogic'

interface ActionPanelProps {
  state: GameState
  onExplore: () => void
  onFight: () => void
  onFightWithMove?: (moveName: string) => void
  onThrowBall: (ballType: BallType) => void
  onRun: () => void
  onSwitch?: (targetIndex: number) => void
}

export function ActionPanel({
  state, onExplore, onFightWithMove, onThrowBall, onRun, onSwitch,
}: ActionPanelProps) {
  const [showBag, setShowBag] = useState(false)
  const [showSwitch, setShowSwitch] = useState(false)
  const { battleState, player, wildPokemon, isLoading } = state

  const isInBattle = battleState === 'encounter' || battleState === 'fighting'
  const playerPokemon = state.team[0]
  const moves = playerPokemon?.moves ?? []
  const switchableTeam = state.team.slice(1).filter(p => p.hp > 0)

  const handleFightMove = (moveName: string) => {
    if (onFightWithMove) onFightWithMove(moveName)
  }

  const handleThrowBall = (ballType: BallType) => {
    onThrowBall(ballType)
    setShowBag(false)
  }

  const handleSwitch = (i: number) => {
    // find actual index in full team
    const target = state.team.findIndex((p, idx) => idx > 0 && p === switchableTeam[i])
    if (target >= 0 && onSwitch) {
      onSwitch(target)
      setShowSwitch(false)
    }
  }

  // Switch panel
  if (showSwitch && isInBattle) {
    return (
      <div style={{ background: '#1a1a2e', borderTop: '2px solid #444', padding: '8px' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#aaa', marginBottom: '6px' }}>
          CHANGER DE POKÉMON
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {switchableTeam.length === 0 ? (
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#555', textAlign: 'center', padding: '8px' }}>
              Pas d'autre Pokémon disponible !
            </div>
          ) : switchableTeam.map((p: OwnedPokemon, i: number) => {
            const hpPct = p.hp / p.maxHp
            return (
              <button key={i} onClick={() => handleSwitch(i)} style={{
                background: '#0f0f1e', border: '1px solid #333', borderRadius: '4px',
                padding: '6px 10px', cursor: 'pointer', fontFamily: "'Press Start 2P', monospace",
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: '8px', color: '#fff' }}>{p.name.toUpperCase()} Nv.{p.level}</span>
                <span style={{ fontSize: '7px', color: hpPct > 0.5 ? '#30c030' : hpPct > 0.2 ? '#f8b800' : '#e03030' }}>
                  PV {p.hp}/{p.maxHp}
                </span>
              </button>
            )
          })}
          <button onClick={() => setShowSwitch(false)} style={{
            background: '#333', border: '1px solid #555', borderRadius: '4px',
            padding: '6px', cursor: 'pointer', fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px', color: '#aaa',
          }}>
            ✕ RETOUR
          </button>
        </div>
      </div>
    )
  }

  // Ball selection panel
  if (showBag && isInBattle) {
    return (
      <div style={{ background: '#1a1a2e', borderTop: '2px solid #444', padding: '8px' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#aaa', marginBottom: '6px' }}>
          LANCER UNE BALL
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => handleThrowBall('pokeball')} disabled={player.pokeballs <= 0} style={{
            flex: 1, padding: '8px', fontFamily: "'Press Start 2P', monospace", fontSize: '7px',
            background: player.pokeballs > 0 ? '#c83030' : '#333',
            color: player.pokeballs > 0 ? '#fff' : '#666',
            border: 'none', borderRadius: '4px', cursor: player.pokeballs > 0 ? 'pointer' : 'not-allowed',
          }}>
            🔴 POKÉBALL<br />
            <span style={{ fontSize: '6px', color: '#ffcc88' }}>x{player.pokeballs}</span>
          </button>
          <button onClick={() => handleThrowBall('greatball')} disabled={player.greatBalls <= 0} style={{
            flex: 1, padding: '8px', fontFamily: "'Press Start 2P', monospace", fontSize: '7px',
            background: player.greatBalls > 0 ? '#3050c8' : '#333',
            color: player.greatBalls > 0 ? '#fff' : '#666',
            border: 'none', borderRadius: '4px', cursor: player.greatBalls > 0 ? 'pointer' : 'not-allowed',
          }}>
            🔵 SUPER BALL<br />
            <span style={{ fontSize: '6px', color: '#88ccff' }}>x{player.greatBalls}</span>
          </button>
          <button onClick={() => setShowBag(false)} style={{
            padding: '8px 10px', fontFamily: "'Press Start 2P', monospace", fontSize: '9px',
            background: '#333', color: '#aaa', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer',
          }}>✕</button>
        </div>
      </div>
    )
  }

  // Caught state
  if (battleState === 'caught') {
    return (
      <div style={{ background: '#1a1a2e', borderTop: '2px solid #444', padding: '8px' }}>
        <button onClick={onExplore} style={{
          width: '100%', padding: '12px', fontFamily: "'Press Start 2P', monospace", fontSize: '9px',
          background: '#20a020', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer',
        }}>
          ▶ CONTINUER
        </button>
      </div>
    )
  }

  // Idle state — explore button
  if (battleState === 'idle') {
    return (
      <div style={{ background: '#1a1a2e', borderTop: '2px solid #444', padding: '8px' }}>
        <button onClick={onExplore} disabled={isLoading} style={{
          width: '100%', padding: '12px', fontFamily: "'Press Start 2P', monospace", fontSize: '10px',
          background: isLoading ? '#333' : '#20803a',
          color: isLoading ? '#555' : '#fff',
          border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer',
          letterSpacing: '1px',
        }}>
          {isLoading ? '⌛ CHARGEMENT...' : '🌿 EXPLORER'}
        </button>
      </div>
    )
  }

  // Battle state — move selection grid
  if (isInBattle && wildPokemon && playerPokemon) {
    const visibleMoves = moves.length > 0 ? moves : ['Charge', 'Rugissement', 'Jackpot', 'Tranche']
    return (
      <div style={{ background: '#1a1a2e', borderTop: '2px solid #444' }}>
        {/* Move grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#111' }}>
          {visibleMoves.slice(0, 4).map((moveName, i) => {
            const { emoji, color } = getMoveInfo(moveName)
            const isStatus = STATUS_MOVES.has(moveName)
            return (
              <button
                key={i}
                onClick={() => handleFightMove(moveName)}
                style={{
                  padding: '10px 8px',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '7px',
                  background: `linear-gradient(135deg, #0f0f1e, #1a1a2e)`,
                  color: isStatus ? '#888' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  border: 'none',
                  borderLeft: `3px solid ${color.replace('bb', 'ff')}`,
                  transition: 'background 0.1s',
                  lineHeight: '1.6',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = color)}
                onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #0f0f1e, #1a1a2e)')}
              >
                <div>{emoji} {moveName}</div>
                {isStatus && <div style={{ fontSize: '5px', color: '#666', marginTop: '2px' }}>STATUT</div>}
              </button>
            )
          })}
        </div>
        {/* Bottom row: SAC + CHANGER + FUITE */}
        <div style={{ display: 'flex', gap: '1px', background: '#111' }}>
          <button onClick={() => { setShowBag(true); setShowSwitch(false) }} style={{
            flex: 1, padding: '8px 4px', fontFamily: "'Press Start 2P', monospace", fontSize: '7px',
            background: '#1a2a3a', color: '#88ccff', cursor: 'pointer', border: 'none',
          }}>
            🎒 SAC
          </button>
          {switchableTeam.length > 0 && (
            <button onClick={() => { setShowSwitch(true); setShowBag(false) }} style={{
              flex: 1, padding: '8px 4px', fontFamily: "'Press Start 2P', monospace", fontSize: '7px',
              background: '#1a2a1a', color: '#88ff88', cursor: 'pointer', border: 'none',
            }}>
              🔄 CHANGER
            </button>
          )}
          <button onClick={onRun} style={{
            flex: 1, padding: '8px 4px', fontFamily: "'Press Start 2P', monospace", fontSize: '7px',
            background: '#2a1a1a', color: '#ff8888', cursor: 'pointer', border: 'none',
          }}>
            🏃 FUITE
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#1a1a2e', borderTop: '2px solid #444', padding: '8px' }}>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: '#555', textAlign: 'center' }}>
        {isLoading ? '⌛ Recherche...' : '—'}
      </div>
    </div>
  )
}
