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

  getBoard(): Board {
    return this.board.map(row => [...row])
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer
  }

  getWinner(): Winner {
    return this.winner
  }

  getWinningCells(): [number, number][] | null {
    return this.winningCells ? [...this.winningCells] : null
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
