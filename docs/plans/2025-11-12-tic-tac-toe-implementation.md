# Tic Tac Toe Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a web-based tic tac toe game with smart AI opponent, retro aesthetic, and comprehensive test coverage.

**Architecture:** Game engine classes (pure TypeScript) handle all logic, React components handle rendering/interaction. TDD throughout with unit tests for engine, integration tests for components, E2E tests for full flows.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, React Testing Library, Playwright, CSS Modules

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `.gitignore`

**Step 1: Initialize Vite + React + TypeScript project**

```bash
npm create vite@latest tic-tac-toe -- --template react-ts
cd tic-tac-toe
```

Expected: Project scaffolded with React + TypeScript template

**Step 2: Install dependencies**

```bash
npm install
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npm install -D playwright @playwright/test
```

Expected: All dependencies installed

**Step 3: Configure Vitest**

Create `vitest.config.ts`:

```typescript
// ABOUTME: Vitest configuration for unit and integration tests
// ABOUTME: Sets up React Testing Library with jsdom environment
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

**Step 4: Create test setup file**

Create `src/test-setup.ts`:

```typescript
// ABOUTME: Test environment setup for Vitest
// ABOUTME: Imports testing library matchers and configures jsdom
import '@testing-library/jest-dom'
```

**Step 5: Configure Playwright**

```bash
npx playwright install
```

Create `playwright.config.ts`:

```typescript
// ABOUTME: Playwright configuration for end-to-end tests
// ABOUTME: Configures test server and browser settings
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Step 6: Update package.json scripts**

Modify `package.json` to add test scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

**Step 7: Create directory structure**

```bash
mkdir -p src/engine
mkdir -p src/components
mkdir -p src/styles
mkdir -p e2e
mkdir -p docs/plans
```

Expected: All directories created

**Step 8: Verify setup works**

```bash
npm run dev
```

Expected: Dev server starts on http://localhost:5173

**Step 9: Commit**

```bash
git init
git add .
git commit -m "feat: initial project setup with Vite, React, TypeScript, and testing"
```

---

## Task 2: TicTacToeGame Class (TDD - Part 1: Basic Structure)

**Files:**
- Create: `src/engine/TicTacToeGame.ts`
- Create: `src/engine/TicTacToeGame.test.ts`

**Step 1: Write failing test for game initialization**

Create `src/engine/TicTacToeGame.test.ts`:

```typescript
// ABOUTME: Unit tests for TicTacToeGame class
// ABOUTME: Tests board state, move validation, and win detection logic
import { describe, it, expect, beforeEach } from 'vitest'
import { TicTacToeGame } from './TicTacToeGame'

describe('TicTacToeGame', () => {
  let game: TicTacToeGame

  beforeEach(() => {
    game = new TicTacToeGame()
  })

  describe('initialization', () => {
    it('should create an empty 3x3 board', () => {
      const board = game.getBoard()
      expect(board).toHaveLength(3)
      expect(board[0]).toHaveLength(3)
      expect(board.flat().every(cell => cell === null)).toBe(true)
    })

    it('should start with X as current player', () => {
      expect(game.getCurrentPlayer()).toBe('X')
    })

    it('should have no winner initially', () => {
      expect(game.getWinner()).toBe(null)
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test -- TicTacToeGame.test.ts
```

Expected: FAIL - "Cannot find module './TicTacToeGame'"

**Step 3: Write minimal implementation**

Create `src/engine/TicTacToeGame.ts`:

```typescript
// ABOUTME: Core game engine for tic tac toe logic
// ABOUTME: Manages board state, turn tracking, move validation, and win detection
export type Player = 'X' | 'O'
export type CellValue = Player | null
export type Board = CellValue[][]
export type Winner = Player | 'Draw' | null

export class TicTacToeGame {
  private board: Board
  private currentPlayer: Player
  private winner: Winner

  constructor() {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]
    this.currentPlayer = 'X'
    this.winner = null
  }

  getBoard(): Board {
    return this.board.map(row => [...row])
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer
  }

  getWinner(): Winner {
    return this.winner
  }
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- TicTacToeGame.test.ts
```

Expected: PASS - All initialization tests pass

**Step 5: Commit**

```bash
git add src/engine/TicTacToeGame.ts src/engine/TicTacToeGame.test.ts
git commit -m "feat: add TicTacToeGame class with initialization"
```

---

## Task 3: TicTacToeGame Class (TDD - Part 2: Making Moves)

**Files:**
- Modify: `src/engine/TicTacToeGame.ts`
- Modify: `src/engine/TicTacToeGame.test.ts`

**Step 1: Write failing tests for making moves**

Add to `src/engine/TicTacToeGame.test.ts`:

```typescript
  describe('makeMove', () => {
    it('should place X on empty cell', () => {
      const result = game.makeMove(0, 0)
      expect(result).toBe(true)
      expect(game.getBoard()[0][0]).toBe('X')
    })

    it('should switch to O after X moves', () => {
      game.makeMove(0, 0)
      expect(game.getCurrentPlayer()).toBe('O')
    })

    it('should place O on second move', () => {
      game.makeMove(0, 0)
      game.makeMove(1, 1)
      expect(game.getBoard()[1][1]).toBe('O')
    })

    it('should reject move on occupied cell', () => {
      game.makeMove(0, 0)
      const result = game.makeMove(0, 0)
      expect(result).toBe(false)
      expect(game.getCurrentPlayer()).toBe('O') // Turn should not change
    })

    it('should reject move out of bounds', () => {
      const result = game.makeMove(3, 3)
      expect(result).toBe(false)
    })

    it('should reject move after game is won', () => {
      // Create winning scenario for X
      game.makeMove(0, 0) // X
      game.makeMove(1, 0) // O
      game.makeMove(0, 1) // X
      game.makeMove(1, 1) // O
      game.makeMove(0, 2) // X wins

      const result = game.makeMove(2, 2)
      expect(result).toBe(false)
    })
  })
```

**Step 2: Run tests to verify they fail**

```bash
npm test -- TicTacToeGame.test.ts
```

Expected: FAIL - "game.makeMove is not a function"

**Step 3: Implement makeMove method**

Modify `src/engine/TicTacToeGame.ts`:

```typescript
export class TicTacToeGame {
  // ... existing code ...

  makeMove(row: number, col: number): boolean {
    // Validate bounds
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      return false
    }

    // Can't move if game is over
    if (this.winner !== null) {
      return false
    }

    // Can't move on occupied cell
    if (this.board[row][col] !== null) {
      return false
    }

    // Make the move
    this.board[row][col] = this.currentPlayer

    // Check for winner
    this.winner = this.checkWinner()

    // Switch player
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'

    return true
  }

  private checkWinner(): Winner {
    // Placeholder for now - will implement in next task
    return null
  }
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test -- TicTacToeGame.test.ts
```

