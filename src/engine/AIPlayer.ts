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
    // Check if any available move would result in a win for the specified player
    // We need to temporarily test what would happen if this player moved
    const board = game.getBoard()

    for (const [row, col] of availableMoves) {
      // Temporarily place the player's mark
      const testBoard = board.map(r => [...r])
      testBoard[row][col] = player

      // Check if this creates a win
      if (this.checkWinForPlayer(testBoard, player)) {
        return [row, col]
      }
    }
    return null
  }

  private checkWinForPlayer(board: (Player | null)[][], player: Player): boolean {
    // Check rows
    for (let row = 0; row < 3; row++) {
      if (board[row][0] === player && board[row][1] === player && board[row][2] === player) {
        return true
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      if (board[0][col] === player && board[1][col] === player && board[2][col] === player) {
        return true
      }
    }

    // Check diagonals
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
      return true
    }
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
      return true
    }

    return false
  }
}
