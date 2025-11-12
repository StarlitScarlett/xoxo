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