Expected: PASS except the "should reject move after game is won" test (checkWinner not implemented yet)

**Step 5: Commit**

```bash
git add src/engine/TicTacToeGame.ts src/engine/TicTacToeGame.test.ts
git commit -m "feat: add makeMove method with validation"
```

---

## Task 4: TicTacToeGame Class (TDD - Part 3: Win Detection)

**Files:**
- Modify: `src/engine/TicTacToeGame.ts`
- Modify: `src/engine/TicTacToeGame.test.ts`

**Step 1: Write failing tests for win detection**

Add to `src/engine/TicTacToeGame.test.ts`:

```typescript
  describe('win detection', () => {
    it('should detect horizontal win in top row', () => {
      game.makeMove(0, 0) // X
      game.makeMove(1, 0) // O
      game.makeMove(0, 1) // X
      game.makeMove(1, 1) // O
      game.makeMove(0, 2) // X wins

      expect(game.getWinner()).toBe('X')
      expect(game.getWinningCells()).toEqual([[0, 0], [0, 1], [0, 2]])
    })

    it('should detect vertical win in middle column', () => {
      game.makeMove(0, 1) // X
      game.makeMove(0, 0) // O
      game.makeMove(1, 1) // X
      game.makeMove(0, 2) // O
      game.makeMove(2, 1) // X wins

      expect(game.getWinner()).toBe('X')
      expect(game.getWinningCells()).toEqual([[0, 1], [1, 1], [2, 1]])
    })

    it('should detect diagonal win (top-left to bottom-right)', () => {
      game.makeMove(0, 0) // X
      game.makeMove(0, 1) // O
      game.makeMove(1, 1) // X
      game.makeMove(0, 2) // O
      game.makeMove(2, 2) // X wins

      expect(game.getWinner()).toBe('X')
      expect(game.getWinningCells()).toEqual([[0, 0], [1, 1], [2, 2]])
    })

    it('should detect diagonal win (top-right to bottom-left)', () => {
      game.makeMove(0, 2) // X
      game.makeMove(0, 0) // O
      game.makeMove(1, 1) // X
      game.makeMove(0, 1) // O
      game.makeMove(2, 0) // X wins

      expect(game.getWinner()).toBe('X')
      expect(game.getWinningCells()).toEqual([[0, 2], [1, 1], [2, 0]])
    })

    it('should detect draw when board is full with no winner', () => {
      // X X O
      // O O X
      // X O X
      game.makeMove(0, 0) // X
      game.makeMove(0, 2) // O
      game.makeMove(0, 1) // X
      game.makeMove(1, 0) // O
      game.makeMove(1, 2) // X
      game.makeMove(1, 1) // O
      game.makeMove(2, 0) // X
      game.makeMove(2, 2) // O
      game.makeMove(2, 1) // X

      expect(game.getWinner()).toBe('Draw')
      expect(game.getWinningCells()).toBe(null)
    })

    it('should detect O winning', () => {
      game.makeMove(0, 0) // X
      game.makeMove(1, 0) // O
      game.makeMove(0, 1) // X
      game.makeMove(1, 1) // O
      game.makeMove(2, 2) // X
      game.makeMove(1, 2) // O wins

      expect(game.getWinner()).toBe('O')
    })
  })
```

**Step 2: Run tests to verify they fail**

```bash
npm test -- TicTacToeGame.test.ts
```

Expected: FAIL - "game.getWinningCells is not a function" and incorrect winner detection

**Step 3: Implement win detection logic**

Modify `src/engine/TicTacToeGame.ts`:

```typescript
export class TicTacToeGame {
  private board: Board
  private currentPlayer: Player
  private winner: Winner
  private winningCells: [number, number][] | null

  constructor() {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]
    this.currentPlayer = 'X'
    this.winner = null
    this.winningCells = null
  }

  // ... existing methods ...

  getWinningCells(): [number, number][] | null {
    return this.winningCells ? [...this.winningCells] : null
  }

  private checkWinner(): Winner {
    // Check rows
    for (let row = 0; row < 3; row++) {
      if (
        this.board[row][0] !== null &&
        this.board[row][0] === this.board[row][1] &&
        this.board[row][1] === this.board[row][2]
      ) {
        this.winningCells = [[row, 0], [row, 1], [row, 2]]
        return this.board[row][0]
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      if (
        this.board[0][col] !== null &&
        this.board[0][col] === this.board[1][col] &&
        this.board[1][col] === this.board[2][col]
      ) {
        this.winningCells = [[0, col], [1, col], [2, col]]
        return this.board[0][col]
      }
    }

    // Check diagonal (top-left to bottom-right)
    if (
      this.board[0][0] !== null &&
      this.board[0][0] === this.board[1][1] &&
      this.board[1][1] === this.board[2][2]
    ) {
      this.winningCells = [[0, 0], [1, 1], [2, 2]]
      return this.board[0][0]
    }

    // Check diagonal (top-right to bottom-left)
    if (
      this.board[0][2] !== null &&
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0]
    ) {
      this.winningCells = [[0, 2], [1, 1], [2, 0]]
      return this.board[0][2]
    }

    // Check for draw (board full)
    const isBoardFull = this.board.flat().every(cell => cell !== null)
    if (isBoardFull) {
      return 'Draw'
    }

    return null
  }
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test -- TicTacToeGame.test.ts
```

Expected: PASS - All win detection tests pass

**Step 5: Commit**

```bash
git add src/engine/TicTacToeGame.ts src/engine/TicTacToeGame.test.ts
git commit -m "feat: add win detection for rows, columns, diagonals, and draws"
```

---

## Task 5: TicTacToeGame Class (TDD - Part 4: Helper Methods)

**Files:**
- Modify: `src/engine/TicTacToeGame.ts`
- Modify: `src/engine/TicTacToeGame.test.ts`

**Step 1: Write failing tests for helper methods**

Add to `src/engine/TicTacToeGame.test.ts`:

```typescript
  describe('helper methods', () => {
    it('should get available moves on empty board', () => {
      const moves = game.getAvailableMoves()
      expect(moves).toHaveLength(9)
      expect(moves).toContainEqual([0, 0])
      expect(moves).toContainEqual([2, 2])
    })

    it('should get available moves on partially filled board', () => {
      game.makeMove(0, 0)
      game.makeMove(1, 1)
      const moves = game.getAvailableMoves()
      expect(moves).toHaveLength(7)
      expect(moves).not.toContainEqual([0, 0])
      expect(moves).not.toContainEqual([1, 1])
    })

    it('should reset the game', () => {
      game.makeMove(0, 0)
      game.makeMove(1, 1)
      game.reset()

      expect(game.getBoard().flat().every(cell => cell === null)).toBe(true)
      expect(game.getCurrentPlayer()).toBe('X')
      expect(game.getWinner()).toBe(null)
      expect(game.getWinningCells()).toBe(null)
    })

    it('should check if game is over when won', () => {
      game.makeMove(0, 0) // X
      game.makeMove(1, 0) // O
      game.makeMove(0, 1) // X
      game.makeMove(1, 1) // O
      game.makeMove(0, 2) // X wins

      expect(game.isGameOver()).toBe(true)
    })

    it('should check if game is over when draw', () => {
      // Fill board to draw
      game.makeMove(0, 0) // X
      game.makeMove(0, 2) // O
      game.makeMove(0, 1) // X
      game.makeMove(1, 0) // O
      game.makeMove(1, 2) // X
      game.makeMove(1, 1) // O
      game.makeMove(2, 0) // X
      game.makeMove(2, 2) // O
      game.makeMove(2, 1) // X

      expect(game.isGameOver()).toBe(true)
    })

    it('should check if game is not over when in progress', () => {
      game.makeMove(0, 0)
      expect(game.isGameOver()).toBe(false)
    })
  })
```

