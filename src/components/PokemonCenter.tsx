import { useState, useEffect } from 'react'
import type { OwnedPokemon } from '../types'
import { capitalizeFirst } from '../gameLogic'

interface PokemonCenterProps {
  team: OwnedPokemon[]
  lastHealTime: number
  onHeal: () => void
}

const COOLDOWN_MS = 5 * 60 * 1000 // 5 minutes

function HpBar({ hp, maxHp }: { hp: number; maxHp: number }) {
  const pct = maxHp > 0 ? Math.max(0, (hp / maxHp)) * 100 : 0
  const colorClass = pct > 50 ? 'green' : pct > 20 ? 'yellow' : 'red'
  return (
    <div className="hp-bar-container" style={{ marginTop: '3px' }}>
      <div className={`hp-bar ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function PokemonCenter({ team, lastHealTime, onHeal }: PokemonCenterProps) {
  const [now, setNow] = useState(Date.now())
  const [showMessage, setShowMessage] = useState('')

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const elapsed = now - lastHealTime
  const onCooldown = lastHealTime > 0 && elapsed < COOLDOWN_MS
  const remainingMs = onCooldown ? COOLDOWN_MS - elapsed : 0

  const allFull = team.length > 0 && team.every(p => p.hp >= p.maxHp)

  const handleHeal = () => {
    if (onCooldown) return
    if (allFull) {
      setShowMessage('Ton équipe est en pleine forme !')
      setTimeout(() => setShowMessage(''), 3000)
      return
    }
    onHeal()
    setShowMessage('Tes Pokémon ont été soignés ! Bonne chance, Dresseur !')
    setTimeout(() => setShowMessage(''), 4000)
  }

  return (
    <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
      {/* Titre */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '11px',
        marginBottom: '4px',
      }}>
        CENTRE POKÉMON
      </div>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '8px',
        color: '#c03030',
        marginBottom: '16px',
      }}>
        + Soins gratuits pour votre équipe
      </div>

      {/* Message de soin */}
      {showMessage !== '' && (
        <div
          className="gba-panel"
          style={{
            background: '#d0f0c8',
            padding: '10px',
            marginBottom: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            color: '#207020',
            lineHeight: '1.8',
          }}>
            {showMessage}
          </div>
        </div>
      )}

      {/* Équipe */}
      {team.length === 0 ? (
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '8px',
          color: '#555',
          textAlign: 'center',
          padding: '32px 16px',
          lineHeight: '2',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏥</div>
          <div>Ton équipe est vide.</div>
          <div style={{ marginTop: '8px', color: '#207020' }}>Capture des Pokémon !</div>
        </div>
      ) : (
        <div style={{ marginBottom: '16px' }}>
          {team.map((pokemon, i) => (
            <div
              key={i}
              className="gba-panel"
              style={{
                padding: '10px',
                marginBottom: '8px',
                background: '#e8f0c8',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <img
                src={pokemon.spriteUrl}
                alt={pokemon.name}
                style={{ width: '48px', height: '48px', imageRendering: 'pixelated' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
                }}
              />
              <div style={{ flex: 1, fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}>
                <div style={{ marginBottom: '3px' }}>
                  {capitalizeFirst(pokemon.name).toUpperCase()}{pokemon.shiny ? ' ✨' : ''}
                  <span style={{ color: '#555', marginLeft: '6px' }}>Nv.{pokemon.level}</span>
                </div>
                <HpBar hp={pokemon.hp} maxHp={pokemon.maxHp} />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '3px',
                  fontSize: '6px',
                  color: pokemon.hp >= pokemon.maxHp ? '#207020' : '#c03030',
                }}>
                  <span>PV {Math.max(0, pokemon.hp)}/{pokemon.maxHp}</span>
                  {pokemon.hp >= pokemon.maxHp && (
                    <span style={{ color: '#207020' }}>PLEIN</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bouton de soin */}
      <button
        className={`gba-btn ${onCooldown ? '' : 'green-btn'}`}
        onClick={handleHeal}
        disabled={onCooldown || team.length === 0}
        style={{
          width: '100%',
          fontSize: '10px',
          padding: '12px',
          marginBottom: '10px',
        }}
      >
        SOIGNER TOUTE L'ÉQUIPE
      </button>

      {/* Cooldown info */}
      {onCooldown ? (
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '7px',
          color: '#c03030',
          textAlign: 'center',
          padding: '8px',
        }}>
          Prochain soin disponible dans {formatCountdown(remainingMs)}
        </div>
      ) : (
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '7px',
          color: '#207020',
          textAlign: 'center',
          padding: '8px',
        }}>
          Soin disponible — Gratuit !
        </div>
      )}

      {/* Info panneau */}
      <div
        className="gba-panel"
        style={{ padding: '12px', background: '#d0d8b8', marginTop: '8px' }}
      >
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '7px',
          color: '#555',
          lineHeight: '1.8',
        }}>
          <div style={{ marginBottom: '4px', color: '#1a1a2e' }}>INFIRMIÈRE JOËLLE :</div>
          <div>"Nous allons prendre soin</div>
          <div>de vos Pokémon."</div>
          <div style={{ marginTop: '6px', color: '#888' }}>Recharge : 5 minutes</div>
        </div>
      </div>
    </div>
  )
}
