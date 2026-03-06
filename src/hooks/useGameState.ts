import { useReducer, useEffect, useCallback, useRef } from 'react'
import type { GameState, GameAction, Zone, BallType, PotionType } from '../types'
import {
  MOCK_GITHUB,
  computePlayerStats,
  getZoneForPlayer,
  generateWildPokemon,
  calculateDamage,
  calculateCatchSuccess,
  wildPokemonToOwned,
  fetchPokemon,
  EVOLUTION_MAP,
  STATUS_MOVES,
} from '../gameLogic'

const { pokeDollars } = computePlayerStats(MOCK_GITHUB)

const INITIAL_STATE: GameState = {
  player: {
    name: MOCK_GITHUB.name,
    pokeDollars,
    pokeballs: 10,
    greatBalls: 3,
    repoCount: MOCK_GITHUB.repoCount,
    commits30d: MOCK_GITHUB.commits30d,
    starsTotal: MOCK_GITHUB.starsTotal,
    potions: 1,
    superPotions: 0,
    hyperPotions: 0,
  },
  team: [],
  pc: [],
  currentZone: getZoneForPlayer(MOCK_GITHUB.repoCount),
  wildPokemon: null,
  battleState: 'idle',
  log: [
    'Bienvenue dans PokéGit !',
    'Explore pour trouver des Pokémon sauvages !',
    'Le minuteur décompte jusqu\'au prochain combat.',
  ],
  idleTimer: 30,
  isLoading: false,
  shakingWild: false,
  shakingPlayer: false,
  starterChosen: false,
  lastHealTime: 0,
  badges: Array(8).fill(false),
  eliteFourDefeated: Array(4).fill(false),
  championDefeated: false,
  playerElo: 1000,
  eloHistory: [],
  seenPokemonIds: [],
}