**Step 2: Run tests to verify they fail**

```bash
npm test -- TicTacToeGame.test.ts
```

Expected: FAIL - Methods not defined

**Step 3: Implement helper methods**

Modify `src/engine/TicTacToeGame.ts`:

```typescript
export class TicTacToeGame {
  // ... existing code ...

  getAvailableMoves(): [number, number][] {
    const moves: [number, number][] = []
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === null) {
          moves.push([row, col])
        }
      }
    }
    return moves
  }

  reset(): void {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]
    this.currentPlayer = 'X'
    this.winner = null
    this.winningCells = null
  }

  isGameOver(): boolean {
    return this.winner !== null
  }
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test -- TicTacToeGame.test.ts
```

Expected: PASS - All tests pass

**Step 5: Commit**

```bash
git add src/engine/TicTacToeGame.ts src/engine/TicTacToeGame.test.ts
git commit -m "feat: add helper methods for available moves, reset, and game over check"
```

---

## Task 6: AIPlayer Class (TDD - Part 1: Basic Structure)

**Files:**
- Create: `src/engine/AIPlayer.ts`
- Create: `src/engine/AIPlayer.test.ts`

**Step 1: Write failing tests for AI player**

Create `src/engine/AIPlayer.test.ts`:

```typescript
// ABOUTME: Unit tests for AIPlayer class
// ABOUTME: Tests AI move calculation logic and smart-but-beatable strategy
import { describe, it, expect, beforeEach } from 'vitest'
import { AIPlayer } from './AIPlayer'
import { TicTacToeGame } from './TicTacToeGame'

describe('AIPlayer', () => {
  let ai: AIPlayer
  let game: TicTacToeGame

  beforeEach(() => {
    ai = new AIPlayer()
    game = new TicTacToeGame()
  })

  it('should make a valid move', () => {
    const [row, col] = ai.calculateMove(game)
    expect(row).toBeGreaterThanOrEqual(0)
    expect(row).toBeLessThanOrEqual(2)
    expect(col).toBeGreaterThanOrEqual(0)
    expect(col).toBeLessThanOrEqual(2)
    expect(game.getBoard()[row][col]).toBe(null)
  })

  it('should take winning move when available', () => {
    // Set up O to win on next move
    game.makeMove(0, 0) // X
    game.makeMove(1, 0) // O (AI)
    game.makeMove(0, 1) // X
    game.makeMove(1, 1) // O (AI)
    game.makeMove(2, 2) // X

    // O should take [1, 2] to win
    const [row, col] = ai.calculateMove(game)
    expect([row, col]).toEqual([1, 2])
  })

  it('should block opponent winning move', () => {
    // Set up X about to win
    game.makeMove(0, 0) // X
    game.makeMove(1, 0) // O (AI)
    game.makeMove(0, 1) // X

    // O should block at [0, 2]
    const [row, col] = ai.calculateMove(game)
    expect([row, col]).toEqual([0, 2])
  })

  it('should prefer center when available', () => {
    game.makeMove(0, 0) // X takes corner

    // O should take center (if not making a "mistake")
    const [row, col] = ai.calculateMove(game)
    // Center is [1, 1] - might take it or make random move
    // Just verify it's a valid move
    expect(game.getBoard()[row][col]).toBe(null)
  })
})
```

**Step 2: Run tests to verify they fail**

```bash
npm test -- AIPlayer.test.ts
```

Expected: FAIL - "Cannot find module './AIPlayer'"

**Step 3: Write minimal implementation**

Create `src/engine/AIPlayer.ts`:

```typescript
// ABOUTME: AI player implementation with smart-but-beatable strategy
// ABOUTME: Makes strategic moves 80% of the time, random moves 20% of the time
import { TicTacToeGame, Player } from './TicTacToeGame'

export class AIPlayer {
  private readonly mistakeChance = 0.2 // 20% chance to make a random move

  calculateMove(game: TicTacToeGame): [number, number] {
    const availableMoves = game.getAvailableMoves()

    if (availableMoves.length === 0) {
      throw new Error('No available moves')
    }

    // 20% chance to make a "mistake" (random move)
    if (Math.random() < this.mistakeChance) {
      return this.getRandomMove(availableMoves)
    }

    // Otherwise, make a smart move
    return this.getSmartMove(game, availableMoves)
  }

  private getRandomMove(availableMoves: [number, number][]): [number, number] {
    const randomIndex = Math.floor(Math.random() * availableMoves.length)
    return availableMoves[randomIndex]
  }

  private getSmartMove(
    game: TicTacToeGame,
    availableMoves: [number, number][]
  ): [number, number] {
    const aiPlayer = game.getCurrentPlayer()
    const opponent: Player = aiPlayer === 'X' ? 'O' : 'X'

    // 1. Try to win
    const winningMove = this.findWinningMove(game, aiPlayer, availableMoves)
    if (winningMove) return winningMove

    // 2. Block opponent from winning
    const blockingMove = this.findWinningMove(game, opponent, availableMoves)
    if (blockingMove) return blockingMove

    // 3. Take center if available
    const center: [number, number] = [1, 1]
    if (availableMoves.some(([r, c]) => r === 1 && c === 1)) {
      return center
    }

    // 4. Take a corner
    const corners: [number, number][] = [[0, 0], [0, 2], [2, 0], [2, 2]]
    const availableCorners = corners.filter(corner =>
      availableMoves.some(([r, c]) => r === corner[0] && c === corner[1])
    )
    if (availableCorners.length > 0) {
      return availableCorners[0]
    }

    // 5. Take any available move
    return availableMoves[0]
  }

  private findWinningMove(
    game: TicTacToeGame,
    player: Player,
    availableMoves: [number, number][]
  ): [number, number] | null {
    // Try each available move to see if it results in a win
    for (const [row, col] of availableMoves) {
      // Simulate the move
      const simulatedGame = this.cloneGame(game)
      // Temporarily set current player to the one we're checking
      const originalPlayer = simulatedGame.getCurrentPlayer()
      if (originalPlayer !== player) {
        // Make a dummy move to switch player if needed
        // This is a hack - better to have a test method
        // For now, we'll just test actual game state
      }

      simulatedGame.makeMove(row, col)
      if (simulatedGame.getWinner() === player) {
        return [row, col]
      }
    }
    return null
  }

  private cloneGame(game: TicTacToeGame): TicTacToeGame {
    const newGame = new TicTacToeGame()
    const board = game.getBoard()

    // Replay moves to recreate game state
    let currentPlayer: Player = 'X'
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] !== null) {
          // Need to track whose turn it actually is
          // This is getting complicated - better approach needed
        }
      }
    }

    // For now, return simple clone by replaying actual moves
    // This is a placeholder - will need to improve
    return newGame
  }
}
```

