import { useState, useEffect } from 'react'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [countdown, setCountdown] = useState(5)
  const [autoStart, setAutoStart] = useState(false)

  useEffect(() => {
    if (countdown <= 0) {
      setAutoStart(true)
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  useEffect(() => {
    if (autoStart) {
      onStart()
    }
  }, [autoStart, onStart])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #1a1a3e 0%, #304070 50%, #605080 100%)',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      {/* Logo style GBA */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '22px',
        color: '#ffcc00',
        textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
        marginBottom: '6px',
        letterSpacing: '2px',
      }}>
        POKÉGIT
      </div>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '8px',
        color: '#98d8d8',
        marginBottom: '32px',
        letterSpacing: '1px',
      }}>
        VERSION DÉVELOPPEUR
      </div>

      {/* Sprite Pikachu decoratif */}
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
        alt="Pikachu"
        style={{
          width: '80px',
          height: '80px',
          imageRendering: 'pixelated',
          marginBottom: '24px',
          animation: 'bounce 1.5s ease-in-out infinite',
        }}
      />

      {/* Description */}
      <div
        className="gba-panel"
        style={{
          background: 'rgba(232,240,200,0.95)',
          padding: '16px',
          marginBottom: '24px',
          maxWidth: '320px',
          width: '100%',
        }}
      >
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '8px',
          color: '#1a1a2e',
          lineHeight: '2',
        }}>
          <div style={{ marginBottom: '10px', fontSize: '9px', color: '#207020' }}>
            BIENVENUE, DRESSEUR !
          </div>
          <div style={{ marginBottom: '8px' }}>
            Ton activité GitHub génère des Pokédollars.
          </div>
          <div style={{ marginBottom: '8px' }}>
            Plus tu codes, plus tu rencontres des Pokémon puissants !
          </div>
          <div style={{ color: '#c08000' }}>
            Capture-les tous !
          </div>
        </div>
      </div>

      {/* Bouton démarrer */}
      <button
        className="gba-btn green-btn"
        onClick={onStart}
        style={{
          fontSize: '11px',
          padding: '12px 20px',
          marginBottom: '16px',
          width: '100%',
          maxWidth: '280px',
          letterSpacing: '1px',
        }}
      >
        COMMENCER L'AVENTURE
      </button>

      {/* Countdown */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '8px',
        color: '#aaa',
      }}>
        {countdown > 0 ? (
          <>
            Premier combat dans{' '}
            <span style={{ color: '#ffcc00', fontSize: '12px' }}>{countdown}</span>
            ...
          </>
        ) : (
          <span style={{ color: '#ffcc00', animation: 'blink 0.5s infinite' }}>
            Démarrage...
          </span>
        )}
      </div>

      {/* Barre de progression du countdown */}
      <div style={{
        width: '200px',
        height: '6px',
        background: '#333',
        border: '2px solid #555',
        marginTop: '10px',
        overflow: 'hidden',
      }}>
        <div
          style={{
            height: '100%',
            background: '#ffcc00',
            width: `${((5 - countdown) / 5) * 100}%`,
            transition: 'width 1s linear',
          }}
        />
      </div>
    </div>
  )
}
