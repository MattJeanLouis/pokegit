import { useState, useEffect } from 'react'
import type { OwnedPokemon } from '../types'
import { getAnimatedSpriteUrl } from '../gameLogic'

interface PokedexViewProps {
  team: OwnedPokemon[]
  pc: OwnedPokemon[]
  seenPokemonIds: number[]
}

interface PokemonDetail {
  id: number
  name: string
  types: string[]
  stats: { name: string; value: number }[]
  description: string
  height: number
  weight: number
  abilities: string[]
}

const TYPE_COLORS: Record<string, string> = {
  fire: '#ff6030', water: '#3090ff', grass: '#40c070', electric: '#ffcc00',
  ice: '#80d0ff', psychic: '#e040a0', ghost: '#6040a0', rock: '#c0a040',
  poison: '#a040c0', dark: '#404080', fighting: '#c03030', flying: '#6090d0',
  dragon: '#7040ff', steel: '#8090a0', ground: '#c09050', bug: '#90a010',
  normal: '#a0a090', fairy: '#e080b0',
}

async function fetchPokemonDetail(id: number): Promise<PokemonDetail | null> {
  try {
    const [pRes, sRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
    ])
    if (!pRes.ok) return null
    const p = await pRes.json()
    let description = ''
    if (sRes.ok) {
      const s = await sRes.json()
      const frEntry = s.flavor_text_entries?.find(
        (e: { language: { name: string }; flavor_text: string }) => e.language.name === 'fr'
      ) ?? s.flavor_text_entries?.find(
        (e: { language: { name: string }; flavor_text: string }) => e.language.name === 'en'
      )
      description = frEntry?.flavor_text?.replace(/\f/g, ' ').replace(/\n/g, ' ') ?? ''
    }
    return {
      id,
      name: p.name,
      types: p.types.map((t: { type: { name: string } }) => t.type.name),
      stats: p.stats.map((s: { stat: { name: string }; base_stat: number }) => ({
        name: s.stat.name.replace('special-attack', 'Sp.Atk').replace('special-defense', 'Sp.Def')
          .replace('attack', 'ATK').replace('defense', 'DEF').replace('speed', 'VIT').replace('hp', 'HP'),
        value: s.base_stat,
      })),
      description,
      height: p.height,
      weight: p.weight,
      abilities: p.abilities.map((a: { ability: { name: string } }) =>
        a.ability.name.replace(/-/g, ' ')
      ),
    }
  } catch {
    return null
  }
}

function TypeBadge({ typeName }: { typeName: string }) {
  const bg = TYPE_COLORS[typeName] ?? '#888'
  return (
    <span style={{
      background: bg, color: '#fff', padding: '2px 8px',
      borderRadius: '10px', fontSize: '6px',
      fontFamily: "'Press Start 2P', monospace",
      textTransform: 'uppercase', marginRight: '4px',
      display: 'inline-block',
    }}>
      {typeName}
    </span>
  )
}

function StatBar({ name, value }: { name: string; value: number }) {
  const pct = Math.min(100, (value / 255) * 100)
  const color = value >= 100 ? '#40d060' : value >= 60 ? '#f8c000' : '#e04040'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '5px', color: '#888', minWidth: '40px' }}>
        {name}
      </span>
      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '5px', color: '#aaa', minWidth: '20px', textAlign: 'right' }}>
        {value}
      </span>
      <div style={{ flex: 1, height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.4s ease' }} />
      </div>
    </div>
  )
}