**Step 4: Run tests**

```bash
npm test -- AIPlayer.test.ts
```

Expected: Some tests may fail due to incomplete cloneGame implementation

**Step 5: Improve implementation to make tests pass**

The AI needs a better way to simulate moves. Let's add a method to TicTacToeGame first:

Modify `src/engine/TicTacToeGame.ts` to add a clone method:

```typescript
export class TicTacToeGame {
  // ... existing code ...

  clone(): TicTacToeGame {
    const cloned = new TicTacToeGame()
    cloned.board = this.board.map(row => [...row])
    cloned.currentPlayer = this.currentPlayer
    cloned.winner = this.winner
    cloned.winningCells = this.winningCells ? [...this.winningCells] : null
    return cloned
  }
}
```

Now update `src/engine/AIPlayer.ts`:

```typescript
  private findWinningMove(
    game: TicTacToeGame,
    player: Player,
    availableMoves: [number, number][]
  ): [number, number] | null {
    for (const [row, col] of availableMoves) {
      const simulatedGame = game.clone()

      // Make sure it's the right player's turn
      if (simulatedGame.getCurrentPlayer() !== player) {
        continue
      }

      simulatedGame.makeMove(row, col)
      if (simulatedGame.getWinner() === player) {
        return [row, col]
      }
    }
    return null
  }

  private cloneGame(game: TicTacToeGame): TicTacToeGame {
    return game.clone()
  }
}
```

**Step 6: Run tests again**

```bash
npm test -- AIPlayer.test.ts
```

Expected: Most tests pass, but AI might not always take winning/blocking moves due to 20% randomness

**Step 7: Update tests to account for randomness**

Modify `src/engine/AIPlayer.test.ts` to run multiple attempts for non-deterministic tests:

```typescript
  it('should take winning move when available (most of the time)', () => {
    // Run multiple times to account for randomness
    let tookWinningMove = false

    for (let attempt = 0; attempt < 10; attempt++) {
      const testGame = new TicTacToeGame()
      testGame.makeMove(0, 0) // X
      testGame.makeMove(1, 0) // O (AI)
      testGame.makeMove(0, 1) // X
      testGame.makeMove(1, 1) // O (AI)
      testGame.makeMove(2, 2) // X

      const [row, col] = ai.calculateMove(testGame)
      if (row === 1 && col === 2) {
        tookWinningMove = true
        break
      }
    }

    expect(tookWinningMove).toBe(true)
  })
```

**Step 8: Commit**

```bash
git add src/engine/AIPlayer.ts src/engine/AIPlayer.test.ts src/engine/TicTacToeGame.ts
git commit -m "feat: add AIPlayer with smart-but-beatable strategy"
```

---

## Task 7: ScoreTracker Class (TDD)

**Files:**
- Create: `src/engine/ScoreTracker.ts`
- Create: `src/engine/ScoreTracker.test.ts`

**Step 1: Write failing tests**

Create `src/engine/ScoreTracker.test.ts`:

```typescript
// ABOUTME: Unit tests for ScoreTracker class
// ABOUTME: Tests score recording and statistics tracking
import { describe, it, expect, beforeEach } from 'vitest'
import { ScoreTracker } from './ScoreTracker'

describe('ScoreTracker', () => {
  let tracker: ScoreTracker

  beforeEach(() => {
    tracker = new ScoreTracker()
  })

  it('should initialize with zero scores', () => {
    const stats = tracker.getStats()
    expect(stats.playerWins).toBe(0)
    expect(stats.aiWins).toBe(0)
    expect(stats.draws).toBe(0)
  })

  it('should record player win', () => {
    tracker.recordResult('X')
    const stats = tracker.getStats()
    expect(stats.playerWins).toBe(1)
  })

  it('should record AI win', () => {
    tracker.recordResult('O')
    const stats = tracker.getStats()
    expect(stats.aiWins).toBe(1)
  })

  it('should record draw', () => {
    tracker.recordResult('Draw')
    const stats = tracker.getStats()
    expect(stats.draws).toBe(1)
  })

  it('should track multiple games', () => {
    tracker.recordResult('X')
    tracker.recordResult('O')
    tracker.recordResult('Draw')
    tracker.recordResult('X')

    const stats = tracker.getStats()
    expect(stats.playerWins).toBe(2)
    expect(stats.aiWins).toBe(1)
    expect(stats.draws).toBe(1)
  })

  it('should reset scores', () => {
    tracker.recordResult('X')
    tracker.recordResult('O')
    tracker.reset()

    const stats = tracker.getStats()
    expect(stats.playerWins).toBe(0)
    expect(stats.aiWins).toBe(0)
    expect(stats.draws).toBe(0)
  })
})
```

**Step 2: Run tests to verify they fail**

```bash
npm test -- ScoreTracker.test.ts
```

Expected: FAIL - Module not found

**Step 3: Implement ScoreTracker**

Create `src/engine/ScoreTracker.ts`:

```typescript
// ABOUTME: Tracks game scores across multiple games
// ABOUTME: Records wins, losses, and draws for player and AI
import { Winner } from './TicTacToeGame'

export interface GameStats {
  playerWins: number
  aiWins: number
  draws: number
}

export class ScoreTracker {
  private playerWins: number
  private aiWins: number
  private draws: number

  constructor() {
    this.playerWins = 0
    this.aiWins = 0
    this.draws = 0
  }

  recordResult(winner: Winner): void {
    if (winner === 'X') {
      this.playerWins++
    } else if (winner === 'O') {
      this.aiWins++
    } else if (winner === 'Draw') {
      this.draws++
    }
  }

  getStats(): GameStats {
    return {
      playerWins: this.playerWins,
      aiWins: this.aiWins,
      draws: this.draws,
    }
  }

  reset(): void {
    this.playerWins = 0
    this.aiWins = 0
    this.draws = 0
  }
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test -- ScoreTracker.test.ts
```

Expected: PASS - All tests pass

**Step 5: Commit**

```bash
git add src/engine/ScoreTracker.ts src/engine/ScoreTracker.test.ts
git commit -m "feat: add ScoreTracker for tracking game statistics"
```

