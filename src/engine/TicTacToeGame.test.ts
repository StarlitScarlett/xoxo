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
})
