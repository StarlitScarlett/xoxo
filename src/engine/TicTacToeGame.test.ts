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
})
