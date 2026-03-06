
import type { OwnedPokemon } from '../types'
import { MOCK_GITHUB, computePlayerStats, getZoneForPlayer } from '../gameLogic'

interface StatsViewProps {
  pokeDollars: number
  pokeballs: number
  greatBalls: number
  team: OwnedPokemon[]
  pc: OwnedPokemon[]
}

export function StatsView({ pokeDollars, pokeballs, greatBalls, team, pc }: StatsViewProps) {
  const github = MOCK_GITHUB
  const { pokeDollars: earnedDollars } = computePlayerStats(github)
  const maxZone = getZoneForPlayer(github.repoCount)
  const totalCaptured = team.length + pc.length

  return (
    <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '11px',
        marginBottom: '12px',
      }}>
        DOSSIER DRESSEUR
      </div>

      {/* Infos du dresseur */}
      <div className="gba-panel" style={{ padding: '12px', marginBottom: '10px', background: '#e8f0c8' }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '9px',
          color: '#555',
          marginBottom: '4px',
        }}>
          GITHUB : @{github.username}
        </div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '12px',
          marginBottom: '8px',
        }}>
          {github.name}
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            color: '#207020',
          }}>
            ₽ {pokeDollars.toLocaleString()}
          </div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            color: '#555',
          }}>
            PB : {pokeballs} / SB : {greatBalls}
          </div>
        </div>
      </div>

      {/* Compteur Pokémon capturés */}
      <div
        className="gba-panel"
        style={{ padding: '12px', marginBottom: '10px', background: '#fffce0', border: '3px solid #c08000' }}
      >
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '9px',
          color: '#c08000',
          marginBottom: '6px',
        }}>
          POKÉMON CAPTURÉS
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '22px',
            color: '#1a1a2e',
          }}>
            {totalCaptured}
          </div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#555', lineHeight: '1.8' }}>
            <div>Équipe : {team.length}/6</div>
            <div>PC : {pc.length}</div>
          </div>
        </div>
      </div>

      {/* Stats GitHub */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '9px',
        marginBottom: '6px',
        color: '#333',
      }}>
        STATS GITHUB
      </div>
      <div className="gba-panel" style={{ padding: '12px', marginBottom: '10px', background: '#e8f0c8' }}>
        {[
          {
            label: 'Commits (30j)',
            value: github.commits30d,
            bonus: `+${earnedDollars - 10}₽/sync (${earnedDollars}₽ total)`,
            bonusColor: '#207020',
          },
          {
            label: 'Dépôts',
            value: github.repoCount,
            bonus: `Zone ${maxZone} déverrouillée`,
            bonusColor: '#3050a0',
          },
          {
            label: 'Étoiles totales',
            value: github.starsTotal,
            bonus: `+${github.starsTotal}% de capture`,
            bonusColor: '#c08000',
          },
        ].map((stat, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '6px 0',
            borderBottom: i < 2 ? '1px solid #ccc' : 'none',
          }}>
            <div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '8px',
                marginBottom: '3px',
              }}>
                {stat.label}
              </div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '7px',
                color: stat.bonusColor,
              }}>
                {stat.bonus}
              </div>
            </div>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '14px',
              fontWeight: 'bold',
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Progression des zones */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '9px',
        marginBottom: '6px',
        color: '#333',
      }}>
        PROGRESSION DES ZONES
      </div>
      <div className="gba-panel" style={{ padding: '12px', background: '#e8f0c8' }}>
        {[
          { zone: 1, name: 'ROUTE 1', req: 0, unlocked: true },
          { zone: 2, name: 'MT. CODE', req: 3, unlocked: github.repoCount >= 3 },
          { zone: 3, name: 'ROUTE VICTOIRE', req: 5, unlocked: github.repoCount >= 5 },
        ].map((z, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '5px 0',
            borderBottom: i < 2 ? '1px solid #ccc' : 'none',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
          }}>
            <span style={{ color: z.unlocked ? '#207020' : '#c03030' }}>
              {z.unlocked ? '✓' : '✗'} Zone {z.zone} : {z.name}
            </span>
            <span style={{ color: '#555', fontSize: '7px' }}>
              {z.req === 0 ? 'Libre' : `${z.req} dépôts`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