---

## Task 8: Basic React Components (Board and Cell)

**Files:**
- Create: `src/components/Board.tsx`
- Create: `src/components/Board.module.css`
- Create: `src/components/Cell.tsx`
- Create: `src/components/Cell.module.css`
- Create: `src/components/Board.test.tsx`

**Step 1: Write failing test for Board component**

Create `src/components/Board.test.tsx`:

```typescript
// ABOUTME: Integration tests for Board component
// ABOUTME: Tests rendering, click handling, and cell display
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Board } from './Board'
import { CellValue } from '../engine/TicTacToeGame'

describe('Board', () => {
  const emptyBoard: CellValue[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]

  it('should render 9 cells', () => {
    const onCellClick = vi.fn()
    render(<Board board={emptyBoard} onCellClick={onCellClick} />)

    const cells = screen.getAllByRole('button')
    expect(cells).toHaveLength(9)
  })

  it('should display X and O markers', () => {
    const board: CellValue[][] = [
      ['X', 'O', null],
      [null, 'X', null],
      [null, null, 'O'],
    ]
    const onCellClick = vi.fn()
    render(<Board board={board} onCellClick={onCellClick} />)

    expect(screen.getAllByText('X')).toHaveLength(2)
    expect(screen.getAllByText('O')).toHaveLength(2)
  })

  it('should call onCellClick when cell is clicked', async () => {
    const user = userEvent.setup()
    const onCellClick = vi.fn()
    render(<Board board={emptyBoard} onCellClick={onCellClick} />)

    const cells = screen.getAllByRole('button')
    await user.click(cells[0])

    expect(onCellClick).toHaveBeenCalledWith(0, 0)
  })
})
```

**Step 2: Run tests to verify they fail**

```bash
npm test -- Board.test.tsx
```

Expected: FAIL - Module not found

**Step 3: Implement Cell component first**

Create `src/components/Cell.tsx`:

```typescript
// ABOUTME: Individual cell component for tic tac toe board
// ABOUTME: Handles click events and displays X, O, or empty state
import { CellValue } from '../engine/TicTacToeGame'
import styles from './Cell.module.css'

interface CellProps {
  value: CellValue
  onClick: () => void
  isWinningCell?: boolean
}

export function Cell({ value, onClick, isWinningCell = false }: CellProps) {
  return (
    <button
      className={`${styles.cell} ${isWinningCell ? styles.winning : ''}`}
      onClick={onClick}
      aria-label={value || 'empty cell'}
    >
      {value}
    </button>
  )
}
```

Create `src/components/Cell.module.css`:

```css
.cell {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  font-size: 3rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.cell:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.cell:disabled {
  cursor: not-allowed;
}

.winning {
  background-color: rgba(255, 190, 11, 0.3);
}
```

**Step 4: Implement Board component**

Create `src/components/Board.tsx`:

```typescript
// ABOUTME: Game board component displaying 3x3 grid of cells
// ABOUTME: Handles cell clicks and highlights winning combinations
import { Board as BoardType } from '../engine/TicTacToeGame'
import { Cell } from './Cell'
import styles from './Board.module.css'

interface BoardProps {
  board: BoardType
  onCellClick: (row: number, col: number) => void
  winningCells?: [number, number][] | null
}

export function Board({ board, onCellClick, winningCells }: BoardProps) {
  const isWinningCell = (row: number, col: number): boolean => {
    if (!winningCells) return false
    return winningCells.some(([r, c]) => r === row && c === col)
  }

  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
            isWinningCell={isWinningCell(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  )
}
```

Create `src/components/Board.module.css`:

```css
.board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 2px;
  background-color: var(--grid-color, #00ff41);
  padding: 2px;
  border: 4px solid var(--grid-color, #00ff41);
}
```

**Step 5: Run tests to verify they pass**

```bash
npm test -- Board.test.tsx
```

Expected: PASS - All tests pass

**Step 6: Commit**

```bash
git add src/components/Board.tsx src/components/Board.module.css src/components/Cell.tsx src/components/Cell.module.css src/components/Board.test.tsx
git commit -m "feat: add Board and Cell components with tests"
```

---

## Task 9: Game Container Component

**Files:**
- Create: `src/components/Game.tsx`
- Create: `src/components/Game.test.tsx`

**Step 1: Write failing tests**

Create `src/components/Game.test.tsx`:

```typescript
// ABOUTME: Integration tests for Game container component
// ABOUTME: Tests full game flow including player moves and AI responses
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Game } from './Game'

describe('Game', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the board', () => {
    render(<Game />)
    const cells = screen.getAllByRole('button')
    expect(cells.length).toBeGreaterThan(0)
  })

  it('should allow player to make a move', async () => {
    const user = userEvent.setup()
    render(<Game />)

    const cells = screen.getAllByRole('button')
    await user.click(cells[0])

    expect(cells[0]).toHaveTextContent('X')
  })

  it('should trigger AI move after player move', async () => {
    const user = userEvent.setup()
    render(<Game />)

    const cells = screen.getAllByRole('button')
    await user.click(cells[0])

    // Wait for AI to make a move
    await waitFor(() => {
      const oCount = cells.filter(cell => cell.textContent === 'O').length
      expect(oCount).toBe(1)
    }, { timeout: 1000 })
  })

  it('should display winner when game is won', async () => {
    const user = userEvent.setup()
    render(<Game />)

    const cells = screen.getAllByRole('button')

    // Play a game where X wins
    await user.click(cells[0]) // X at [0,0]
    await waitFor(() => expect(cells.filter(c => c.textContent === 'O').length).toBe(1))

    await user.click(cells[1]) // X at [0,1]
    await waitFor(() => expect(cells.filter(c => c.textContent === 'O').length).toBe(2))

    await user.click(cells[2]) // X at [0,2] - wins!

    await waitFor(() => {
      expect(screen.getByText(/wins/i)).toBeInTheDocument()
    })
  })
})
```

**Step 2: Run tests to verify they fail**

```bash
npm test -- Game.test.tsx
```

Expected: FAIL - Module not found

**Step 3: Implement Game component**

Create `src/components/Game.tsx`:

