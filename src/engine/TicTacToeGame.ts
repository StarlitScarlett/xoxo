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
