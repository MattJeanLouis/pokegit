import type { TrainerPokemon } from './types'

function hp(level: number): number {
  return level * 5 + 20
}

function sprite(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

export interface GymLeader {
  id: number
  name: string
  title: string
  city: string
  type: string
  typeEmoji: string
  badgeName: string
  badgeIcon: string
  elo: number
  team: TrainerPokemon[]
  tagline: string
}

export interface EliteFourMember {
  id: number
  name: string
  title: string
  type: string
  typeEmoji: string
  elo: number
  team: TrainerPokemon[]
  tagline: string
}

export interface Champion {
  id: number
  name: string
  title: string
  elo: number
  team: TrainerPokemon[]
  tagline: string
}

export const GYM_LEADERS: GymLeader[] = [
  {
    id: 1,
    name: 'VIRIDIS',
    title: 'Champion Insecte',
    city: 'Argenta',
    type: 'Insecte',
    typeEmoji: '🐛',
    badgeName: 'Badge Cocon',
    badgeIcon: '🏅',
    elo: 800,
    tagline: 'Les bugs du code font ma force !',
    team: [
      { id: 10, name: 'Chenipan', level: 10, hp: hp(10), maxHp: hp(10), spriteUrl: sprite(10), moves: ['Charge', 'Rugissement'] },
      { id: 13, name: 'Aspicot', level: 12, hp: hp(12), maxHp: hp(12), spriteUrl: sprite(13), moves: ['Charge', 'Dard-Venin'] },
    ],
  },
  {
    id: 2,
    name: 'GRANIT',
    title: 'Champion Roche',
    city: 'Argenta',
    type: 'Roche',
    typeEmoji: '🪨',
    badgeName: 'Badge Pierre Grise',
    badgeIcon: '🪨',
    elo: 900,
    tagline: 'Solide comme un commit signé en prod.',
    team: [
      { id: 74, name: 'Racaillou', level: 14, hp: hp(14), maxHp: hp(14), spriteUrl: sprite(74), moves: ['Charge', 'Éboulement'] },
      { id: 95, name: 'Onix', level: 16, hp: hp(16), maxHp: hp(16), spriteUrl: sprite(95), moves: ['Charge', 'Patience'] },
    ],
  },
  {
    id: 3,
    name: 'ONDINE',
    title: 'Maîtresse des Eaux',
    city: 'Azuria',
    type: 'Eau',
    typeEmoji: '💧',
    badgeName: 'Badge Cascade',
    badgeIcon: '💧',
    elo: 1000,
    tagline: 'Ton code est submergé de dette technique !',
    team: [
      { id: 120, name: 'Stari', level: 18, hp: hp(18), maxHp: hp(18), spriteUrl: sprite(120), moves: ['Hydrocanon', 'Tranche'] },
      { id: 121, name: 'Staross', level: 21, hp: hp(21), maxHp: hp(21), spriteUrl: sprite(121), moves: ['Hydrocanon', 'Surf'] },
    ],
  },
  {
    id: 4,
    name: 'SURGE',
    title: 'Lieutenant Électrique',
    city: 'Cramois\'île',
    type: 'Électrique',
    typeEmoji: '⚡',
    badgeName: 'Badge Tonnerre',
    badgeIcon: '⚡',
    elo: 1050,
    tagline: 'Zero bugs ou je te déploie en prod direct !',
    team: [
      { id: 100, name: 'Voltorbe', level: 21, hp: hp(21), maxHp: hp(21), spriteUrl: sprite(100), moves: ['Tonnerre', 'Explosion'] },
      { id: 25, name: 'Pikachu', level: 24, hp: hp(24), maxHp: hp(24), spriteUrl: sprite(25), moves: ['Tonnerre', 'Vive-Attaque'] },
      { id: 26, name: 'Raichu', level: 28, hp: hp(28), maxHp: hp(28), spriteUrl: sprite(26), moves: ['Tonnerre', 'Tranche'] },
    ],
  },
  {
    id: 5,
    name: 'ERIKA',
    title: 'Professeure Nature',
    city: 'Céladopole',
    type: 'Plante',
    typeEmoji: '🌿',
    badgeName: 'Badge Arc-en-Ciel',
    badgeIcon: '🌿',
    elo: 1100,
    tagline: 'Cultive ton code comme un jardin zen.',
    team: [
      { id: 43, name: 'Mystherbe', level: 24, hp: hp(24), maxHp: hp(24), spriteUrl: sprite(43), moves: ['Tranch\'Herbe', 'Para-Spore'] },
      { id: 44, name: 'Ortide', level: 26, hp: hp(26), maxHp: hp(26), spriteUrl: sprite(44), moves: ['Tranch\'Herbe', 'Souplesse'] },
      { id: 45, name: 'Rafflesia', level: 29, hp: hp(29), maxHp: hp(29), spriteUrl: sprite(45), moves: ['Tranch\'Herbe', 'Pétale Danse'] },
    ],
  },
  {
    id: 6,
    name: 'KOGA',
    title: 'Ninja du Code',
    city: 'Parmanie',
    type: 'Poison',
    typeEmoji: '☠️',
    badgeName: 'Badge Âme',
    badgeIcon: '☠️',
    elo: 1150,
    tagline: 'Mon code empoisonne les serveurs adverses.',
    team: [
      { id: 109, name: 'Smogo', level: 37, hp: hp(37), maxHp: hp(37), spriteUrl: sprite(109), moves: ['Bomb-Beurk', 'Étreinte'] },
      { id: 110, name: 'Smogogo', level: 42, hp: hp(42), maxHp: hp(42), spriteUrl: sprite(110), moves: ['Bomb-Beurk', 'Déflagration'] },
    ],
  },
  {
    id: 7,
    name: 'SABRINA',
    title: 'Maîtresse PSY',
    city: 'Safrania',
    type: 'Psy',
    typeEmoji: '🔮',
    badgeName: 'Badge Marais',
    badgeIcon: '🔮',
    elo: 1250,
    tagline: 'Je lis ton code avant même que tu l\'écrives.',
    team: [
      { id: 64, name: 'Kadabra', level: 38, hp: hp(38), maxHp: hp(38), spriteUrl: sprite(64), moves: ['Choc Mental', 'Psyko'] },
      { id: 124, name: 'Lippoutou', level: 38, hp: hp(38), maxHp: hp(38), spriteUrl: sprite(124), moves: ['Choc Mental', 'Blizzard'] },
      { id: 65, name: 'Alakazam', level: 43, hp: hp(43), maxHp: hp(43), spriteUrl: sprite(65), moves: ['Psyko', 'Jackpot'] },
    ],
  },
  {
    id: 8,
    name: 'PYRO',
    title: 'Maître du Feu',
    city: 'Cramois\'île',
    type: 'Feu',
    typeEmoji: '🔥',
    badgeName: 'Badge Terre',
    badgeIcon: '🔥',
    elo: 1350,
    tagline: 'Je brûle les repos qui ne compilent pas.',
    team: [
      { id: 58, name: 'Caninos', level: 42, hp: hp(42), maxHp: hp(42), spriteUrl: sprite(58), moves: ['Flammèche', 'Morsure'] },
      { id: 59, name: 'Arcanin', level: 47, hp: hp(47), maxHp: hp(47), spriteUrl: sprite(59), moves: ['Déflagration', 'Tranche'] },
      { id: 78, name: 'Galopa', level: 50, hp: hp(50), maxHp: hp(50), spriteUrl: sprite(78), moves: ['Déflagration', 'Vive-Attaque'] },
    ],
  },
]

export const ELITE_FOUR: EliteFourMember[] = [
  {
    id: 9,
    name: 'LORELEI',
    title: 'Élite Quatre — Glace',
    type: 'Glace',
    typeEmoji: '❄️',
    elo: 1500,
    tagline: 'Ton code va geler sous mon blizzard.',
    team: [
      { id: 87, name: 'Lamantine', level: 54, hp: hp(54), maxHp: hp(54), spriteUrl: sprite(87), moves: ['Blizzard', 'Surf'] },
      { id: 91, name: 'Crustabri', level: 55, hp: hp(55), maxHp: hp(55), spriteUrl: sprite(91), moves: ['Blizzard', 'Tranche'] },
      { id: 131, name: 'Lokhlass', level: 56, hp: hp(56), maxHp: hp(56), spriteUrl: sprite(131), moves: ['Blizzard', 'Hydrocanon'] },
    ],
  },
  {
    id: 10,
    name: 'ALDO',
    title: 'Élite Quatre — Combat',
    type: 'Combat',
    typeEmoji: '🥊',
    elo: 1550,
    tagline: 'Le merge conflict ne me fait pas peur.',
    team: [
      { id: 106, name: 'Kicklee', level: 53, hp: hp(53), maxHp: hp(53), spriteUrl: sprite(106), moves: ['Balayage', 'Contre'] },
      { id: 107, name: 'Tygnon', level: 55, hp: hp(55), maxHp: hp(55), spriteUrl: sprite(107), moves: ['Poing-Éclair', 'Contre'] },
      { id: 68, name: 'Mackogneur', level: 58, hp: hp(58), maxHp: hp(58), spriteUrl: sprite(68), moves: ['Séisme', 'Contre'] },
    ],
  },
  {
    id: 11,
    name: 'AGATHA',
    title: 'Élite Quatre — Spectre',
    type: 'Spectre',
    typeEmoji: '👻',
    elo: 1600,
    tagline: 'Je hante les dépôts abandonnés depuis des années.',
    team: [
      { id: 93, name: 'Spectrum', level: 54, hp: hp(54), maxHp: hp(54), spriteUrl: sprite(93), moves: ['Balle Ombre', 'Ténèbres'] },
      { id: 94, name: 'Ectoplasma', level: 58, hp: hp(58), maxHp: hp(58), spriteUrl: sprite(94), moves: ['Balle Ombre', 'Tonnerre'] },
      { id: 94, name: 'Ectoplasma', level: 60, hp: hp(60), maxHp: hp(60), spriteUrl: sprite(94), moves: ['Balle Ombre', 'Hypnose'] },
    ],
  },
  {
    id: 12,
    name: 'WATARU',
    title: 'Élite Quatre — Dragon',
    type: 'Dragon',
    typeEmoji: '🐉',
    elo: 1700,
    tagline: 'Mes dragons pulvérisent toutes les deadlines.',
    team: [
      { id: 142, name: 'Aérodactyl', level: 58, hp: hp(58), maxHp: hp(58), spriteUrl: sprite(142), moves: ['Dracosouffle', 'Tranche'] },
      { id: 148, name: 'Draco', level: 60, hp: hp(60), maxHp: hp(60), spriteUrl: sprite(148), moves: ['Dracosouffle', 'Jackpot'] },
      { id: 149, name: 'Dracolosse', level: 62, hp: hp(62), maxHp: hp(62), spriteUrl: sprite(149), moves: ['Dracojet', 'Jackpot'] },
    ],
  },
]

export const CHAMPION: Champion = {
  id: 13,
  name: 'BLUE',
  title: 'Champion de la Ligue',
  elo: 1900,
  tagline: 'Tu sens le commit de quelqu\'un qui n\'a aucune chance.',
  team: [
    { id: 18, name: 'Roucarnage', level: 63, hp: hp(63), maxHp: hp(63), spriteUrl: sprite(18), moves: ['Tranche', 'Cyclone'] },
    { id: 65, name: 'Alakazam', level: 65, hp: hp(65), maxHp: hp(65), spriteUrl: sprite(65), moves: ['Psyko', 'Jackpot'] },
    { id: 112, name: 'Rhinoféros', level: 65, hp: hp(65), maxHp: hp(65), spriteUrl: sprite(112), moves: ['Séisme', 'Éboulement'] },
    { id: 130, name: 'Léviator', level: 65, hp: hp(65), maxHp: hp(65), spriteUrl: sprite(130), moves: ['Hydrocanon', 'Jackpot'] },
    { id: 59, name: 'Arcanin', level: 65, hp: hp(65), maxHp: hp(65), spriteUrl: sprite(59), moves: ['Déflagration', 'Tranche'] },
    { id: 3, name: 'Florizarre', level: 68, hp: hp(68), maxHp: hp(68), spriteUrl: sprite(3), moves: ['Tranch\'Herbe', 'Pétale Danse'] },
  ],
}

// ELO calculation (chess-like)
export function calculateEloChange(playerElo: number, opponentElo: number, won: boolean, K = 32): number {
  const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400))
  const actual = won ? 1 : 0
  return Math.round(K * (actual - expected))
}

export function getEloRank(elo: number): { rank: string; color: string } {
  if (elo >= 1800) return { rank: 'MAÎTRE', color: '#ff2244' }
  if (elo >= 1600) return { rank: 'EXPERT', color: '#ff6600' }
  if (elo >= 1400) return { rank: 'AVANCÉ', color: '#ffb700' }
  if (elo >= 1200) return { rank: 'CONFIRMÉ', color: '#00f5ff' }
  if (elo >= 1000) return { rank: 'INTERMÉDIAIRE', color: '#00ff41' }
  if (elo >= 800) return { rank: 'DÉBUTANT', color: '#aaaaaa' }
  return { rank: 'NOVICE', color: '#666666' }
}
