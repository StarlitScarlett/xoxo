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
