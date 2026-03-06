import { useState } from 'react'
import type { OwnedPokemon, EloHistoryEntry } from '../types'
import { GYM_LEADERS, ELITE_FOUR, CHAMPION, getEloRank } from '../leagueData'
import { TrainerBattleModal } from './TrainerBattleModal'
import type { GymLeader, EliteFourMember, Champion } from '../leagueData'

type AnyOpponent = GymLeader | EliteFourMember | Champion
type OpponentType = 'gym' | 'eliteFour' | 'champion'

interface LeagueViewProps {
  badges: boolean[]
  eliteFourDefeated: boolean[]
  championDefeated: boolean
  playerElo: number
  eloHistory: EloHistoryEntry[]
  team: OwnedPokemon[]
  onWin: (opponentId: number, opponentName: string, opponentElo: number, isGym: boolean, gymIndex: number | undefined, isEliteFour: boolean, eliteFourIndex: number | undefined, isChampion: boolean) => void
  onLoss: (opponentName: string, opponentElo: number) => void
}

export function LeagueView({
  badges,
  eliteFourDefeated,
  championDefeated,
  playerElo,
  eloHistory,
  team,
  onWin,
  onLoss,
}: LeagueViewProps) {
  const [battleTarget, setBattleTarget] = useState<{ opponent: AnyOpponent; type: OpponentType; gymIdx?: number; eliteFourIdx?: number } | null>(null)
  const [activeSection, setActiveSection] = useState<'badges' | 'league' | 'elo'>('badges')

  const badgesEarned = badges.filter(Boolean).length
  const eliteFourBeaten = eliteFourDefeated.filter(Boolean).length
  const allBadgesEarned = badgesEarned === 8
  const allEliteBeaten = eliteFourBeaten === 4
  const eloRank = getEloRank(playerElo)

  const canChallengeElite = allBadgesEarned
  const canChallengeChampion = allEliteBeaten && canChallengeElite

  const handleChallenge = (opponent: AnyOpponent, type: OpponentType, gymIdx?: number, eliteFourIdx?: number) => {
    if (team.length === 0) return
    setBattleTarget({ opponent, type, gymIdx, eliteFourIdx })
  }

  if (battleTarget) {
    return (
      <TrainerBattleModal
        opponent={battleTarget.opponent}
        opponentType={battleTarget.type}
        gymIndex={battleTarget.gymIdx}
        eliteFourIndex={battleTarget.eliteFourIdx}
        playerTeam={team}
        playerElo={playerElo}
        onWin={onWin}
        onLoss={onLoss}
        onClose={() => setBattleTarget(null)}
      />
    )
  }

  return (
    <div style={{ fontFamily: "'Press Start 2P', monospace", paddingBottom: '16px' }}>
      {/* ELO Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0a2e, #0a1a2e)',
        border: '2px solid #e84393',
        borderRadius: '8px', padding: '12px', margin: '8px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '7px', color: '#aaa', marginBottom: '4px' }}>CLASSEMENT ELO</div>
          <div style={{ fontSize: '22px', color: eloRank.color, marginBottom: '2px' }}>{playerElo}</div>
          <div style={{ fontSize: '7px', color: eloRank.color, letterSpacing: '1px' }}>{eloRank.rank}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '7px', color: '#aaa', marginBottom: '4px' }}>BADGES</div>
          <div style={{ fontSize: '16px', color: '#ffb700' }}>{badgesEarned}/8</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'flex-end', marginTop: '4px', maxWidth: '80px' }}>
            {badges.map((earned, i) => (
              <span key={i} style={{ fontSize: '10px', opacity: earned ? 1 : 0.2 }}>
                {GYM_LEADERS[i]?.badgeIcon ?? '🏅'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', margin: '0 8px 8px', gap: '4px' }}>
        {(['badges', 'league', 'elo'] as const).map(s => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            style={{
              flex: 1, padding: '6px 4px', fontSize: '7px', fontFamily: 'inherit',
              background: activeSection === s ? '#e84393' : '#1a1a2e',
              color: activeSection === s ? '#fff' : '#888',
              border: `1px solid ${activeSection === s ? '#e84393' : '#333'}`,
              borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.5px',
            }}
          >
            {s === 'badges' ? '🏅 ARÈNES' : s === 'league' ? '💎 LIGUE' : '📈 ELO'}
          </button>
        ))}
      </div>

      {/* ── ARENES / GYM LEADERS ── */}
      {activeSection === 'badges' && (
        <div style={{ padding: '0 8px' }}>
          <div style={{ fontSize: '7px', color: '#aaa', marginBottom: '8px', letterSpacing: '1px' }}>
            // DÉFIE LES 8 CHAMPIONS D'ARÈNE
          </div>
          {GYM_LEADERS.map((leader, i) => {
            const earned = badges[i]
            const canChallenge = i === 0 || badges[i - 1] // must beat previous first
            return (
              <div
                key={leader.id}
                style={{
                  background: earned ? 'rgba(48,192,48,0.1)' : canChallenge ? '#0f0f1e' : 'rgba(50,50,50,0.3)',
                  border: `1px solid ${earned ? '#30c030' : canChallenge ? '#333' : '#222'}`,
                  borderRadius: '6px', padding: '8px', marginBottom: '6px',
                  opacity: canChallenge ? 1 : 0.5,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '18px', minWidth: '28px', textAlign: 'center' }}>
                    {earned ? leader.badgeIcon : leader.typeEmoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '8px', color: earned ? '#30c030' : '#fff' }}>
                        {leader.name}
                        {earned && <span style={{ color: '#30c030', marginLeft: '6px', fontSize: '7px' }}>✓ VAINCU</span>}
                      </div>
                      <div style={{ fontSize: '7px', color: '#ffb700' }}>ELO {leader.elo}</div>
                    </div>
                    <div style={{ fontSize: '6px', color: '#888', marginTop: '2px' }}>{leader.title} — {leader.type}</div>
                    <div style={{ fontSize: '6px', color: '#555', marginTop: '2px', fontStyle: 'italic' }}>
                      "{leader.tagline}"
                    </div>
                    <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
                      {leader.team.map((p, j) => (
                        <div key={j} style={{
                          fontSize: '5px', color: '#aaa', background: '#1a1a2e',
                          border: '1px solid #333', borderRadius: '3px', padding: '2px 4px',
                        }}>
                          {p.name} Nv.{p.level}
                        </div>
                      ))}
                    </div>
                  </div>
                  {canChallenge && !earned && (
                    <button
                      onClick={() => handleChallenge(leader, 'gym', i, undefined)}
                      disabled={team.length === 0}
                      style={{
                        padding: '6px 8px', fontSize: '7px', fontFamily: 'inherit',
                        background: team.length === 0 ? '#333' : '#e84393',
                        color: team.length === 0 ? '#666' : '#fff',
                        border: 'none', borderRadius: '4px', cursor: team.length === 0 ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      DÉFIER
                    </button>
                  )}
                  {earned && (
                    <button
                      onClick={() => handleChallenge(leader, 'gym', i, undefined)}
                      disabled={team.length === 0}
                      style={{
                        padding: '6px 8px', fontSize: '6px', fontFamily: 'inherit',
                        background: '#1a2a1a', color: '#30c030',
                        border: '1px solid #30c030', borderRadius: '4px', cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      REVANCHE
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── ELITE FOUR + CHAMPION ── */}
      {activeSection === 'league' && (
        <div style={{ padding: '0 8px' }}>
          {!canChallengeElite && (
            <div style={{
              background: 'rgba(232,67,147,0.1)', border: '1px solid rgba(232,67,147,0.3)',
              borderRadius: '6px', padding: '10px', marginBottom: '10px', fontSize: '7px', color: '#e84393',
              textAlign: 'center', lineHeight: '1.6',
            }}>
              ⚠ Obtiens les 8 badges pour accéder à la Ligue Pokémon !
              <div style={{ color: '#ffb700', marginTop: '4px' }}>{badgesEarned}/8 badges obtenus</div>
            </div>
          )}

          <div style={{ fontSize: '7px', color: '#aaa', marginBottom: '8px', letterSpacing: '1px' }}>
            💎 ÉLITE QUATRE
          </div>
          {ELITE_FOUR.map((member, i) => {
            const defeated = eliteFourDefeated[i]
            const canChallenge = canChallengeElite && (i === 0 || eliteFourDefeated[i - 1])
            return (
              <div
                key={member.id}
                style={{
                  background: defeated ? 'rgba(48,192,48,0.1)' : canChallenge ? 'rgba(232,67,147,0.05)' : 'rgba(30,30,30,0.5)',
                  border: `1px solid ${defeated ? '#30c030' : canChallenge ? '#e84393' : '#222'}`,
                  borderRadius: '6px', padding: '8px', marginBottom: '6px',
                  opacity: canChallengeElite ? 1 : 0.4,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '18px', minWidth: '28px', textAlign: 'center' }}>{member.typeEmoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '8px', color: defeated ? '#30c030' : '#fff' }}>
                        {member.name}
                        {defeated && <span style={{ color: '#30c030', marginLeft: '6px', fontSize: '7px' }}>✓</span>}
                      </div>
                      <div style={{ fontSize: '7px', color: '#ffb700' }}>ELO {member.elo}</div>
                    </div>
                    <div style={{ fontSize: '6px', color: '#888', marginTop: '2px' }}>{member.title}</div>
                    <div style={{ fontSize: '6px', color: '#555', marginTop: '2px', fontStyle: 'italic' }}>"{member.tagline}"</div>
                  </div>
                  {canChallenge && (
                    <button
                      onClick={() => handleChallenge(member, 'eliteFour', undefined, i)}
                      disabled={team.length === 0}
                      style={{
                        padding: '6px 8px', fontSize: '7px', fontFamily: 'inherit',
                        background: team.length === 0 ? '#333' : defeated ? '#1a2a1a' : '#e84393',
                        color: team.length === 0 ? '#666' : defeated ? '#30c030' : '#fff',
                        border: defeated ? '1px solid #30c030' : 'none',
                        borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap',
                      }}
                    >
                      {defeated ? 'REVANCHE' : 'DÉFIER'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {/* CHAMPION */}
          <div style={{ fontSize: '7px', color: '#aaa', margin: '10px 0 8px', letterSpacing: '1px' }}>
            👑 CHAMPION
          </div>
          <div style={{
            background: canChallengeChampion
              ? (championDefeated ? 'rgba(48,192,48,0.1)' : 'rgba(255,183,0,0.08)')
              : 'rgba(30,30,30,0.5)',
            border: `2px solid ${championDefeated ? '#30c030' : canChallengeChampion ? '#ffb700' : '#333'}`,
            borderRadius: '8px', padding: '12px',
            opacity: canChallengeChampion ? 1 : 0.4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '24px' }}>👑</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '10px', color: championDefeated ? '#30c030' : '#ffb700' }}>
                    {CHAMPION.name}
                    {championDefeated && <span style={{ color: '#30c030', marginLeft: '6px', fontSize: '7px' }}>✓ VAINCU</span>}
                  </div>
                  <div style={{ fontSize: '7px', color: '#ffb700' }}>ELO {CHAMPION.elo}</div>
                </div>
                <div style={{ fontSize: '7px', color: '#888', marginTop: '2px' }}>{CHAMPION.title}</div>
                <div style={{ fontSize: '6px', color: '#555', marginTop: '3px', fontStyle: 'italic' }}>"{CHAMPION.tagline}"</div>
                <div style={{ display: 'flex', gap: '3px', marginTop: '5px', flexWrap: 'wrap' }}>
                  {CHAMPION.team.map((p, j) => (
                    <div key={j} style={{
                      fontSize: '5px', color: '#ffb700', background: 'rgba(255,183,0,0.1)',
                      border: '1px solid rgba(255,183,0,0.3)', borderRadius: '3px', padding: '2px 4px',
                    }}>
                      {p.name} Nv.{p.level}
                    </div>
                  ))}
                </div>
              </div>
              {canChallengeChampion && (
                <button
                  onClick={() => handleChallenge(CHAMPION, 'champion')}
                  disabled={team.length === 0}
                  style={{
                    padding: '8px 10px', fontSize: '7px', fontFamily: 'inherit',
                    background: team.length === 0 ? '#333' : championDefeated ? '#1a2a1a' : '#ffb700',
                    color: team.length === 0 ? '#666' : championDefeated ? '#30c030' : '#000',
                    border: championDefeated ? '1px solid #30c030' : 'none',
                    borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  {championDefeated ? 'REVANCHE' : 'DÉFIER'}
                </button>
              )}
            </div>
          </div>

          {team.length === 0 && (
            <div style={{ fontSize: '6px', color: '#e84393', textAlign: 'center', marginTop: '10px' }}>
              ⚠ Tu dois avoir au moins 1 Pokémon dans ton équipe pour combattre !
            </div>
          )}
        </div>
      )}

      {/* ── ELO HISTORY ── */}
      {activeSection === 'elo' && (
        <div style={{ padding: '0 8px' }}>
          <div style={{ fontSize: '7px', color: '#aaa', marginBottom: '8px', letterSpacing: '1px' }}>
            // HISTORIQUE DES COMBATS
          </div>

          {/* ELO gauge */}
          <div style={{
            background: '#0f0f1e', border: '1px solid #333', borderRadius: '6px',
            padding: '10px', marginBottom: '10px',
          }}>
            <div style={{ fontSize: '7px', color: '#aaa', marginBottom: '6px' }}>PROGRESSION ELO</div>
            {[
              { label: 'NOVICE', min: 600, max: 800, color: '#666' },
              { label: 'DÉBUTANT', min: 800, max: 1000, color: '#aaa' },
              { label: 'INTERMÉDIAIRE', min: 1000, max: 1200, color: '#00ff41' },
              { label: 'CONFIRMÉ', min: 1200, max: 1400, color: '#00f5ff' },
              { label: 'AVANCÉ', min: 1400, max: 1600, color: '#ffb700' },
              { label: 'EXPERT', min: 1600, max: 1800, color: '#ff6600' },
              { label: 'MAÎTRE', min: 1800, max: 2000, color: '#ff2244' },
            ].map(tier => {
              const pct = Math.min(1, Math.max(0, (playerElo - tier.min) / (tier.max - tier.min)))
              const active = playerElo >= tier.min && playerElo < tier.max
              return (
                <div key={tier.label} style={{
                  display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px',
                  opacity: playerElo < tier.min ? 0.3 : 1,
                }}>
                  <div style={{ fontSize: '6px', color: tier.color, minWidth: '75px' }}>
                    {active ? '▶ ' : ''}{tier.label}
                  </div>
                  <div style={{ flex: 1, height: '5px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', background: tier.color,
                      width: `${active ? pct * 100 : playerElo >= tier.max ? 100 : 0}%`,
                      boxShadow: active ? `0 0 4px ${tier.color}` : 'none',
                    }} />
                  </div>
                  <div style={{ fontSize: '6px', color: '#555', minWidth: '40px', textAlign: 'right' }}>
                    {tier.min}-{tier.max}
                  </div>
                </div>
              )
            })}
          </div>

          {/* History */}
          {eloHistory.length === 0 ? (
            <div style={{
              background: '#0f0f1e', border: '1px solid #222', borderRadius: '6px',
              padding: '20px', textAlign: 'center', fontSize: '7px', color: '#555',
            }}>
              Aucun combat enregistré.<br/>
              <span style={{ color: '#aaa', marginTop: '4px', display: 'block' }}>
                Défie des champions d'arène !
              </span>
            </div>
          ) : (
            eloHistory.map((entry, i) => (
              <div key={i} style={{
                background: '#0f0f1e', border: `1px solid ${entry.result === 'win' ? '#1a3a1a' : '#3a1a1a'}`,
                borderRadius: '4px', padding: '7px 10px', marginBottom: '4px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '7px', color: '#fff' }}>
                    {entry.result === 'win' ? '✓' : '✗'} {entry.opponent}
                  </div>
                  <div style={{ fontSize: '6px', color: '#555', marginTop: '2px' }}>{entry.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '9px',
                    color: entry.result === 'win' ? '#30c030' : '#e03030',
                  }}>
                    {entry.result === 'win' ? '+' : ''}{entry.change}
                  </div>
                  <div style={{ fontSize: '6px', color: '#aaa' }}>{entry.elo} ELO</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
