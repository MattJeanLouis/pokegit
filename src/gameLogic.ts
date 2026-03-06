import type { GitHubData, WildPokemon, OwnedPokemon, Zone, ZoneInfo, BallType } from './types'

// Mock GitHub data
export const MOCK_GITHUB: GitHubData = {
  username: 'MattJeanLouis',
  name: 'Dixi',
  commits30d: 0,
  repoCount: 5,
  starsTotal: 5,
}

// Non-damaging status moves — enemy won't use these to attack
export const STATUS_MOVES = new Set([
  'Growl', 'Tail Whip', 'Leer', 'String Shot', 'Sand Attack', 'Smokescreen',
  'Harden', 'Withdraw', 'Defense Curl', 'Screech', 'Charm', 'Baby Doll Eyes',
  'Disable', 'Supersonic', 'Swords Dance', 'Amnesia', 'Minimize', 'Double Team',
  'Sharpen', 'Flash', 'Splash', 'Meditate', 'Agility', 'Barrier', 'Acid Armor',
  'Reflect', 'Light Screen', 'Mist', 'Safeguard', 'Focus Energy', 'Bide',
  'Whirlwind', 'Roar', 'Sweet Scent', 'Toxic', 'Thunder Wave', 'Will O Wisp',
  'Hypnosis', 'Sing', 'Lovely Kiss', 'Spore', 'Sleep Powder', 'Stun Spore',
  'Poison Powder', 'Leech Seed', 'Encore', 'Mean Look', 'Spider Web',
  'Nasty Plot', 'Calm Mind', 'Bulk Up', 'Dragon Dance', 'Belly Drum',
  'Work Up', 'Coil', 'Hone Claws', 'Soft Boiled', 'Recover', 'Rest',
  'Tail Glow', 'Shift Gear', 'Quiver Dance',
])

// Returns type emoji + flash color + moveType for a move name
export function getMoveInfo(moveName: string): { emoji: string; color: string; moveType: string } {
  const n = moveName.toLowerCase()
  if (/fire|flame|burn|ember|blaze|heat|inferno|overheat/.test(n)) return { emoji: '🔥', color: '#ff6030bb', moveType: 'fire' }
  if (/water|surf|splash|bubble|hydro|waterfall|aqua|wave|rain/.test(n)) return { emoji: '💧', color: '#3090ffbb', moveType: 'water' }
  if (/thunder|lightning|electric|spark|bolt|shock|volt|zap|charge/.test(n)) return { emoji: '⚡', color: '#ffdd00bb', moveType: 'electric' }
  if (/leaf|grass|vine|seed|solar|petal|razor|absorb|drain|giga/.test(n)) return { emoji: '🌿', color: '#40c070bb', moveType: 'grass' }
  if (/ice|blizzard|freeze|frost|snow|hail|cold|aurora/.test(n)) return { emoji: '❄️', color: '#80d0ffbb', moveType: 'ice' }
  if (/psychic|psych|mind|psy|confusion|zen|extrasensory/.test(n)) return { emoji: '🔮', color: '#e040a0bb', moveType: 'psychic' }
  if (/ghost|shadow|spirit|curse|hex/.test(n)) return { emoji: '👻', color: '#8040c0bb', moveType: 'ghost' }
  if (/rock|stone|boulder|ancient|power|edge/.test(n)) return { emoji: '🪨', color: '#c0a040bb', moveType: 'rock' }
  if (/poison|toxic|sludge|venom|acid/.test(n)) return { emoji: '☠️', color: '#a040d0bb', moveType: 'poison' }
  if (/dark|crunch|bite|night|foul|knock|pursuit/.test(n)) return { emoji: '🌑', color: '#303060bb', moveType: 'dark' }
  if (/fight|karate|kick|punch|slam|force|close|counter|drain/.test(n)) return { emoji: '🥊', color: '#c03030bb', moveType: 'fight' }
  if (/fly|wing|aerial|air|gust|feather|hurricane|drill/.test(n)) return { emoji: '🌪️', color: '#80c0e0bb', moveType: 'flying' }
  if (/dragon|draco|outrage|twister|claw/.test(n)) return { emoji: '🐉', color: '#8040ffbb', moveType: 'dragon' }
  if (/steel|iron|metal|gear|bullet|flash|cannon/.test(n)) return { emoji: '⚙️', color: '#8080a0bb', moveType: 'steel' }
  if (/ground|earth|quake|dig|fissure|magnitude|mud/.test(n)) return { emoji: '🌍', color: '#c09050bb', moveType: 'ground' }
  if (/bug|string|signal|attack|x-scissor/.test(n)) return { emoji: '🐛', color: '#90a000bb', moveType: 'bug' }
  if (/normal|tackle|scratch|quick|hyper|body|slam|swift/.test(n)) return { emoji: '⚪', color: '#aaaaaa88', moveType: 'normal' }
  return { emoji: '💥', color: '#ffffff66', moveType: 'normal' }
}

