// ABOUTME: Integration tests for Game container component
// ABOUTME: Tests full game flow including player moves and AI responses
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Game } from './Game'

describe('Game', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('should render the board', () => {
    render(<Game />)
    const cells = screen.getAllByRole('button')
    expect(cells.length).toBeGreaterThan(0)
  })

  it('should allow player to make a move', async () => {
    const user = userEvent.setup()
    render(<Game />)

    const cells = screen.getAllByRole('button')
    await user.click(cells[0])

    expect(cells[0]).toHaveTextContent('X')
  })

  it('should trigger AI move after player move', async () => {
    const user = userEvent.setup()
    render(<Game />)

    const cells = screen.getAllByRole('button')
    await user.click(cells[0])

    // Wait for AI to make a move
    await waitFor(() => {
      const oCount = cells.filter(cell => cell.textContent === 'O').length
      expect(oCount).toBe(1)
    }, { timeout: 1000 })
  })

  it('should display winner when game is won', async () => {
    const user = userEvent.setup()
    render(<Game />)

    const cells = screen.getAllByRole('button')

    // Play moves until a winner is determined
    // Keep making moves alternating with AI until game ends
    for (let moveCount = 0; moveCount < 9; moveCount++) {
      // Check if game already ended
      const winner = screen.queryByText(/wins|draw/i)
      if (winner) {
        expect(winner).toBeInTheDocument()
        return
      }

      // Find first empty cell and click it
      const emptyCells = cells.filter(c => c.textContent === '')
      if (emptyCells.length === 0) break

      await user.click(emptyCells[0])

      // Wait for AI to make its move (if game not over)
      await new Promise(resolve => setTimeout(resolve, 400))
    }

    // Game should be over by now - verify winner/draw message exists
    await waitFor(() => {
      expect(screen.getByText(/wins|draw/i)).toBeInTheDocument()
    }, { timeout: 1000 })
  })
})