function PokemonDetailPanel({ pokemon, onClose }: { pokemon: OwnedPokemon; onClose: () => void }) {
  const [detail, setDetail] = useState<PokemonDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const animUrl = getAnimatedSpriteUrl(pokemon.id, false)
  const backUrl = getAnimatedSpriteUrl(pokemon.id, true)

  useEffect(() => {
    setLoading(true)
    fetchPokemonDetail(pokemon.id).then(d => {
      setDetail(d)
      setLoading(false)
    })
  }, [pokemon.id])

  const hpPct = pokemon.maxHp > 0 ? (pokemon.hp / pokemon.maxHp) * 100 : 0
  const hpColor = hpPct > 50 ? '#30c030' : hpPct > 20 ? '#f8b800' : '#e03030'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '12px',
    }}>
      <div style={{
        background: '#0f0f1e', border: '2px solid #444', borderRadius: '12px',
        width: '100%', maxWidth: '380px', maxHeight: '90vh', overflowY: 'auto',
        padding: '16px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px', color: '#fff' }}>
              #{String(pokemon.id).padStart(3, '0')} {pokemon.name.toUpperCase()}
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#888', marginTop: '4px' }}>
              Niveau {pokemon.level}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: '#333', border: '1px solid #555', borderRadius: '6px',
            color: '#aaa', padding: '4px 8px', cursor: 'pointer',
            fontFamily: "'Press Start 2P', monospace", fontSize: '8px',
          }}>✕</button>
        </div>

        {/* Sprites row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <img src={animUrl} alt={pokemon.name}
              style={{ width: '72px', height: '72px', imageRendering: 'pixelated' }}
              onError={e => { (e.target as HTMLImageElement).src = pokemon.spriteUrl }} />
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '5px', color: '#666' }}>FACE</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img src={backUrl} alt={pokemon.name + ' dos'}
              style={{ width: '72px', height: '72px', imageRendering: 'pixelated' }}
              onError={e => { (e.target as HTMLImageElement).src = pokemon.backSpriteUrl }} />
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '5px', color: '#666' }}>DOS</div>
          </div>
        </div>

        {/* Types */}
        {detail && (
          <div style={{ marginBottom: '10px', textAlign: 'center' }}>
            {detail.types.map(t => <TypeBadge key={t} typeName={t} />)}
          </div>
        )}

        {/* HP & XP */}
        <div style={{ background: '#1a1a2e', borderRadius: '6px', padding: '8px', marginBottom: '10px' }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#aaa', marginBottom: '6px' }}>
            ÉTAT
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#888', minWidth: '16px' }}>PV</span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: hpColor, minWidth: '40px' }}>
              {pokemon.hp}/{pokemon.maxHp}
            </span>
            <div style={{ flex: 1, height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${hpPct}%`, height: '100%', background: hpColor, borderRadius: '3px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#888', minWidth: '16px' }}>EXP</span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#4080ff', minWidth: '40px' }}>
              {pokemon.xp}/{pokemon.xpToNext}
            </span>
            <div style={{ flex: 1, height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (pokemon.xp / pokemon.xpToNext) * 100)}%`, height: '100%', background: '#4080ff', borderRadius: '3px' }} />
            </div>
          </div>
        </div>

        {/* Stats from PokéAPI */}
        {loading ? (
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#555', textAlign: 'center', padding: '12px' }}>
            ⌛ Chargement...
          </div>
        ) : detail ? (
          <>
            {/* Base stats */}
            <div style={{ background: '#1a1a2e', borderRadius: '6px', padding: '8px', marginBottom: '10px' }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#aaa', marginBottom: '6px' }}>
                STATS DE BASE
              </div>
              {detail.stats.map(s => <StatBar key={s.name} name={s.name} value={s.value} />)}
            </div>

            {/* Infos */}
            <div style={{ background: '#1a1a2e', borderRadius: '6px', padding: '8px', marginBottom: '10px' }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#aaa', marginBottom: '6px' }}>
                INFOS
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#888' }}>
                  Taille: <span style={{ color: '#fff' }}>{(detail.height / 10).toFixed(1)}m</span>
                </div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#888' }}>
                  Poids: <span style={{ color: '#fff' }}>{(detail.weight / 10).toFixed(1)}kg</span>
                </div>
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '5px', color: '#888', marginBottom: '4px' }}>
                Talents: <span style={{ color: '#ccc' }}>{detail.abilities.join(', ')}</span>
              </div>
              {detail.description && (
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '5px', color: '#aaa', lineHeight: 1.8, marginTop: '6px' }}>
                  {detail.description}
                </div>
              )}
            </div>
          </>
        ) : null}

        {/* Current moves */}
        <div style={{ background: '#1a1a2e', borderRadius: '6px', padding: '8px' }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#aaa', marginBottom: '6px' }}>
            ATTAQUES CONNUES
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {(pokemon.moves.length > 0 ? pokemon.moves : ['—']).map((m, i) => (
              <span key={i} style={{
                background: '#0f0f1e', border: '1px solid #333', borderRadius: '4px',
                padding: '3px 7px', fontFamily: "'Press Start 2P', monospace",
                fontSize: '6px', color: '#ccc',
              }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Small card in the grid
function DexCard({ pokemon, onClick }: { pokemon: OwnedPokemon; onClick: () => void }) {
  const hpPct = pokemon.maxHp > 0 ? (pokemon.hp / pokemon.maxHp) * 100 : 0
  const hpColor = hpPct > 50 ? '#30c030' : hpPct > 20 ? '#f8b800' : '#e03030'
  const animUrl = getAnimatedSpriteUrl(pokemon.id, false)
  return (
    <button onClick={onClick} style={{
      background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px',
      padding: '8px', cursor: 'pointer', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#666')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#333')}
    >
      <img src={animUrl} alt={pokemon.name}
        style={{ width: '48px', height: '48px', imageRendering: 'pixelated' }}
        onError={e => { (e.target as HTMLImageElement).src = pokemon.spriteUrl }} />
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '5px', color: '#888' }}>
        #{String(pokemon.id).padStart(3, '0')}
      </div>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#fff' }}>
        {pokemon.name.toUpperCase().slice(0, 8)}
      </div>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '5px', color: '#666' }}>
        Nv.{pokemon.level}
      </div>
      {/* Mini HP bar */}
      <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${hpPct}%`, height: '100%', background: hpColor }} />
      </div>
    </button>
  )
}

// Seen (but not owned) silhouette card
function SeenCard({ id }: { id: number }) {
  return (
    <div style={{
      background: '#111', border: '1px solid #222', borderRadius: '8px',
      padding: '8px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    }}>
      <div style={{
        width: '48px', height: '48px', background: '#222', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px', filter: 'grayscale(1) brightness(0.3)',
      }}>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
          alt="?"
          style={{ width: '48px', height: '48px', imageRendering: 'pixelated', filter: 'brightness(0) invert(0)' }}
        />
      </div>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '5px', color: '#444' }}>
        #{String(id).padStart(3, '0')}
      </div>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#333' }}>
        ???
      </div>
    </div>
  )
}

export function PokedexView({ team, pc, seenPokemonIds }: PokedexViewProps) {
  const [filter, setFilter] = useState<'all' | 'team' | 'pc'>('all')
  const [selectedPokemon, setSelectedPokemon] = useState<OwnedPokemon | null>(null)

  const allOwned = [...team, ...pc]
  // Dedupe by id (keep first occurrence, which might be in team)
  const ownedMap = new Map<number, OwnedPokemon>()
  allOwned.forEach(p => { if (!ownedMap.has(p.id)) ownedMap.set(p.id, p) })
  const uniqueOwned = Array.from(ownedMap.values())

  // Seen but not owned
  const ownedIds = new Set(allOwned.map(p => p.id))
  const onlySeen = seenPokemonIds.filter(id => !ownedIds.has(id))

  const displayOwned = filter === 'team' ? team : filter === 'pc' ? pc : uniqueOwned

  return (
    <div style={{ background: '#0f0f1e', minHeight: '100%', padding: '10px' }}>
      {selectedPokemon && (
        <PokemonDetailPanel pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '9px', color: '#fff' }}>
          📖 POKÉDEX
        </div>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#888' }}>
          <span style={{ color: '#30c030' }}>✦ {uniqueOwned.length}</span> capturés
          &nbsp;·&nbsp;
          <span style={{ color: '#f8b800' }}>◯ {onlySeen.length}</span> vus
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
        {(['all', 'team', 'pc'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            flex: 1, padding: '6px', fontFamily: "'Press Start 2P', monospace", fontSize: '6px',
            background: filter === f ? '#303060' : '#1a1a2e',
            color: filter === f ? '#fff' : '#666',
            border: `1px solid ${filter === f ? '#5050a0' : '#333'}`,
            borderRadius: '4px', cursor: 'pointer',
          }}>
            {f === 'all' ? `TOUS (${uniqueOwned.length})` : f === 'team' ? `ÉQUIPE (${team.length})` : `PC (${pc.length})`}
          </button>
        ))}
      </div>

      {/* Owned grid */}
      {displayOwned.length === 0 ? (
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#444', textAlign: 'center', padding: '20px' }}>
          Aucun Pokémon ici !<br />
          <span style={{ fontSize: '5px', color: '#333', lineHeight: 2.5 }}>Explore pour en capturer</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
          {displayOwned.map((p, i) => (
            <DexCard key={i} pokemon={p} onClick={() => setSelectedPokemon(p)} />
          ))}
        </div>
      )}

      {/* Seen but not owned */}
      {filter === 'all' && onlySeen.length > 0 && (
        <>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#555', marginBottom: '6px', borderTop: '1px solid #222', paddingTop: '10px' }}>
            VUS DANS LA NATURE
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {onlySeen.map(id => <SeenCard key={id} id={id} />)}
          </div>
        </>
      )}

      {/* Empty state for first launch */}
      {uniqueOwned.length === 0 && onlySeen.length === 0 && (
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#444', textAlign: 'center', padding: '30px 20px', lineHeight: 2.5 }}>
          Ton Pokédex est vide !<br />
          <span style={{ fontSize: '5px', color: '#333' }}>Explore et capture des Pokémon pour les voir ici.</span>
        </div>
      )}
    </div>
  )
}