// Zone definitions (noms en français) — 6 zones
export const ZONE_INFO: ZoneInfo[] = [
  {
    id: 1,
    name: 'ROUTE 1',
    subtitle: 'Herbes de Bourg Palette',
    idRange: [1, 50],
    requiredRepos: 0,
    bgColor: 'battle-zone-1',
    description: 'Pokémon de Kanto pour débutants. Faciles à capturer !',
  },
  {
    id: 2,
    name: 'MT. CODE',
    subtitle: 'Grottes Rocheuses',
    idRange: [51, 151],
    requiredRepos: 3,
    bgColor: 'battle-zone-2',
    description: 'Pokémon intermédiaires dans les caves. Nécessite 3+ dépôts.',
  },
  {
    id: 3,
    name: 'ROUTE VICTOIRE',
    subtitle: 'La Route des Champions',
    idRange: [152, 251],
    requiredRepos: 5,
    bgColor: 'battle-zone-3',
    description: 'Pokémon Gen 2 redoutables. Nécessite 5+ dépôts.',
  },
  {
    id: 4,
    name: 'FORÊT OBSCURE',
    subtitle: 'Bois Mystérieux de Johto',
    idRange: [252, 386],
    requiredRepos: 8,
    bgColor: 'battle-zone-4',
    description: 'Pokémon Gen 3 redoutables. Nécessite 8+ dépôts.',
    badgesRequired: 2,
  },
  {
    id: 5,
    name: 'ÎLE ÉCARLATE',
    subtitle: 'Archipel Mystique de Sinnoh',
    idRange: [387, 493],
    requiredRepos: 12,
    bgColor: 'battle-zone-5',
    description: 'Pokémon Gen 4 d\'élite. Nécessite 12+ dépôts et 4 badges.',
    badgesRequired: 4,
  },
  {
    id: 6,
    name: 'SANCTUAIRE',
    subtitle: 'Territoire Légendaire',
    idRange: [494, 649],
    requiredRepos: 20,
    bgColor: 'battle-zone-6',
    description: 'Pokémon Gen 5 légendaires. Nécessite 20+ dépôts et 8 badges.',
    badgesRequired: 8,
  },
]

// Pokémon de secours si PokéAPI est indisponible
const FALLBACK_POKEMON = {
  id: 25,
  name: 'pikachu',
  spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  backSpriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png',
  moves: ['Thunder Shock', 'Tail Whip', 'Growl', 'Quick Attack'],
}

// PokéAPI cache to avoid re-fetching
const pokeCache = new Map<number, { name: string; spriteUrl: string; backSpriteUrl: string; moves: string[] }>()

interface PokeApiMove {
  move: { name: string }
}

interface PokeApiResponse {
  name: string
  sprites: {
    front_default: string | null
    back_default: string | null
  }
  moves: PokeApiMove[]
}

