# PokéGit 🎮

> A GBA FireRed-style Pokémon idle game powered by your real GitHub activity.

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan?logo=tailwindcss)](https://tailwindcss.com)

---

## What is PokéGit?

PokéGit turns your GitHub activity into a full Pokémon adventure. Your commits, repositories, stars, and pull requests become the fuel that powers your journey. Choose a starter, explore zones, battle wild Pokémon, earn badges, and climb the league — all driven by how active you are as a developer.

The more you code, the stronger your team becomes.

---

## Features

- **Wild Encounters** — Random Pokémon appear based on your GitHub activity level. More commits = rarer spawns.
- **XP + Leveling System** — Your Pokémon gain experience points tied to real development metrics.
- **Evolutions** — Hit milestones (stars, PRs merged, streak days) to trigger evolutions with full animations.
- **Badge System** — Earn Gym Badges by completing coding challenges: push streaks, repo goals, contribution targets.
- **Pokémon League with ELO** — Compete in a ranked league against other developers. Your ELO score reflects your GitHub consistency.
- **Pokémon Center** — Heal your team between sessions. Recovery time scales with how long since your last commit.
- **Starter Choice** — Pick your starter Pokémon on first login: Bulbasaur, Charmander, or Squirtle.
- **6 Exploration Zones** — Each zone unlocks at different activity thresholds and features different Pokémon types.
- **Real PokéAPI Moves** — All moves pulled live from [PokéAPI](https://pokeapi.co) with accurate stats and types.
- **Animated Gen 5 Sprites** — Full animated sprites from the Black/White era for battles and the Pokédex.

---

## How It Works

When you connect your GitHub account, PokéGit reads your public activity to generate your starting resources:

| GitHub Metric | In-Game Resource |
|---|---|
| Total commits (30 days) | Starting Poké Balls & potions |
| Public repositories | Starting gold / currency |
| Stars received | Rare item drops |
| Pull requests merged | Bonus XP multiplier |
| Contribution streak | Daily login bonus |

Your activity is checked periodically to reward continued development. Idle progress accumulates while you code.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Pokémon Data | [PokéAPI](https://pokeapi.co) |
| GitHub Data | GitHub REST API (OAuth) |
| Deployment | Cloudflare Tunnels |

---

## Screenshots

*Coming soon — game is in active development.*

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/MattJeanLouis/pokegit.git
cd pokegit

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and connect your GitHub account to begin your adventure.

---

## Roadmap

- [ ] Multiplayer battles between developers
- [ ] Guild / team system for organizations
- [ ] Shiny variants tied to rare GitHub achievements
- [ ] Move tutors unlocked by open-source contributions
- [ ] Seasonal events matching real GitHub events (Hacktoberfest, etc.)

---

## Made By

Built with love by [@MattJeanLouis](https://github.com/MattJeanLouis).

Powered by [PokéAPI](https://pokeapi.co) — no commercial affiliation with Nintendo or The Pokémon Company.
