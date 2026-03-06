import { useState } from 'react'
import type { OwnedPokemon } from '../types'
import { capitalizeFirst } from '../gameLogic'

interface TeamViewProps {
  team: OwnedPokemon[]
  pc: OwnedPokemon[]
  onSendToPC: (index: number) => void
}

function HpBar({ hp, maxHp }: { hp: number; maxHp: number }) {
  const pct = maxHp > 0 ? Math.max(0, (hp / maxHp)) * 100 : 0
  const colorClass = pct > 50 ? 'green' : pct > 20 ? 'yellow' : 'red'
  return (
    <div className="hp-bar-container" style={{ marginTop: '3px' }}>
      <div className={`hp-bar ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function PokemonDetail({ pokemon, onClose, onSendToPC }: {
  pokemon: OwnedPokemon
  onClose: () => void
  onSendToPC?: () => void
}) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    }}>
      <div className="gba-panel" style={{
        width: '320px',
        padding: '16px',
        background: '#e8f0c8',
      }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '11px',
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>{capitalizeFirst(pokemon.name)} {pokemon.shiny ? '✨' : ''}</span>
          <span style={{ fontSize: '9px', color: '#555' }}>Nv.{pokemon.level}</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <img
            src={pokemon.spriteUrl}
            alt={pokemon.name}
            style={{ width: '96px', height: '96px', imageRendering: 'pixelated' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
            }}
          />
          <div style={{ flex: 1, fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }}>
            <div>PV : {Math.max(0, pokemon.hp)}/{pokemon.maxHp}</div>
            <HpBar hp={pokemon.hp} maxHp={pokemon.maxHp} />
            <div style={{ marginTop: '8px' }}>CAPACITÉS :</div>
            {pokemon.moves.map((m, i) => (
              <div key={i} style={{ marginTop: '3px', fontSize: '7px', color: '#333' }}>
                - {m.split('-').map(capitalizeFirst).join(' ')}
              </div>
            ))}
          </div>
        </div>
        {pokemon.shiny && (
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            color: '#c8a000',
            marginBottom: '8px',
            textAlign: 'center',
          }}>
            ✨ POKÉMON CHROMATIQUE ! ✨
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          {onSendToPC && (
            <button
              className="gba-btn"
              onClick={onSendToPC}
              style={{ flex: 1, fontSize: '8px' }}
            >
              ENVOYER AU PC
            </button>
          )}
          <button
            className="gba-btn red-btn"
            onClick={onClose}
            style={{ flex: 1, fontSize: '8px' }}
          >
            FERMER
          </button>
        </div>
      </div>
    </div>
  )
}

export function TeamView({ team, pc, onSendToPC }: TeamViewProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showPC, setShowPC] = useState(false)

  const slots = Array.from({ length: 6 }, (_, i) => team[i] ?? null)
  const selectedPokemon = selectedIndex !== null ? team[selectedIndex] : null

  return (
    <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '11px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>TON ÉQUIPE ({team.length}/6)</span>
        <button
          className="gba-btn"
          onClick={() => setShowPC(p => !p)}
          style={{ fontSize: '7px', padding: '5px 8px' }}
        >
          {showPC ? 'ÉQUIPE' : 'BOÎTE PC'}
        </button>
      </div>

      {!showPC ? (
        team.length === 0 ? (
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            color: '#555',
            textAlign: 'center',
            padding: '32px 16px',
            lineHeight: '2',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎮</div>
            <div>Ton équipe est vide.</div>
            <div style={{ marginTop: '8px', color: '#207020' }}>
              Capture des Pokémon !
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {slots.map((pokemon, i) => (
              pokemon ? (
                <div
                  key={i}
                  className="pokemon-card"
                  onClick={() => setSelectedIndex(i)}
                  style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
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
                    <div style={{ marginBottom: '2px' }}>
                      {capitalizeFirst(pokemon.name)}{pokemon.shiny ? ' ✨' : ''}
                    </div>
                    <div style={{ color: '#555' }}>Nv.{pokemon.level}</div>
                    <HpBar hp={pokemon.hp} maxHp={pokemon.maxHp} />
                    <div style={{ fontSize: '6px', color: '#888', marginTop: '1px' }}>
                      PV {Math.max(0, pokemon.hp)}/{pokemon.maxHp}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={i}
                  className="pokemon-card empty"
                  style={{ padding: '8px', minHeight: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#888' }}>
                    VIDE
                  </span>
                </div>
              )
            ))}
          </div>
        )
      ) : (
        <div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '9px', marginBottom: '8px', color: '#555' }}>
            BOÎTE PC ({pc.length} Pokémon)
          </div>
          {pc.length === 0 ? (
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: '#888', textAlign: 'center', padding: '20px' }}>
              Aucun Pokémon en PC
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {pc.map((pokemon, i) => (
                <div
                  key={i}
                  className="pokemon-card"
                  style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <img
                    src={pokemon.spriteUrl}
                    alt={pokemon.name}
                    style={{ width: '40px', height: '40px', imageRendering: 'pixelated' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
                    }}
                  />
                  <div style={{ flex: 1, fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}>
                    <div>{capitalizeFirst(pokemon.name)}{pokemon.shiny ? ' ✨' : ''}</div>
                    <div style={{ color: '#555' }}>Nv.{pokemon.level}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedPokemon && selectedIndex !== null && (
        <PokemonDetail
          pokemon={selectedPokemon}
          onClose={() => setSelectedIndex(null)}
          onSendToPC={() => {
            onSendToPC(selectedIndex)
            setSelectedIndex(null)
          }}
        />
      )}
    </div>
  )
}