// Evolution map for Gen 1 Pokémon (level-based)
export const EVOLUTION_MAP: Record<number, { evolvesAt: number; evolutionId: number; evolutionName: string }> = {
  1: { evolvesAt: 16, evolutionId: 2, evolutionName: 'herbizarre' },
  2: { evolvesAt: 32, evolutionId: 3, evolutionName: 'florizarre' },
  4: { evolvesAt: 16, evolutionId: 5, evolutionName: 'reptincel' },
  5: { evolvesAt: 36, evolutionId: 6, evolutionName: 'dracaufeu' },
  7: { evolvesAt: 16, evolutionId: 8, evolutionName: 'carabaffe' },
  8: { evolvesAt: 36, evolutionId: 9, evolutionName: 'tortank' },
  10: { evolvesAt: 7, evolutionId: 11, evolutionName: 'chrysacier' },
  13: { evolvesAt: 7, evolutionId: 14, evolutionName: 'coconfort' },
  16: { evolvesAt: 18, evolutionId: 17, evolutionName: 'roucarnage' },
  19: { evolvesAt: 20, evolutionId: 20, evolutionName: 'rattatac' },
  21: { evolvesAt: 20, evolutionId: 22, evolutionName: 'rapasdepic' },
  23: { evolvesAt: 22, evolutionId: 24, evolutionName: 'arbok' },
  25: { evolvesAt: 99, evolutionId: 26, evolutionName: 'raichu' },
  27: { evolvesAt: 22, evolutionId: 28, evolutionName: 'sablaireau' },
  29: { evolvesAt: 16, evolutionId: 30, evolutionName: 'spectrum' },
  32: { evolvesAt: 16, evolutionId: 33, evolutionName: 'nidorino' },
  37: { evolvesAt: 99, evolutionId: 38, evolutionName: 'feunard' },
  41: { evolvesAt: 22, evolutionId: 42, evolutionName: 'nosferalto' },
  43: { evolvesAt: 21, evolutionId: 44, evolutionName: 'ortide' },
  44: { evolvesAt: 34, evolutionId: 45, evolutionName: 'rafflesia' },
  46: { evolvesAt: 24, evolutionId: 47, evolutionName: 'parasite' },
  48: { evolvesAt: 31, evolutionId: 49, evolutionName: 'aeromite' },
  50: { evolvesAt: 26, evolutionId: 51, evolutionName: 'triopikeur' },
  52: { evolvesAt: 28, evolutionId: 53, evolutionName: 'persian' },
  54: { evolvesAt: 33, evolutionId: 55, evolutionName: 'akwakwak' },
  56: { evolvesAt: 28, evolutionId: 57, evolutionName: 'colossinge' },
  58: { evolvesAt: 36, evolutionId: 59, evolutionName: 'arcanin' },
  60: { evolvesAt: 25, evolutionId: 61, evolutionName: 'tetarte' },
  61: { evolvesAt: 36, evolutionId: 62, evolutionName: 'mackogneur' },
  63: { evolvesAt: 16, evolutionId: 64, evolutionName: 'kadabra' },
  66: { evolvesAt: 28, evolutionId: 67, evolutionName: 'machopeur' },
  69: { evolvesAt: 21, evolutionId: 70, evolutionName: 'boustiflor' },
  70: { evolvesAt: 34, evolutionId: 71, evolutionName: 'empiflor' },
  74: { evolvesAt: 25, evolutionId: 75, evolutionName: 'gravalanch' },
  75: { evolvesAt: 36, evolutionId: 76, evolutionName: 'grolem' },
  77: { evolvesAt: 40, evolutionId: 78, evolutionName: 'galopa' },
  79: { evolvesAt: 37, evolutionId: 80, evolutionName: 'flagadoss' },
  81: { evolvesAt: 30, evolutionId: 82, evolutionName: 'magneton' },
  84: { evolvesAt: 31, evolutionId: 85, evolutionName: 'dodrio' },
  86: { evolvesAt: 34, evolutionId: 87, evolutionName: 'lamantine' },
  88: { evolvesAt: 38, evolutionId: 89, evolutionName: 'grotadmorv' },
  92: { evolvesAt: 25, evolutionId: 93, evolutionName: 'spectrum' },
  93: { evolvesAt: 45, evolutionId: 94, evolutionName: 'ectoplasma' },
  98: { evolvesAt: 28, evolutionId: 99, evolutionName: 'colossiclaw' },
  100: { evolvesAt: 30, evolutionId: 101, evolutionName: 'electrode' },
  109: { evolvesAt: 35, evolutionId: 110, evolutionName: 'smogogo' },
  111: { evolvesAt: 42, evolutionId: 112, evolutionName: 'rhinoferos' },
  116: { evolvesAt: 32, evolutionId: 117, evolutionName: 'hypotrempe' },
  118: { evolvesAt: 33, evolutionId: 119, evolutionName: 'poissoroy' },
  133: { evolvesAt: 99, evolutionId: 134, evolutionName: 'aquali' },
  138: { evolvesAt: 40, evolutionId: 139, evolutionName: 'ammonitan' },
  140: { evolvesAt: 40, evolutionId: 141, evolutionName: 'kabutops' },
  147: { evolvesAt: 30, evolutionId: 148, evolutionName: 'draco' },
  148: { evolvesAt: 55, evolutionId: 149, evolutionName: 'dracolosse' },
}

function pickRandomMoves(moves: PokeApiMove[]): string[] {
  if (moves.length <= 4) {
    return moves.map(m => formatMoveName(m.move.name))
  }
  // Pick 4 random moves
  const shuffled = [...moves].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 4).map(m => formatMoveName(m.move.name))
}

