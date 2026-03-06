import { useState } from 'react'
import type { OwnedPokemon } from '../types'

interface StarterScreenProps {
  onChoose: (pokemon: OwnedPokemon) => void
}

interface StarterDef {
  id: number
  name: string
  displayName: string
  type: string
  description: string
  spriteUrl: string
  backSpriteUrl: string
  moves: string[]
}

const STARTERS: StarterDef[] = [
  {
    id: 1,
    name: 'bulbasaur',
    displayName: 'Bulbasaur',
    type: 'Plante / Poison',
    description: 'Solide et endurant. Idéal pour débuter.',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    backSpriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    moves: ['Charge', 'Rugissement', 'Jackpot', 'Fouet Lianes'],
  },
  {
    id: 4,
    name: 'charmander',
    displayName: 'Charmander',
    type: 'Feu',
    description: 'Attaquant puissant. Pour les dresseurs audacieux.',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    backSpriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png',
    moves: ['Charge', 'Rugissement', 'Griffe', 'Flammèche'],
  },
  {
    id: 7,
    name: 'squirtle',
    displayName: 'Squirtle',
    type: 'Eau',
    description: 'Équilibré et résistant. Un choix sûr.',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
    backSpriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/7.png',
    moves: ['Charge', 'Rugissement', 'Pistolet à O', 'Pistolet Eau'],
  },
]

export function StarterScreen({ onChoose }: StarterScreenProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleChoose = () => {
    if (selectedId === null) return
    const starter = STARTERS.find(s => s.id === selectedId)
    if (!starter) return

    const maxHp = 5 * 5 + 20 // level 5: 45 HP
    const pokemon: OwnedPokemon = {
      id: starter.id,
      name: starter.name,
      level: 5,
      hp: maxHp,
      maxHp,
      spriteUrl: starter.spriteUrl,
      backSpriteUrl: starter.backSpriteUrl,
      shiny: false,
      moves: starter.moves,
      xp: 0,
      xpToNext: 5 * 20,
    }

    onChoose(pokemon)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#b8d8a8',
        padding: '16px',
        textAlign: 'center',
      }}
    >
      {/* Titre style GBA */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '11px',
        color: '#1a1a2e',
        textShadow: '2px 2px 0 #fff',
        marginBottom: '6px',
        letterSpacing: '1px',
      }}>
        PROFESSEUR CHEN
      </div>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '9px',
        color: '#207020',
        marginBottom: '20px',
        letterSpacing: '1px',
      }}>
        CHOISIS TON PARTENAIRE !
      </div>

      {/* Les 3 cartes starters */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        width: '100%',
        justifyContent: 'center',
      }}>
        {STARTERS.map(starter => {
          const isSelected = selectedId === starter.id
          return (
            <div
              key={starter.id}
              onClick={() => setSelectedId(starter.id)}
              style={{
                flex: 1,
                background: isSelected ? '#fffce0' : '#e8f0c8',
                border: isSelected ? '3px solid #ffcc00' : '3px solid #1a1a2e',
                padding: '10px 6px',
                cursor: 'pointer',
                transition: 'transform 0.1s',
                transform: isSelected ? 'translateY(-4px)' : 'none',
                boxShadow: isSelected ? '3px 3px 0px #c08000' : '3px 3px 0px #000',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img
                src={starter.spriteUrl}
                alt={starter.displayName}
                style={{
                  width: '64px',
                  height: '64px',
                  imageRendering: 'pixelated',
                  marginBottom: '6px',
                }}
              />
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '7px',
                color: '#1a1a2e',
                marginBottom: '4px',
                textAlign: 'center',
              }}>
                {starter.displayName.toUpperCase()}
              </div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '6px',
                color: '#207020',
                marginBottom: '6px',
                textAlign: 'center',
                lineHeight: '1.4',
              }}>
                {starter.type}
              </div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '6px',
                color: '#555',
                textAlign: 'center',
                lineHeight: '1.5',
              }}>
                {starter.description}
              </div>
              {isSelected && (
                <div style={{
                  marginTop: '8px',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '7px',
                  color: '#c08000',
                  animation: 'blink 1s infinite',
                }}>
                  CHOISI !
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Info niveau */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '7px',
        color: '#555',
        marginBottom: '16px',
      }}>
        Nv.5 — HP complets
      </div>

      {/* Bouton CHOISIR */}
      <button
        className="gba-btn green-btn"
        onClick={handleChoose}
        disabled={selectedId === null}
        style={{
          fontSize: '11px',
          padding: '12px 20px',
          width: '90%',
          letterSpacing: '1px',
          opacity: selectedId === null ? 0.5 : 1,
        }}
      >
        CHOISIR !
      </button>

      {selectedId === null && (
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '7px',
          color: '#888',
          marginTop: '12px',
        }}>
          Sélectionne un Pokémon d'abord
        </div>
      )}
    </div>
  )
}