function addLog(log: string[], message: string): string[] {
  const next = [...log, message]
  return next.slice(-20) // garder les 20 derniers messages
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SEE_POKEMON':
      if (state.seenPokemonIds.includes(action.id)) return state
      return { ...state, seenPokemonIds: [...state.seenPokemonIds, action.id] }

    case 'ENCOUNTER':
      return {
        ...state,
        wildPokemon: action.pokemon,
        battleState: 'encounter',
        idleTimer: 30,
        isLoading: false,
        seenPokemonIds: state.seenPokemonIds.includes(action.pokemon.id)
          ? state.seenPokemonIds
          : [...state.seenPokemonIds, action.pokemon.id],
        log: addLog(state.log, `Un ${action.pokemon.name.toUpperCase()} sauvage apparaît ! (Nv.${action.pokemon.level})`),
      }

    case 'FIGHT': {
      if (!state.wildPokemon) return state
      const damage = calculateDamage(state.team[0]?.level ?? 5, state.wildPokemon.maxHp)
      const newHp = Math.max(0, state.wildPokemon.hp - damage)
      const playerPokemon = state.team[0]
      const moveName = action.moveName ?? (playerPokemon?.moves[Math.floor(Math.random() * (playerPokemon?.moves.length ?? 1))] ?? 'Charge')

      let newLog = addLog(state.log, `${playerPokemon?.name.toUpperCase() ?? 'Toi'} utilise ${moveName} ! (-${damage} PV)`)

      if (newHp <= 0) {
        const earnedDollars = state.wildPokemon.level * 10
        const xpGained = state.wildPokemon.level * 5
        newLog = addLog(newLog, `${state.wildPokemon.name.toUpperCase()} est K.O. ! +${earnedDollars}₽ +${xpGained} XP !`)

        // Apply XP to lead Pokémon inline
        let newTeam = state.team
        if (playerPokemon) {
          let newXp = playerPokemon.xp + xpGained
          let newLevel = playerPokemon.level
          let newXpToNext = playerPokemon.xpToNext
          let newMaxHp = playerPokemon.maxHp
          // Level up loop
          while (newXp >= newXpToNext) {
            newXp -= newXpToNext
            newLevel += 1
            newXpToNext = newLevel * 20
            newMaxHp += 5
            newLog = addLog(newLog, `${playerPokemon.name.toUpperCase()} passe au niveau ${newLevel} !`)
          }
          newTeam = state.team.map((p, i) =>
            i === 0 ? { ...p, xp: newXp, level: newLevel, xpToNext: newXpToNext, maxHp: newMaxHp, hp: Math.min(p.hp, newMaxHp) } : p
          )
        }

        return {
          ...state,
          wildPokemon: null,
          battleState: 'idle',
          idleTimer: 30,
          shakingWild: true,
          team: newTeam,
          player: {
            ...state.player,
            pokeDollars: state.player.pokeDollars + earnedDollars,
          },
          log: newLog,
        }
      }

      return {
        ...state,
        wildPokemon: { ...state.wildPokemon, hp: newHp },
        battleState: 'fighting',
        shakingWild: true,
        log: newLog,
      }
    }

    case 'THROW_BALL': {
      if (!state.wildPokemon) return state
      const ballType: BallType = action.ballType
      const haseball = ballType === 'pokeball' ? state.player.pokeballs : state.player.greatBalls
      if (haseball <= 0) {
        return {
          ...state,
          log: addLog(state.log, `Plus de ${ballType === 'pokeball' ? 'Pokéballs' : 'Super Balls'} !`),
        }
      }

      const success = calculateCatchSuccess(state.wildPokemon, ballType, state.player.starsTotal)
      const ballName = ballType === 'pokeball' ? 'Pokéball' : 'Super Ball'
      const newPokeballs = ballType === 'pokeball' ? state.player.pokeballs - 1 : state.player.pokeballs
      const newGreatBalls = ballType === 'greatball' ? state.player.greatBalls - 1 : state.player.greatBalls

      if (success) {
        // On garde wildPokemon en mémoire pour le traitement CATCH_SUCCESS
        return {
          ...state,
          player: { ...state.player, pokeballs: newPokeballs, greatBalls: newGreatBalls },
          battleState: 'caught',
          log: addLog(state.log, `Lance une ${ballName}... Gotcha ! ${state.wildPokemon.name.toUpperCase()} est capturé !`),
        }
      } else {
        return {
          ...state,
          player: { ...state.player, pokeballs: newPokeballs, greatBalls: newGreatBalls },
          battleState: 'encounter',
          shakingWild: false,
          log: addLog(state.log, `Lance une ${ballName}... ${state.wildPokemon.name.toUpperCase()} s'est libéré !`),
        }
      }
    }

    case 'RUN':
      return {
        ...state,
        wildPokemon: null,
        battleState: 'idle',
        idleTimer: 30,
        log: addLog(state.log, 'Tu t\'es enfui sans problème !'),
      }

    case 'CATCH_SUCCESS': {
      if (!action.pokemon) return state
      const backSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${action.pokemon.id}.png`
      const owned = wildPokemonToOwned(action.pokemon, backSpriteUrl, ['Charge', 'Rugissement'])
      if (state.team.length < 6) {
        return {
          ...state,
          team: [...state.team, owned],
          wildPokemon: null,
          battleState: 'idle',
          idleTimer: 30,
          log: addLog(
            addLog(state.log, `${owned.name.toUpperCase()} rejoint ton équipe !`),
            owned.shiny ? '✨ Pokémon Chromatique ! Quelle chance !' : ''
          ).filter(l => l !== ''),
        }
      } else {
        return {
          ...state,
          pc: [...state.pc, owned],
          wildPokemon: null,
          battleState: 'idle',
          idleTimer: 30,
          log: addLog(state.log, `Équipe pleine ! ${owned.name.toUpperCase()} envoyé au PC.`),
        }
      }
    }

    case 'POKEMON_FLED':
      return {
        ...state,
        wildPokemon: null,
        battleState: 'idle', // BUG FIX: reset to idle (pas 'fled') pour que le timer fonctionne
        idleTimer: 30,
        log: addLog(state.log, `${state.wildPokemon?.name.toUpperCase() ?? 'Le Pokémon'} s\'est enfui !`),
      }

    case 'TICK_TIMER': {
      const newTimer = state.idleTimer - 1
      if (newTimer <= 0 && state.battleState === 'idle') {
        return {
          ...state,
          idleTimer: 30,
          isLoading: true,
          log: addLog(state.log, 'Un Pokémon sauvage approche...'),
        }
      }
      return { ...state, idleTimer: Math.max(0, newTimer) }
    }

    case 'ADD_TO_TEAM':
      if (state.team.length >= 6) {
        return { ...state, log: addLog(state.log, 'L\'équipe est pleine !') }
      }
      return { ...state, team: [...state.team, action.pokemon] }

    case 'SEND_TO_PC': {
      const pokemon = state.team[action.pokemonIndex]
      if (!pokemon) return state
      return {
        ...state,
        team: state.team.filter((_, i) => i !== action.pokemonIndex),
        pc: [...state.pc, pokemon],
        log: addLog(state.log, `${pokemon.name.toUpperCase()} envoyé au PC.`),
      }
    }

    case 'CHANGE_ZONE':
      if (state.battleState !== 'idle') {
        return { ...state, log: addLog(state.log, 'Termine le combat d\'abord !') }
      }
      return {
        ...state,
        currentZone: action.zone,
        wildPokemon: null,
        idleTimer: 30,
        log: addLog(state.log, `Déplacé vers la Zone ${action.zone} !`),
      }

    case 'BUY_ITEM': {
      if (state.player.pokeDollars < action.cost) {
        return { ...state, log: addLog(state.log, `Pas assez de ₽ !`) }
      }
      let itemName = ''
      let updatedPlayer = { ...state.player, pokeDollars: state.player.pokeDollars - action.cost }

      if (action.item === 'pokeball') {
        itemName = 'Pokéball'
        updatedPlayer = { ...updatedPlayer, pokeballs: updatedPlayer.pokeballs + 1 }
      } else if (action.item === 'greatball') {
        itemName = 'Super Ball'
        updatedPlayer = { ...updatedPlayer, greatBalls: updatedPlayer.greatBalls + 1 }
      } else if (action.item === 'potion') {
        itemName = 'Potion'
        updatedPlayer = { ...updatedPlayer, potions: updatedPlayer.potions + 1 }
      } else if (action.item === 'superPotion') {
        itemName = 'Super Potion'
        updatedPlayer = { ...updatedPlayer, superPotions: updatedPlayer.superPotions + 1 }
      } else if (action.item === 'hyperPotion') {
        itemName = 'Hyper Potion'
        updatedPlayer = { ...updatedPlayer, hyperPotions: updatedPlayer.hyperPotions + 1 }
      }

      return {
        ...state,
        player: updatedPlayer,
        log: addLog(state.log, `Acheté 1 ${itemName} pour ${action.cost}₽`),
      }
    }

    case 'SET_LOADING':
      return { ...state, isLoading: action.loading }

    case 'SHAKE_WILD':
      return { ...state, shakingWild: action.shaking }

    case 'SHAKE_PLAYER':
      return { ...state, shakingPlayer: action.shaking }

    case 'ENEMY_ATTACK': {
      if (!state.wildPokemon || state.team.length === 0 || state.battleState === 'idle') return state
      const playerPokemon = state.team[0]
      const damage = calculateDamage(state.wildPokemon.level, playerPokemon.maxHp)
      const newHp = Math.max(0, playerPokemon.hp - damage)
      const newTeam = state.team.map((p, i) =>
        i === 0 ? { ...p, hp: newHp } : p
      )
      // Pick a damaging move (not a status move) for the enemy
      const wildMoves = state.wildPokemon.moves ?? []
      const damagingMoves = wildMoves.filter(m => !STATUS_MOVES.has(m))
      const enemyMove = damagingMoves.length > 0
        ? damagingMoves[Math.floor(Math.random() * damagingMoves.length)]
        : (wildMoves[0] ?? 'Charge')

      if (newHp <= 0) {
        return {
          ...state,
          team: newTeam,
          shakingPlayer: true,
          wildPokemon: null,
          battleState: 'idle',
          idleTimer: 30,
          log: addLog(
            addLog(state.log, `${state.wildPokemon.name.toUpperCase()} utilise ${enemyMove} ! (-${damage} PV)`),
            `${playerPokemon.name.toUpperCase()} est K.O. ! Tu t\'es enfui...`
          ),
        }
      }

      return {
        ...state,
        team: newTeam,
        shakingPlayer: true,
        log: addLog(state.log, `${state.wildPokemon.name.toUpperCase()} utilise ${enemyMove} ! (-${damage} PV)`),
      }
    }

    case 'ADD_LOG':
      return { ...state, log: addLog(state.log, action.message) }

    case 'CHOOSE_STARTER': {
      return {
        ...state,
        team: [action.pokemon],
        starterChosen: true,
        log: addLog(state.log, `${action.pokemon.name.toUpperCase()} a rejoint ton équipe ! Bonne chance, Dresseur !`),
      }
    }

    case 'HEAL_TEAM': {
      const now = Date.now()
      const cooldown = 5 * 60 * 1000
      if (now - state.lastHealTime < cooldown) {
        return state
      }
      const allFull = state.team.every(p => p.hp >= p.maxHp)
      if (allFull) {
        return { ...state, log: addLog(state.log, 'Ton équipe est en pleine forme !') }
      }
      const healedTeam = state.team.map(p => ({ ...p, hp: p.maxHp }))
      return {
        ...state,
        team: healedTeam,
        lastHealTime: now,
        log: addLog(state.log, 'Tes Pokémon ont été soignés ! Bonne chance, Dresseur !'),
      }
    }

    case 'USE_POTION': {
      const { pokemonIndex, potionType } = action
      const pokemon = state.team[pokemonIndex]
      if (!pokemon) return state

      let healAmount = 0
      let potionName = ''
      let newPotions = state.player.potions
      let newSuperPotions = state.player.superPotions
      let newHyperPotions = state.player.hyperPotions

      if (potionType === 'potion') {
        if (state.player.potions <= 0) return { ...state, log: addLog(state.log, 'Plus de Potions !') }
        healAmount = 20
        potionName = 'Potion'
        newPotions = state.player.potions - 1
      } else if (potionType === 'superPotion') {
        if (state.player.superPotions <= 0) return { ...state, log: addLog(state.log, 'Plus de Super Potions !') }
        healAmount = 50
        potionName = 'Super Potion'
        newSuperPotions = state.player.superPotions - 1
      } else if (potionType === 'hyperPotion') {
        if (state.player.hyperPotions <= 0) return { ...state, log: addLog(state.log, 'Plus d\'Hyper Potions !') }
        healAmount = pokemon.maxHp // restore all HP
        potionName = 'Hyper Potion'
        newHyperPotions = state.player.hyperPotions - 1
      }

      const newHp = potionType === 'hyperPotion'
        ? pokemon.maxHp
        : Math.min(pokemon.maxHp, pokemon.hp + healAmount)

      const newTeam = state.team.map((p, i) =>
        i === pokemonIndex ? { ...p, hp: newHp } : p
      )

      return {
        ...state,
        team: newTeam,
        player: {
          ...state.player,
          potions: newPotions,
          superPotions: newSuperPotions,
          hyperPotions: newHyperPotions,
        },
        log: addLog(state.log, `${potionName} utilisée sur ${pokemon.name.toUpperCase()} ! (+${healAmount === pokemon.maxHp ? 'tous les' : healAmount} PV)`),
      }
    }

    case 'SWITCH_POKEMON': {
      const { targetIndex } = action
      if (targetIndex <= 0 || targetIndex >= state.team.length) return state
      const newTeam = [...state.team]
      const tmp = newTeam[0]
      newTeam[0] = newTeam[targetIndex]
      newTeam[targetIndex] = tmp
      return {
        ...state,
        team: newTeam,
        log: addLog(state.log, `Tu changes pour ${newTeam[0].name.toUpperCase()} ! L'ennemi en profite...`),
      }
    }

    case 'EVOLVE_POKEMON': {
      const { pokemonIndex, newId, newName, newSpriteUrl, newBackSpriteUrl } = action
      const newTeam = state.team.map((p, i) =>
        i === pokemonIndex ? { ...p, id: newId, name: newName, spriteUrl: newSpriteUrl, backSpriteUrl: newBackSpriteUrl } : p
      )
      return {
        ...state,
        team: newTeam,
        log: addLog(state.log, `✨ ${state.team[pokemonIndex]?.name.toUpperCase()} évolue en ${newName.toUpperCase()} !`),
      }
    }

    case 'TRAINER_BATTLE_WON': {
      const eloChange = Math.round(32 * (1 - 1 / (1 + Math.pow(10, (action.opponentElo - state.playerElo) / 400))))
      const newElo = state.playerElo + eloChange
      const entry = {
        elo: newElo,
        change: eloChange,
        result: 'win' as const,
        opponent: action.opponentName,
        date: new Date().toLocaleDateString('fr-FR'),
      }
      const newBadges = [...state.badges]
      const newEliteFour = [...state.eliteFourDefeated]
      if (action.isGym && action.gymIndex !== undefined) {
        newBadges[action.gymIndex] = true
      }
      if (action.isEliteFour && action.eliteFourIndex !== undefined) {
        newEliteFour[action.eliteFourIndex] = true
      }
      const rewardCredits = action.isChampion ? 5000 : action.isEliteFour ? 2000 : action.isGym ? 500 : 200
      return {
        ...state,
        badges: newBadges,
        eliteFourDefeated: newEliteFour,
        championDefeated: action.isChampion ? true : state.championDefeated,
        playerElo: newElo,
        eloHistory: [entry, ...state.eloHistory].slice(0, 20),
        player: { ...state.player, pokeDollars: state.player.pokeDollars + rewardCredits },
        log: addLog(state.log, `VICTOIRE contre ${action.opponentName} ! ELO: ${state.playerElo} → ${newElo} (+${eloChange}) +${rewardCredits}₽`),
      }
    }

    case 'TRAINER_BATTLE_LOST': {
      const eloChange = Math.round(32 * (1 / (1 + Math.pow(10, (action.opponentElo - state.playerElo) / 400))))
      const newElo = Math.max(600, state.playerElo - eloChange)
      const entry = {
        elo: newElo,
        change: -eloChange,
        result: 'loss' as const,
        opponent: action.opponentName,
        date: new Date().toLocaleDateString('fr-FR'),
      }
      return {
        ...state,
        playerElo: newElo,
        eloHistory: [entry, ...state.eloHistory].slice(0, 20),
        log: addLog(state.log, `Défaite contre ${action.opponentName}... ELO: ${state.playerElo} → ${newElo} (-${eloChange})`),
      }
    }

    default:
      return state
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE)
  const isEncountering = useRef(false)
  // Stocker wildPokemon au moment de la capture pour éviter la perte lors du changement d'état
  const capturedPokemonRef = useRef<typeof state.wildPokemon>(null)

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Watch for loading state to trigger encounter
  useEffect(() => {
    if (state.isLoading && !isEncountering.current) {
      isEncountering.current = true
      generateWildPokemon(state.currentZone, state.player.starsTotal)
        .then(pokemon => {
          dispatch({ type: 'ENCOUNTER', pokemon })
        })
        .catch(() => {
          dispatch({ type: 'SET_LOADING', loading: false })
          dispatch({ type: 'ADD_LOG', message: 'Impossible de charger le Pokémon. Réessaie.' })
        })
        .finally(() => {
          isEncountering.current = false
        })
    }
  }, [state.isLoading, state.currentZone, state.player.starsTotal])

  // Clear shake animations
  useEffect(() => {
    if (state.shakingWild) {
      const t = setTimeout(() => dispatch({ type: 'SHAKE_WILD', shaking: false }), 500)
      return () => clearTimeout(t)
    }
  }, [state.shakingWild])

  useEffect(() => {
    if (state.shakingPlayer) {
      const t = setTimeout(() => dispatch({ type: 'SHAKE_PLAYER', shaking: false }), 500)
      return () => clearTimeout(t)
    }
  }, [state.shakingPlayer])

  // BUG FIX: Sauvegarder wildPokemon avant que l'état 'caught' le réinitialise
  useEffect(() => {
    if (state.battleState === 'caught' && state.wildPokemon) {
      capturedPokemonRef.current = state.wildPokemon
    }
  }, [state.battleState, state.wildPokemon])

  // After 'caught' state, trigger add to team
  useEffect(() => {
    if (state.battleState === 'caught') {
      // Utiliser la ref pour récupérer le Pokémon capturé même si wildPokemon est null
      const pokemon = state.wildPokemon ?? capturedPokemonRef.current
      if (!pokemon) return

      fetchPokemon(pokemon.id)
        .then(data => {
          dispatch({
            type: 'CATCH_SUCCESS',
            pokemon: {
              ...pokemon,
              spriteUrl: data.spriteUrl,
            },
          })
        })
        .catch(() => {
          dispatch({ type: 'CATCH_SUCCESS', pokemon })
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.battleState])

  // Auto-fuite si pas d'équipe au combat
  useEffect(() => {
    if (state.battleState === 'encounter' && state.team.length === 0) {
      const t = setTimeout(() => {
        dispatch({ type: 'RUN' })
        dispatch({ type: 'ADD_LOG', message: 'Pas de Pokémon ! Fuite automatique...' })
      }, 1500)
      return () => clearTimeout(t)
    }
  }, [state.battleState, state.team.length])

  // Evolution checker - watch team levels
  const evolvingRef = useRef<Set<number>>(new Set())
  useEffect(() => {
    state.team.forEach((pokemon, index) => {
      const evo = EVOLUTION_MAP[pokemon.id]
      if (evo && pokemon.level >= evo.evolvesAt && !evolvingRef.current.has(index)) {
        evolvingRef.current.add(index)
        const newSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.evolutionId}.png`
        const newBackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${evo.evolutionId}.png`
        dispatch({
          type: 'EVOLVE_POKEMON',
          pokemonIndex: index,
          newId: evo.evolutionId,
          newName: evo.evolutionName,
          newSpriteUrl,
          newBackSpriteUrl,
        })
        setTimeout(() => evolvingRef.current.delete(index), 2000)
      }
    })
  }, [state.team])

  const explore = useCallback(() => {
    if (state.battleState !== 'idle' || state.isLoading) return
    dispatch({ type: 'SET_LOADING', loading: true })
    dispatch({ type: 'ADD_LOG', message: 'Recherche de Pokémon...' })
  }, [state.battleState, state.isLoading])

  const fight = useCallback(() => {
    if (state.battleState !== 'encounter' && state.battleState !== 'fighting') return
    if (!state.wildPokemon) return
    dispatch({ type: 'FIGHT' })
    setTimeout(() => { dispatch({ type: 'ENEMY_ATTACK' }) }, 800)
  }, [state.battleState, state.wildPokemon])

  const fightWithMove = useCallback((moveName: string) => {
    if (state.battleState !== 'encounter' && state.battleState !== 'fighting') return
    if (!state.wildPokemon) return
    dispatch({ type: 'FIGHT', moveName })
    setTimeout(() => { dispatch({ type: 'ENEMY_ATTACK' }) }, 800)
  }, [state.battleState, state.wildPokemon])

  const throwBall = useCallback((ballType: BallType) => {
    if (!state.wildPokemon) return // BUG FIX: guard null wildPokemon
    dispatch({ type: 'THROW_BALL', ballType })
  }, [state.wildPokemon])

  const run = useCallback(() => {
    dispatch({ type: 'RUN' })
  }, [])

  const changeZone = useCallback((zone: Zone) => {
    dispatch({ type: 'CHANGE_ZONE', zone })
  }, [])

  const buyItem = useCallback((item: import('../types').ItemType, cost: number) => {
    dispatch({ type: 'BUY_ITEM', item, cost })
  }, [])

  const sendToPC = useCallback((index: number) => {
    dispatch({ type: 'SEND_TO_PC', pokemonIndex: index })
  }, [])

  const chooseStarter = useCallback((pokemon: import('../types').OwnedPokemon) => {
    dispatch({ type: 'CHOOSE_STARTER', pokemon })
  }, [])

  const healTeam = useCallback(() => {
    dispatch({ type: 'HEAL_TEAM' })
  }, [])

  const usePotion = useCallback((pokemonIndex: number, potionType: PotionType) => {
    dispatch({ type: 'USE_POTION', pokemonIndex, potionType })
  }, [])

  const switchPokemon = useCallback((targetIndex: number) => {
    dispatch({ type: 'SWITCH_POKEMON', targetIndex })
    // Enemy gets a free attack during switch
    setTimeout(() => {
      dispatch({ type: 'ENEMY_ATTACK' })
    }, 400)
  }, [])

  return {
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
  }
}

// Export dispatch type for external use
export type { GameState }
