import { useState, useCallback, useEffect, useRef } from 'react'
import type { OwnedPokemon, TrainerPokemon } from '../types'
import type { GymLeader, EliteFourMember, Champion } from '../leagueData'
import { calculateEloChange } from '../leagueData'
import { getMoveInfo, STATUS_MOVES, getAnimatedSpriteUrl } from '../gameLogic'

type AnyOpponent = GymLeader | EliteFourMember | Champion

interface TrainerBattleModalProps {
  opponent: AnyOpponent
  opponentType: 'gym' | 'eliteFour' | 'champion'
  gymIndex?: number
  eliteFourIndex?: number
  playerTeam: OwnedPokemon[]
  playerElo: number
  onWin: (opponentId: number, opponentName: string, opponentElo: number, isGym: boolean, gymIndex: number | undefined, isEliteFour: boolean, eliteFourIndex: number | undefined, isChampion: boolean) => void
  onLoss: (opponentName: string, opponentElo: number) => void
  onClose: () => void
}

function calcDmg(attackerLevel: number, defenderMaxHp: number): number {
  const base = Math.max(1, Math.floor(attackerLevel * 1.5))
  const variance = Math.floor(Math.random() * base * 0.4)
  const isCrit = Math.random() < 0.1
  const dmg = isCrit ? Math.floor((base + variance) * 1.5) : base + variance
  return Math.min(dmg, defenderMaxHp)
}

