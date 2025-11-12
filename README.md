# Tic Tac Toe

A retro-styled tic tac toe game built with React, TypeScript, and Vite. Play against a smart AI opponent that provides a good challenge while still being beatable.

## Features

- 🎮 Play against smart AI opponent
- 📊 Score tracking across multiple games
- 🎨 Retro arcade aesthetic with pixel font
- ✨ Smooth animations and visual effects
- 🧪 Comprehensive test coverage

## Tech Stack

- React 18
- TypeScript
- Vite
- Vitest (unit/integration tests)
- Playwright (E2E tests)
- CSS Modules

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 to play.

### Testing

Run unit and integration tests:

```bash
npm test
```

Run E2E tests:

```bash
npm run test:e2e
```

### Build

```bash
npm run build
```

## Architecture

The application uses a clean separation between game logic and UI:

- **Game Engine** (`src/engine/`): Pure TypeScript classes handling game logic
  - `TicTacToeGame`: Board state, move validation, win detection
  - `AIPlayer`: Smart-but-beatable AI strategy
  - `ScoreTracker`: Score persistence across games

- **UI Components** (`src/components/`): React components for rendering
  - `Game`: Main container coordinating engine and UI
  - `Board`: 3x3 grid display
  - `Cell`: Individual cell with animations
  - `ScoreBoard`: Score display

## AI Strategy

The AI uses a priority-based strategy with intentional imperfection:

**80% Smart Moves:**
1. Take winning move if available
2. Block player's winning move
3. Take center if available
4. Prefer corners over edges
5. Take any available spot

**20% "Mistakes":**
- Randomly pick any valid move
- Makes the AI beatable and more fun

## License

MIT