export async function fetchPokemon(id: number): Promise<{ name: string; spriteUrl: string; backSpriteUrl: string; moves: string[] }> {
  if (pokeCache.has(id)) {
    return pokeCache.get(id)!
  }

  // Timeout de 8 secondes pour éviter un blocage UI
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, { signal: controller.signal })
    clearTimeout(timeoutId)
    if (!response.ok) throw new Error(`Failed to fetch pokemon ${id}`)
    const data: PokeApiResponse = await response.json()

    const result = {
      name: data.name,
      spriteUrl: data.sprites.front_default ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      backSpriteUrl: data.sprites.back_default ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`,
      moves: pickRandomMoves(data.moves),
    }

    pokeCache.set(id, result)
    return result
  } catch {
    clearTimeout(timeoutId)
    // Retourner un Pokémon de secours (Pikachu) si l'API échoue
    const fallback = {
      ...FALLBACK_POKEMON,
      name: FALLBACK_POKEMON.name,
      spriteUrl: FALLBACK_POKEMON.spriteUrl,
      backSpriteUrl: FALLBACK_POKEMON.backSpriteUrl,
      moves: FALLBACK_POKEMON.moves,
    }
    // Ne pas mettre en cache les fallbacks pour permettre un retry
    return fallback
  }
}

export function computePlayerStats(github: GitHubData): { pokeDollars: number } {
  const pokeDollars = 10 + github.commits30d * 50
  return { pokeDollars }
}

export function getZoneForPlayer(repoCount: number): Zone {
  if (repoCount >= 20) return 6
  if (repoCount >= 12) return 5
  if (repoCount >= 8) return 4
  if (repoCount >= 5) return 3
  if (repoCount >= 3) return 2
  return 1
}

export function getAvailableZones(repoCount: number, badges: boolean[] = []): Zone[] {
  const badgeCount = badges.filter(Boolean).length
  const zones: Zone[] = [1]
  if (repoCount >= 3) zones.push(2)
  if (repoCount >= 5) zones.push(3)
  if (repoCount >= 8 && badgeCount >= 2) zones.push(4)
  if (repoCount >= 12 && badgeCount >= 4) zones.push(5)
  if (repoCount >= 20 && badgeCount >= 8) zones.push(6)
  return zones
}

// ── Tables d'apparition par zone (style FireRed) ──────────────────────────
// Chaque entrée : { id, rate (%) }  — la somme doit faire 100
interface EncounterEntry { id: number; rate: number }

const ZONE_ENCOUNTERS: Record<number, EncounterEntry[]> = {
  // Zone 1 – Route 1 (Kanto débutant)
  1: [
    { id: 19, rate: 30 }, // Rattata     ████████████
    { id: 16, rate: 27 }, // Pidgey      ███████████
    { id: 10, rate: 13 }, // Chenipan    █████
    { id: 13, rate: 13 }, // Aspicot     █████
    { id: 23, rate:  7 }, // Abo         ██
    { id: 25, rate:  5 }, // Pikachu ⚡   ██
    { id: 35, rate:  3 }, // Mélofée     █
    { id: 39, rate:  2 }, // Rondoudou   ░
  ],
  // Zone 2 – Mt. Code (Grottes)
  2: [
    { id: 74, rate: 25 }, // Racaillou   █████████
    { id: 41, rate: 25 }, // Nosferapti  █████████
    { id: 66, rate: 15 }, // Machoc      █████
    { id: 79, rate: 10 }, // Ramoloss    ███
    { id: 81, rate: 10 }, // Magneti     ███
    { id: 92, rate:  8 }, // Fantominus  ██
    { id: 63, rate:  5 }, // Abra        █
    { id: 143, rate: 2 }, // Ronflex     ░ (rare!)
  ],
  // Zone 3 – Route Victoire (Gen 2)
  3: [
    { id: 161, rate: 22 }, // Fouinette
    { id: 163, rate: 20 }, // Hoothoot
    { id: 167, rate: 15 }, // Feuforêve
    { id: 183, rate: 13 }, // Marill
    { id: 194, rate: 10 }, // Axoloto
    { id: 209, rate:  8 }, // Snubbull
    { id: 214, rate:  7 }, // Scarhino
    { id: 246, rate:  5 }, // Embrylex 🐉  ░ (rare!)
  ],
  // Zone 4 – Forêt Obscure (Gen 3)
  4: [
    { id: 263, rate: 20 }, // Zigzaton
    { id: 265, rate: 15 }, // Cheniti
    { id: 280, rate: 15 }, // Tarsal
    { id: 285, rate: 10 }, // Balignon
    { id: 304, rate: 10 }, // Steuby
    { id: 270, rate:  8 }, // Lombre
    { id: 328, rate:  8 }, // Trapinch
    { id: 371, rate:  7 }, // Draby 🐉
    { id: 374, rate:  5 }, // Terhal 🤖 (rare!)
    { id: 350, rate:  2 }, // Milobellus (très rare!)
  ],
  // Zone 5 – Île Écarlate (Gen 4)
  5: [
    { id: 396, rate: 22 }, // Étourmi
    { id: 403, rate: 20 }, // Lixy ⚡
    { id: 406, rate: 15 }, // Rozbouton
    { id: 418, rate: 12 }, // Flozelle
    { id: 425, rate: 10 }, // Driftlon
    { id: 443, rate:  8 }, // Griknot 🐉
    { id: 447, rate:  8 }, // Riolu ⚡ (rare!)
    { id: 479, rate:  5 }, // Motisma ⚡ (rare!)
  ],
  // Zone 6 – Sanctuaire (Gen 5 + légendaires)
  6: [
    { id: 504, rate: 18 }, // Ratentif
    { id: 506, rate: 18 }, // Ponchiot
    { id: 519, rate: 15 }, // Poichigeon
    { id: 522, rate: 12 }, // Zébibron ⚡
    { id: 529, rate: 10 }, // Rapitaupe
    { id: 610, rate:  8 }, // Axew 🐉
    { id: 633, rate:  7 }, // Vrombi 🐉
    { id: 595, rate:  5 }, // Surchoupi ⚡
    { id: 643, rate:  4 }, // Reshiram 🔥 (légendaire!)
    { id: 644, rate:  3 }, // Zekrom ⚡ (légendaire!)
  ],
}

// Sélection pondérée selon les taux d'apparition
function pickEncounterId(zone: Zone): number {
  const entries = ZONE_ENCOUNTERS[zone] ?? ZONE_ENCOUNTERS[1]
  const roll = Math.random() * 100
  let cumulative = 0
  for (const entry of entries) {
    cumulative += entry.rate
    if (roll < cumulative) return entry.id
  }
  return entries[entries.length - 1].id
}

// Plages de niveau par zone
const ZONE_LEVEL_RANGE: Record<number, [number, number]> = {
  1: [2, 12],
  2: [8, 22],
  3: [15, 32],
  4: [25, 42],
  5: [35, 52],
  6: [45, 65],
}

export async function generateWildPokemon(zone: Zone, starsBonus: number): Promise<WildPokemon> {
  const id = pickEncounterId(zone)
  const [minLevel, maxLevel] = ZONE_LEVEL_RANGE[zone] ?? [2, 12]
  const level = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel

  const pokemonData = await fetchPokemon(id)
  const maxHp = level * 5 + 20

  return {
    id,
    name: pokemonData.name,
    level,
    hp: maxHp,
    maxHp,
    spriteUrl: pokemonData.spriteUrl,
    catchRate: Math.min(80, 30 + starsBonus),
    moves: pokemonData.moves,
  }
}

// Get animated Gen5 sprite URL for a pokemon ID (GBA-style animated)
export function getAnimatedSpriteUrl(id: number, back = false): string {
  const base = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated'
  return back ? `${base}/back/${id}.gif` : `${base}/${id}.gif`
}

export function calculateDamage(_attackerLevel: number, _defenderMaxHp: number): number {
  // Aléatoire entre 10-30% des HP max de l'ennemi
  const pct = 0.1 + Math.random() * 0.2
  return Math.max(1, Math.floor(_defenderMaxHp * pct))
}

export function calculateCatchSuccess(
  pokemon: WildPokemon,
  ballType: BallType,
  starBonus: number
): boolean {
  const ballBonus = ballType === 'greatball' ? 15 : 0
  const hpPct = pokemon.hp / pokemon.maxHp
  // Moins de HP = plus facile à capturer
  const hpBonus = Math.floor((1 - hpPct) * 20)
  const catchChance = pokemon.catchRate + starBonus + ballBonus + hpBonus
  return Math.random() * 100 < catchChance
}

export function wildPokemonToOwned(wild: WildPokemon, backSpriteUrl: string, moves: string[]): OwnedPokemon {
  return {
    id: wild.id,
    name: wild.name,
    level: wild.level,
    hp: wild.maxHp,
    maxHp: wild.maxHp,
    spriteUrl: wild.spriteUrl,
    backSpriteUrl,
    shiny: Math.random() < 0.01, // 1% de chance shiny
    moves,
    xp: 0,
    xpToNext: wild.level * 20,
  }
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatMoveName(move: string): string {
  return move.split('-').map(capitalizeFirst).join(' ')
}
