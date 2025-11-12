// ABOUTME: Individual cell component for tic tac toe board
// ABOUTME: Handles click events and displays X, O, or empty state
import { CellValue } from '../engine/TicTacToeGame'
import styles from './Cell.module.css'

interface CellProps {
  value: CellValue
  onClick: () => void
  isWinningCell?: boolean
}

export function Cell({ value, onClick, isWinningCell = false }: CellProps) {
  return (
    <button
      className={`${styles.cell} ${isWinningCell ? styles.winning : ''}`}
      onClick={onClick}
      aria-label={value || 'empty cell'}
    >
      {value}
    </button>
  )
}
