export interface OwnedPokemon {
  id: number
  name: string
  level: number
  hp: number
  maxHp: number
  spriteUrl: string
  backSpriteUrl: string
  shiny: boolean
  moves: string[]
  xp: number
  xpToNext: number
}

export interface WildPokemon {
  id: number
  name: string
  level: number
  hp: number
  maxHp: number
  spriteUrl: string
  catchRate: number
  moves: string[]
}

export interface TrainerPokemon {
  id: number
  name: string
  level: number
  hp: number
  maxHp: number
  spriteUrl: string
  moves: string[]
}

export interface EloHistoryEntry {
  elo: number
  change: number
  result: 'win' | 'loss'
  opponent: string
  date: string
}

export type BallType = 'pokeball' | 'greatball'

export type PotionType = 'potion' | 'superPotion' | 'hyperPotion'

export type ItemType = BallType | PotionType

export type BattleState = 'idle' | 'encounter' | 'fighting' | 'catching' | 'fled' | 'caught'

export type Zone = 1 | 2 | 3 | 4 | 5 | 6

export interface Player {
  name: string
  pokeDollars: number
  pokeballs: number
  greatBalls: number
  repoCount: number
  commits30d: number
  starsTotal: number
  potions: number
  superPotions: number
  hyperPotions: number
}

export interface GameState {
  player: Player
  team: OwnedPokemon[]
  pc: OwnedPokemon[]
  currentZone: Zone
  wildPokemon: WildPokemon | null
  battleState: BattleState
  log: string[]
  idleTimer: number
  isLoading: boolean
  shakingWild: boolean
  shakingPlayer: boolean
  starterChosen: boolean
  lastHealTime: number
  // League
  badges: boolean[]
  eliteFourDefeated: boolean[]
  championDefeated: boolean
  playerElo: number
  eloHistory: EloHistoryEntry[]
}

export interface ZoneInfo {
  id: Zone
  name: string
  subtitle: string
  idRange: [number, number]
  requiredRepos: number
  bgColor: string
  description: string
  badgesRequired?: number
}

export interface GitHubData {
  username: string
  name: string
  commits30d: number
  repoCount: number
  starsTotal: number
}

export type GameAction =
  | { type: 'ENCOUNTER'; pokemon: WildPokemon }
  | { type: 'FIGHT'; moveName?: string }
  | { type: 'THROW_BALL'; ballType: BallType }
  | { type: 'RUN' }
  | { type: 'CATCH_SUCCESS'; pokemon: WildPokemon }
  | { type: 'POKEMON_FLED' }
  | { type: 'TICK_TIMER' }
  | { type: 'ADD_TO_TEAM'; pokemon: OwnedPokemon }
  | { type: 'SEND_TO_PC'; pokemonIndex: number }
  | { type: 'CHANGE_ZONE'; zone: Zone }
  | { type: 'BUY_ITEM'; item: ItemType; cost: number }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SHAKE_WILD'; shaking: boolean }
  | { type: 'SHAKE_PLAYER'; shaking: boolean }
  | { type: 'ENEMY_ATTACK' }
  | { type: 'ADD_LOG'; message: string }
  | { type: 'CHOOSE_STARTER'; pokemon: OwnedPokemon }
  | { type: 'HEAL_TEAM' }
  | { type: 'USE_POTION'; pokemonIndex: number; potionType: PotionType }
  | { type: 'TRAINER_BATTLE_WON'; opponentId: number; opponentName: string; opponentElo: number; isGym: boolean; gymIndex?: number; isEliteFour: boolean; eliteFourIndex?: number; isChampion: boolean }
  | { type: 'TRAINER_BATTLE_LOST'; opponentName: string; opponentElo: number }
  | { type: 'GAIN_XP'; pokemonIndex: number; amount: number }
  | { type: 'EVOLVE_POKEMON'; pokemonIndex: number; newId: number; newName: string; newSpriteUrl: string; newBackSpriteUrl: string }
  | { type: 'SWITCH_POKEMON'; targetIndex: number }
