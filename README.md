# PokéGit 🎮

> *Un jeu Pokémon idle dans l'esprit GBA FireRed — exploration, captures, arènes et ligue.*

![Salamèche](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif)
![Pikachu](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif)
![Abra](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/63.gif)

---

## 🕹️ Présentation

PokéGit est un jeu Pokémon jouable dans le navigateur, avec une esthétique fidèle à la GBA FireRed. Explore des zones progressives, capture des Pokémon sauvages, monte en niveau, fais évoluer ton équipe, bats les 8 champions d'arène et affronte la Ligue Pokémon.

---

## ✨ Fonctionnalités actuelles

### ⚔️ Système de combat
- **Grille 2×2 de vraies attaques** — choisir ta technique à chaque tour
- **17 types** reconnus avec couleurs et emojis dédiés
- **Animations d'attaque par type** — particules CSS uniques (feu qui monte, eau en arc, électrik en zigzag, glace en étoile, psy en spirale...)
- **L'ennemi n'utilise que des attaques offensives** (les coups de statut sont filtrés)
- **Sprites animés Gen 5** depuis le CDN PokeAPI (Black & White animated GIFs)
- **Terrain GBA authentique** — plateformes ovales, horizon net, couleurs par zone
- **Barres HP style FireRed** — boîte crème, label HP coloré, reflet blanc
- **Boîte de message style GBA** — effet machine à écrire, flèche ▼ clignotante

### 🌿 Exploration & zones
- **6 zones progressives** avec tables d'apparition dédiées
- **Pokémon pondérés par rareté** — les communs apparaissent souvent, les rares vraiment peu
- **Dresseur animé en idle** — le Pokémon de tête se promène en attendant un combat
- **Timer de 30 secondes** entre chaque apparition

| Zone | Pokémon | Niveau | Communs | Rares |
|------|---------|--------|---------|-------|
| 🌿 Route 1 | Gen 1 (1-50) | 2-12 | Rattata, Pidgey | Pikachu, Rondoudou |
| 🌋 Mt. Code | Gen 1 (51-151) | 8-22 | Racaillou, Nosferapti | Abra, Ronflex |
| 🏔️ Route Victoire | Gen 2 (152-251) | 15-32 | Fouinette, Hoothoot | Scarhino, Embrylex |
| 🌲 Forêt Obscure | Gen 3 (252-386) | 25-42 | Zigzaton, Tarsal | Draby, Terhal |
| 🌋 Île Écarlate | Gen 4 (387-493) | 35-52 | Étourmi, Lixy | Riolu, Motisma |
| 🌌 Sanctuaire | Gen 5 (494-649) | 45-65 | Ratentif, Ponchiot | **Reshiram & Zekrom** |

### 👾 Équipe & Pokédex
- Équipe de **6 Pokémon** maximum + stockage PC illimité
- **Évolutions automatiques** au niveau requis (ex: Salamèche → Reptincel Lv16)
- **Gain d'XP** à chaque K.O. ennemi, level-up en combat
- **📖 Pokédex complet** : stats de base PokéAPI, types, taille/poids, talents, description
- **Pokémon vus** (rencontrés mais pas capturés) affichés en silhouette

### 🏆 Ligue Pokémon & ELO
- **8 Champions d'arène** à battre en ordre (Insecte → Feu)
- **Élite Quatre** (Glace, Combat, Spectre, Dragon) — déblocage après les 8 badges
- **Le Champion** — Blue avec Ronflex et Dracaufeu
- Système **ELO style échecs** — `K × (résultat - 1/(1 + 10^(ΔElo/400)))`
- **7 tiers** : Novice → Légende (1000 ELO au départ)
- Historique des 20 derniers combats

| # | Champion | Type | ELO |
|---|----------|------|-----|
| 1 | Argenta | Insecte 🐛 | 800 |
| 2 | Pierre | Roche 🪨 | 900 |
| 3 | Ondine | Eau 💧 | 1 000 |
| 4 | Surge | Électrik ⚡ | 1 050 |
| 5 | Marguerite | Plante 🌿 | 1 100 |
| 6 | Erika | Poison ☠️ | 1 150 |
| 7 | Sabrina | Psy 🔮 | 1 200 |
| 8 | Agatha | Feu 🔥 | 1 350 |

### 💊 Objets & économie
- Pokéballs, Super Balls — pour capturer les Pokémon sauvages
- Potions, Super Potions, Hyper Potions
- **PokéDollars** gagnés en battant des Pokémon et des dresseurs
- **Centre Pokémon** gratuit (cooldown)
- **Boutique** in-game

---

## 🛠️ Stack technique

| Tech | Usage |
|------|-------|
| **React 19** | Interface utilisateur |
| **TypeScript** | Typage strict |
| **Vite** | Bundler |
| **Tailwind CSS** | Styles utilitaires |
| **PokeAPI** | Données & sprites Pokémon |
| **Press Start 2P** | Police GBA |

---

## 🚀 Installation locale

```bash
git clone https://github.com/MattJeanLouis/pokegit.git
cd pokegit
npm install
npm run dev
```

---

## 🗺️ Déblocage des zones

| Zone | Dépôts requis | Badges requis |
|------|---------------|---------------|
| 🌿 Route 1 | 0 | 0 |
| 🌋 Mt. Code | 3 | 0 |
| 🏔️ Route Victoire | 5 | 0 |
| 🌲 Forêt Obscure | 8 | 2 |
| 🌋 Île Écarlate | 12 | 4 |
| 🌌 Sanctuaire | 20 | 8 |

---

## 🔮 Roadmap

- [ ] Connexion GitHub réelle (OAuth) — stats de commits comme bonus in-game
- [ ] Pokémon shinys (chances ultra-rares)
- [ ] Sauvegarde de progression (localStorage)
- [ ] Évolutions Gen 2-5
- [ ] Combat multi-joueurs entre développeurs
- [ ] Événements saisonniers (Hacktoberfest...)

---

*Fait par [@MattJeanLouis](https://github.com/MattJeanLouis) — propulsé par [PokéAPI](https://pokeapi.co)*
