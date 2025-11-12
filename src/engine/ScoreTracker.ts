// ABOUTME: Tracks game scores across multiple games
// ABOUTME: Records wins, losses, and draws for player and AI
import type { Winner } from './TicTacToeGame'

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
