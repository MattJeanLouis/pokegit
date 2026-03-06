import { useState } from 'react'
import type { PotionType, OwnedPokemon, ItemType } from '../types'
import { capitalizeFirst } from '../gameLogic'

interface ShopViewProps {
  pokeDollars: number
  pokeballs: number
  greatBalls: number
  potions: number
  superPotions: number
  hyperPotions: number
  team: OwnedPokemon[]
  onBuy: (item: ItemType, cost: number) => void
  onUsePotion: (pokemonIndex: number, potionType: PotionType) => void
}

interface ShopItem {
  id: ItemType
  name: string
  cost: number
  description: string
  catchBonus: string
  count: number
}

function PokemonSelector({
  team,
  potionType,
  onSelect,
  onClose,
}: {
  team: OwnedPokemon[]
  potionType: PotionType
  onSelect: (index: number) => void
  onClose: () => void
}) {
  const healLabel = potionType === 'potion' ? '20 PV' : potionType === 'superPotion' ? '50 PV' : 'Tous les PV'

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
          fontSize: '9px',
          marginBottom: '12px',
        }}>
          UTILISER SUR QUEL POKÉMON ?
        </div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '7px',
          color: '#207020',
          marginBottom: '12px',
        }}>
          Soin : +{healLabel}
        </div>
        {team.map((pokemon, i) => {
          const isFull = pokemon.hp >= pokemon.maxHp
          return (
            <div
              key={i}
              className="gba-panel"
              style={{
                padding: '8px',
                marginBottom: '6px',
                background: isFull ? '#d0d8b8' : '#e8f0c8',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: isFull ? 'not-allowed' : 'pointer',
                opacity: isFull ? 0.6 : 1,
              }}
              onClick={() => {
                if (!isFull) {
                  onSelect(i)
                }
              }}
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
                <div>{capitalizeFirst(pokemon.name)}</div>
                <div style={{ color: '#555', marginTop: '2px' }}>
                  PV {Math.max(0, pokemon.hp)}/{pokemon.maxHp}
                  {isFull && <span style={{ color: '#207020', marginLeft: '6px' }}>PLEIN</span>}
                </div>
              </div>
            </div>
          )
        })}
        <button
          className="gba-btn red-btn"
          onClick={onClose}
          style={{ width: '100%', fontSize: '8px', marginTop: '8px' }}
        >
          ANNULER
        </button>
      </div>
    </div>
  )
}

