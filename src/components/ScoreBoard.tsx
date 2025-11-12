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
