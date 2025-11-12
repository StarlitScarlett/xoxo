// ABOUTME: Integration tests for Board component
// ABOUTME: Tests rendering, click handling, and cell display
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Board } from './Board'
import { CellValue } from '../engine/TicTacToeGame'

describe('Board', () => {
  const emptyBoard: CellValue[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]

  it('should render 9 cells', () => {
    const onCellClick = vi.fn()
    render(<Board board={emptyBoard} onCellClick={onCellClick} />)

    const cells = screen.getAllByRole('button')
    expect(cells).toHaveLength(9)
  })

  it('should display X and O markers', () => {
    const board: CellValue[][] = [
      ['X', 'O', null],
      [null, 'X', null],
      [null, null, 'O'],
    ]
    const onCellClick = vi.fn()
    render(<Board board={board} onCellClick={onCellClick} />)

    expect(screen.getAllByText('X')).toHaveLength(2)
    expect(screen.getAllByText('O')).toHaveLength(2)
  })

  it('should call onCellClick when cell is clicked', async () => {
    const user = userEvent.setup()
    const onCellClick = vi.fn()
    render(<Board board={emptyBoard} onCellClick={onCellClick} />)

    const cells = screen.getAllByRole('button')
    await user.click(cells[0])

    expect(onCellClick).toHaveBeenCalledWith(0, 0)
  })
})
