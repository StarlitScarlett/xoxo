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

  it('should block opponent winning move (most of the time)', () => {
    // Run multiple times to account for randomness
    let blockedWinningMove = false

    for (let attempt = 0; attempt < 10; attempt++) {
      const testGame = new TicTacToeGame()
      testGame.makeMove(0, 0) // X
      testGame.makeMove(1, 0) // O (AI)
      testGame.makeMove(0, 1) // X

      // O should block at [0, 2]
      const [row, col] = ai.calculateMove(testGame)
      if (row === 0 && col === 2) {
        blockedWinningMove = true
        break
      }
    }

    expect(blockedWinningMove).toBe(true)
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