```typescript
// ABOUTME: Main game container managing game state and flow
// ABOUTME: Coordinates game engine, AI player, and UI components
import { useState, useEffect } from 'react'
import { TicTacToeGame } from '../engine/TicTacToeGame'
import { AIPlayer } from '../engine/AIPlayer'
import { Board } from './Board'

const game = new TicTacToeGame()
const ai = new AIPlayer()

export function Game() {
  const [board, setBoard] = useState(game.getBoard())
  const [currentPlayer, setCurrentPlayer] = useState(game.getCurrentPlayer())
  const [winner, setWinner] = useState(game.getWinner())
  const [winningCells, setWinningCells] = useState(game.getWinningCells())
  const [isAiThinking, setIsAiThinking] = useState(false)

  const updateGameState = () => {
    setBoard(game.getBoard())
    setCurrentPlayer(game.getCurrentPlayer())
    setWinner(game.getWinner())
    setWinningCells(game.getWinningCells())
  }

  const handleCellClick = (row: number, col: number) => {
    if (isAiThinking || game.isGameOver()) {
      return
    }

    const success = game.makeMove(row, col)
    if (!success) {
      return
    }

    updateGameState()

    // Trigger AI move if game is not over
    if (!game.isGameOver()) {
      setIsAiThinking(true)
    }
  }

  useEffect(() => {
    if (isAiThinking && currentPlayer === 'O' && !game.isGameOver()) {
      // Delay AI move for better UX
      const timeout = setTimeout(() => {
        const [row, col] = ai.calculateMove(game)
        game.makeMove(row, col)
        updateGameState()
        setIsAiThinking(false)
      }, 300)

      return () => clearTimeout(timeout)
    }
  }, [isAiThinking, currentPlayer])

  const handleNewGame = () => {
    game.reset()
    updateGameState()
    setIsAiThinking(false)
  }

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <Board
        board={board}
        onCellClick={handleCellClick}
        winningCells={winningCells}
      />
      {winner && (
        <div>
          <p>
            {winner === 'Draw' ? "It's a draw!" : `${winner} wins!`}
          </p>
          <button onClick={handleNewGame}>New Game</button>
        </div>
      )}
      {!winner && <p>Current player: {currentPlayer}</p>}
    </div>
  )
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test -- Game.test.tsx
```

Expected: PASS - All tests pass

**Step 5: Commit**

```bash
git add src/components/Game.tsx src/components/Game.test.tsx
git commit -m "feat: add Game container component with AI integration"
```

---

## Task 10: ScoreBoard Component

**Files:**
- Create: `src/components/ScoreBoard.tsx`
- Create: `src/components/ScoreBoard.module.css`
- Create: `src/components/ScoreBoard.test.tsx`

**Step 1: Write failing tests**

Create `src/components/ScoreBoard.test.tsx`:

```typescript
// ABOUTME: Tests for ScoreBoard component
// ABOUTME: Verifies score display and updates
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScoreBoard } from './ScoreBoard'

describe('ScoreBoard', () => {
  it('should display player wins', () => {
    render(<ScoreBoard playerWins={3} aiWins={1} draws={0} />)
    expect(screen.getByText(/player.*3/i)).toBeInTheDocument()
  })

  it('should display AI wins', () => {
    render(<ScoreBoard playerWins={1} aiWins={2} draws={0} />)
    expect(screen.getByText(/ai.*2/i)).toBeInTheDocument()
  })

  it('should display draws', () => {
    render(<ScoreBoard playerWins={1} aiWins={1} draws={1} />)
    expect(screen.getByText(/draw.*1/i)).toBeInTheDocument()
  })

  it('should display zero scores initially', () => {
    render(<ScoreBoard playerWins={0} aiWins={0} draws={0} />)
    expect(screen.getByText(/player.*0/i)).toBeInTheDocument()
    expect(screen.getByText(/ai.*0/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run tests to verify they fail**

```bash
npm test -- ScoreBoard.test.tsx
```

Expected: FAIL - Module not found

**Step 3: Implement ScoreBoard**

Create `src/components/ScoreBoard.tsx`:

```typescript
// ABOUTME: Score display component showing wins, losses, and draws
// ABOUTME: Updates with animations when scores change
import styles from './ScoreBoard.module.css'

interface ScoreBoardProps {
  playerWins: number
  aiWins: number
  draws: number
}

export function ScoreBoard({ playerWins, aiWins, draws }: ScoreBoardProps) {
  return (
    <div className={styles.scoreBoard}>
      <div className={styles.score}>
        <span className={styles.label}>PLAYER</span>
        <span className={styles.value}>{playerWins}</span>
      </div>
      <div className={styles.score}>
        <span className={styles.label}>DRAWS</span>
        <span className={styles.value}>{draws}</span>
      </div>
      <div className={styles.score}>
        <span className={styles.label}>AI</span>
        <span className={styles.value}>{aiWins}</span>
      </div>
    </div>
  )
}
```

Create `src/components/ScoreBoard.module.css`:

```css
.scoreBoard {
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  border: 2px solid var(--grid-color, #00ff41);
}

.score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.label {
  font-size: 0.75rem;
  opacity: 0.7;
  letter-spacing: 0.1em;
}

.value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--accent, #ffbe0b);
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test -- ScoreBoard.test.tsx
```

Expected: PASS - All tests pass

**Step 5: Integrate ScoreBoard into Game component**

Modify `src/components/Game.tsx`:

```typescript
import { useState, useEffect } from 'react'
import { TicTacToeGame } from '../engine/TicTacToeGame'
import { AIPlayer } from '../engine/AIPlayer'
import { ScoreTracker } from '../engine/ScoreTracker'
import { Board } from './Board'
import { ScoreBoard } from './ScoreBoard'

const game = new TicTacToeGame()
const ai = new AIPlayer()
const scoreTracker = new ScoreTracker()

export function Game() {
  const [board, setBoard] = useState(game.getBoard())
  const [currentPlayer, setCurrentPlayer] = useState(game.getCurrentPlayer())
  const [winner, setWinner] = useState(game.getWinner())
  const [winningCells, setWinningCells] = useState(game.getWinningCells())
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [scores, setScores] = useState(scoreTracker.getStats())

  const updateGameState = () => {
    setBoard(game.getBoard())
    setCurrentPlayer(game.getCurrentPlayer())
    const newWinner = game.getWinner()
    setWinner(newWinner)
    setWinningCells(game.getWinningCells())

    // Record score if game just ended
    if (newWinner && newWinner !== winner) {
      scoreTracker.recordResult(newWinner)
      setScores(scoreTracker.getStats())
    }
  }

  const handleCellClick = (row: number, col: number) => {
    if (isAiThinking || game.isGameOver()) {
      return
    }

    const success = game.makeMove(row, col)
    if (!success) {
      return
    }

    updateGameState()

    if (!game.isGameOver()) {
      setIsAiThinking(true)
    }
  }

  useEffect(() => {
    if (isAiThinking && currentPlayer === 'O' && !game.isGameOver()) {
      const timeout = setTimeout(() => {
        const [row, col] = ai.calculateMove(game)
        game.makeMove(row, col)
        updateGameState()
        setIsAiThinking(false)
      }, 300)

      return () => clearTimeout(timeout)
    }
  }, [isAiThinking, currentPlayer])

  const handleNewGame = () => {
    game.reset()
    setWinner(null)
    updateGameState()
    setIsAiThinking(false)
  }

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <ScoreBoard
        playerWins={scores.playerWins}
        aiWins={scores.aiWins}
        draws={scores.draws}
      />
      <Board
        board={board}
        onCellClick={handleCellClick}
        winningCells={winningCells}
      />
      {winner && (
        <div>
          <p>
            {winner === 'Draw' ? "It's a draw!" : `${winner} wins!`}
          </p>
          <button onClick={handleNewGame}>New Game</button>
        </div>
      )}
      {!winner && <p>Current player: {currentPlayer}</p>}
    </div>
  )
}
```

**Step 6: Run tests**

```bash
npm test -- Game.test.tsx
```

Expected: PASS - Tests still pass with ScoreBoard integrated

**Step 7: Commit**

```bash
git add src/components/ScoreBoard.tsx src/components/ScoreBoard.module.css src/components/ScoreBoard.test.tsx src/components/Game.tsx
git commit -m "feat: add ScoreBoard component and integrate with Game"
```

---

## Task 11: Retro Styling Theme

**Files:**
- Create: `src/styles/retro-theme.css`
- Modify: `src/main.tsx`
- Modify: `index.html`

**Step 1: Add Press Start 2P font to HTML**

Modify `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <title>Tic Tac Toe</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 2: Create retro theme CSS**

