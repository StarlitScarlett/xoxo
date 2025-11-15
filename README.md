# Tic Tac Toe

A retro-styled tic tac toe game built with React, TypeScript, and Vite. Play against a smart AI opponent that provides a good challenge while still being beatable. Built using Test-Driven Development (TDD) with comprehensive test coverage across all layers. 

## Features

- 🎮 **Smart AI Opponent** - Uses priority-based strategy with intentional imperfections (80% smart, 20% random)
- 📊 **Score Tracking** - Persistent score tracking across multiple games
- 🎨 **Retro Arcade Aesthetic** - CRT scanlines, neon glow effects, and pixel-perfect styling
- ✨ **Smooth Animations** - Cell placement, winning lines, and modal transitions
- 🏗️ **Clean Architecture** - Pure TypeScript game engine separated from React UI
- 🧪 **Comprehensive Testing** - 42 unit/integration tests + 9 E2E tests with 100% coverage

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd tic-tac-toe

# Install dependencies
npm install
```

### Development

```bash
# Start dev server
npm run dev
```

Open http://localhost:5173 to play the game.

### Testing

```bash
# Run unit and integration tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests (requires dev server running)
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | React 18 | UI components and rendering |
| Language | TypeScript | Type safety and developer experience |
| Build Tool | Vite | Fast dev server and optimized builds |
| Unit Testing | Vitest | Fast unit and integration tests |
| Component Testing | React Testing Library | Component behavior testing |
| E2E Testing | Playwright | Full browser automation |
| Styling | CSS Modules | Scoped component styles |
| Font | Press Start 2P | Retro pixel font from Google Fonts |

## Project Structure

```
tic-tac-toe/
├── src/
│   ├── engine/              # Pure TypeScript game logic
│   │   ├── TicTacToeGame.ts        # Core game state and rules (21 tests)
│   │   ├── TicTacToeGame.test.ts
│   │   ├── AIPlayer.ts              # AI move calculation (4 tests)
│   │   ├── AIPlayer.test.ts
│   │   ├── ScoreTracker.ts          # Score persistence (6 tests)
│   │   └── ScoreTracker.test.ts
│   ├── components/          # React UI components
│   │   ├── Game.tsx                 # Main container (4 tests)
│   │   ├── Game.test.tsx
│   │   ├── Board.tsx                # 3x3 grid display (3 tests)
│   │   ├── Board.test.tsx
│   │   ├── Board.module.css
│   │   ├── Cell.tsx                 # Individual cell with animations
│   │   ├── Cell.module.css
│   │   ├── ScoreBoard.tsx           # Score display (4 tests)
│   │   └── ScoreBoard.module.css
│   ├── styles/
│   │   └── retro-theme.css  # Global retro theme and effects
│   ├── App.tsx              # Application root
│   ├── App.css
│   └── main.tsx             # Entry point
├── e2e/                     # End-to-end tests
│   ├── game-flow.spec.ts    # Full gameplay scenarios (6 tests)
│   └── ai-behavior.spec.ts  # AI validation (3 tests)
├── docs/
│   └── plans/               # Design and implementation docs
│       ├── 2025-11-12-tic-tac-toe-design.md
│       └── 2025-11-12-tic-tac-toe-implementation.md
├── public/                  # Static assets
├── index.html
├── package.json
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Vitest configuration
├── playwright.config.ts     # Playwright configuration
└── tsconfig.json            # TypeScript configuration
```

## Architecture

The application uses a three-layer architecture for clean separation of concerns:

### 1. Game Engine Layer (Pure TypeScript)

**TicTacToeGame** - Manages board state and game rules
```typescript
class TicTacToeGame {
  makeMove(row: number, col: number): boolean
  checkWinner(): 'X' | 'O' | 'draw' | null
  getAvailableMoves(): [number, number][]
  reset(): void
  getWinningCells(): [number, number][] | null
}
```

**AIPlayer** - Calculates AI moves with smart-but-beatable strategy
```typescript
class AIPlayer {
  calculateMove(game: TicTacToeGame): [number, number]
}
```

**ScoreTracker** - Persists scores across games
```typescript
class ScoreTracker {
  recordResult(winner: 'X' | 'O' | 'draw'): void
  getStats(): { playerWins, aiWins, draws }
  reset(): void
}
```

### 2. UI Layer (React Components)

- **Game** - Main container coordinating game engine and UI
- **Board** - Renders 3x3 grid and handles cell clicks
- **Cell** - Individual cell with hover states and animations
- **ScoreBoard** - Displays current scores with animated updates

### 3. Styling Layer (CSS Modules)

- Component-scoped styles using CSS Modules
- Global retro theme with CRT effects and neon colors
- Smooth CSS animations for all interactions

## AI Strategy

The AI provides a fun challenge by being smart but not perfect:

### Smart Moves (80% of the time)
1. **Win** - Take winning move if available
2. **Block** - Block player's winning move
3. **Center** - Take center square if available
4. **Corners** - Prefer corners over edges
5. **Any** - Take any available spot

### "Mistakes" (20% of the time)
- Makes a random valid move
- Creates opportunities for player to win
- Makes the game more engaging and beatable

## Testing

### Test Coverage

- **42 unit/integration tests** (Vitest + React Testing Library)
- **9 E2E tests** (Playwright)
- **100% coverage** of game engine logic
- **Full component behavior coverage**

### Testing Philosophy

Built using **Test-Driven Development (TDD)**:
1. Write failing test (RED)
2. Implement minimal code to pass (GREEN)
3. Refactor while keeping tests green (REFACTOR)

### Running Tests

```bash
# Unit tests (fast, isolated)
npm test

# E2E tests (full browser, requires dev server)
npm run test:e2e

# Run both
npm test && npm run test:e2e
```

## Development Workflow

### Making Changes

1. **Write tests first** following TDD principles
2. **Run tests** to confirm they fail appropriately
3. **Implement** minimal code to make tests pass
4. **Refactor** while keeping tests green
5. **Verify** all tests still pass

### Code Style

- Use TypeScript for all logic
- Follow existing code patterns and formatting
- Keep components small and focused
- Separate concerns (engine vs UI)
- Write descriptive test names

## Visual Design

### Color Palette (Retro Arcade)
```css
--bg-dark: #0a0e27        /* Deep space blue */
--grid-color: #00ff41     /* Neon green (terminal style) */
--player-x: #ff006e       /* Hot pink */
--player-o: #00d9ff       /* Cyan */
--text: #ffffff           /* White */
--accent: #ffbe0b         /* Yellow for highlights */
```

### Typography
- Primary font: "Press Start 2P" (Google Fonts)
- Fallback: monospace
- Pixel-perfect rendering

### Retro Effects
- CRT scanline overlay
- Glow effects on grid lines
- Smooth animations (200-500ms)
- Pixelated button press effects

## Design Philosophy

This project demonstrates several key principles:

1. **Separation of Concerns** - Game logic is pure TypeScript, completely separate from React
2. **Testability** - Engine can be tested without React, enabling fast TDD cycles
3. **Type Safety** - TypeScript throughout for compile-time error catching
4. **User Experience** - Smooth animations and clear visual feedback
5. **Code Quality** - Comprehensive tests, clean architecture, maintainable code

## Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following TDD
4. Ensure all tests pass (`npm test && npm run test:e2e`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Guidelines
- Follow TDD: Write tests before implementation
- Maintain test coverage at 100%
- Match existing code style
- Keep commits focused and atomic
- Write clear commit messages

## License

MIT

## Acknowledgments

Built with Test-Driven Development using React, TypeScript, and Vite. Designed and implemented following clean architecture principles with comprehensive test coverage.
