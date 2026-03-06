import type { Zone } from '../types'
import { ZONE_INFO, getAvailableZones } from '../gameLogic'

interface ZoneSelectorProps {
  currentZone: Zone
  repoCount: number
  badges?: boolean[]
  onChangeZone: (zone: Zone) => void
}

const ZONE_COLORS: Record<number, { bg: string; accent: string; emoji: string }> = {
  1: { bg: '#78c850', accent: '#40a020', emoji: '🌿' },
  2: { bg: '#607060', accent: '#405040', emoji: '⛰️' },
  3: { bg: '#304070', accent: '#1a2a50', emoji: '🌌' },
  4: { bg: '#1a3020', accent: '#0a2010', emoji: '🌲' },
  5: { bg: '#3a1050', accent: '#2a0840', emoji: '🌺' },
  6: { bg: '#001030', accent: '#001050', emoji: '✨' },
}

export function ZoneSelector({ currentZone, repoCount, badges = [], onChangeZone }: ZoneSelectorProps) {
  const availableZones = getAvailableZones(repoCount, badges)

  return (
    <div style={{ padding: '8px', flex: 1, overflowY: 'auto', background: '#0f0f1e' }}>
      <div style={{
        fontFamily: "'Press Start 2P', monospace", fontSize: '9px', color: '#aaa',
        marginBottom: '10px', letterSpacing: '1px',
      }}>
        🗺 CARTE DES ZONES ({availableZones.length}/6)
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {ZONE_INFO.map(zone => {
          const isUnlocked = availableZones.includes(zone.id)
          const isActive = zone.id === currentZone
          const colors = ZONE_COLORS[zone.id] ?? ZONE_COLORS[1]
          const badgesRequired = zone.badgesRequired ?? 0

          return (
            <div
              key={zone.id}
              onClick={() => isUnlocked && onChangeZone(zone.id)}
              style={{
                background: isActive ? 'rgba(0,255,65,0.08)' : isUnlocked ? '#0f0f1e' : '#080810',
                border: `2px solid ${isActive ? '#00ff41' : isUnlocked ? '#333' : '#1a1a2a'}`,
                borderRadius: '6px', overflow: 'hidden',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                opacity: isUnlocked ? 1 : 0.5,
                transition: 'border-color 0.2s',
              }}
            >
              {/* Zone header */}
              <div style={{
                background: colors.bg, padding: '6px 10px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: '#fff' }}>
                  {colors.emoji} Zone {zone.id} — {zone.name}
                </div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}>
                  {isActive ? (
                    <span style={{ background: '#000', color: '#ffcc00', padding: '2px 4px' }}>▶ ICI</span>
                  ) : !isUnlocked ? (
                    <span style={{ color: '#ffcc00' }}>🔒</span>
                  ) : null}
                </div>
              </div>

              {/* Zone details */}
              <div style={{ padding: '8px 10px' }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#aaa', marginBottom: '4px' }}>
                  {zone.subtitle}
                </div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#555', marginBottom: '6px', lineHeight: '1.6' }}>
                  {zone.description}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#444' }}>
                    Pokémon #{zone.idRange[0]}–{zone.idRange[1]}
                  </div>
                  {!isUnlocked ? (
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#e84393' }}>
                      {zone.requiredRepos} dépôts{badgesRequired > 0 ? ` + ${badgesRequired} badges` : ''}
                    </div>
                  ) : !isActive ? (
                    <button
                      onClick={e => { e.stopPropagation(); onChangeZone(zone.id) }}
                      style={{
                        fontFamily: "'Press Start 2P', monospace", fontSize: '7px',
                        background: colors.accent, color: '#fff', border: 'none',
                        borderRadius: '3px', padding: '4px 8px', cursor: 'pointer',
                      }}
                    >
                      ▶ ALLER
                    </button>
                  ) : (
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#00ff41' }}>
                      En exploration...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
