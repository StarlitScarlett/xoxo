// ABOUTME: Individual cell component for tic tac toe board
// ABOUTME: Handles click events and displays X, O, or empty state
import { CellValue } from '../engine/TicTacToeGame'
import styles from './Cell.module.css'
import { useEffect, useState } from 'react'

interface CellProps {
  value: CellValue
  onClick: () => void
  isWinningCell?: boolean
}

export function Cell({ value, onClick, isWinningCell = false }: CellProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true)
      setDisplayValue(value)

      const timeout = setTimeout(() => {
        setIsAnimating(false)
      }, 200)

      return () => clearTimeout(timeout)
    }
  }, [value, displayValue])

  return (
    <button
      className={`${styles.cell} ${isWinningCell ? styles.winning : ''} ${isAnimating ? styles.animating : ''}`}
      onClick={onClick}
      aria-label={value || 'empty cell'}
    >
      <span className={value === 'X' ? styles.x : value === 'O' ? styles.o : ''}>
        {displayValue}
      </span>
    </button>
  )
}