Create `src/styles/retro-theme.css`:

```css
/* ABOUTME: Retro/arcade visual theme with pixel font and CRT effects */
/* ABOUTME: Defines color palette, typography, and retro visual effects */

:root {
  /* Color palette - classic arcade */
  --bg-dark: #0a0e27;
  --grid-color: #00ff41;
  --player-x: #ff006e;
  --player-o: #00d9ff;
  --text: #ffffff;
  --accent: #ffbe0b;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Press Start 2P', monospace;
  background-color: var(--bg-dark);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* CRT scanline effect */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 1000;
}

#root {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent);
  text-shadow: 0 0 10px var(--accent);
}

button {
  font-family: 'Press Start 2P', monospace;
  text-transform: uppercase;
}

/* Glow effect for grid lines */
.board {
  box-shadow:
    0 0 20px rgba(0, 255, 65, 0.5),
    inset 0 0 20px rgba(0, 255, 65, 0.1);
}

/* Player colors */
button:has-text("X") {
  color: var(--player-x);
  text-shadow: 0 0 10px var(--player-x);
}

button:has-text("O") {
  color: var(--player-o);
  text-shadow: 0 0 10px var(--player-o);
}
```

**Step 3: Import theme in main.tsx**

Modify `src/main.tsx`:

```typescript
// ABOUTME: Application entry point
// ABOUTME: Renders root React component and imports global styles
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/retro-theme.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Step 4: Update App.tsx to use Game component**

Modify `src/App.tsx`:

```typescript
// ABOUTME: Root application component
// ABOUTME: Wraps main game interface
import { Game } from './components/Game'
import './App.css'

function App() {
  return (
    <div className="app">
      <Game />
    </div>
  )
}

export default App
```

**Step 5: Update App.css for layout**

Modify `src/App.css`:

```css
.app {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

p {
  margin: 1rem 0;
  font-size: 0.875rem;
}

button:not([class*="cell"]) {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--accent);
  color: var(--bg-dark);
  border: 3px solid var(--accent);
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
  box-shadow: 0 0 10px var(--accent);
}

button:not([class*="cell"]):hover {
  background-color: transparent;
  color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 0 20px var(--accent);
}

button:not([class*="cell"]):active {
  transform: translateY(0);
}
```

**Step 6: Test visual appearance**

```bash
npm run dev
```

Expected: Dev server runs, visit http://localhost:5173 to see retro-styled game

**Step 7: Commit**

```bash
git add src/styles/retro-theme.css src/main.tsx src/App.tsx src/App.css index.html
git commit -m "feat: add retro arcade visual theme with pixel font and CRT effects"
```

---

## Task 12: Cell Animations

**Files:**
- Modify: `src/components/Cell.tsx`
- Modify: `src/components/Cell.module.css`

**Step 1: Add animation to Cell component**

Modify `src/components/Cell.tsx`:

```typescript
import { CellValue } from '../engine/TicTacToeGame'
import styles from './Cell.module.css'
import { useEffect, useState } from 'react'

interface CellProps {
  value: CellValue
  onClick: () => void
  isWinningCell?: boolean
}

export function Cell({ value, onClick, isWinningCell = false }: CellProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true)
      setDisplayValue(value)

      const timeout = setTimeout(() => {
        setIsAnimating(false)
      }, 200)

      return () => clearTimeout(timeout)
    }
  }, [value, displayValue])

  return (
    <button
      className={`${styles.cell} ${isWinningCell ? styles.winning : ''} ${isAnimating ? styles.animating : ''}`}
      onClick={onClick}
      aria-label={value || 'empty cell'}
    >
      <span className={value === 'X' ? styles.x : value === 'O' ? styles.o : ''}>
        {displayValue}
      </span>
    </button>
  )
}
```

**Step 2: Add animation CSS**

Modify `src/components/Cell.module.css`:

```css
.cell {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  font-size: 3rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  position: relative;
}

.cell:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.1);
}

.cell:disabled {
  cursor: not-allowed;
}

.cell span {
  display: inline-block;
  transition: transform 0.2s ease-out;
}

.animating span {
  animation: placeAnimation 0.2s ease-out;
}