export function ShopView({
  pokeDollars,
  pokeballs,
  greatBalls,
  potions,
  superPotions,
  hyperPotions,
  team,
  onBuy,
  onUsePotion,
}: ShopViewProps) {
  const [subTab, setSubTab] = useState<'acheter' | 'inventaire'>('acheter')
  const [selectorPotion, setSelectorPotion] = useState<PotionType | null>(null)

  const ballItems: ShopItem[] = [
    {
      id: 'pokeball',
      name: 'POKÉBALL',
      cost: 50,
      description: 'Capture les Pokémon affaiblis',
      catchBonus: 'Taux de capture de base',
      count: pokeballs,
    },
    {
      id: 'greatball',
      name: 'SUPER BALL',
      cost: 200,
      description: 'Meilleur taux de capture',
      catchBonus: '+15% de taux de capture',
      count: greatBalls,
    },
  ]

  const potionShopItems: ShopItem[] = [
    {
      id: 'potion',
      name: 'POTION',
      cost: 100,
      description: 'Restaure 20 HP à un Pokémon',
      catchBonus: '',
      count: potions,
    },
    {
      id: 'superPotion',
      name: 'SUPER POTION',
      cost: 300,
      description: 'Restaure 50 HP à un Pokémon',
      catchBonus: '',
      count: superPotions,
    },
    {
      id: 'hyperPotion',
      name: 'HYPER POTION',
      cost: 800,
      description: 'Restaure tous les HP',
      catchBonus: '',
      count: hyperPotions,
    },
  ]

  // BUG FIX: Logique BUY x5 corrigée - effectue exactement min(5, max_affordable) achats
  const handleBuyMultiple = (item: ShopItem, qty: number) => {
    const maxAffordable = Math.floor(pokeDollars / item.cost)
    const actualQty = Math.min(qty, maxAffordable)
    for (let i = 0; i < actualQty; i++) {
      onBuy(item.id, item.cost)
    }
  }

  const handleUsePotion = (potionType: PotionType) => {
    setSelectorPotion(potionType)
  }

  const handlePokemonSelected = (index: number) => {
    if (selectorPotion) {
      onUsePotion(index, selectorPotion)
      setSelectorPotion(null)
    }
  }

  const inventoryItems = [
    { label: 'POKÉBALL', count: pokeballs, type: 'ball' as const },
    { label: 'SUPER BALL', count: greatBalls, type: 'ball' as const },
    { label: 'POTION', count: potions, potionType: 'potion' as PotionType, healDesc: 'Restaure 20 HP', type: 'potion' as const },
    { label: 'SUPER POTION', count: superPotions, potionType: 'superPotion' as PotionType, healDesc: 'Restaure 50 HP', type: 'potion' as const },
    { label: 'HYPER POTION', count: hyperPotions, potionType: 'hyperPotion' as PotionType, healDesc: 'Restaure tous les HP', type: 'potion' as const },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
      {/* Sous-onglets internes */}
      <div style={{
        display: 'flex',
        background: '#1a1a2e',
        borderBottom: '3px solid #000',
      }}>
        <button
          onClick={() => setSubTab('acheter')}
          style={{
            flex: 1,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            padding: '10px 6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: subTab === 'acheter' ? '#ffcc00' : '#aaa',
            borderBottom: subTab === 'acheter' ? '3px solid #ffcc00' : '3px solid transparent',
            marginBottom: subTab === 'acheter' ? '-3px' : '0',
          }}
        >
          ACHETER
        </button>
        <button
          onClick={() => setSubTab('inventaire')}
          style={{
            flex: 1,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            padding: '10px 6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: subTab === 'inventaire' ? '#ffcc00' : '#aaa',
            borderBottom: subTab === 'inventaire' ? '3px solid #ffcc00' : '3px solid transparent',
            marginBottom: subTab === 'inventaire' ? '-3px' : '0',
          }}
        >
          INVENTAIRE
        </button>
      </div>

      {/* Vue ACHETER */}
      {subTab === 'acheter' && (
        <div style={{ padding: '12px', flex: 1 }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '11px',
            marginBottom: '4px',
          }}>
            POKÉMART
          </div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '9px',
            marginBottom: '16px',
            color: '#207020',
          }}>
            Solde : {pokeDollars.toLocaleString()}₽
          </div>

          {/* Section Pokéballs */}
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            color: '#3050a0',
            marginBottom: '8px',
          }}>
            — POKÉBALLS —
          </div>

          {ballItems.map(item => (
            <div
              key={item.id}
              className="gba-panel"
              style={{ padding: '12px', marginBottom: '10px', background: '#e8f0c8' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '10px',
                    marginBottom: '6px',
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '7px',
                    color: '#555',
                    marginBottom: '3px',
                  }}>
                    {item.description}
                  </div>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '7px',
                    color: '#207020',
                    marginBottom: '8px',
                  }}>
                    {item.catchBonus}
                  </div>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '7px',
                    color: '#3050a0',
                    fontWeight: 'bold',
                  }}>
                    En stock : {item.count}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '10px',
                    color: '#c08000',
                  }}>
                    {item.cost}₽
                  </div>
                  <button
                    className="gba-btn green-btn"
                    onClick={() => onBuy(item.id, item.cost)}
                    disabled={pokeDollars < item.cost}
                    style={{ fontSize: '9px', padding: '6px 10px' }}
                  >
                    ACHETER
                  </button>
                  <button
                    className="gba-btn"
                    onClick={() => handleBuyMultiple(item, 5)}
                    disabled={pokeDollars < item.cost}
                    style={{ fontSize: '8px', padding: '5px 8px' }}
                  >
                    ACHETER x5
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Section Potions */}
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            color: '#c03030',
            marginBottom: '8px',
            marginTop: '4px',
          }}>
            — OBJETS DE SOIN —
          </div>

          {potionShopItems.map(item => (
            <div
              key={item.id}
              className="gba-panel"
              style={{ padding: '12px', marginBottom: '10px', background: '#e8f0c8' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '10px',
                    marginBottom: '6px',
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '7px',
                    color: '#555',
                    marginBottom: '8px',
                  }}>
                    {item.description}
                  </div>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '7px',
                    color: '#3050a0',
                    fontWeight: 'bold',
                  }}>
                    En stock : {item.count}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '10px',
                    color: '#c08000',
                  }}>
                    {item.cost}₽
                  </div>
                  <button
                    className="gba-btn green-btn"
                    onClick={() => onBuy(item.id, item.cost)}
                    disabled={pokeDollars < item.cost}
                    style={{ fontSize: '9px', padding: '6px 10px' }}
                  >
                    ACHETER
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div
            className="gba-panel"
            style={{ padding: '12px', background: '#d0d8b8', marginTop: '8px' }}
          >
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '8px',
              color: '#555',
              lineHeight: '1.8',
            }}>
              <div style={{ marginBottom: '4px', color: '#1a1a2e' }}>GAGNER PLUS DE ₽ :</div>
              <div>- Chaque commit = +50₽/sync</div>
              <div>- Base = 10₽/sync</div>
              <div>- Étoiles = +1% de capture</div>
            </div>
          </div>
        </div>
      )}

      {/* Vue INVENTAIRE */}
      {subTab === 'inventaire' && (
        <div style={{ padding: '12px', flex: 1 }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '11px',
            marginBottom: '4px',
          }}>
            INVENTAIRE
          </div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            color: '#555',
            marginBottom: '16px',
          }}>
            Tes objets
          </div>

          {/* Section Pokéballs */}
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            color: '#3050a0',
            marginBottom: '8px',
          }}>
            — POKÉBALLS —
          </div>

          {inventoryItems.filter(item => item.type === 'ball').map((item, i) => (
            <div
              key={i}
              className="gba-panel"
              style={{
                padding: '10px 12px',
                marginBottom: '6px',
                background: item.count === 0 ? '#d0d8b8' : '#e8f0c8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: item.count === 0 ? 0.6 : 1,
              }}
            >
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '9px',
                color: item.count === 0 ? '#888' : '#1a1a2e',
              }}>
                {item.label}
              </div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '9px',
                color: item.count === 0 ? '#888' : '#3050a0',
              }}>
                × {item.count}
              </div>
            </div>
          ))}

          {/* Section Objets de Soin */}
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            color: '#c03030',
            marginBottom: '8px',
            marginTop: '12px',
          }}>
            — OBJETS DE SOIN —
          </div>

          {inventoryItems.filter(item => item.type === 'potion').map((item, i) => (
            <div
              key={i}
              className="gba-panel"
              style={{
                padding: '10px 12px',
                marginBottom: '6px',
                background: item.count === 0 ? '#d0d8b8' : '#e8f0c8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: item.count === 0 ? 0.6 : 1,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '9px',
                  color: item.count === 0 ? '#888' : '#1a1a2e',
                  marginBottom: '3px',
                }}>
                  {item.label}
                </div>
                {'healDesc' in item && (
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '6px',
                    color: item.count === 0 ? '#aaa' : '#555',
                  }}>
                    {item.healDesc}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '9px',
                  color: item.count === 0 ? '#888' : '#3050a0',
                }}>
                  × {item.count}
                </div>
                {item.type === 'potion' && item.potionType && (
                  <button
                    className="gba-btn blue-btn"
                    onClick={() => handleUsePotion(item.potionType!)}
                    disabled={item.count === 0 || team.length === 0}
                    style={{ fontSize: '7px', padding: '5px 8px' }}
                  >
                    UTILISER
                  </button>
                )}
              </div>
            </div>
          ))}

          {team.length === 0 && (
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '7px',
              color: '#888',
              textAlign: 'center',
              padding: '12px',
              marginTop: '8px',
            }}>
              Capture un Pokémon pour utiliser les potions !
            </div>
          )}
        </div>
      )}

      {/* Sélecteur de Pokémon pour potion */}
      {selectorPotion && (
        <PokemonSelector
          team={team}
          potionType={selectorPotion}
          onSelect={handlePokemonSelected}
          onClose={() => setSelectorPotion(null)}
        />
      )}
    </div>
  )
}
