import { useState, useCallback } from 'react'
import type { OwnedPokemon, TrainerPokemon } from '../types'
import type { GymLeader, EliteFourMember, Champion } from '../leagueData'
import { calculateEloChange } from '../leagueData'

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

export function TrainerBattleModal({
  opponent,
  opponentType,
  gymIndex,
  eliteFourIndex,
  playerTeam,
  playerElo,
  onWin,
  onLoss,
  onClose,
}: TrainerBattleModalProps) {
  const [trainerTeam, setTrainerTeam] = useState<TrainerPokemon[]>(
    opponent.team.map(p => ({ ...p, hp: p.maxHp }))
  )
  const [playerHPs, setPlayerHPs] = useState<number[]>(
    playerTeam.map(p => p.hp)
  )
  const [trainerIdx, setTrainerIdx] = useState(0)
  const [playerIdx, setPlayerIdx] = useState(0)
  const [battleLog, setBattleLog] = useState<string[]>([
    `${opponent.name} veut se battre !`,
    `"${opponent.tagline}"`,
    `${opponent.name} envoie ${opponent.team[0].name.toUpperCase()} !`,
  ])
  const [phase, setPhase] = useState<'ready' | 'player_turn' | 'enemy_turn' | 'won' | 'lost'>('player_turn')
  const [animating, setAnimating] = useState(false)
  const [shakePlayer, setShakePlayer] = useState(false)
  const [shakeEnemy, setShakeEnemy] = useState(false)

  const addLog = (msg: string) => setBattleLog(prev => [...prev.slice(-15), msg])

  const currentTrainer = trainerTeam[trainerIdx]
  const currentPlayer = playerTeam[playerIdx]
  const currentPlayerHp = playerHPs[playerIdx] ?? 0

  const eloGain = calculateEloChange(playerElo, opponent.elo, true)
  const eloLoss = Math.abs(calculateEloChange(playerElo, opponent.elo, false))

  // Player attacks
  const handleAttack = useCallback(() => {
    if (animating || phase !== 'player_turn') return
    setAnimating(true)

    const move = currentPlayer?.moves[Math.floor(Math.random() * (currentPlayer?.moves.length ?? 1))] ?? 'Charge'
    const dmg = calcDmg(currentPlayer?.level ?? 5, currentTrainer.maxHp)
    const isCrit = dmg > currentPlayer?.level * 1.5 * 1.3

    addLog(`${currentPlayer?.name.toUpperCase()} utilise ${move} ! ${isCrit ? '⚡ CRITIQUE ! ' : ''}(-${dmg} PV)`)
    setShakeEnemy(true)
    setTimeout(() => setShakeEnemy(false), 400)

    const newTrainerHp = Math.max(0, currentTrainer.hp - dmg)
    const newTrainerTeam = trainerTeam.map((p, i) =>
      i === trainerIdx ? { ...p, hp: newTrainerHp } : p
    )
    setTrainerTeam(newTrainerTeam)

    if (newTrainerHp <= 0) {
      addLog(`${currentTrainer.name.toUpperCase()} est K.O. !`)
      const nextTrainerIdx = trainerIdx + 1
      if (nextTrainerIdx >= trainerTeam.length) {
        // Player wins!
        setTimeout(() => {
          addLog('🏆 Tu as gagné le combat !')
          addLog(`ELO : ${playerElo} → ${playerElo + eloGain} (+${eloGain})`)
          setPhase('won')
          setAnimating(false)
        }, 600)
      } else {
        setTimeout(() => {
          addLog(`${opponent.name} envoie ${trainerTeam[nextTrainerIdx].name.toUpperCase()} !`)
          setTrainerIdx(nextTrainerIdx)
          setPhase('player_turn')
          setAnimating(false)
        }, 800)
      }
    } else {
      // Enemy attacks back
      setPhase('enemy_turn')
      setTimeout(() => {
        const eDmg = calcDmg(currentTrainer.level, currentPlayer?.maxHp ?? 50)
        const eMove = currentTrainer.moves[Math.floor(Math.random() * currentTrainer.moves.length)]
        addLog(`${currentTrainer.name.toUpperCase()} utilise ${eMove} ! (-${eDmg} PV)`)
        setShakePlayer(true)
        setTimeout(() => setShakePlayer(false), 400)

        const newPlayerHp = Math.max(0, currentPlayerHp - eDmg)
        const newHPs = playerHPs.map((hp, i) => i === playerIdx ? newPlayerHp : hp)
        setPlayerHPs(newHPs)

        if (newPlayerHp <= 0) {
          addLog(`${currentPlayer?.name.toUpperCase()} est K.O. !`)
          const nextPlayerIdx = playerIdx + 1
          if (nextPlayerIdx >= playerTeam.length) {
            setTimeout(() => {
              addLog('💀 Tous tes Pokémon sont K.O. !')
              addLog(`ELO : ${playerElo} → ${playerElo - eloLoss} (-${eloLoss})`)
              setPhase('lost')
              setAnimating(false)
            }, 600)
          } else {
            setTimeout(() => {
              addLog(`Go ! ${playerTeam[nextPlayerIdx].name.toUpperCase()} !`)
              setPlayerIdx(nextPlayerIdx)
              setPhase('player_turn')
              setAnimating(false)
            }, 800)
          }
        } else {
          setPhase('player_turn')
          setAnimating(false)
        }
      }, 700)
    }
  }, [animating, phase, currentPlayer, currentTrainer, trainerTeam, trainerIdx, playerHPs, playerIdx, playerTeam, playerElo, eloGain, eloLoss, opponent.name])

  // Flee
  const handleFlee = useCallback(() => {
    addLog('Tu t\'es enfui...')
    addLog(`ELO : ${playerElo} → ${playerElo - eloLoss} (-${eloLoss})`)
    setPhase('lost')
  }, [playerElo, eloLoss])

  // Handle result
  const handleResult = () => {
    if (phase === 'won') {
      onWin(
        opponent.id,
        opponent.name,
        opponent.elo,
        opponentType === 'gym',
        gymIndex,
        opponentType === 'eliteFour',
        eliteFourIndex,
        opponentType === 'champion'
      )
    } else if (phase === 'lost') {
      onLoss(opponent.name, opponent.elo)
    }
    onClose()
  }

  const trainerHpPct = currentTrainer ? (currentTrainer.hp / currentTrainer.maxHp) : 0
  const playerHpPct = currentPlayer ? (currentPlayerHp / currentPlayer.maxHp) : 0
  const hpBarColor = (pct: number) => pct > 0.5 ? '#30c030' : pct > 0.2 ? '#f8b800' : '#e03030'

  const opponentEmoji = opponentType === 'champion' ? '👑' : opponentType === 'eliteFour' ? '💎' : ('typeEmoji' in opponent ? opponent.typeEmoji : '⚔️')

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Press Start 2P', monospace",
    }}>
      {/* Header */}
      <div style={{
        background: '#1a1a2e', borderBottom: '3px solid #e84393',
        padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '9px', color: '#e84393' }}>
            {opponentEmoji} {opponentType === 'champion' ? '🏆 CHAMPION' : opponentType === 'eliteFour' ? '💎 ÉLITE QUATRE' : '🏟 ARÈNE'}
          </div>
          <div style={{ fontSize: '11px', color: '#fff', marginTop: '2px' }}>{opponent.name}</div>
        </div>
        <div style={{ fontSize: '8px', color: '#ffb700', textAlign: 'right' }}>
          <div>ELO {opponent.elo}</div>
          <div style={{ color: '#aaa', marginTop: '2px' }}>vs {playerElo}</div>
        </div>
      </div>

      {/* Battle arena */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around',
        background: 'linear-gradient(180deg, #2a1a4a 0%, #1a2a3a 50%, #2a3a2a 100%)',
        padding: '8px',
        minHeight: 0,
      }}>
        {/* Trainer Pokemon (top) */}
        {currentTrainer && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px' }}>
            <img
              src={currentTrainer.spriteUrl}
              alt={currentTrainer.name}
              style={{
                width: '64px', height: '64px', imageRendering: 'pixelated',
                transform: shakeEnemy ? 'translateX(4px)' : 'none',
                transition: 'transform 0.1s',
                filter: 'drop-shadow(0 0 8px rgba(232,67,147,0.5))',
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '9px', color: '#fff', marginBottom: '3px' }}>
                {currentTrainer.name.toUpperCase()} Nv.{currentTrainer.level}
                <span style={{ fontSize: '7px', color: '#aaa', marginLeft: '6px' }}>
                  {trainerIdx + 1}/{trainerTeam.length}
                </span>
              </div>
              <div style={{ fontSize: '7px', color: '#aaa', marginBottom: '4px' }}>
                PV {currentTrainer.hp}/{currentTrainer.maxHp}
              </div>
              <div style={{ height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: hpBarColor(trainerHpPct),
                  width: `${Math.max(0, trainerHpPct * 100)}%`,
                  transition: 'width 0.3s, background 0.3s',
                  boxShadow: `0 0 4px ${hpBarColor(trainerHpPct)}`,
                }} />
              </div>
            </div>
          </div>
        )}

        {/* Player Pokemon (bottom) */}
        {currentPlayer && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px', flexDirection: 'row-reverse' }}>
            <img
              src={currentPlayer.backSpriteUrl || currentPlayer.spriteUrl}
              alt={currentPlayer.name}
              style={{
                width: '64px', height: '64px', imageRendering: 'pixelated',
                transform: shakePlayer ? 'translateX(-4px)' : 'none',
                transition: 'transform 0.1s',
              }}
            />
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ fontSize: '9px', color: '#fff', marginBottom: '3px' }}>
                {currentPlayer.name.toUpperCase()} Nv.{currentPlayer.level}
                <span style={{ fontSize: '7px', color: '#aaa', marginLeft: '6px' }}>
                  {playerIdx + 1}/{playerTeam.length}
                </span>
              </div>
              <div style={{ fontSize: '7px', color: '#aaa', marginBottom: '4px' }}>
                PV {currentPlayerHp}/{currentPlayer.maxHp}
              </div>
              <div style={{ height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: hpBarColor(playerHpPct),
                  width: `${Math.max(0, playerHpPct * 100)}%`,
                  transition: 'width 0.3s, background 0.3s',
                  boxShadow: `0 0 4px ${hpBarColor(playerHpPct)}`,
                }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Battle Log */}
      <div style={{
        background: '#0f0f1e', borderTop: '2px solid #333',
        padding: '6px 10px', height: '90px', overflowY: 'auto',
      }}>
        {battleLog.slice(-5).map((line, i) => (
          <div key={i} style={{
            fontSize: '7px', color: i === battleLog.slice(-5).length - 1 ? '#fff' : '#888',
            lineHeight: '1.6', marginBottom: '2px',
          }}>
            {line}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ background: '#1a1a2e', borderTop: '3px solid #333', padding: '8px' }}>
        {phase === 'player_turn' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAttack}
              disabled={animating}
              style={{
                flex: 2, padding: '10px', fontSize: '9px', fontFamily: 'inherit',
                background: animating ? '#333' : '#e84393', color: '#fff',
                border: 'none', borderRadius: '4px', cursor: animating ? 'not-allowed' : 'pointer',
                letterSpacing: '0.5px',
              }}
            >
              ⚔ ATTAQUER
            </button>
            <button
              onClick={handleFlee}
              style={{
                flex: 1, padding: '10px', fontSize: '8px', fontFamily: 'inherit',
                background: '#333', color: '#aaa',
                border: '1px solid #555', borderRadius: '4px', cursor: 'pointer',
              }}
            >
              🏃 FUIR
            </button>
          </div>
        )}
        {phase === 'enemy_turn' && (
          <div style={{ textAlign: 'center', fontSize: '8px', color: '#e84393', padding: '10px' }}>
            ⏳ L'adversaire attaque...
          </div>
        )}
        {(phase === 'won' || phase === 'lost') && (
          <div>
            <div style={{
              textAlign: 'center', fontSize: '10px',
              color: phase === 'won' ? '#30c030' : '#e03030',
              padding: '8px', marginBottom: '6px',
            }}>
              {phase === 'won' ? `🏆 VICTOIRE ! +${eloGain} ELO` : `💀 DÉFAITE... -${eloLoss} ELO`}
            </div>
            <button
              onClick={handleResult}
              style={{
                width: '100%', padding: '10px', fontSize: '9px', fontFamily: 'inherit',
                background: phase === 'won' ? '#30c030' : '#555',
                color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer',
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