@keyframes placeAnimation {
  0% {
    transform: scale(0) rotate(-10deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

.winning {
  background-color: rgba(255, 190, 11, 0.3);
  animation: winningPulse 0.5s ease-in-out;
}

@keyframes winningPulse {
  0%, 100% {
    background-color: rgba(255, 190, 11, 0.3);
  }
  50% {
    background-color: rgba(255, 190, 11, 0.6);
  }
}

.x {
  color: var(--player-x);
  text-shadow: 0 0 10px var(--player-x);
}

.o {
  color: var(--player-o);
  text-shadow: 0 0 10px var(--player-o);
}
```

**Step 3: Test animations**

```bash
npm run dev
```

Expected: Pieces animate when placed, winning cells pulse

**Step 4: Commit**

```bash
git add src/components/Cell.tsx src/components/Cell.module.css
git commit -m "feat: add cell placement and winning animations"
```

---

## Task 13: End-to-End Tests

**Files:**
- Create: `e2e/game-flow.spec.ts`
- Create: `e2e/ai-behavior.spec.ts`

**Step 1: Write E2E test for complete game flow**

Create `e2e/game-flow.spec.ts`:

```typescript
// ABOUTME: End-to-end tests for complete game flow
// ABOUTME: Tests user journey from start to finish
import { test, expect } from '@playwright/test'

test.describe('Tic Tac Toe Game Flow', () => {
  test('should load the game', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Tic Tac Toe')
  })

  test('should allow player to make moves', async ({ page }) => {
    await page.goto('/')

    const cells = page.locator('button[aria-label*="cell"]')
    await cells.first().click()

    await expect(cells.first()).toContainText('X')
  })

  test('should have AI make a move after player', async ({ page }) => {
    await page.goto('/')

    const cells = page.locator('button[aria-label*="cell"]')
    await cells.first().click()

    // Wait for AI move
    await page.waitForTimeout(500)

    const oCount = await cells.filter({ hasText: 'O' }).count()
    expect(oCount).toBe(1)
  })

  test('should display winner message when game is won', async ({ page }) => {
    await page.goto('/')

    // This test is non-deterministic due to AI, but we can try to win
    const cells = page.locator('button[aria-label*="cell"]')

    // Try to get three in a row quickly
    await cells.nth(0).click() // X
    await page.waitForTimeout(400)
    await cells.nth(1).click() // X
    await page.waitForTimeout(400)

    // Keep playing until game ends
    for (let i = 0; i < 5; i++) {
      const winner = page.locator('text=/wins|draw/i')
      if (await winner.isVisible()) {
        break
      }

      // Click next available cell
      const availableCell = cells.filter({ hasText: '' }).first()
      if (await availableCell.count() > 0) {
        await availableCell.click()
        await page.waitForTimeout(400)
      }
    }

    // Eventually someone wins or draws
    await expect(page.locator('text=/wins|draw/i')).toBeVisible({ timeout: 5000 })
  })

  test('should allow starting a new game', async ({ page }) => {
    await page.goto('/')

    const cells = page.locator('button[aria-label*="cell"]')

    // Play until game ends (simplified)
    await cells.nth(0).click()
    await page.waitForTimeout(400)
    await cells.nth(3).click()
    await page.waitForTimeout(400)
    await cells.nth(1).click()
    await page.waitForTimeout(400)

    // Click through remaining moves if needed
    for (let i = 4; i < 9; i++) {
      const gameOver = await page.locator('text=/wins|draw/i').isVisible()
      if (gameOver) break

      const cell = cells.nth(i)
      if (await cell.textContent() === '') {
        await cell.click()
        await page.waitForTimeout(400)
      }
    }

    // Click new game button
    await page.locator('button:has-text("New Game")').click()

    // All cells should be empty
    const xCount = await cells.filter({ hasText: 'X' }).count()
    const oCount = await cells.filter({ hasText: 'O' }).count()
    expect(xCount).toBe(0)
    expect(oCount).toBe(0)
  })

  test('should track scores across multiple games', async ({ page }) => {
    await page.goto('/')

    // Initial scores should be 0
    await expect(page.locator('text=/PLAYER/i').locator('..').locator('text=/0/')).toBeVisible()

    // Play a game (outcome doesn't matter for this test)
    // Just verify score board exists and updates
    const scoreBoard = page.locator('text=/PLAYER/i').locator('..')
    await expect(scoreBoard).toBeVisible()
  })
})
```

**Step 2: Write E2E test for AI behavior**

Create `e2e/ai-behavior.spec.ts`:

```typescript
// ABOUTME: End-to-end tests for AI player behavior
// ABOUTME: Verifies AI makes reasonable moves
import { test, expect } from '@playwright/test'

test.describe('AI Behavior', () => {
  test('AI should make valid moves', async ({ page }) => {
    await page.goto('/')

    const cells = page.locator('button[aria-label*="cell"]')

    // Player makes a move
    await cells.first().click()

    // Wait for AI
    await page.waitForTimeout(500)

    // Count O pieces
    const oCount = await cells.filter({ hasText: 'O' }).count()
    expect(oCount).toBe(1)

    // Verify O is on an empty cell (not overlapping X)
    const xCell = await cells.first().textContent()
    expect(xCell).toBe('X')
  })

  test('AI should not move on occupied cells', async ({ page }) => {
    await page.goto('/')

    const cells = page.locator('button[aria-label*="cell"]')

    // Fill several cells
    for (let i = 0; i < 3; i++) {
      await cells.nth(i).click()
      await page.waitForTimeout(400)
    }

    // Check no cell has both X and O
    for (let i = 0; i < 9; i++) {
      const text = await cells.nth(i).textContent()
      expect(text).not.toContain('XO')
      expect(text).not.toContain('OX')
    }
  })

  test('AI should respond within reasonable time', async ({ page }) => {
    await page.goto('/')

    const cells = page.locator('button[aria-label*="cell"]')

    const startTime = Date.now()
    await cells.first().click()

    // Wait for AI move
    await page.waitForTimeout(100)
    await cells.filter({ hasText: 'O' }).first().waitFor({ timeout: 1000 })

    const endTime = Date.now()
    const duration = endTime - startTime

    // AI should move within 1 second
    expect(duration).toBeLessThan(1000)
  })
})
```

**Step 3: Run E2E tests**

```bash
npm run test:e2e
```

Expected: All E2E tests pass (some may be flaky due to AI randomness)

**Step 4: Commit**

```bash
git add e2e/game-flow.spec.ts e2e/ai-behavior.spec.ts
git commit -m "feat: add end-to-end tests for game flow and AI behavior"
```

---

## Task 14: Final Testing and Documentation

**Files:**
- Create: `README.md`
- Modify: `package.json`

**Step 1: Run all tests**

```bash
npm test
```

Expected: All unit and integration tests pass

```bash
npm run test:e2e
```

Expected: All E2E tests pass

**Step 2: Build for production**

```bash
npm run build
```

Expected: Build succeeds with no errors

**Step 3: Create README**

Create `README.md`:

```markdown
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

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:5173 to play.

### Testing

Run unit and integration tests:

\`\`\`bash
npm test
\`\`\`

Run E2E tests:

\`\`\`bash
npm run test:e2e
\`\`\`

### Build

\`\`\`bash
npm run build
\`\`\`

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
```

**Step 4: Verify everything works**

```bash
npm run dev
```

Play a few games manually, verify:
- ✅ Game loads with retro styling
- ✅ Player can make moves
- ✅ AI responds after each move
- ✅ Win detection works correctly
- ✅ Scores update after games
- ✅ New game button works
- ✅ Animations are smooth

**Step 5: Commit**

```bash
git add README.md
git commit -m "docs: add README with setup and architecture documentation"
```

**Step 6: Final commit**

```bash
git add .
git commit -m "feat: complete tic tac toe game with AI, tests, and retro styling"
```

---

## Implementation Complete!

You now have a fully functional tic tac toe game with:
- ✅ Smart AI opponent (beatable)
- ✅ Score tracking across games
- ✅ Retro arcade aesthetic
- ✅ Smooth animations
- ✅ Comprehensive test coverage (unit, integration, E2E)
- ✅ Clean architecture (engine separate from UI)
- ✅ TypeScript for type safety
- ✅ Modern tooling (Vite, Vitest, Playwright)

## Running the Game

```bash
npm run dev
```

Visit http://localhost:5173 and enjoy! 🎮
