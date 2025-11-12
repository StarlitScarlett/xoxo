// ABOUTME: Game board component displaying 3x3 grid of cells
// ABOUTME: Handles cell clicks and highlights winning combinations
import { Board as BoardType } from '../engine/TicTacToeGame'
import { Cell } from './Cell'
import styles from './Board.module.css'

interface BoardProps {
  board: BoardType
  onCellClick: (row: number, col: number) => void
  winningCells?: [number, number][] | null
}

export function Board({ board, onCellClick, winningCells }: BoardProps) {
  const isWinningCell = (row: number, col: number): boolean => {
    if (!winningCells) return false
    return winningCells.some(([r, c]) => r === row && c === col)
  }

  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
            isWinningCell={isWinningCell(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  )
}