// GBA-style HP bar for trainer battles
function TrainerHpBar({ hp, maxHp, name, level, xp, xpToNext, isPlayer }: {
  hp: number; maxHp: number; name: string; level: number;
  xp?: number; xpToNext?: number; isPlayer?: boolean;
}) {
  const pct = maxHp > 0 ? Math.max(0, Math.min(1, hp / maxHp)) : 0
  const color = pct > 0.5 ? '#58d858' : pct > 0.2 ? '#f8c800' : '#f83830'
  const xpPct = xpToNext && xpToNext > 0 ? Math.min(1, (xp ?? 0) / xpToNext) : 0
  return (
    <div style={{
      background: '#f0f0c8', border: '3px solid #181818', borderRadius: '4px',
      padding: '5px 10px', minWidth: isPlayer ? '165px' : '150px',
      fontFamily: "'Press Start 2P', monospace", boxShadow: '3px 3px 0 #606060',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '7px', color: '#181818' }}>{name.toUpperCase().slice(0, 11)}</span>
        <span style={{ fontSize: '6px', color: '#484848' }}>Lv{level}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '5px', color: color, minWidth: '13px', fontWeight: 'bold' }}>HP</span>
        <div style={{ flex: 1, height: '8px', background: '#282828', border: '1px solid #181818', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.2)', zIndex: 1 }} />
          <div style={{ height: '100%', width: `${pct * 100}%`, background: color, transition: 'width 0.35s ease, background 0.35s', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.5)' }} />
          </div>
        </div>
      </div>
      {isPlayer && (
        <div style={{ textAlign: 'right', fontSize: '6px', color: '#484848', marginTop: '2px' }}>
          {hp}<span style={{ color: '#888' }}>/{maxHp}</span>
        </div>
      )}
      {isPlayer && xpToNext !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px', borderTop: '1px solid #d0d0a8', paddingTop: '2px' }}>
          <span style={{ fontSize: '5px', color: '#4878e8', minWidth: '13px' }}>EXP</span>
          <div style={{ flex: 1, height: '4px', background: '#282828', border: '1px solid #181818', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${xpPct * 100}%`, background: '#4878e8' }} />
          </div>
        </div>
      )}
    </div>
  )
}

// GBA message box for trainer battle
function TrainerMsgBox({ messages }: { messages: string[] }) {
  const last = messages[messages.length - 1] ?? ''
  const prev = messages[messages.length - 2] ?? ''
  const [displayed, setDisplayed] = useState('')
  const [arrowBlink, setArrowBlink] = useState(true)
  const [done, setDone] = useState(false)
  const prevRef = useRef('')

  useEffect(() => {
    if (last === prevRef.current) return
    prevRef.current = last
    setDisplayed('')
    setDone(false)
    let i = 0
    const chars = last.split('')
    const t = setInterval(() => {
      i++
      setDisplayed(chars.slice(0, i).join(''))
      if (i >= chars.length) { clearInterval(t); setDone(true) }
    }, 20)
    return () => clearInterval(t)
  }, [last])

  useEffect(() => {
    const t = setInterval(() => setArrowBlink(b => !b), 450)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      background: '#f0f0d0', border: '4px solid #181818',
      padding: '7px 12px 9px', minHeight: '60px', position: 'relative',
      boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.6)',
    }}>
      {prev && (
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#787860', lineHeight: '1.7', marginBottom: '1px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {prev}
        </div>
      )}
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#181818', lineHeight: '1.7', minHeight: '12px' }}>
        {displayed}
        {!done && displayed.length > 0 && <span style={{ opacity: arrowBlink ? 1 : 0 }}>▋</span>}
      </div>
      {done && <div style={{ position: 'absolute', bottom: '6px', right: '9px', fontSize: '9px', opacity: arrowBlink ? 1 : 0, color: '#181818' }}>▼</div>}
    </div>
  )
}

export function TrainerBattleModal({
  opponent, opponentType, gymIndex, eliteFourIndex,
  playerTeam, playerElo, onWin, onLoss, onClose,
}: TrainerBattleModalProps) {
  const [trainerTeam, setTrainerTeam] = useState<TrainerPokemon[]>(
    opponent.team.map(p => ({ ...p, hp: p.maxHp }))
  )
  const [playerHPs, setPlayerHPs] = useState<number[]>(playerTeam.map(p => p.hp))
  const [trainerIdx, setTrainerIdx] = useState(0)
  const [playerIdx, setPlayerIdx] = useState(0)
  const [battleLog, setBattleLog] = useState<string[]>([
    `${opponent.name} veut se battre !`,
    `"${opponent.tagline}"`,
    `${opponent.name} envoie ${opponent.team[0].name.toUpperCase()} !`,
  ])
  const [phase, setPhase] = useState<'player_turn' | 'enemy_turn' | 'won' | 'lost'>('player_turn')
  const [animating, setAnimating] = useState(false)
  const [shakePlayer, setShakePlayer] = useState(false)
  const [shakeEnemy, setShakeEnemy] = useState(false)
  const [attackFlashColor, setAttackFlashColor] = useState<string | null>(null)

  const addLog = (msg: string) => setBattleLog(prev => [...prev.slice(-20), msg])

  const currentTrainer = trainerTeam[trainerIdx]
  const currentPlayer = playerTeam[playerIdx]
  const currentPlayerHp = playerHPs[playerIdx] ?? 0

  const eloGain = calculateEloChange(playerElo, opponent.elo, true)
  const eloLoss = Math.abs(calculateEloChange(playerElo, opponent.elo, false))

  // Flash attack color briefly
  const flashAttack = (color: string) => {
    setAttackFlashColor(color)
    setTimeout(() => setAttackFlashColor(null), 400)
  }

  const handleAttackWithMove = useCallback((moveName: string) => {
    if (animating || phase !== 'player_turn') return
    setAnimating(true)

    const { emoji, color } = getMoveInfo(moveName)
    const dmg = calcDmg(currentPlayer?.level ?? 5, currentTrainer.maxHp)
    const isCrit = dmg > (currentPlayer?.level ?? 5) * 1.5 * 1.3
    addLog(`${currentPlayer?.name.toUpperCase()} utilise ${emoji} ${moveName} !${isCrit ? ' CRITIQUE !' : ''} (-${dmg} PV)`)
    flashAttack(color)
    setShakeEnemy(true)
    setTimeout(() => setShakeEnemy(false), 400)

    const newTrainerHp = Math.max(0, currentTrainer.hp - dmg)
    const newTrainerTeam = trainerTeam.map((p, i) => i === trainerIdx ? { ...p, hp: newTrainerHp } : p)
    setTrainerTeam(newTrainerTeam)

    if (newTrainerHp <= 0) {
      addLog(`${currentTrainer.name.toUpperCase()} est K.O. !`)
      const nextIdx = trainerIdx + 1
      if (nextIdx >= trainerTeam.length) {
        setTimeout(() => {
          addLog('🏆 Tu as gagné le combat !')
          addLog(`ELO : ${playerElo} → ${playerElo + eloGain} (+${eloGain})`)
          setPhase('won')
          setAnimating(false)
        }, 700)
      } else {
        setTimeout(() => {
          addLog(`${opponent.name} envoie ${trainerTeam[nextIdx].name.toUpperCase()} !`)
          setTrainerIdx(nextIdx)
          setPhase('player_turn')
          setAnimating(false)
        }, 900)
      }
    } else {
      // Enemy counterattack
      setPhase('enemy_turn')
      setTimeout(() => {
        const damagingMoves = currentTrainer.moves.filter(m => !STATUS_MOVES.has(m))
        const eMove = damagingMoves.length > 0
          ? damagingMoves[Math.floor(Math.random() * damagingMoves.length)]
          : currentTrainer.moves[Math.floor(Math.random() * currentTrainer.moves.length)] ?? 'Charge'
        const { emoji: eEmoji, color: eColor } = getMoveInfo(eMove)
        const eDmg = calcDmg(currentTrainer.level, currentPlayer?.maxHp ?? 50)
        addLog(`${currentTrainer.name.toUpperCase()} utilise ${eEmoji} ${eMove} ! (-${eDmg} PV)`)
        flashAttack(eColor)
        setShakePlayer(true)
        setTimeout(() => setShakePlayer(false), 400)

        const newPlayerHp = Math.max(0, currentPlayerHp - eDmg)
        const newHPs = playerHPs.map((hp, i) => i === playerIdx ? newPlayerHp : hp)
        setPlayerHPs(newHPs)

        if (newPlayerHp <= 0) {
          addLog(`${currentPlayer?.name.toUpperCase()} est K.O. !`)
          const nextPIdx = playerIdx + 1
          if (nextPIdx >= playerTeam.length) {
            setTimeout(() => {
              addLog('💀 Tous tes Pokémon sont K.O. !')
              addLog(`ELO : ${playerElo} → ${playerElo - eloLoss} (-${eloLoss})`)
              setPhase('lost')
              setAnimating(false)
            }, 700)
          } else {
            setTimeout(() => {
              addLog(`Go ! ${playerTeam[nextPIdx].name.toUpperCase()} !`)
              setPlayerIdx(nextPIdx)
              setPhase('player_turn')
              setAnimating(false)
            }, 900)
          }
        } else {
          setPhase('player_turn')
          setAnimating(false)
        }
      }, 750)
    }
  }, [animating, phase, currentPlayer, currentTrainer, trainerTeam, trainerIdx, playerHPs, playerIdx, playerTeam, playerElo, eloGain, eloLoss, opponent.name, currentPlayerHp])

  const handleFlee = useCallback(() => {
    addLog('Tu t\'es enfui...')
    addLog(`ELO : ${playerElo} → ${playerElo - eloLoss} (-${eloLoss})`)
    setPhase('lost')
  }, [playerElo, eloLoss])

  const handleResult = () => {
    if (phase === 'won') {
      onWin(opponent.id, opponent.name, opponent.elo, opponentType === 'gym', gymIndex, opponentType === 'eliteFour', eliteFourIndex, opponentType === 'champion')
    } else if (phase === 'lost') {
      onLoss(opponent.name, opponent.elo)
    }
    onClose()
  }

  const trainerHpPct = currentTrainer ? currentTrainer.hp / currentTrainer.maxHp : 0
  const playerHpPct = currentPlayer ? currentPlayerHp / currentPlayer.maxHp : 0
  const opponentEmoji = opponentType === 'champion' ? '👑' : opponentType === 'eliteFour' ? '💎' : ('typeEmoji' in opponent ? opponent.typeEmoji : '⚔️')

  // Player's current moves (filter status for display but still show)
  const playerMoves = currentPlayer?.moves.length > 0
    ? currentPlayer.moves.slice(0, 4)
    : ['Charge', 'Rugissement', 'Tranche', 'Jackpot']

  // Zone-like background for the trainer battle
  const arenaGradient = opponentType === 'champion'
    ? 'linear-gradient(180deg, #1a0030 0%, #200840 50%, #100020 100%)'
    : opponentType === 'eliteFour'
    ? 'linear-gradient(180deg, #1a1a4a 0%, #2a2060 50%, #1a1030 100%)'
    : 'linear-gradient(180deg, #1a2a0a 0%, #203010 50%, #1a2a0a 100%)'

  const groundColor = opponentType === 'champion' ? '#280048' : opponentType === 'eliteFour' ? '#282060' : '#203820'
  const platColor = opponentType === 'champion' ? '#480088' : opponentType === 'eliteFour' ? '#484090' : '#305a28'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Press Start 2P', monospace",
    }}>
      {/* Header */}
      <div style={{
        background: '#181828', borderBottom: '3px solid #e84393',
        padding: '7px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '8px', color: '#e84393' }}>
            {opponentEmoji} {opponentType === 'champion' ? '👑 CHAMPION' : opponentType === 'eliteFour' ? '💎 ÉLITE QUATRE' : '🏟 ARÈNE'}
          </div>
          <div style={{ fontSize: '10px', color: '#fff', marginTop: '2px' }}>{opponent.name}</div>
          <div style={{ fontSize: '6px', color: '#888', marginTop: '1px' }}>"{opponent.tagline}"</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '7px', color: '#ffb700' }}>ELO {opponent.elo}</div>
          <div style={{ fontSize: '6px', color: '#888', marginTop: '2px' }}>Toi : {playerElo}</div>
          <div style={{ fontSize: '5px', color: '#30c030', marginTop: '2px' }}>+{eloGain} si victoire</div>
        </div>
      </div>

      {/* Battle arena */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        background: arenaGradient, minHeight: 0,
      }}>
        {/* Attack flash */}
        {attackFlashColor && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
            background: attackFlashColor, animation: 'attackFlash 0.4s ease-out forwards',
          }} />
        )}

        {/* Ground */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '90px', background: groundColor }} />
        <div style={{ position: 'absolute', bottom: '88px', left: 0, right: 0, height: '2px', background: 'rgba(0,0,0,0.4)' }} />

        {/* Enemy platform + sprite */}
        {currentTrainer && (
          <>
            <div style={{
              position: 'absolute', top: '82px', right: '18px',
              width: '85px', height: '18px',
              background: platColor, borderRadius: '50%',
              boxShadow: '0 4px 0 rgba(0,0,0,0.4)', border: '1px solid rgba(0,0,0,0.2)',
            }} />
            <div style={{ position: 'absolute', top: '12px', right: '18px' }}>
              <img
                src={getAnimatedSpriteUrl(currentTrainer.id, false)}
                alt={currentTrainer.name}
                style={{
                  width: '80px', height: '80px', imageRendering: 'pixelated',
                  transform: shakeEnemy ? 'translateX(6px)' : 'none', transition: 'transform 0.07s',
                  filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.5))',
                }}
                onError={e => { (e.target as HTMLImageElement).src = currentTrainer.spriteUrl }}
              />
            </div>
            <div style={{ position: 'absolute', top: '8px', left: '6px' }}>
              <TrainerHpBar hp={currentTrainer.hp} maxHp={currentTrainer.maxHp} name={currentTrainer.name} level={currentTrainer.level} />
            </div>
            <div style={{ position: 'absolute', top: '8px', right: '8px', fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#888' }}>
              {trainerIdx + 1}/{trainerTeam.length}
            </div>
          </>
        )}

        {/* Player platform + sprite */}
        {currentPlayer && (
          <>
            <div style={{
              position: 'absolute', bottom: '42px', left: '10px',
              width: '90px', height: '20px',
              background: platColor, borderRadius: '50%',
              boxShadow: '0 4px 0 rgba(0,0,0,0.4)', border: '1px solid rgba(0,0,0,0.2)',
              filter: 'brightness(1.2)',
            }} />
            <div style={{ position: 'absolute', bottom: '36px', left: '10px', width: '90px', display: 'flex', justifyContent: 'center' }}>
              <img
                src={getAnimatedSpriteUrl(currentPlayer.id, true)}
                alt={currentPlayer.name}
                style={{
                  width: '80px', height: '80px', imageRendering: 'pixelated',
                  transform: shakePlayer ? 'translateX(-6px)' : 'none', transition: 'transform 0.07s',
                  filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.5))',
                }}
                onError={e => { (e.target as HTMLImageElement).src = currentPlayer.backSpriteUrl }}
              />
            </div>
            <div style={{ position: 'absolute', bottom: '5px', right: '5px' }}>
              <TrainerHpBar
                hp={currentPlayerHp} maxHp={currentPlayer.maxHp}
                name={currentPlayer.name} level={currentPlayer.level}
                xp={currentPlayer.xp} xpToNext={currentPlayer.xpToNext}
                isPlayer
              />
            </div>
            <div style={{ position: 'absolute', bottom: '5px', left: '8px', fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#888' }}>
              {playerIdx + 1}/{playerTeam.length}
            </div>
          </>
        )}

        {/* HP bar tiny indicator at top for visual pacing */}
        <div style={{
          position: 'absolute', bottom: '92px', left: 0, right: 0, height: '3px',
          background: 'rgba(0,0,0,0.3)',
        }}>
          <div style={{
            height: '100%',
            width: `${Math.max(0, trainerHpPct * 100)}%`,
            background: trainerHpPct > 0.5 ? '#58d858' : trainerHpPct > 0.2 ? '#f8c800' : '#f83830',
            transition: 'width 0.35s',
          }} />
        </div>
        <div style={{
          position: 'absolute', top: '88px', left: 0, right: 0, height: '2px',
          background: 'rgba(0,0,0,0.3)',
        }}>
          <div style={{
            height: '100%', float: 'right',
            width: `${Math.max(0, playerHpPct * 100)}%`,
            background: playerHpPct > 0.5 ? '#58d858' : playerHpPct > 0.2 ? '#f8c800' : '#f83830',
            transition: 'width 0.35s',
          }} />
        </div>
      </div>

      {/* GBA message box */}
      <TrainerMsgBox messages={battleLog} />

      {/* Action panel */}
      <div style={{ background: '#1a1a2e', borderTop: '3px solid #181818' }}>
        {phase === 'player_turn' && (
          <>
            {/* Move grid — same as wild battles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#111' }}>
              {playerMoves.map((moveName, i) => {
                const { emoji, color } = getMoveInfo(moveName)
                const isStatus = STATUS_MOVES.has(moveName)
                return (
                  <button
                    key={i}
                    onClick={() => handleAttackWithMove(moveName)}
                    disabled={animating}
                    style={{
                      padding: '10px 8px',
                      fontFamily: "'Press Start 2P', monospace", fontSize: '7px',
                      background: animating ? '#1a1a2e' : `linear-gradient(135deg, #0f0f1e, #1a1a2e)`,
                      color: isStatus ? '#666' : animating ? '#555' : '#fff',
                      cursor: animating ? 'not-allowed' : 'pointer',
                      textAlign: 'left', border: 'none',
                      borderLeft: `3px solid ${color.replace('bb', 'ff')}`,
                      transition: 'background 0.1s',
                      lineHeight: '1.6',
                    }}
                    onMouseEnter={e => { if (!animating) e.currentTarget.style.background = color }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #0f0f1e, #1a1a2e)' }}
                  >
                    <div>{emoji} {moveName}</div>
                    {isStatus && <div style={{ fontSize: '5px', color: '#555', marginTop: '2px' }}>STATUT</div>}
                  </button>
                )
              })}
            </div>
            {/* Flee button */}
            <div style={{ display: 'flex', background: '#111', gap: '1px' }}>
              <button
                onClick={handleFlee}
                disabled={animating}
                style={{
                  flex: 1, padding: '8px 4px',
                  fontFamily: "'Press Start 2P', monospace", fontSize: '7px',
                  background: '#2a1a1a', color: '#ff8888',
                  cursor: animating ? 'not-allowed' : 'pointer', border: 'none',
                }}
              >
                🏃 FUIR (pénalité ELO)
              </button>
            </div>
          </>
        )}
        {phase === 'enemy_turn' && (
          <div style={{
            textAlign: 'center', fontSize: '8px', color: '#e84393',
            padding: '14px', background: '#0f0f1e',
          }}>
            ⏳ L'adversaire attaque...
          </div>
        )}
        {(phase === 'won' || phase === 'lost') && (
          <div style={{ padding: '10px' }}>
            <div style={{
              textAlign: 'center', fontSize: '10px',
              color: phase === 'won' ? '#30c030' : '#e03030',
              padding: '8px', marginBottom: '8px',
              textShadow: `0 0 8px ${phase === 'won' ? '#30c030' : '#e03030'}`,
            }}>
              {phase === 'won' ? `🏆 VICTOIRE ! +${eloGain} ELO` : `💀 DÉFAITE... -${eloLoss} ELO`}
            </div>
            <button
              onClick={handleResult}
              style={{
                width: '100%', padding: '12px', fontSize: '9px',
                fontFamily: "'Press Start 2P', monospace",
                background: phase === 'won' ? '#20a020' : '#555',
                color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer',
                letterSpacing: '0.5px',
              }}
            >
              {phase === 'won' ? '🎖 RÉCUPÉRER LE BADGE' : '↩ CONTINUER'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
