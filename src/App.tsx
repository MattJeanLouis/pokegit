import { useState, useCallback, useRef } from 'react'
import { useGameState } from './hooks/useGameState'
import { BattleArena } from './components/BattleArena'
import { ActionPanel } from './components/ActionPanel'
import { BattleLog } from './components/BattleLog'
import { TeamView } from './components/TeamView'
import { ShopView } from './components/ShopView'
import { ZoneSelector } from './components/ZoneSelector'
import { WelcomeScreen } from './components/WelcomeScreen'
import { StarterScreen } from './components/StarterScreen'
import { PokemonCenter } from './components/PokemonCenter'
import { LeagueView } from './components/LeagueView'
import { PokedexView } from './components/PokedexView'
import { ZONE_INFO, getMoveInfo } from './gameLogic'
import type { OwnedPokemon } from './types'

type Tab = 'battle' | 'team' | 'shop' | 'centre' | 'zones' | 'ligue' | 'pokedex'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('battle')
  const [showWelcome, setShowWelcome] = useState(true)
  const {
    state,
    dispatch,
    explore,
    fight,
    fightWithMove,
    throwBall,
    run,
    changeZone,
    buyItem,
    sendToPC,
    chooseStarter,
    healTeam,
    usePotion,
    switchPokemon,
  } = useGameState()

  const [attackFlash, setAttackFlash] = useState<{ color: string; emoji: string; moveType: string } | null>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleFightWithMove = useCallback((moveName: string) => {
    const { color, emoji, moveType } = getMoveInfo(moveName)
    setAttackFlash({ color, emoji, moveType })
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setAttackFlash(null), 600)
    fightWithMove(moveName)
  }, [fightWithMove])

  const { player, log, currentZone } = state
  const zoneInfo = ZONE_INFO.find(z => z.id === currentZone)!

  const isTeamFull = state.team.length >= 6

  const handleStart = useCallback(() => {
    setShowWelcome(false)
    // Démarrer le premier combat automatiquement
    explore()
  }, [explore])

  const handleChooseStarter = useCallback((pokemon: OwnedPokemon) => {
    chooseStarter(pokemon)
    // Rester sur l'écran de bienvenue après le choix du starter
  }, [chooseStarter])

  const tabs: { id: Tab; label: string; icon: string; badge?: boolean }[] = [
    { id: 'battle', label: 'COMBAT', icon: '⚔' },
    { id: 'team', label: 'ÉQUIPE', icon: '👾', badge: isTeamFull },
    { id: 'pokedex', label: 'DEX', icon: '📖' },
    { id: 'shop', label: 'SHOP', icon: '🛒' },
    { id: 'centre', label: 'CENTRE', icon: '➕' },
    { id: 'zones', label: 'ZONES', icon: '🗺' },
    { id: 'ligue', label: 'LIGUE', icon: '🏆', badge: state.badges.filter(Boolean).length === 8 && !state.championDefeated },
  ]

  // Écran de choix du starter si pas encore choisi
  if (!state.starterChosen) {
    return <StarterScreen onChoose={handleChooseStarter} />
  }

  // Afficher l'écran d'accueil si première visite (starter choisi mais welcome pas encore vu)
  if (showWelcome) {
    return <WelcomeScreen onStart={handleStart} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', maxWidth: '400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="game-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontSize: '13px', letterSpacing: '1px' }}>POKÉGIT</div>
          <div style={{ fontSize: '7px', color: '#aaa' }}>{zoneInfo.name}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
          <div style={{ fontSize: '10px', color: '#ffcc00' }}>₽ {player.pokeDollars.toLocaleString()}</div>
          <div style={{ fontSize: '7px', color: '#aaa' }}>
            PB:{player.pokeballs} SB:{player.greatBalls}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {activeTab === 'battle' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <BattleArena state={state} attackFlash={attackFlash} />
            <ActionPanel
              state={state}
              onExplore={explore}
              onFight={fight}
              onFightWithMove={handleFightWithMove}
              onThrowBall={throwBall}
              onRun={run}
              onSwitch={switchPokemon}
            />
            <BattleLog log={log} />
          </div>
        )}

        {activeTab === 'team' && (
          <TeamView
            team={state.team}
            pc={state.pc}
            onSendToPC={sendToPC}
          />
        )}

        {activeTab === 'shop' && (
          <ShopView
            pokeDollars={player.pokeDollars}
            pokeballs={player.pokeballs}
            greatBalls={player.greatBalls}
            potions={player.potions}
            superPotions={player.superPotions}
            hyperPotions={player.hyperPotions}
            team={state.team}
            onBuy={buyItem}
            onUsePotion={usePotion}
          />
        )}

        {activeTab === 'centre' && (
          <PokemonCenter
            team={state.team}
            lastHealTime={state.lastHealTime}
            onHeal={healTeam}
          />
        )}

        {activeTab === 'zones' && (
          <ZoneSelector
            currentZone={currentZone}
            repoCount={player.repoCount}
            badges={state.badges}
            onChangeZone={changeZone}
          />
        )}

        {activeTab === 'pokedex' && (
          <PokedexView
            team={state.team}
            pc={state.pc}
            seenPokemonIds={state.seenPokemonIds}
          />
        )}

        {activeTab === 'ligue' && (
          <LeagueView
            badges={state.badges}
            eliteFourDefeated={state.eliteFourDefeated}
            championDefeated={state.championDefeated}
            playerElo={state.playerElo}
            eloHistory={state.eloHistory}
            team={state.team}
            onWin={(opponentId, opponentName, opponentElo, isGym, gymIndex, isEliteFour, eliteFourIndex, isChampion) => {
              dispatch({
                type: 'TRAINER_BATTLE_WON',
                opponentId,
                opponentName,
                opponentElo,
                isGym,
                gymIndex,
                isEliteFour,
                eliteFourIndex,
                isChampion,
              })
            }}
            onLoss={(opponentName, opponentElo) => {
              dispatch({ type: 'TRAINER_BATTLE_LOST', opponentName, opponentElo })
            }}
          />
        )}
      </div>

      {/* Barre d'onglets du bas */}
      <div
        className="tab-bar"
        style={{ display: 'flex', padding: '4px 0 0 0' }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ position: 'relative' }}
          >
            <div style={{ fontSize: '14px', marginBottom: '2px' }}>{tab.icon}</div>
            <div>{tab.label}</div>
            {/* Badge rouge si équipe pleine */}
            {tab.badge && (
              <div style={{
                position: 'absolute',
                top: '2px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#e83030',
                border: '1px solid #000',
              }} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
